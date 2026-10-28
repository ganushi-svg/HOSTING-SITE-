import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { QuoteCallout } from "@/components/QuoteCallout";
import { TODO } from "@/components/TODO";

export const metadata: Metadata = {
  title: "How Hosting Works",
  description: "Onboarding steps and contract terms for Segments Cloud mining hosting, from first enquiry to running machines.",
  alternates: { canonical: "/how-it-works" },
};

const terms = ["Contract length", "Notice period", "Who contracts with you", "Payment terms", "Machine delivery and return"];

export default function HowItWorksPage() {
  return (
    <main id="main" className="subpage">
      <div className="container">
        <PageHero kicker="How it works" title="From first enquiry to" highlight="running machines." />

        <section className="subpage-block" aria-labelledby="steps-title">
          <h2 id="steps-title">Onboarding steps</h2>
          <ol className="process-grid">
            <li className="process-card"><div className="process-number">01<span className="step-line" /></div><h3>Request a quote</h3><p>Send your machine models and quantity through the contact form.</p></li>
            {["02", "03", "04"].map((n) => (
              <li className="process-card" key={n}><div className="process-number">{n}<span className="step-line" /></div><TODO source="content/contract-and-onboarding.md">Step title and description</TODO></li>
            ))}
          </ol>
        </section>

        <section className="subpage-block" aria-labelledby="terms-title">
          <h2 id="terms-title">Contract terms</h2>
          <div className="panel">
            <ul className="term-list">
              {terms.map((t) => (
                <li key={t}><strong>{t}</strong><TODO source="content/contract-and-onboarding.md" inline>to be provided</TODO></li>
              ))}
            </ul>
          </div>
        </section>

        <QuoteCallout />
      </div>
    </main>
  );
}
