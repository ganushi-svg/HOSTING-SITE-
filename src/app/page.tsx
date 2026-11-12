import type React from "react";
import { Clock, Droplets, FileBarChart, Mail, MapPin, Phone, Wrench, Zap } from "lucide-react";
import { CoolingLayout } from "@/components/CoolingLayout";
import { OpsPanel } from "@/components/OpsPanel";
import { Globe } from "@/components/Globe";
import { LeadForm } from "@/components/LeadForm";
import { LegalNotices } from "@/components/LegalNotices";
import { HostingOverview } from "@/components/HostingOverview";
import { MonitoringSamples } from "@/components/MonitoringSamples";
import { SiteCameras } from "@/components/SiteCameras";
import { MachinesTable } from "@/components/MachinesTable";
import { CountUp } from "@/components/CountUp";
import { PowerCalculator } from "@/components/PowerCalculator";
import { QuoteIcon } from "@/components/QuoteIcon";
import { Reveal } from "@/components/Reveal";
import { SitePhoto } from "@/components/SitePhoto";
import { SiteVideo } from "@/components/SiteVideo";
import { Tabs } from "@/components/Tabs";
import { WhatsAppIcon } from "@/components/WhatsAppButton";
import { models } from "@/lib/models";
import { airVideos, capacity, contact, hydroVideos, photos, pricing, repair, site, whyHost, faqs, sections } from "@/lib/site";

/**
 * The whole site is this one page, in a six-section executive flow (Ganushi, 4 Nov 2026): Overview, Infrastructure,
 * Pricing, Calculator and hardware, FAQ, Contact. Every fact traces to content/ through src/lib. The former Services,
 * Sites, Quality, Repair, Reporting and How-it-works sections are folded into the four Infrastructure cards; their
 * components (CoolingLayout, SampleReport, MinerTurntable, Faq, SiteVideo, Tabs) stay in src/components for reuse.
 */

// The five flagship models shown before the "Show all models" toggle (models.ts).
const FLAGSHIPS = ["antminer-s21-xp", "antminer-s21-xp-hydro", "antminer-s21-plus", "antminer-z15-pro", "antminer-l9"];
// The six questions shown on the page; the rest of `faqs` stay in site.ts for Pip.
const FAQ_COUNT = 6;

// Four Infrastructure cards, at most three points each. Sources: content/services.md, sites.md, quality.md,
// cooling-structure.md (summer readiness), performance.md and contract-and-onboarding.md.
const infra = [
  {
    icon: Zap, kicker: `${capacity.totalMw} MW`, title: "Across Abu Dhabi",
    points: ["Hosting sites all around Abu Dhabi, each with a named site in-charge", "Hosting technicians on site 24/7, fully monitored", "Power capacity tracked per site and zone; load read before machines are placed"],
  },
  {
    icon: Droplets, kicker: "Air & hydro", title: "Cooling built for the UAE heat",
    points: ["Air-cooled halls: filtered fresh air, evaporative pads and exhaust fan walls", "Hydro zone: sealed coolant loops with a weekly nine-step inspection per container", "Intake filters cleaned weekly, disposable filters replaced monthly, by Segments Quality Control"],
  },
  {
    icon: Wrench, kicker: "In-house", title: "Bitmain-trained repair",
    points: [repair.steps.map((s) => s.title).join(" → "), "Common spares held in our own warehouse", "You approve every quote before work starts; the cost lands on the same invoice"],
  },
  {
    icon: FileBarChart, kicker: "Pool-synced", title: "Transparent billing",
    points: ["Fleet data synced daily: status, hash rate, last share, repair state", "Monthly report per machine: running days, energy kWh and charge", "Offline days billed $0; running days come from your pool data"],
  },
];

// Four key terms (content/pricing.md, content/contract-and-onboarding.md). The coins line is the billing-structure
// argument: hosting is settled from the client's own funds, so mined coins stay in the client's wallet.
const keyTerms: { label: string; value: string; note?: string }[] = [
  { label: "Setup fee", value: pricing.setupFeeLabel },
  { label: "Deposit", value: pricing.depositLabel },
  { label: "Minimum term", value: pricing.minimumTermLabel },
  { label: "Settlement", value: `${pricing.currenciesLabel}, by ${pricing.paymentMethodsLabel}`, note: "From your own funds. You keep 100% of the coins you mine." },
];

