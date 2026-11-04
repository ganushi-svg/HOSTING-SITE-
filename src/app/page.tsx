import type React from "react";
import { Check, Clock, Droplets, Fan, FileBarChart, Mail, MapPin, Phone, Wrench, Zap } from "lucide-react";
import { Globe } from "@/components/Globe";
import { LeadForm } from "@/components/LeadForm";
import { MachinesTable } from "@/components/MachinesTable";
import { CountUp } from "@/components/CountUp";
import { PowerCalculator } from "@/components/PowerCalculator";
import { QuoteIcon } from "@/components/QuoteIcon";
import { Reveal } from "@/components/Reveal";
import { SitePhoto } from "@/components/SitePhoto";
import { TODO } from "@/components/TODO";
import { WhatsAppIcon } from "@/components/WhatsAppButton";
import { models } from "@/lib/models";
import { capacity, contact, photos, pricing, repair, site, whyHost, faqs, sections } from "@/lib/site";

/**
 * The whole site is this one page, in a six-section executive flow (Ganushi, 4 Nov 2026): Overview, Infrastructure,
 * Pricing, Calculator and hardware, FAQ, Contact. Every fact traces to content/ through src/lib. The former Services,
 * Sites, Quality, Repair, Reporting and How-it-works sections are folded into the four Infrastructure cards; their
 * components (CoolingLayout, SampleReport, MinerTurntable, Faq, SiteVideo, Tabs) stay in src/components for reuse.
 */

// The five flagship models shown before "Show all 16 models" (models.ts).
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
    points: ["Air-cooled halls: filtered fresh air, evaporative pads and exhaust fan walls", "Hydro zone: sealed coolant loops with a weekly nine-step inspection per container", "Filters cleaned weekly and replaced monthly by Segments Quality Control"],
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

const keyTerms = [
  { label: "Setup fee", value: pricing.setupFeeLabel },
  { label: "Deposit", value: pricing.depositLabel },
  { label: "Minimum term", value: pricing.minimumTermLabel },
  { label: "Settlement", value: `${pricing.currenciesLabel}, by ${pricing.paymentMethodsLabel}` },
  { label: "Your coins", value: "Stay in your wallet, 100%" },
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
            <p className="lead">{site.name} hosts ASIC miners for owners, funds and fleet operators: air and hydro-cooled halls, on-site technicians, in-house repair and a monthly power report for every machine.</p>
            <div className="cta-row">
              <a className="button" href="#contact">Request a quote <QuoteIcon size={26} /></a>
              <a className="button button-ghost" href="#calculator">Estimate power cost</a>
            </div>

          </div>
          <div className="hero-visual">
            <Globe />
            <p className="globe-note"><span aria-hidden="true" />Ongoing clients from {capacity.clientRegionsLabel} host with Segments</p>
          </div>
        </div>
      </section>

      <section className="section stats-band" aria-label="Key figures">
        <div className="container stats">
          <Reveal className="panel stat"><b className="num"><CountUp value={capacity.totalMw} suffix=" MW" /></b><span>Operating power capacity</span></Reveal>
          <Reveal delay={0.05} className="panel stat"><b>Abu Dhabi</b><span>Hosting sites all around Abu Dhabi</span></Reveal>
          <Reveal delay={0.1} className="panel stat"><b className="num"><CountUp value={capacity.uptimePct} suffix="%" /></b><span>Uptime</span></Reveal>
          <Reveal delay={0.15} className="panel stat"><b className="num"><CountUp value={capacity.machinesHosted} suffix="+" /></b><span>Machines hosted</span></Reveal>
        </div>
      </section>

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
          <div className="infra-photos">
            <SitePhoto photo={photos.hallLongRacks} crop sizes="(min-width: 840px) 33vw, 100vw" />
            <SitePhoto photo={photos.hydroContainerDusk} crop sizes="(min-width: 840px) 33vw, 100vw" />
            <SitePhoto photo={photos.hallCoolingPadWall} crop sizes="(min-width: 840px) 33vw, 100vw" />
          </div>
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
              <ul>{pricing.tiers.map((t) => <li key={t.min}><b>{t.rateLabel}</b> per kWh for {t.label.toLowerCase()}</li>)}<li>Billed only on running days</li><li>Air-cooled halls or the hydro zone</li></ul>
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
            <ul>{keyTerms.map((t) => <li key={t.label}><span>{t.label}</span><b>{t.value}</b></li>)}</ul>
          </Reveal>
          <Reveal className="why">
            <div className="why-head">
              <p className="eyebrow">{whyHost.eyebrow}</p>
              <h3>{whyHost.title}</h3>
              <p className="muted">{whyHost.lead}</p>
            </div>
            <ul className="why-points why-points-wide">
              {whyHost.points.map((pt) => <li key={pt.title}><b>{pt.title}</b><span>{pt.text}</span></li>)}
            </ul>
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
                  {/* eslint-disable-next-line @next/next/no-img-element -- portrait supplied by Ganushi KC */}
                  <img className="vcard-photo" src="/brand/ganushi.webp" width={480} height={480} alt="Ganushi KC" />
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
                <a className="vcard-save" href="/ganushi-kc.vcf" download>Save contact to phone</a>
              </Reveal>
              <div className="panel contact-info">
                <div><Clock size={18} aria-hidden="true" /><span><small>Office hours</small><b>{contact.hours}</b></span></div>
                <div><Mail size={18} aria-hidden="true" /><span><small>Email</small><b className="selectable">{contact.email}</b></span></div>
                <div><MapPin size={18} aria-hidden="true" /><span><small>Office</small><address>{contact.office}</address></span></div>
                <ul className="contact-points">
                  <li><Check size={16} aria-hidden="true" /> From {pricing.plugFromLabel} per kWh, billed on running days</li>
                  <li><Fan size={16} aria-hidden="true" /> Air and hydro-cooled halls</li>
                </ul>
              </div>
            </div>
            <div className="panel form-panel">
              <h3>Tell us about your fleet.</h3>
              <p className="muted">Name and email are required. Everything else helps us quote faster.</p>
              <LeadForm />
            </div>
          </div>

          <details className="panel privacy" id="privacy">
            <summary>Privacy notice (draft, requires legal review)</summary>
            <div className="privacy-body">
              <TODO source="legal">Replace this draft with a privacy notice approved by the company&apos;s legal advisor before the public launch</TODO>
              <h4>What the enquiry form collects</h4>
              <p>Your name, work email, company, number of machines, machine models and your message.</p>
              <h4>Why we use it</h4>
              <p>Only to reply to your hosting enquiry and prepare a quote.</p>
              <h4>Who receives it</h4>
              <p>The form sends your details by email, through the email delivery service Resend, to the {site.name} team at {contact.email}.</p>
              <TODO source="legal">Retention period, data transfers and your rights under UAE law</TODO>
              <h4>Who is responsible</h4>
              <p>{site.legalNames.join(" and ")}, {contact.office}. Questions: {contact.email}.</p>
            </div>
          </details>
        </div>
      </section>
    </main>
  );
}
