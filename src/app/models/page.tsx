import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Droplets, Fan } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { QuoteCallout } from "@/components/QuoteCallout";
import { TODO } from "@/components/TODO";
import { models, monthlyEstimate, usd, type Model } from "@/lib/models";
import { pricing, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Hosting by Machine Model",
  description: `Hosting for the Antminer Z15 Pro, S21 series, L9, KS5, hydro models and more in the ${site.serviceArea}. Nameplate power and a monthly power estimate for each model.`,
  alternates: { canonical: "/models" },
};

function ModelCard({ m }: { m: Model }) {
  const est = monthlyEstimate(m.watts);
  return (
    <Link href={`/models/${m.slug}`} className={m.featured ? "model-card model-card-featured" : "model-card"}>
      <div className="model-card-top">
        <span className="model-badge">{m.cooling === "Hydro" ? <Droplets size={14} aria-hidden="true" /> : <Fan size={14} aria-hidden="true" />} {m.cooling}-cooled</span>
        {m.featured && <span className="model-badge model-badge-gold">Featured</span>}
      </div>
      <h3>{m.name}</h3>
      <dl className="model-specs">
        <div><dt>Power</dt><dd>{m.watts.toLocaleString("en-US")} W</dd></div>
        <div><dt>Algorithm</dt><dd>{m.algorithm}</dd></div>
        <div><dt>Power cost / 30 days</dt><dd>{usd(est.from)} – {usd(est.to)}</dd></div>
      </dl>
      <span className="service-link">View hosting details <ArrowUpRight size={16} aria-hidden="true" /></span>
    </Link>
  );
}

export default function ModelsPage() {
  const featured = models.filter((m) => m.featured);
  const air = models.filter((m) => !m.featured && m.cooling === "Air");
  const hydro = models.filter((m) => m.cooling === "Hydro");
  return (
    <main id="main" className="subpage">
      <div className="container">
        <PageHero
          kicker="Models we host"
          title="Hosting for"
          highlight="your machine model."
          lede={`Air-cooled and hydro-cooled ASICs, from Bitcoin miners to the Antminer Z15 Pro. Plug and play hosting from ${pricing.plugFromLabel} per kWh.`}
        />

        <section className="subpage-block" aria-labelledby="featured-title">
          <span className="section-kicker">Featured</span>
          <h2 id="featured-title">Antminer Z15 Pro hosting</h2>
          <div className="model-grid">{featured.map((m) => <ModelCard key={m.slug} m={m} />)}</div>
        </section>

        <section className="subpage-block" aria-labelledby="air-title">
          <span className="section-kicker">Air-cooled halls</span>
          <h2 id="air-title">Air-cooled models</h2>
          <div className="model-grid">{air.map((m) => <ModelCard key={m.slug} m={m} />)}</div>
        </section>

        <section className="subpage-block" aria-labelledby="hydro-title">
          <span className="section-kicker">Hydro-cooled zone</span>
          <h2 id="hydro-title">Hydro-cooled models</h2>
          <div className="model-grid">{hydro.map((m) => <ModelCard key={m.slug} m={m} />)}</div>
          <p className="fine-print">Power cost estimates are power only, for 30 running days at the plug and play range of {pricing.plugRangeLabel} per kWh. Wattage is the nameplate figure from our fleet records. Your quote depends on quantity.</p>
          <TODO source="content/models.md">IceRiver AL3 / AL-BOX: confirm the model name before it gets a page</TODO>
        </section>

        <QuoteCallout title="Model not listed?" text="Tell us what you run and how many units. We will confirm whether we can host it and send a quote." />
      </div>
    </main>
  );
}