function SectionHead({ eyebrow, title, children }: { eyebrow: string; title: string; children?: React.ReactNode }) {
  return (
    <Reveal className="head">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {children && <p>{children}</p>}
    </Reveal>
  );
}

export default function Home() {
  const shownFaqs = faqs.slice(0, FAQ_COUNT);
  // Structured data for search engines (Ganushi, 4 Nov 2026). Every value comes from site.ts / models.ts, so nothing here is invented.
  const jsonLd = [
    { "@context": "https://schema.org", "@type": "WebSite", name: site.name, url: site.url, inLanguage: "en" },
    {
      "@context": "https://schema.org", "@type": "Service", name: "Bitcoin mining hosting", serviceType: "ASIC miner hosting",
      description: site.description, provider: { "@type": "Organization", name: site.name, url: site.url },
      areaServed: { "@type": "Country", name: "United Arab Emirates" }, availableChannel: { "@type": "ServiceChannel", serviceUrl: `${site.url}/#contact` },
      offers: {
        "@type": "Offer", priceCurrency: "USD", availability: "https://schema.org/InStock",
        priceSpecification: { "@type": "UnitPriceSpecification", price: pricing.plugFromUsd, priceCurrency: "USD", referenceQuantity: { "@type": "QuantitativeValue", value: 1, unitCode: "KWH" }, description: "Plug and play hosting from this rate per kWh; the rate is set by fleet size." },
      },
    },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: shownFaqs.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })) },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: sections.map((sec, i) => ({ "@type": "ListItem", position: i + 1, name: sec.label, item: `${site.url}/#${sec.id}` })) },
  ];

  return (
    <main id="main">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      {/* OVERVIEW */}
      <section id="overview" className="hero" aria-labelledby="hero-title">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-orb hero-orb-a" aria-hidden="true" />
        <div className="hero-orb hero-orb-b" aria-hidden="true" />
        <div className="container hero-inner">
          <div className="hero-copy">
            <p className="eyebrow"><span className="pulse-dot" aria-hidden="true" /> ASIC mining hosting · Abu Dhabi, {site.serviceArea}</p>
            <h1 id="hero-title">Host your mining machines with a team that runs <em>{capacity.totalMw} MW</em>.</h1>
            <p className="lead">{site.name} hosts ASIC miners for owners, funds and fleet operators: air and hydro-cooled halls, on-site technicians, in-house repair and per-machine billing.</p>
            <div className="cta-row">
              <a className="button" href="#contact">Request a quote <QuoteIcon size={26} /></a>
              <a className="button button-ghost" href="#calculator">Estimate power cost</a>
            </div>

          </div>
          <div className="hero-visual">
            <Globe />
            <p className="globe-note"><span aria-hidden="true" />{capacity.clientsHosted.toLocaleString("en-US")}+ clients from {capacity.clientRegionsLabel} host with Segments</p>
          </div>
        </div>
      </section>

      <section className="section stats-band" aria-label="Key figures">
        <div className="container stats">
          <Reveal className="panel stat"><b className="num"><CountUp value={capacity.totalMw} suffix=" MW" /></b><span>Power capacity across Abu Dhabi</span></Reveal>
          <Reveal delay={0.05} className="panel stat"><b className="num"><CountUp value={capacity.clientsHosted} suffix="+" /></b><span>Clients hosted</span></Reveal>
          <Reveal delay={0.1} className="panel stat"><b className="num"><CountUp value={capacity.uptimePct} suffix="%" /></b><span>Uptime</span></Reveal>
          <Reveal delay={0.15} className="panel stat"><b className="num"><CountUp value={capacity.machinesHosted} suffix="+" /></b><span>Machines hosted</span></Reveal>
        </div>
      </section>

      <HostingOverview />

      {/* INFRASTRUCTURE */}
      <section id="infrastructure" className="section alt" aria-labelledby="infrastructure-title">
        <div className="container">
          <SectionHead eyebrow="Infrastructure & operations" title="Abu Dhabi Infrastructure & Operations">One team runs the power, the cooling, the repair center and the billing, so every charge on your invoice traces to a machine and a day.</SectionHead>
          <div className="infra-grid">
            {infra.map((c, i) => (
              <Reveal key={c.title} delay={i * 0.05} className="panel infra-card">
                <span className="ico"><c.icon size={20} strokeWidth={1.7} aria-hidden="true" /></span>
                <p className="infra-kicker num">{c.kicker}</p>
                <h3>{c.title}</h3>
                <ul className="dot-list">{c.points.map((t) => <li key={t}>{t}</li>)}</ul>
              </Reveal>
            ))}
          </div>
          <OpsPanel />
          <div className="setups">
            <div className="setups-head">
              <p className="eyebrow">The two setups</p>
              <h3>How our air-cooled and hydro-cooling mining systems are built</h3>
              <p className="muted">Pick a system, tap a layer to see what it does, then see it for real in the photos and video from our sites.</p>
            </div>
            <Tabs
              label="The two setups"
              tabs={[
                {
                  id: "setup-air", label: "Air-cooled mining system",
                  content: (
                    <div className="setup-pane">
                      <CoolingLayout kind="air" />
                      <div className="setup-media">
                        <SitePhoto photo={photos.hallPadsAndRacks} crop sizes="(min-width: 840px) 36vw, 100vw" />
                        <SitePhoto photo={photos.hallRackCloseup} crop sizes="(min-width: 840px) 36vw, 100vw" />
                        <SiteVideo src={airVideos.wide.src} poster={airVideos.wide.poster} label="Air-cooled mining system video" caption={airVideos.wide.caption} />
                      </div>
                    </div>
                  ),
                },
                {
                  id: "setup-hydro", label: "Hydro-cooling mining system",
                  content: (
                    <div className="setup-pane">
                      <CoolingLayout kind="hydro" />
                      <div className="setup-media">
                        <SitePhoto photo={photos.hydroContainerAisle} crop sizes="(min-width: 840px) 36vw, 100vw" />
                        <SitePhoto photo={photos.hydroContainerDusk} crop sizes="(min-width: 840px) 36vw, 100vw" />
                        <SiteVideo src={hydroVideos[0].src} poster={hydroVideos[0].poster} label="Hydro-cooling mining system video" caption={hydroVideos[0].caption} />
                      </div>
                    </div>
                  ),
                },
              ]}
            />
          </div>
          <MonitoringSamples />
          <SiteCameras />
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="section" aria-labelledby="pricing-title">
        <div className="container">
          <SectionHead eyebrow="Pricing" title="Two ways to host">Ship your machines to our halls on a per-kWh rate, or have capacity built for your fleet.</SectionHead>
          <div className="plans">
            <Reveal className="panel plan plan-pick">
              <span className="plan-kicker">Your machines, our halls</span>
              <h3>Plug and play</h3>
              <p className="price num">{pricing.plugFromLabel}<small>/ kWh, from</small></p>
              <ul>{pricing.tiers.map((t) => <li key={t.min}><b>{t.rateLabel}</b> per kWh for {t.label.toLowerCase()}</li>)}<li>Minimum fleet: {pricing.minimumFleetLabel.toLowerCase()}</li><li>Air-cooled halls or the hydro zone</li></ul>
              <a className="button plan-cta" href="#contact">Get a quote <QuoteIcon /></a>
            </Reveal>
            <Reveal delay={0.06} className="panel plan">
              <span className="plan-kicker plan-kicker-muted">For larger fleets</span>
              <h3>Turnkey solution</h3>
              <p className="price num">{pricing.turnkeyPowerFromLabel}<small>/ kWh, from</small></p>
              <ul><li>Capex <b>{pricing.turnkeyCapexPerMwLabel}</b> per MW: {pricing.turnkeyTerms[0].value.toLowerCase()}</li>{pricing.turnkeyTerms.slice(1).map((t) => <li key={t.label}><b>{t.value}</b> {t.label.toLowerCase()}</li>)}</ul>
              <a className="button button-outline plan-cta" href="#contact">Request a proposal</a>
            </Reveal>
          </div>
          <Reveal className="key-terms" aria-label="Key terms and settlement">
            <p className="eyebrow">Key terms & settlement</p>
            <ul>{keyTerms.map((t) => <li key={t.label}><span>{t.label}</span><b>{t.value}</b>{t.note && <small>{t.note}</small>}</li>)}</ul>
          </Reveal>
          <Reveal className="why">
            <div className="why-head">
              <p className="eyebrow">{whyHost.eyebrow}</p>
              <h3>{whyHost.title}</h3>
              <p className="muted">{whyHost.lead}</p>
            </div>
            <p className="fine-print why-note">{whyHost.note}</p>
          </Reveal>
        </div>
      </section>

      {/* CALCULATOR AND HARDWARE */}
      <section id="calculator" className="section alt" aria-labelledby="calculator-title">
        <div className="container">
          <SectionHead eyebrow="Calculator & supported hardware" title="Estimate your hosting power bill">Pick a machine and a quantity to see the monthly power charge at our plug and play rate. Hosting cost only, never mining revenue.</SectionHead>
          <PowerCalculator />
          <div className="hardware-head">
            <p className="eyebrow">Supported hardware</p>
            <h3>{models.length} models, air and hydro-cooled</h3>
          </div>
          <MachinesTable models={models} flagships={FLAGSHIPS} />
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="section" aria-labelledby="faq-title">
        <div className="container">
          <SectionHead eyebrow="FAQ" title="Common questions" />
          <div className="faq">
            {shownFaqs.map((f, i) => (
              <Reveal key={f.question} delay={i * 0.03}>
                <details className="panel">
                  <summary>{f.question}</summary>
                  <p>{f.answer}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="section alt" aria-labelledby="contact-title">
        <div className="container">
          <SectionHead eyebrow="Contact" title="Request a hosting quote">Tell us about your fleet and we will reply by email with a quote.</SectionHead>
          <div className="contact">
            <div className="contact-side">
              <Reveal className="vcard">
                <div className="vcard-top">
                  {/* eslint-disable-next-line @next/next/no-img-element -- small static logo */}
                  <img className="vcard-logo" src="/logo-mark.webp" width={30} height={35} alt="" />
                  <span className="vcard-brand">Segments Cloud<small>Mining hosting · Abu Dhabi</small></span>
                </div>
                <div className="vcard-id">
                  {/* eslint-disable-next-line @next/next/no-img-element -- portrait supplied by Segments (5 Nov 2026) */}
                  <img className="vcard-photo" src={contact.photo} width={480} height={480} alt={`${contact.person}, ${contact.personTitle} at Segments Cloud`} />
                  <div>
                    <h3>{contact.person}</h3>
                    <p className="vcard-title">{contact.personTitle}</p>
                  </div>
                </div>
                <div className="vcard-actions">
                  <a className="vcard-btn vcard-call" href={contact.phoneUrl}><i className="vcard-badge"><Phone size={18} strokeWidth={2.2} aria-hidden="true" /></i><span><b>Call</b><small>{contact.hours}</small></span></a>
                  <a className="vcard-btn vcard-wa" href={contact.whatsappUrl} target="_blank" rel="noopener noreferrer"><i className="vcard-badge"><WhatsAppIcon size={20} /></i><span><b>WhatsApp</b><small>After office hours</small></span></a>
                </div>
                <dl className="vcard-lines">
                  <div><dt className="vcard-ico"><Phone size={16} strokeWidth={2.2} aria-hidden="true" /></dt><dd className="num selectable">{contact.phone}</dd></div>
                  <div><dt className="vcard-ico"><Mail size={16} strokeWidth={2.2} aria-hidden="true" /></dt><dd className="selectable">{contact.email}</dd></div>
                  <div><dt className="vcard-ico"><MapPin size={16} strokeWidth={2.2} aria-hidden="true" /></dt><dd>{contact.office}</dd></div>
                </dl>
                <a className="vcard-save" href={contact.vcard} download>Save contact to phone</a>
              </Reveal>
              <div className="panel contact-info">
                <div><Clock size={18} aria-hidden="true" /><span><small>Office hours</small><b>{contact.hours}</b></span></div>
                <div><Mail size={18} aria-hidden="true" /><span><small>Email</small><b className="selectable">{contact.email}</b></span></div>
                <div><MapPin size={18} aria-hidden="true" /><span><small>Office</small><address>{contact.office}</address></span></div>
              </div>
            </div>
            <div className="panel form-panel">
              <h3>Tell us about your fleet.</h3>
              <p className="muted">Name and email are required. Everything else helps us quote faster.</p>
              <LeadForm />
            </div>
          </div>

          <LegalNotices />
        </div>
      </section>
    </main>
  );
}
