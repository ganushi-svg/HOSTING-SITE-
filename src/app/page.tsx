import Link from "next/link";
import { ArrowRight, ArrowUpRight, Building2, Check, ClipboardCheck, CircleHelp, Cpu, Droplets, Fan, FileBarChart, Gauge, ShieldCheck, Wrench, Zap } from "lucide-react";
import { FacilityVisual } from "@/components/FacilityVisual";
import { Reveal } from "@/components/Reveal";
import { LeadForm } from "@/components/LeadForm";
import { ModelCard } from "@/components/ModelCard";
import { SitePhoto } from "@/components/SitePhoto";
import { TODO } from "@/components/TODO";
import { capacity, contact, faqs, photos, pricing, quality, site, sites } from "@/lib/site";
import { getModel, models, type Model } from "@/lib/models";
import { QuoteIcon } from "@/components/QuoteIcon";
import { WhatsAppIcon } from "@/components/WhatsAppButton";

const modelCount = models.length;
const showcase = ["antminer-z15-pro", "antminer-s21-xp", "antminer-l9", "antminer-s21-xp-hydro"].map((slug) => getModel(slug)).filter((m): m is Model => Boolean(m));

// Every line below traces to content/ (see src/lib/site.ts for the source of each fact).
const trust = [
  `${capacity.totalMw} MW operating capacity`,
  `Hosting from ${pricing.plugFromLabel} per kWh`,
  "Billed only on days your machines run",
  "Air and hydro-cooled halls",
  "In-house repair center",
];

const services = [
  { n: "01", icon: Zap, title: "Power and cooling", text: "Power tracked per site and zone, air-cooled halls, and a hydro-cooled zone for hydro models.", href: "/services#power" },
  { n: "02", icon: Wrench, title: "Operations and repair", text: "On-site technicians and in-house repair. You approve each repair quote before work starts.", href: "/services#operations" },
  { n: "03", icon: FileBarChart, title: "Monitoring and reporting", text: "Every machine tracked, and a monthly report with running days, energy and charge per machine.", href: "/monitoring" },
  { n: "04", icon: Gauge, title: "Plug and play pricing", text: `${pricing.plugRangeLabel} per kWh depending on quantity, charged only for the days each machine runs.`, href: "/pricing" },
  { n: "05", icon: Cpu, title: "Every major model", text: "Z15 Pro, S21 series, L9, KS5, hydro models and more, each with its own hosting page.", href: "/models" },
  { n: "06", icon: Building2, title: "Turnkey solution", text: `Capacity built for your fleet, with power from ${pricing.turnkeyPowerFromLabel} per kWh.`, href: "/turnkey" },
];

