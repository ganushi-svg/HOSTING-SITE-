import type { Metadata } from "next";
import { Building2, Droplets, MessageCircle, Wrench, Zap } from "lucide-react";
import { LeadForm } from "@/components/LeadForm";
import { PageHero } from "@/components/PageHero";
import { TODO } from "@/components/TODO";
import { usd } from "@/lib/models";
import { capacity, contact, pricing, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Turnkey Mining Solution",
  description: `Turnkey mining capacity in the ${site.serviceArea}: power from ${pricing.turnkeyPowerFromLabel} per kWh and capex of ${pricing.turnkeyCapexPerMwLabel} per MW, from the team running ${capacity.totalMw} MW.`,
  alternates: { canonical: "/turnkey" },
};

// Arithmetic only: MW × capex per MW, and MW × 1,000 kW × 24 h × 30 days × power rate (content/pricing.md).
const sizes = [1, 5, 10, 20].map((mw) => ({
  mw,
  capex: mw * pricing.turnkeyCapexPerMwUsd,
  power: mw * 1000 * 24 * 30 * pricing.turnkeyPowerFromUsd,
}));

const compare = [
  { label: "Power rate", plug: `${pricing.plugRangeLabel} per kWh, by quantity`, turnkey: `From ${pricing.turnkeyPowerFromLabel} per kWh` },
  { label: "Upfront capex", plug: "None", turnkey: `${pricing.turnkeyCapexPerMwLabel} per MW` },
  { label: "How you start", plug: "Ship your machines to our halls", turnkey: "Capacity built for your fleet" },
];

const open = ["What the capex covers", "Who owns the infrastructure", "Minimum capacity (MW)", "Build timeline", "Contract term"];

export default function TurnkeyPage() {
  return (
    <main id="main" className="subpage">
      <div className="container">
        <PageHero
          kicker="Turnkey solution"
          title="Mining capacity,"
          highlight="built for your fleet."
          lede={`For larger fleets: a turnkey build with power from ${pricing.turnkeyPowerFromLabel} per kWh, delivered by the team that runs ${capacity.totalMw} MW in the ${site.serviceArea}.`}
        />

        <section className="subpage-block grid-2" aria-label="Turnkey pricing">
          <div className="rate-card">
            <span className="section-kicker">Power</span>
            <p className="rate-value">{pricing.turnkeyPowerFromLabel}<small>per kWh, from</small></p>
            <p className="muted-line">US dollars, per kilowatt-hour consumed.</p>
          </div>
          <div className="rate-card">
            <span className="section-kicker">Capex</span>
            <p className="rate-value">$300k<small>per MW</small></p>
            <p className="muted-line">{pricing.turnkeyCapexPerMwLabel} per megawatt of capacity.</p>
          </div>
        </section>

        <section className="subpage-block" aria-labelledby="size-title">
          <span className="section-kicker">By size</span>
          <h2 id="size-title">What a build looks like</h2>
          <div className="table-wrap">
            <table className="data-table">
              <caption className="sr-only">Turnkey capex and power cost by capacity</caption>
              <thead><tr><th scope="col">Capacity</th><th scope="col">Capex</th><th scope="col">Power, 30 days at full load</th></tr></thead>
              <tbody>
                {sizes.map((s) => (
                  <tr key={s.mw}><th scope="row">{s.mw} MW</th><td>{usd(s.capex).replace(".00", "")}</td><td>from {usd(s.power).replace(".00", "")}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="fine-print">Capex = MW × {pricing.turnkeyCapexPerMwLabel}. Power = MW × 1,000 kW × 24 h × 30 days × {pricing.turnkeyPowerFromLabel}. Power only; your proposal sets the final figures.</p>
        </section>

        <section className="subpage-block" aria-labelledby="compare-title">
          <span className="section-kicker">Compare</span>
          <h2 id="compare-title">Plug and play or turnkey</h2>
          <div className="table-wrap">
            <table className="data-table">
              <thead><tr><th scope="col"><span className="sr-only">Item</span></th><th scope="col">Plug and play</th><th scope="col">Turnkey</th></tr></thead>
              <tbody>
                {compare.map((c) => <tr key={c.label}><th scope="row">{c.label}</th><td>{c.plug}</td><td>{c.turnkey}</td></tr>)}
              </tbody>
            </table>
          </div>
        </section>

        <section className="subpage-block grid-2" aria-label="Operator and open terms">
          <div className="panel">
            <h2>Run by an operator</h2>
            <ul className="check-list">
              <li><Zap size={17} aria-hidden="true" /> {capacity.totalMw} MW of operating capacity in the {site.serviceArea}</li>
              <li><Droplets size={17} aria-hidden="true" /> Air-cooled halls and hydro-cooled zones</li>
              <li><Wrench size={17} aria-hidden="true" /> On-site technicians and an in-house repair center</li>
              <li><Building2 size={17} aria-hidden="true" /> Monthly power reporting per machine</li>
            </ul>
          </div>
          <div className="panel">
            <h2>Agreed in your proposal</h2>
            <ul className="term-list">
              {open.map((item) => <li key={item}><span>{item}</span><TODO source="content/pricing.md" inline>to be provided</TODO></li>)}
            </ul>
          </div>
        </section>

        <section className="subpage-block contact-grid" id="turnkey-quote" aria-labelledby="turnkey-quote-title">
          <div className="contact-copy">
            <span className="section-kicker">Request a proposal</span>
            <h2 id="turnkey-quote-title">Plan your <span>turnkey build.</span></h2>
            <p className="section-lede">Tell us the capacity you need, your machine models and your timeline.</p>
            {contact.whatsapp && (
              <a className="button button-outline" href={`${contact.whatsappUrl}?text=${encodeURIComponent("Hello Segments, I would like a turnkey proposal.")}`} target="_blank" rel="noopener noreferrer">
                <MessageCircle size={18} aria-hidden="true" /> Ask on WhatsApp
              </a>
            )}
          </div>
          <div className="form-panel">
            <div className="form-panel-top"><span>TURNKEY ENQUIRY</span><span className="form-panel-indicator"><span aria-hidden="true" /> Goes straight to our team</span></div>
            <h3>Tell us about your project.</h3>
            <p className="form-intro">Add the MW you need in the message.</p>
            <LeadForm defaultModels="Turnkey solution" />
          </div>
        </section>
      </div>
    </main>
  );
}
