import { NextRequest, NextResponse } from "next/server";
import { contact } from "@/lib/site";

export const runtime = "nodejs";

const MINER_RANGES = ["", "1-10", "11-50", "51-200", "200+", "undecided"];
const EMAIL_RE = /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]{2,}$/;

// Best-effort limit per server instance. Serverless instances do not share memory,
// so add a shared store (e.g. Upstash) and a bot check before the public launch.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

function text(value: unknown, max: number): string | null {
  if (value === undefined || value === null) return "";
  return typeof value === "string" && value.length <= max ? value.trim() : null;
}

// Header-bound values (subject, reply-to) must not carry line breaks.
const oneLine = (v: string) => v.replace(/[\r\n]+/g, " ");

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] || c);
}

export async function POST(req: NextRequest) {
  if (!req.headers.get("content-type")?.includes("application/json")) {
    return NextResponse.json({ message: "Send the form as JSON." }, { status: 415 });
  }
  if (Number(req.headers.get("content-length") || 0) > 12_000) {
    return NextResponse.json({ message: "Your message is too long." }, { status: 413 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ message: "Too many requests. Please try again in a few minutes, or email us." }, { status: 429 });
  }

  let payload: Record<string, unknown>;
  try {
    const raw: unknown = await req.json();
    if (typeof raw !== "object" || raw === null || Array.isArray(raw)) throw new Error("Invalid body");
    payload = raw as Record<string, unknown>;
  } catch {
    return NextResponse.json({ message: "Please submit a valid request." }, { status: 400 });
  }

  // Honeypot: automated submissions look successful but are not delivered.
  if (typeof payload.website === "string" && payload.website.trim()) return NextResponse.json({ ok: true });

  const name = text(payload.name, 100);
  const email = text(payload.email, 254);
  const company = text(payload.company, 150);
  const miners = text(payload.miners, 20);
  const models = text(payload.models, 200);
  const notes = text(payload.notes, 4000);

  if (!name) return NextResponse.json({ message: "Enter your name." }, { status: 400 });
  if (!email || !EMAIL_RE.test(email)) return NextResponse.json({ message: "Enter a valid email address." }, { status: 400 });
  if (company === null || models === null || notes === null || miners === null || !MINER_RANGES.includes(miners)) {
    return NextResponse.json({ message: "Check the form fields and try again." }, { status: 400 });
  }
  if (payload.consent !== "yes") return NextResponse.json({ message: "Tick the box to agree to be contacted." }, { status: 400 });

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    return NextResponse.json({ message: "The form is not set up yet. Please email or call us." }, { status: 503 });
  }
  // TODO: set RESEND_FROM_EMAIL once segments.ae is verified in Resend. The fallback only delivers to the Resend account owner.
  const from = process.env.RESEND_FROM_EMAIL || "Segments Cloud website <onboarding@resend.dev>";
  const to = process.env.RESEND_TO_EMAIL || contact.email;

  const fields: [string, string][] = [
    ["Name", oneLine(name)],
    ["Email", oneLine(email)],
    ["Company", oneLine(company || "—")],
    ["Number of machines", miners || "—"],
    ["Machine models", oneLine(models || "—")],
  ];
  const html =
    `<h2>New hosting enquiry</h2>` +
    fields.map(([k, v]) => `<p><strong>${k}:</strong> ${escapeHtml(v)}</p>`).join("") +
    `<p><strong>Message:</strong><br>${escapeHtml(notes || "—").replace(/\n/g, "<br>")}</p>`;
  const plain = `${fields.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\nMessage:\n${notes || "—"}`;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: oneLine(email),
        subject: `Hosting enquiry: ${oneLine(company || name)}${miners ? ` (${miners} machines)` : ""}`,
        html,
        text: plain,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) {
      console.error("Resend rejected the enquiry email", response.status);
      return NextResponse.json({ message: "We could not send your request. Please email or call us." }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Enquiry email failed", error instanceof Error ? error.message : "unknown error");
    return NextResponse.json({ message: "We could not send your request. Please email or call us." }, { status: 502 });
  }
}
