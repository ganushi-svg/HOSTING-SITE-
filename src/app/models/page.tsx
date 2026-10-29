import type { Metadata } from "next";
import { ModelCard } from "@/components/ModelCard";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { QuoteCallout } from "@/components/QuoteCallout";
import { TODO } from "@/components/TODO";
import { models } from "@/lib/models";
import { pricing, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Hosting by Machine Model",
  description: `Hosting for the Antminer Z15 Pro, S21 series, L9, KS5, hydro models and more in the ${site.serviceArea}. Nameplate power and a monthly power estimate for each model.`,
  alternates: { canonical: "/models" },
};

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
          <div className="model-grid model-grid-featured">{featured.map((m, i) => <Reveal key={m.slug} delay={(i % 4) * 0.06}><ModelCard m={m} /></Reveal>)}</div>
        </section>

        <section className="subpage-block" aria-labelledby="air-title">
          <span className="section-kicker">Air-cooled halls</span>
          <h2 id="air-title">Air-cooled models</h2>
          <div className="model-grid">{air.map((m, i) => <Reveal key={m.slug} delay={(i % 4) * 0.06}><ModelCard m={m} /></Reveal>)}</div>
        </section>

        <section className="subpage-block" aria-labelledby="hydro-title">
          <span className="section-kicker">Hydro-cooled zone</span>
          <h2 id="hydro-title">Hydro-cooled models</h2>
          <div className="model-grid">{hydro.map((m, i) => <Reveal key={m.slug} delay={(i % 4) * 0.06}><ModelCard m={m} /></Reveal>)}</div>
          <p className="fine-print">Power cost estimates are power only, for 30 running days at the plug and play range of {pricing.plugRangeLabel} per kWh. Wattage is the nameplate figure from our fleet records. Your quote depends on quantity. Machine images are 3D renders for illustration, not product photos.</p>
          <TODO source="content/models.md">IceRiver AL3 / AL-BOX: confirm the model name before it gets a page</TODO>
        </section>

        <QuoteCallout title="Model not listed?" text="Tell us what you run and how many units. We will confirm whether we can host it and send a quote." />
      </div>
    </main>
  );
}
