"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { LoaderCircle } from "lucide-react";
import { QuoteIcon } from "./QuoteIcon";

type State = "idle" | "sending" | "success" | "error";

export function LeadForm({ defaultModels = "" }: { defaultModels?: string }) {
  const [status, setStatus] = useState<State>("idle");
  const [message, setMessage] = useState("");

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
      setStatus("success");
      setMessage("Request sent. We will reply by email.");
      form.reset();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "We could not send your request. Please email or call us.");
    }
  }

  return (
    <form className="lead-form" onSubmit={submit}>
      <div className="form-row">
        <label><span>Full name <span aria-hidden="true">*</span></span><input id="lf-name" name="name" autoComplete="name" maxLength={100} required /></label>
        <label><span>Work email <span aria-hidden="true">*</span></span><input id="lf-email" name="email" autoComplete="email" type="email" maxLength={254} required /></label>
      </div>
      <div className="form-row">
        <label>Company<input id="lf-company" name="company" autoComplete="organization" maxLength={150} /></label>
        <label>Number of machines
          <select id="lf-miners" name="miners" defaultValue="">
            <option value="">Select a range</option>
            <option value="1-10">1–10</option>
            <option value="11-50">11–50</option>
            <option value="51-200">51–200</option>
            <option value="200+">200+</option>
            <option value="undecided">Not sure yet</option>
          </select>
        </label>
      </div>
      <label>Machine models<input id="lf-models" name="models" maxLength={200} defaultValue={defaultModels} placeholder="e.g. Antminer Z15 Pro, S21+" /></label>
      <label>Message<textarea id="lf-notes" name="notes" rows={4} maxLength={4000} placeholder="Timeline, cooling preference, questions" /></label>
      <div className="hp-field" aria-hidden="true"><label>Leave this field empty<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      <label className="consent">
        <input id="lf-consent" type="checkbox" name="consent" value="yes" required />
        <span>I agree that Segments Cloud may use these details to reply to this enquiry. <Link href="/privacy">Privacy notice</Link>.</span>
      </label>
      <button type="submit" className="button form-submit" disabled={status === "sending"}>
        {status === "sending" ? <><LoaderCircle className="spin" size={18} aria-hidden="true" /> Sending…</> : <>Send request <QuoteIcon /></>}
      </button>
      {message && <p className={`form-feedback ${status}`} role={status === "error" ? "alert" : "status"}>{message}</p>}
    </form>
  );
}
