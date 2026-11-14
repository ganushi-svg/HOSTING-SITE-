// Copied from the hosting site (src/app/api/enquiry/route.ts, 14 Nov 2026) so the NOC page delivers to the same inbox
// through the same Resend sender. Adds an optional phone field and marks the email "Sent via: NOC Telemetry page".
import { NextRequest, NextResponse } from "next/server";
import { EMAIL_RE, MINER_RANGES, sendEnquiryEmail } from "@/lib/enquiry";

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
  const phone = text(payload.phone, 40);

  if (!name) return NextResponse.json({ message: "Enter your name." }, { status: 400 });
  if (!email || !EMAIL_RE.test(email)) return NextResponse.json({ message: "Enter a valid email address." }, { status: 400 });
  if (phone === null || company === null || models === null || notes === null || miners === null || !MINER_RANGES.includes(miners as (typeof MINER_RANGES)[number])) {
    return NextResponse.json({ message: "Check the form fields and try again." }, { status: 400 });
  }
  if (payload.consent !== "yes") return NextResponse.json({ message: "Tick the box to agree to be contacted." }, { status: 400 });

  // Sent from the NOC Telemetry comparison page; the phone number, when given, is added to the message.
  const message = phone ? `${notes ? `${notes}\n\n` : ""}Phone: ${phone}` : notes;
  const result = await sendEnquiryEmail({ name, email, company, miners, models, notes: message, via: "NOC Telemetry page (segments-hosting-noc)" });
  if (!result.ok) return NextResponse.json({ message: result.message }, { status: result.status });
  return NextResponse.json({ ok: true });
}
