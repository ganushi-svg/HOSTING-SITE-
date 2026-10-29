import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { QuoteCallout } from "@/components/QuoteCallout";
import { TODO } from "@/components/TODO";
import { billing, pricing } from "@/lib/site";
import { QuoteIcon } from "@/components/QuoteIcon";

export const metadata: Metadata = {
  title: "Hosting Pricing",
  description: `Plug and play mining hosting from ${pricing.plugFromLabel} to $0.068 per kWh by quantity, or a turnkey build with power from ${pricing.turnkeyPowerFromLabel} per kWh. See how charges are calculated.`,
  alternates: { canonical: "/pricing" },
};

const open = ["Quantity tiers for the plug and play rate", "What the rate includes besides power", "Setup fee and deposit", "Minimum term and minimum fleet size", "Payment currencies and methods"];

export default function PricingPage() {
  return (
    <main id="main" className="subpage">
      <div className="container">
        <PageHero kicker="Pricing" title="Two ways" highlight="to host." lede="Ship your machines to our halls on a per-kWh rate, or have capacity built for your fleet with a turnkey solution." />

        <section className="subpage-block grid-2" aria-label="Pricing options">
          <div className="rate-card">
            <span className="section-kicker">Plug and play hosting</span>
            <p className="rate-value">{pricing.plugFromLabel}<small>per kWh, from</small></p>
            <p className="muted-line">{pricing.plugRangeLabel} per kWh depending on quantity. Your machines, our halls, billed on running days.</p>
            <Link className="button" href="/contact">Request a quote <QuoteIcon /></Link>
          </div>
          <div className="rate-card rate-card-alt">
            <span className="section-kicker">Turnkey solution</span>
            <p className="rate-value">{pricing.turnkeyPowerFromLabel}<small>per kWh, from</small></p>
            <p className="muted-line">Power from {pricing.turnkeyPowerFromLabel} per kWh, with capex of {pricing.turnkeyCapexPerMwLabel} per MW.</p>
            <Link className="button button-outline" href="/turnkey">See the turnkey solution <ArrowRight size={18} aria-hidden="true" /></Link>
          </div>
        </section>

        <section className="subpage-block split" aria-label="Billing">
          <div className="panel">
            <h2>How plug and play is billed</h2>
            <ul className="dot-list">{billing.map((b) => <li key={b}>{b}</li>)}</ul>
            <p style={{ marginBottom: 0 }}><Link href="/monitoring" className="text-link">See a sample report <ArrowRight size={18} aria-hidden="true" /></Link></p>
          </div>
          <div className="stack">
            <div className="panel">
              <h2>Cost for your model</h2>
              <p className="muted-line" style={{ marginTop: 0 }}>Each model page shows its nameplate power and a 30-day power cost at the plug and play range.</p>
              <Link href="/models" className="text-link">Browse models, including the Z15 Pro <ArrowRight size={18} aria-hidden="true" /></Link>
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