const pillars = [
  { icon: Fan, eyebrow: "AIR", title: "Air-cooled halls", text: "Exhaust-fan halls for air-cooled ASICs such as the Antminer Z15 Pro, S21 series, L9 and KS5." },
  { icon: Droplets, eyebrow: "HYDRO", title: "Hydro-cooled zone", text: "A dedicated zone for hydro models such as the S21 XP Hydro and S21+ Hydro." },
  { icon: Zap, eyebrow: "POWER", title: `${capacity.totalMw} MW operating`, text: "Load is read from the fleet platform before new machines are placed." },
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
            <div className="eyebrow"><span className="pulse-dot" aria-hidden="true" /> ASIC mining hosting · {site.serviceArea} <span className="eyebrow-line" aria-hidden="true" /></div>
            <h1>Hosting for your <em>mining machines</em> in the {site.serviceArea}.</h1>
            <p className="hero-sub">{site.name} hosts ASIC miners for owners, funds and fleet operators. Tell us about your fleet and we will send you a quote.</p>
            <div className="hero-actions">
              <Link href="/contact" className="button">Request a quote <QuoteIcon size={30} /></Link>
              <Link href="/pricing" className="button button-outline">See pricing <ArrowRight size={18} aria-hidden="true" /></Link>
            </div>
            <ul className="hero-facts">
              <li><span className="tiny-diamond" aria-hidden="true" /> <b>{capacity.totalMw} MW</b> operating</li>
              <li><span className="tiny-diamond" aria-hidden="true" /> From <b>{pricing.plugFromLabel}</b> per kWh</li>
              <li><span className="tiny-diamond" aria-hidden="true" /> Air + hydro cooling</li>
              <li><span className="tiny-diamond" aria-hidden="true" /> Turnkey from <b>{pricing.turnkeyPowerFromLabel}</b></li>
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
            <div className="stat"><span className="stat-value">{capacity.totalMw} MW</span><span className="stat-label">Operating power capacity</span></div>
            <div className="stat"><span className="stat-value">{sites.activeCount}</span><span className="stat-label">Active hosting sites in the {site.serviceArea}</span></div>
            <div className="stat"><span className="stat-label">Uptime</span><TODO source="content/performance.md" inline>value</TODO></div>
            <div className="stat"><span className="stat-label">Machines hosted</span><TODO source="content/performance.md" inline>value</TODO></div>

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

      <section className="section" id="machines" aria-labelledby="machines-title">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <div><span className="section-kicker">03 / Machines we host</span><h2 id="machines-title">Pick your model, <span>see the cost.</span></h2></div>
              <p>Click any machine for its full hosting details: power draw, cooling, a 30-day power estimate and a quote form. Drawings are illustrations.</p>
            </div>
          </Reveal>
          <div className="model-grid">
            {showcase.map((m, i) => <Reveal key={m.slug} delay={i * 0.07}><ModelCard m={m} /></Reveal>)}
          </div>
          <p style={{ marginTop: 28 }}><Link href="/models" className="text-link">See all {modelCount} models <ArrowRight size={18} aria-hidden="true" /></Link></p>
        </div>
      </section>

      <section className="section" id="sites" aria-labelledby="sites-title">
        <div className="container infra-grid">
          <Reveal className="infra-copy">
            <span className="section-kicker">04 / Our sites</span>
            <h2 id="sites-title">Built for <span>every watt.</span></h2>
            <p className="section-lede">{sites.activeCount} active hosting sites in the {site.serviceArea}, each with a site in-charge and on-site hosting technicians.</p>
            <div className="pillar-grid">
              {pillars.map((p) => (
                <div className="pillar" key={p.title}><p.icon size={24} strokeWidth={1.6} aria-hidden="true" /><span>{p.eyebrow}</span><h3>{p.title}</h3><p>{p.text}</p></div>
              ))}
            </div>
            <p><Link href="/sites" className="text-link">See our sites and photos <ArrowRight size={18} aria-hidden="true" /></Link></p>
          </Reveal>
          <Reveal delay={0.1} className="infra-photo"><SitePhoto photo={photos.finishedHallAisle} sizes="(min-width: 880px) 40vw, 100vw" /></Reveal>
        </div>
      </section>

      <section className="section section-alt" id="quality" aria-labelledby="quality-title">
        <div className="container quality-band">
          <Reveal>
            <span className="section-kicker">Quality control</span>
            <h2 id="quality-title">A dedicated team for <span>sites and machines.</span></h2>
            <p className="section-lede">Intake filters cleaned and replaced, a nine-step weekly inspection on every hydro container, coolant tested against set standards, and every job tracked until it is closed.</p>
            <ul className="check-list" style={{ marginTop: 18 }}>
              <li><ClipboardCheck size={17} aria-hidden="true" /> {quality.airReport.giFilters + quality.airReport.disposableFilters} intake filters serviced at one site in {quality.airReport.month}</li>
              <li><ClipboardCheck size={17} aria-hidden="true" /> Coolant pH kept between 7.0 and 9.0, deionised water only</li>
              <li><ClipboardCheck size={17} aria-hidden="true" /> Signed, photographed log after every weekly inspection</li>
            </ul>
            <p><Link href="/quality" className="text-link">How our quality team works <ArrowRight size={18} aria-hidden="true" /></Link></p>
          </Reveal>
          <Reveal delay={0.1} className="quality-band-photos">
            <SitePhoto photo={photos.qcNewFiltersWall} crop sizes="(min-width: 880px) 22vw, 50vw" />
            <SitePhoto photo={photos.qcMeshPrefilters} crop sizes="(min-width: 880px) 22vw, 50vw" />
          </Reveal>
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
              <div><span className="section-kicker">05 / How it works</span><h2 id="process-title">From enquiry to <span>running machines.</span></h2></div>
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
              <span className="section-kicker">06 / Questions</span>
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
              <span className="section-kicker">07 / Request a quote</span>
              <h2 id="quote-title">Ready to host <span>your miners?</span></h2>
              <p>Tell us what you want to host. We reply by email with a quote for your fleet.</p>
              <ul className="contact-points">
                <li><Check size={18} aria-hidden="true" /> From {pricing.plugFromLabel} per kWh, billed on running days</li>
                <li><Check size={18} aria-hidden="true" /> Air and hydro-cooled halls</li>
                {contact.whatsapp && <li><WhatsAppIcon size={20} /> <a href={contact.whatsappUrl} target="_blank" rel="noopener noreferrer">WhatsApp {contact.whatsapp}</a></li>}
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
