import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, CircleHelp, Droplets, Fan, FileBarChart, Gauge, Mail, ShieldCheck, Wrench, Zap } from "lucide-react";
import { FacilityVisual } from "@/components/FacilityVisual";
import { Reveal } from "@/components/Reveal";
import { LeadForm } from "@/components/LeadForm";
import { SitePhoto } from "@/components/SitePhoto";
import { TODO } from "@/components/TODO";
import { faqs, photos, pricing, site, sites } from "@/lib/site";

// Every line below traces to content/ (see src/lib/site.ts for the source of each fact).
const trust = [
  `${pricing.rateLabel} per kWh`,
  "Billed only on days your machines run",
  "Air and hydro-cooled halls",
  "In-house repair center",
];

const services = [
  { n: "01", icon: Zap, title: "Power and cooling", text: "Power tracked per site and zone, air-cooled halls, and a hydro-cooled zone for hydro models.", href: "/services#power" },
  { n: "02", icon: Wrench, title: "Operations and repair", text: "On-site technicians and in-house repair. You approve each repair quote before work starts.", href: "/services#operations" },
  { n: "03", icon: FileBarChart, title: "Monitoring and reporting", text: "Every machine tracked, and a monthly report with running days, energy and charge per machine.", href: "/monitoring" },
  { n: "04", icon: Gauge, title: "Simple pricing", text: `One rate of ${pricing.rateLabel} per kWh, charged only for the days each machine runs.`, href: "/pricing" },
];

const pillars = [
  { icon: Fan, eyebrow: "AIR", title: "Air-cooled halls", text: "Exhaust-fan halls for air-cooled ASICs such as the Antminer S21 series, L9 and KS5." },
  { icon: Droplets, eyebrow: "HYDRO", title: "Hydro-cooled zone", text: "A dedicated zone for hydro models such as the S21 XP Hydro and S21+ Hydro." },
  { icon: Zap, eyebrow: "POWER", title: "Capacity tracked", text: "Load is read from the fleet platform before new machines are placed." },
  { icon: Wrench, eyebrow: "REPAIR", title: "In-house repair", text: "Pickup, diagnosis, quote and repair at the Segments repair center." },
];

