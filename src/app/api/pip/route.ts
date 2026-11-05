import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { PIP_MODEL, pipBriefing } from "@/lib/pip-briefing";
import { models, usd } from "@/lib/models";
import { contact, pricing, sections, tierFor } from "@/lib/site";
import { EMAIL_RE, MINER_RANGES, sendEnquiryEmail } from "@/lib/enquiry";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * Pip's brain when ANTHROPIC_API_KEY is set (Ganushi KC, 4 Nov 2026): Claude with the site's facts as its briefing
 * and four actions. estimate_power_cost and send_enquiry run here; show_section and whatsapp_handoff are returned
 * to the browser to perform. Without a key the route answers 503 and the browser falls back to the scripted Pip.
 * Guardrails: hosting only, no profit talk, numbers only from the briefing (see pip-briefing.ts), 20 messages per
 * conversation, 240 characters per message, per-IP rate limit (best effort per instance; add Upstash before launch).
 */
const MAX_TURNS = 20;
const MAX_CHARS = 240;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 40;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

/** The chat renders plain text, so markdown emphasis and headings are stripped; list dashes become bullets. */
const plain = (t: string) => t.replace(/\*\*(.+?)\*\*/g, "$1").replace(/(^|\n)#{1,6}\s+/g, "$1").replace(/(^|\n)[-*]\s+/g, "$1• ").trim();

type ClientAction = { type: "show"; id: string; label: string } | { type: "whatsapp"; url: string } | { type: "enquiry_sent" };

const sectionIds = sections.map((s) => s.id);

const tools: Anthropic.Beta.BetaTool[] = [
  {
    name: "estimate_power_cost",
    description: "Hosting power bill for a machine model and quantity, computed from the published nameplate watts and the fleet-size rate. Hosting cost only, never revenue.",
    strict: true,
    input_schema: {
      type: "object",
      properties: {
        model_slug: { type: "string", enum: models.map((m) => m.slug), description: "The model's slug from the briefing" },
        quantity: { type: "integer", description: "Number of machines, 1 to 10,000" },
        running_days: { type: "integer", description: "Days the machines run in the month, 1 to 31; use 30 unless the visitor says otherwise" },
      },
      required: ["model_slug", "quantity", "running_days"],
      additionalProperties: false,
    },
  },
  {
    name: "show_section",
    description: "Scroll the visitor's page to a section so they can see it (pricing table, machines, calculator, sample report, contact card).",
    strict: true,
    input_schema: {
      type: "object",
      properties: { section_id: { type: "string", enum: sectionIds } },
      required: ["section_id"],
      additionalProperties: false,
    },
  },
  {
    name: "whatsapp_handoff",
    description: `Offer a WhatsApp button that opens a chat with ${contact.person} at Segments, with the topic prefilled. Use for anything you cannot answer, for quotes, turnkey terms, site visits, or when the visitor asks for a person.`,
    strict: true,
    input_schema: {
      type: "object",
      properties: { topic: { type: "string", description: "One line summarising what the visitor wants" } },
      required: ["topic"],
      additionalProperties: false,
    },
  },
  {
    name: "send_enquiry",
    description: "Email the visitor's hosting enquiry to the Segments team. Call it only after reading the summary back and getting a clear yes; set confirmed to true only in that case.",
    strict: true,
    input_schema: {
      type: "object",
      properties: {
        name: { type: "string" },
        email: { type: "string" },
        company: { type: "string", description: "Empty string if none" },
        miners: { type: "string", enum: MINER_RANGES.filter(Boolean) as string[], description: "Fleet tier: under-50, 50-99 or 100-plus machines on plug and play, or turnkey-mw for a megawatt-scale build" },
        models: { type: "string", description: "Machine models and quantities, e.g. '20 × Antminer S21 XP'" },
        notes: { type: "string", description: "Anything else the visitor said, in their words" },
        confirmed: { type: "boolean", description: "True only after the visitor confirmed the summary" },
      },
      required: ["name", "email", "company", "miners", "models", "notes", "confirmed"],
      additionalProperties: false,
    },
  },
];

type ToolInput = Record<string, unknown>;

async function runTool(name: string, input: ToolInput, actions: ClientAction[], via: string): Promise<{ content: string; isError?: boolean }> {
  if (name === "estimate_power_cost") {
    const m = models.find((x) => x.slug === input.model_slug);
    const qty = Number(input.quantity), days = Number(input.running_days);
    if (!m || !Number.isInteger(qty) || qty < 1 || qty > 10000 || !Number.isInteger(days) || days < 1 || days > 31) return { content: "Invalid input: quantity 1 to 10,000, running days 1 to 31", isError: true };
    const tier = tierFor(qty);
    const kwhPerMachine = (m.watts * 24 * days) / 1000;
    const fleetKw = (m.watts * qty) / 1000;
    return {
      content: JSON.stringify({
        model: m.name, cooling: m.cooling, watts: m.watts, wattsSource: m.wattsSource, quantity: qty, runningDays: days,
        rate: tier.rateLabel + " per kWh", tier: tier.label,
        kwhPerMachine: Math.round(kwhPerMachine), costPerMachine: usd(kwhPerMachine * tier.rateUsd),
        kwhFleet: Math.round(kwhPerMachine * qty), costFleet: usd(kwhPerMachine * tier.rateUsd * qty),
        fleetKw: +fleetKw.toFixed(1), setupFeeOneOff: usd(fleetKw * pricing.setupFeePerKwUsd), setupFeeBasis: pricing.setupFeeLabel,
        deposit: "one month of hosting",
        note: "Hosting power cost only. Offline days are not charged. Not a mining estimate.",
      }),
    };
  }
  if (name === "show_section") {
    const id = String(input.section_id);
    const s = sections.find((x) => x.id === id);
    if (!s) return { content: "Unknown section", isError: true };
    actions.push({ type: "show", id: s.id, label: s.label });
    return { content: `The page scrolled to ${s.label}.` };
  }
  if (name === "whatsapp_handoff") {
    const topic = String(input.topic || "").slice(0, 140);
    const msg = `Hi Segments, I was chatting with Pip on your website about: ${topic}`;
    actions.push({ type: "whatsapp", url: `${contact.whatsappUrl}?text=${encodeURIComponent(msg)}` });
    return { content: `A WhatsApp button to ${contact.person} (${contact.phone}) is now shown to the visitor.` };
  }
  if (name === "send_enquiry") {
    if (input.confirmed !== true) return { content: "Not sent: the visitor has not confirmed yet. Read the summary back and ask for a yes.", isError: true };
    const name = String(input.name || "").trim().slice(0, 100);
    const email = String(input.email || "").trim().slice(0, 254);
    if (!name || !EMAIL_RE.test(email)) return { content: "Not sent: a valid name and email address are needed.", isError: true };
    const miners = String(input.miners || "");
    if (!MINER_RANGES.includes(miners as (typeof MINER_RANGES)[number])) return { content: "Not sent: invalid fleet size range.", isError: true };
    const r = await sendEnquiryEmail({
      name, email, company: String(input.company || "").slice(0, 150), miners, models: String(input.models || "").slice(0, 200), notes: String(input.notes || "").slice(0, 4000), via,
    });
    if (!r.ok) return { content: `Not sent: ${r.message} Offer WhatsApp instead.`, isError: true };
    actions.push({ type: "enquiry_sent" });
    return { content: `Sent to the Segments team. Tell the visitor ${contact.person} will reply by email.` };
  }
  return { content: "Unknown tool", isError: true };
}

type ClientMsg = { role: "user" | "assistant"; content: string | Anthropic.Beta.BetaContentBlockParam[] };

function validHistory(raw: unknown): ClientMsg[] | null {
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > MAX_TURNS * 4) return null;
  const out: ClientMsg[] = [];
  let userTurns = 0;
  for (const m of raw) {
    if (!m || typeof m !== "object") return null;
    const { role, content } = m as { role?: unknown; content?: unknown };
    if (role !== "user" && role !== "assistant") return null;
    if (typeof content === "string") {
      if (role === "user") { userTurns++; if (content.length > MAX_CHARS || !content.trim()) return null; }
      out.push({ role, content });
    } else if (Array.isArray(content) && content.length > 0 && content.length < 20) {
      out.push({ role, content: content as Anthropic.Beta.BetaContentBlockParam[] });
    } else return null;
  }
  if (out[0].role !== "user" || out[out.length - 1].role !== "user" || userTurns > MAX_TURNS) return null;
  return out;
}

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) return NextResponse.json({ message: "Pip's assistant is not connected." }, { status: 503 });
  if (Number(req.headers.get("content-length") || 0) > 60_000) return NextResponse.json({ message: "Too long." }, { status: 413 });
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) return NextResponse.json({ message: "Too many messages. Please try again in a few minutes or WhatsApp us." }, { status: 429 });

  let body: { messages?: unknown };
  try { body = await req.json(); } catch { return NextResponse.json({ message: "Invalid request." }, { status: 400 }); }
  const history = validHistory(body.messages);
  if (!history) return NextResponse.json({ message: "Invalid conversation." }, { status: 400 });

  const client = new Anthropic();
  const messages: Anthropic.Beta.BetaMessageParam[] = history.map((m) => ({ role: m.role, content: m.content }));
  const actions: ClientAction[] = [];
  const newTurns: Anthropic.Beta.BetaMessageParam[] = [];
  let text = "";

  try {
    for (let i = 0; i < 4; i++) {
      const response = await client.beta.messages.create({
        model: PIP_MODEL,
        max_tokens: 1200,
        betas: ["server-side-fallback-2026-07-01"],
        fallbacks: "default",
        output_config: { effort: "low" },
        system: [{ type: "text", text: pipBriefing(), cache_control: { type: "ephemeral" } }],
        tools,
        messages,
      });
      const assistantTurn: Anthropic.Beta.BetaMessageParam = { role: "assistant", content: response.content };
      messages.push(assistantTurn); newTurns.push(assistantTurn);
      text = plain(response.content.filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === "text").map((b) => b.text).join("\n")) || text;
      if (response.stop_reason === "refusal") { text = text || "I can't help with that one. For anything about hosting your miners, ask away."; break; }
      if (response.stop_reason === "pause_turn") continue;
      const uses = response.content.filter((b): b is Anthropic.Beta.BetaToolUseBlock => b.type === "tool_use");
      if (uses.length === 0 || response.stop_reason === "max_tokens") break;
      const results: Anthropic.Beta.BetaToolResultBlockParam[] = [];
      for (const u of uses) {
        const r = await runTool(u.name, (u.input ?? {}) as ToolInput, actions, "Pip, the website assistant");
        results.push({ type: "tool_result", tool_use_id: u.id, content: r.content, ...(r.isError ? { is_error: true } : {}) });
      }
      const resultTurn: Anthropic.Beta.BetaMessageParam = { role: "user", content: results };
      messages.push(resultTurn); newTurns.push(resultTurn);
    }
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError || error instanceof Anthropic.InternalServerError || error instanceof Anthropic.APIConnectionError) {
      return NextResponse.json({ message: "Pip is busy right now." }, { status: 503 });
    }
    console.error("Pip request failed", error instanceof Error ? error.message : "unknown error");
    return NextResponse.json({ message: "Pip could not answer." }, { status: 502 });
  }

  return NextResponse.json({ text: text || "Could you say that another way?", actions, turns: newTurns });
}
