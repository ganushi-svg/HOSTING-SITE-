import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { QuoteCallout } from "@/components/QuoteCallout";
import { TODO } from "@/components/TODO";
import { billing, pricing } from "@/lib/site";

export const metadata: Metadata = {
  title: "Hosting Pricing",
  description: `Mining hosting at ${pricing.rateLabel} per kWh, billed only on the days your machines run. See how the charge is calculated and request a quote.`,
  alternates: { canonical: "/pricing" },
};

const open = ["What the rate includes besides power", "Setup fee and deposit", "Minimum term and minimum fleet size", "Payment currencies and methods"];

export default function PricingPage() {
  return (
    <main id="main" className="subpage">
      <div className="container">
        <PageHero kicker="Pricing" title="One rate" highlight="per kWh." lede="You pay for the power your machines use, on the days they run. Send us your fleet details for a full quote." />

        <section className="subpage-block split" aria-label="Rate and billing">
          <div className="rate-card">
            <span className="section-kicker">Hosting rate</span>
            <p className="rate-value">{pricing.rateLabel}<small>per kWh</small></p>
            <p style={{ color: "var(--muted)", margin: 0 }}>US dollars, per kilowatt-hour consumed.</p>
            <Link className="button" href="/contact" style={{ marginTop: 10 }}>Request a quote <ArrowUpRight size={18} aria-hidden="true" /></Link>
          </div>
          <div className="stack">
            <div className="panel">
              <h2>How your charge is calculated</h2>
              <ul className="dot-list">{billing.map((b) => <li key={b}>{b}</li>)}</ul>
              <p style={{ marginBottom: 0 }}><Link href="/monitoring" className="text-link">See a sample report <ArrowRight size={18} aria-hidden="true" /></Link></p>
            </div>
            <div className="panel">
              <h2>Other terms</h2>
              <ul className="term-list">
                {open.map((item) => (
                  <li key={item}><span>{item}</span><TODO source="content/pricing.md" inline>to be provided</TODO></li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <QuoteCallout />
      </div>
    </main>
  );
}
