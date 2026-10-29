import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { LeadForm } from "@/components/LeadForm";
import Image from "next/image";
import { MinerArt } from "@/components/MinerArt";
import { SiteVideo } from "@/components/SiteVideo";
import { TODO } from "@/components/TODO";
import { getModel, models, monthlyEstimate, renderFor, usd } from "@/lib/models";
import { contact, pricing, services, site } from "@/lib/site";
import { QuoteIcon } from "@/components/QuoteIcon";
import { WhatsAppIcon } from "@/components/WhatsAppButton";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return models.map((m) => ({ slug: m.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const m = getModel((await params).slug);
  if (!m) return {};
  return {
    title: `${m.name} Hosting in the ${site.serviceArea}`,
    description: `Host your ${m.name} with ${site.name} in ${m.cooling.toLowerCase()}-cooled halls in the ${site.serviceArea}. ${m.watts.toLocaleString("en-US")} W nameplate, plug and play hosting from ${pricing.plugFromLabel} per kWh.`,
    alternates: { canonical: `/models/${m.slug}` },
  };
}

export default async function ModelPage({ params }: Props) {
  const m = getModel((await params).slug);
  if (!m) notFound();
  const est = monthlyEstimate(m.watts);
  const render = renderFor(m.slug);
  const hall = m.cooling === "Hydro" ? "our hydro-cooled zone" : "our air-cooled halls";
  const included = [
    `Space in ${hall}`,
    services.operations[0],
    "In-house repair, with a quote you approve before work starts",
    "Every machine tracked on the fleet platform",
    "Monthly report with running days, energy and charge per machine",
  ];

  return (
    <main id="main" className="subpage">
      <div className="container">
        <p className="crumbs"><Link href="/models" className="text-link"><ArrowLeft size={16} aria-hidden="true" /> All models</Link></p>
        <section className="subpage-hero model-hero">
          <div>
            <span className="section-kicker">{m.maker} · {m.cooling}-cooled · {m.algorithm}</span>
            <h1>{m.name} <span>hosting in the {site.serviceArea}.</span></h1>
            <p className="section-lede">We host the {m.name} in {hall}, with on-site technicians, in-house repair and a monthly power report for every machine.</p>
          </div>
          {render?.video ? (
            <div className="model-hero-art model-hero-video">
              <SiteVideo src={render.video} poster={render.videoPoster ?? render.poster} label={`Rotating 3D render of the ${m.name}`} caption="3D render for illustration, not a product photo" />
            </div>
          ) : (
            <figure className="model-hero-art">
              {render ? (
                <Image className="model-render" src={render.poster} alt={`3D render of the ${m.name}`} width={960} height={720} priority sizes="(min-width: 880px) 36vw, 90vw" />
              ) : (
                <MinerArt id={`${m.slug}-hero`} cooling={m.cooling} algorithm={m.algorithm} />
              )}
              <figcaption>{render ? "3D render for illustration, not a product photo" : "Illustration, not a product photo"}</figcaption>
            </figure>
          )}
        </section>

        <section className="subpage-block split" aria-label="Specification and cost">
          <div className="rate-card">
            <span className="section-kicker">Plug and play rate</span>
            <p className="rate-value">{pricing.plugFromLabel}<small>per kWh, from</small></p>
            <p className="muted-line">{pricing.plugRangeLabel} per kWh depending on quantity.</p>
            <div className="estimate">
              <span>Power cost per {m.name}, 30 running days</span>
              <strong>{usd(est.from)} – {usd(est.to)}</strong>
              <small>{Math.round(est.kwh).toLocaleString("en-US")} kWh × rate. Power only. Billed on actual running days.</small>
            </div>
            <Link className="button" href="#model-quote">Get a quote for the {m.name} <QuoteIcon /></Link>
          </div>
          <div className="stack">
            <div className="panel">
              <h2>Specification</h2>
              <dl className="spec-list">
                <div><dt>Manufacturer</dt><dd>{m.maker}</dd></div>
                <div><dt>Cooling</dt><dd>{m.cooling}-cooled</dd></div>
                <div><dt>Nameplate power</dt><dd>{m.watts.toLocaleString("en-US")} W{m.wattsNote && <small> ({m.wattsNote})</small>}</dd></div>
                {m.hashrate && <div><dt>Hash rate</dt><dd>{m.hashrate}</dd></div>}
                <div><dt>Algorithm</dt><dd>{m.algorithm}</dd></div>
                <div><dt>Coins</dt><dd>{m.coins}</dd></div>
              </dl>
              <p className="fine-print">Power figure: {m.wattsSource}.</p>
              {m.todo && <TODO source="content/models.md">{m.todo}</TODO>}
            </div>
            <div className="panel">
              <h2>What hosting includes</h2>
              <ul className="check-list">{included.map((i) => <li key={i}><Check size={17} aria-hidden="true" /> {i}</li>)}</ul>
              <p style={{ marginBottom: 0 }}><Link href="/pricing" className="text-link">How billing works <ArrowRight size={18} aria-hidden="true" /></Link></p>
            </div>
          </div>
        </section>

        <section className="subpage-block contact-grid" id="model-quote" aria-labelledby="model-quote-title">
          <div className="contact-copy">
            <span className="section-kicker">Request a quote</span>
            <h2 id="model-quote-title">Host your <span>{m.name}.</span></h2>
            <p className="section-lede">Tell us how many units and when they arrive. We reply by email with a quote.</p>
            {contact.whatsapp && (
              <a className="button button-outline" href={`${contact.whatsappUrl}?text=${encodeURIComponent(`Hello Segments, I would like a hosting quote for ${m.name}.`)}`} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon size={22} /> Ask on WhatsApp
              </a>
            )}
          </div>
          <div className="form-panel">
            <div className="form-panel-top"><span>{m.name.toUpperCase()} ENQUIRY</span><span className="form-panel-indicator"><span aria-hidden="true" /> Goes straight to our team</span></div>
            <h3>Tell us about your fleet.</h3>
            <p className="form-intro">Name and email are required.</p>
            <LeadForm defaultModels={m.name} />
          </div>
        </section>
      </div>
    </main>
  );
}
