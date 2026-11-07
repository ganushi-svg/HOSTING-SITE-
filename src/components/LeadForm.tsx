"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2, LoaderCircle } from "lucide-react";
import { QuoteIcon } from "./QuoteIcon";
import { contact } from "@/lib/site";

type State = "idle" | "sending" | "success" | "error";

/**
 * Enquiry form (Ganushi, 4 Nov 2026): Fleet Tier dropdown mirrors the pricing tiers (Under 50, 50–99, 100+ Plug & Play,
 * Turnkey MW; values in src/lib/enquiry.ts MINER_RANGES) and a clean confirmation panel replaces the form after a
 * successful send, so a live demo ends on a clear "sent" state. Posts to /api/enquiry.
 */
export function LeadForm({ defaultModels = "" }: { defaultModels?: string }) {
  const [status, setStatus] = useState<State>("idle");
  const [message, setMessage] = useState("");
  const [sentTo, setSentTo] = useState("");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setMessage("");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result: { message?: string } = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || "We could not send your request. Please email or call us.");
      setSentTo(String(data.email || ""));
      setStatus("success");
      window.dispatchEvent(new Event("pip-cheer")); // Pip reacts to a sent enquiry
      form.reset();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "We could not send your request. Please email or call us.");
    }
  }

  if (status === "success") {
    return (
      <div className="form-done" role="status" aria-live="polite">
        <span className="form-done-ico" aria-hidden="true"><CheckCircle2 size={30} strokeWidth={1.8} /></span>
        <h4>Request sent</h4>
        <p>Thank you. Your enquiry is with our team, and {contact.person}, our {contact.personTitle}, will reply by email{sentTo ? <> to <b>{sentTo}</b></> : null}.</p>
        <p className="form-done-sub">Need an answer sooner? Call in office hours or WhatsApp after hours on {contact.phone}.</p>
        <button type="button" className="button button-outline" onClick={() => { setStatus("idle"); setSentTo(""); }}>Send another request</button>
      </div>
    );
  }

  return (
    <form className="lead-form" onSubmit={submit}>
      <div className="form-row">
        <label><span>Full name <span aria-hidden="true">*</span></span><input id="lf-name" name="name" autoComplete="name" maxLength={100} required /></label>
        <label><span>Work email <span aria-hidden="true">*</span></span><input id="lf-email" name="email" autoComplete="email" type="email" maxLength={254} required /></label>
      </div>
      <div className="form-row">
        <label>Company<input id="lf-company" name="company" autoComplete="organization" maxLength={150} /></label>
        <label>Fleet tier
          <select id="lf-miners" name="miners" defaultValue="">
            <option value="">Select a tier</option>
            <option value="under-50">Under 50</option>
            <option value="50-99">50–99</option>
            <option value="100-plus">100+ Plug &amp; Play</option>
            <option value="turnkey-mw">Turnkey MW</option>
          </select>
        </label>
      </div>
      <label>Machine models<input id="lf-models" name="models" maxLength={200} defaultValue={defaultModels} placeholder="e.g. Antminer Z15 Pro, S21+" /></label>
      <label>Message<textarea id="lf-notes" name="notes" rows={4} maxLength={4000} placeholder="Timeline, cooling preference, questions" /></label>
      <div className="hp-field" aria-hidden="true"><label>Leave this field empty<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      <label className="consent">
        <input id="lf-consent" type="checkbox" name="consent" value="yes" required />
        <span>I agree that Segments Cloud may use these details to reply to this enquiry. <a href="#privacy" onClick={() => { const d = document.getElementById("privacy"); if (d instanceof HTMLDetailsElement) d.open = true; }}>Privacy notice</a>.</span>
      </label>
      <button type="submit" className="button form-submit" disabled={status === "sending"}>
        {status === "sending" ? <><LoaderCircle className="spin" size={18} aria-hidden="true" /> Sending…</> : <>Send request <QuoteIcon /></>}
      </button>
      {message && <p className={`form-feedback ${status}`} role="alert">{message}</p>}
    </form>
  );
}