export default function Home() {
  return (
    <main id="main">
      <section className="hero" id="top">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-glow" aria-hidden="true" />
        <div className="container hero-container">
          <div className="hero-copy">
            <div className="eyebrow"><span className="pulse-dot" aria-hidden="true" /> Bitcoin mining hosting · {site.serviceArea} <span className="eyebrow-line" aria-hidden="true" /></div>
            <h1>Hosting for your <em>mining machines</em> in the {site.serviceArea}.</h1>
            <p className="hero-sub">{site.name} hosts ASIC miners for owners, funds and fleet operators. Tell us about your fleet and we will send you a quote.</p>
            <div className="hero-actions">
              <Link href="/contact" className="button">Request a quote <ArrowUpRight size={20} aria-hidden="true" /></Link>
              <Link href="/pricing" className="button button-outline">See pricing <ArrowRight size={18} aria-hidden="true" /></Link>
            </div>
            <ul className="hero-facts">
              <li><span className="tiny-diamond" aria-hidden="true" /> <b>{pricing.rateLabel}</b> per kWh</li>
              <li><span className="tiny-diamond" aria-hidden="true" /> Air + hydro cooling</li>
              <li><span className="tiny-diamond" aria-hidden="true" /> In-house repair</li>
            </ul>
          </div>
          <div className="hero-visual"><FacilityVisual /></div>
        </div>
      </section>

      <section className="trust-strip" aria-label="Key facts">
        <ul className="container trust-items">
          {trust.map((t) => <li key={t}><Check size={17} aria-hidden="true" /> {t}</li>)}
        </ul>
      </section>

      <section className="section" aria-labelledby="numbers-title">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <div><span className="section-kicker">01 / By the numbers</span><h2 id="numbers-title">Facts you can <span>check.</span></h2></div>
              <p>Every figure on this site comes from our own operating records. Figures still being confirmed are marked.</p>
            </div>
          </Reveal>
          <div className="stat-grid">
            <div className="stat"><span className="stat-value">{sites.activeCount}</span><span className="stat-label">Active hosting sites in the {site.serviceArea}</span></div>
            <div className="stat"><span className="stat-label">Uptime</span><TODO source="content/performance.md" inline>value</TODO></div>
            <div className="stat"><span className="stat-label">Machines hosted</span><TODO source="content/performance.md" inline>value</TODO></div>
            <div className="stat"><span className="stat-label">Power capacity</span><TODO source="content/performance.md" inline>value</TODO></div>
          </div>
        </div>
      </section>

      <section className="section section-alt" id="services" aria-labelledby="services-title">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <div><span className="section-kicker">02 / What hosting covers</span><h2 id="services-title">One partner for <span>your fleet.</span></h2></div>
              <p>Power, cooling, repair and reporting from one team, with every charge traceable to a machine and a day.</p>
            </div>
          </Reveal>
          <div className="service-grid">
            {services.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.07} className="service-wrap">
                <Link className="service-card" href={s.href}>
                  <div className="service-top"><span>{s.n}</span><span className="icon-outline"><s.icon size={24} strokeWidth={1.6} aria-hidden="true" /></span></div>
                  <div><h3>{s.title}</h3><p>{s.text}</p></div>
                  <span className="service-link">Learn more <ArrowUpRight size={18} aria-hidden="true" /></span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="sites" aria-labelledby="sites-title">
        <div className="container infra-grid">
          <Reveal className="infra-copy">
            <span className="section-kicker">03 / Our sites</span>
            <h2 id="sites-title">Built for <span>every watt.</span></h2>
            <p className="section-lede">{sites.activeCount} active hosting sites in the {site.serviceArea}, each with a site in-charge and on-site hosting technicians.</p>
            <div className="pillar-grid">
              {pillars.map((p) => (
                <div className="pillar" key={p.title}><p.icon size={24} strokeWidth={1.6} aria-hidden="true" /><span>{p.eyebrow}</span><h3>{p.title}</h3><p>{p.text}</p></div>
              ))}
            </div>
            <p><Link href="/sites" className="text-link">See our sites and photos <ArrowRight size={18} aria-hidden="true" /></Link></p>
          </Reveal>
          <Reveal delay={0.1}><SitePhoto photo={photos.hallFanWall} /></Reveal>
        </div>
      </section>

      <section className="statement" aria-labelledby="statement-title">
        <div className="container statement-inner">
          <span className="statement-mark" aria-hidden="true"><ShieldCheck size={28} /></span>
          <div><span className="section-kicker">No hype</span><h2 id="statement-title">Mining is volatile. <span>Your hosting bill shouldn&apos;t be a mystery.</span></h2></div>
          <Link href="/monitoring" className="button button-outline">See a sample report <ArrowUpRight size={18} aria-hidden="true" /></Link>
        </div>
      </section>

      <section className="section section-alt" id="process" aria-labelledby="process-title">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <div><span className="section-kicker">04 / How it works</span><h2 id="process-title">From enquiry to <span>running machines.</span></h2></div>
              <p>The full onboarding steps and contract terms are on the How it works page.</p>
            </div>
          </Reveal>
          <ol className="process-grid">
            <li className="process-card"><div className="process-number">01<span className="step-line" /></div><h3>Request a quote</h3><p>Send your machine models and quantity through the form below.</p></li>
            {["02", "03", "04"].map((n) => (
              <li className="process-card" key={n}><div className="process-number">{n}<span className="step-line" /></div><TODO source="content/contract-and-onboarding.md">Step title and description</TODO></li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section" id="faq" aria-labelledby="faq-title">
        <div className="container faq-grid">
          <Reveal>
            <div>
              <span className="section-kicker">05 / Questions</span>
              <h2 id="faq-title">Good questions. <span>Clear answers.</span></h2>
              <p className="section-lede">What hosting buyers ask us first.</p>
              <div className="faq-ornament" aria-hidden="true"><CircleHelp size={60} strokeWidth={1} /></div>
            </div>
          </Reveal>
          <div className="faq-list">
            {faqs.map((f) => (
              <details className="faq-item" key={f.question}>
                <summary><span>{f.question}</span><span className="faq-plus" aria-hidden="true">+</span></summary>
                <p>{f.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="section contact-section" id="quote" aria-labelledby="quote-title">
        <div className="container contact-grid">
          <Reveal>
            <div className="contact-copy">
              <span className="section-kicker">06 / Request a quote</span>
              <h2 id="quote-title">Ready to host <span>your miners?</span></h2>
              <p>Tell us what you want to host. We reply by email with a quote for your fleet.</p>
              <ul className="contact-points">
                <li><Check size={18} aria-hidden="true" /> {pricing.rateLabel} per kWh, billed on running days</li>
                <li><Check size={18} aria-hidden="true" /> Air and hydro-cooled halls</li>
                <li><Mail size={18} aria-hidden="true" /> Or email us directly from the contact page</li>
              </ul>
            </div>
          </Reveal>
          <div className="form-panel">
            <div className="form-panel-top"><span>HOSTING ENQUIRY</span><span className="form-panel-indicator"><span aria-hidden="true" /> Goes straight to our team</span></div>
            <h3>Tell us about your fleet.</h3>
            <p className="form-intro">Name and email are required. Everything else helps us quote faster.</p>
            <LeadForm />
          </div>
        </div>
      </section>
    </main>
  );
}
