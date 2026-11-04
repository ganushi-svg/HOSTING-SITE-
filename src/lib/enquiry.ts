// Sends a hosting enquiry to Ganushi through Resend. Shared by the enquiry form route and Pip's send_enquiry action.
// Keys come from environment variables only (CLAUDE.md): RESEND_API_KEY, RESEND_FROM_EMAIL, RESEND_TO_EMAIL.
import { contact } from "./site";

// Fleet tier options on the contact form and in Pip's send_enquiry (Ganushi, 4 Nov 2026): the plug and play
// pricing tiers plus the turnkey (MW) route. The value is what the form posts; the label is what people read.
export const MINER_RANGES = ["", "under-50", "50-99", "100-plus", "turnkey-mw"] as const;
export const MINER_LABELS: Record<(typeof MINER_RANGES)[number], string> = { "": "—", "under-50": "Under 50 machines", "50-99": "50–99 machines", "100-plus": "100+ machines (Plug & Play)", "turnkey-mw": "Turnkey (MW)" };
export const EMAIL_RE = /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]{2,}$/;

export type Enquiry = { name: string; email: string; company: string; miners: string; models: string; notes: string; via?: string };
export type SendResult = { ok: true } | { ok: false; status: number; message: string };

// Header-bound values (subject, reply-to) must not carry line breaks.
const oneLine = (v: string) => v.replace(/[\r\n]+/g, " ");

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] || c);
}

export async function sendEnquiryEmail(e: Enquiry): Promise<SendResult> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { ok: false, status: 503, message: "The form is not set up yet. Please email or call us." };
  // TODO: set RESEND_FROM_EMAIL once segments.ae is verified in Resend. The fallback only delivers to the Resend account owner.
  const from = process.env.RESEND_FROM_EMAIL || "Segments Cloud website <onboarding@resend.dev>";
  const to = process.env.RESEND_TO_EMAIL || contact.email;

  const fields: [string, string][] = [
    ["Name", oneLine(e.name)],
    ["Email", oneLine(e.email)],
    ["Company", oneLine(e.company || "—")],
    ["Fleet tier", MINER_LABELS[e.miners as (typeof MINER_RANGES)[number]] || e.miners || "—"],
    ["Machine models", oneLine(e.models || "—")],
    ["Sent via", e.via || "Website form"],
  ];
  const html =
    `<h2>New hosting enquiry</h2>` +
    fields.map(([k, v]) => `<p><strong>${k}:</strong> ${escapeHtml(v)}</p>`).join("") +
    `<p><strong>Message:</strong><br>${escapeHtml(e.notes || "—").replace(/\n/g, "<br>")}</p>`;
  const plain = `${fields.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\nMessage:\n${e.notes || "—"}`;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: oneLine(e.email),
        subject: `Hosting enquiry: ${oneLine(e.company || e.name)}${e.miners ? ` (${MINER_LABELS[e.miners as (typeof MINER_RANGES)[number]] || e.miners})` : ""}`,
        html,
        text: plain,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) {
      console.error("Resend rejected the enquiry email", response.status);
      return { ok: false, status: 502, message: "We could not send your request. Please email or call us." };
    }
    return { ok: true };
  } catch (error) {
    console.error("Enquiry email failed", error instanceof Error ? error.message : "unknown error");
    return { ok: false, status: 502, message: "We could not send your request. Please email or call us." };
  }
}
