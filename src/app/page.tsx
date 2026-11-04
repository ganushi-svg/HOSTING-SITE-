import { Check, ClipboardCheck, Clock, Droplets, Fan, FileBarChart, Mail, MapPin, Phone, ShieldCheck, User, Wrench, Zap } from "lucide-react";
import { HydroLoop } from "@/components/HydroLoop";
import { LeadForm } from "@/components/LeadForm";
import { MinerTurntable } from "@/components/MinerTurntable";
import { CountUp } from "@/components/CountUp";
import { EstimateButton, PowerCalculator } from "@/components/PowerCalculator";
import { QuoteIcon } from "@/components/QuoteIcon";
import { Reveal } from "@/components/Reveal";
import { SampleReport } from "@/components/SampleReport";
import { SitePhoto } from "@/components/SitePhoto";
import { Tabs } from "@/components/Tabs";
import { TODO } from "@/components/TODO";
import { WhatsAppIcon } from "@/components/WhatsAppButton";
import { monthlyEstimate, models, usd, type Model } from "@/lib/models";
import { billing, capacity, contact, faqs, photos, pricing, quality, services, site } from "@/lib/site";

// The whole site is this one page (Ganushi, 3 Nov 2026). Every fact traces to content/ through src/lib.

const serviceGroups = [
  { icon: Zap, title: "Power", items: services.power },
  { icon: Droplets, title: "Cooling", items: services.cooling },
  { icon: Wrench, title: "Operations and repair", items: services.operations },
  { icon: FileBarChart, title: "Monitoring", items: services.monitoring },
];

// Arithmetic only: MW × capex per MW, and MW × 1,000 kW × 24 h × 30 days × power rate (content/pricing.md).
const turnkeySizes = [1, 5, 10, 20].map((mw) => ({ mw, capex: mw * pricing.turnkeyCapexPerMwUsd, power: mw * 1000 * 24 * 30 * pricing.turnkeyPowerFromUsd }));
const whole = (n: number) => usd(n).replace(".00", "");

const compare = [
  { label: "Power rate", plug: `${pricing.plugRangeLabel} per kWh, by quantity`, turnkey: `From ${pricing.turnkeyPowerFromLabel} per kWh` },
  { label: "Upfront capex", plug: "None", turnkey: `${pricing.turnkeyCapexPerMwLabel} per MW` },
  { label: "How you start", plug: "Ship your machines to our halls", turnkey: "Capacity built for your fleet" },
];
const plugTerms = ["Quantity tiers for the plug and play rate", "What the rate includes besides power", "Setup fee and deposit", "Minimum term and minimum fleet size", "Payment currencies and methods"];
const turnkeyTerms = ["What the capex covers", "Who owns the infrastructure", "Minimum capacity (MW)", "Build timeline", "Contract term"];
const contractTerms = ["Contract length", "Notice period", "Who contracts with you", "Payment terms", "Machine delivery and return"];

function MachineTable({ list }: { list: Model[] }) {
  return (
    <div className="panel table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th scope="col">Model</th>
            <th scope="col">Algorithm · coin</th>
            <th scope="col" className="num">Power</th>
            <th scope="col" className="num">Hash rate</th>
            <th scope="col" className="num">Power cost / 30 days</th>
            <th scope="col"><span className="sr-only">Estimate</span></th>
          </tr>
        </thead>
        <tbody>
          {list.map((m) => {
            const est = monthlyEstimate(m.watts);
            return (
              <tr key={m.slug}>
                <th scope="row">
                  {m.name} {m.featured && <span className="badge-gold">Featured</span>}
                  {m.todo && <TODO source="content/models.md" inline>{m.todo}</TODO>}
                  {m.wattsNote && <small className="cell-note">{m.wattsNote}</small>}
                </th>
                <td>{m.algorithm} · {m.coins}</td>
                <td className="num">{m.watts.toLocaleString("en-US")} W</td>
                <td className="num hash">{m.hashrate ?? "–"}</td>
                <td className="num">{usd(est.from)} – {usd(est.to)}</td>
                <td><EstimateButton slug={m.slug} name={m.name} /></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

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
  const air = models.filter((m) => m.cooling === "Air");
  const hydro = models.filter((m) => m.cooling === "Hydro");
  const r = quality.airReport;

  return (
    <main id="main">
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
          <aside className="rate-card" aria-label="Hosting rate summary">
            <p className="eyebrow">Plug and play hosting</p>
            <p className="rate-big num">{pricing.plugFromLabel}<span>/ kWh, from</span></p>
            <p className="rate-sub">{pricing.plugRangeLabel} per kWh depending on quantity, billed only on days your machines run.</p>
            <dl>
              <div><dt>Operating capacity</dt><dd className="num">{capacity.totalMw} MW</dd></div>
              <div><dt>Hosting sites</dt><dd>All around Abu Dhabi</dd></div>
              <div><dt>Cooling</dt><dd>Air + hydro</dd></div>
              <div><dt>Turnkey power</dt><dd className="num">from {pricing.turnkeyPowerFromLabel}</dd></div>
            </dl>
          </aside>
        </div>
      </section>

      <section className="section stats-band" aria-label="Key figures">
        <div className="container stats">
          <Reveal className="panel stat"><b className="num"><CountUp value={capacity.totalMw} suffix=" MW" /></b><span>Operating power capacity</span></Reveal>
          <Reveal delay={0.05} className="panel stat"><b>Abu Dhabi</b><span>Hosting sites all around Abu Dhabi</span></Reveal>
          <Reveal delay={0.1} className="panel stat"><span>Uptime</span><TODO source="content/performance.md" inline>value</TODO></Reveal>
          <Reveal delay={0.15} className="panel stat"><span>Machines hosted</span><TODO source="content/performance.md" inline>value</TODO></Reveal>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="section alt" aria-labelledby="services-title">
        <div className="container">
          <SectionHead eyebrow="Services" title="What hosting includes">Power, cooling, repair and reporting from one team, with every charge traceable to a machine and a day.</SectionHead>
          <Reveal className="overview"><p>{services.overview}</p></Reveal>
          <div className="feat">
            {serviceGroups.map((g, i) => (
              <Reveal key={g.title} delay={i * 0.05} className="panel feat-card">
                <span className="ico"><g.icon size={20} strokeWidth={1.7} aria-hidden="true" /></span>
                <h3>{g.title}</h3>
                <ul className="dot-list">{g.items.map((t) => <li key={t}>{t}</li>)}</ul>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="section" aria-labelledby="pricing-title">
        <div className="container">
          <SectionHead eyebrow="Pricing" title="Two ways to host">Ship your machines to our halls on a per-kWh rate, or have capacity built for your fleet.</SectionHead>
          <div className="plans">
            <Reveal className="panel plan plan-pick">
              <span className="tag">Your machines, our halls</span>
              <h3>Plug and play</h3>
              <p className="price num">{pricing.plugFromLabel}<small>/ kWh, from</small></p>
              <ul><li>{pricing.plugRangeLabel} per kWh, set by quantity</li><li>Billed only on running days</li><li>Air-cooled halls or the hydro zone</li><li>Monthly power report per machine</li></ul>
              <a className="button" href="#contact">Get a quote <QuoteIcon /></a>
            </Reveal>
            <Reveal delay={0.06} className="panel plan">
              <span className="tag tag-plain">For larger fleets</span>
              <h3>Turnkey solution</h3>
              <p className="price num">{pricing.turnkeyPowerFromLabel}<small>/ kWh, from</small></p>
              <ul><li>Capex {pricing.turnkeyCapexPerMwLabel} per MW</li><li>Capacity built for your fleet</li><li>Run by the team operating {capacity.totalMw} MW</li><li>Terms set in your proposal</li></ul>
              <a className="button button-outline" href="#turnkey">See turnkey details</a>
            </Reveal>
          </div>

          <Tabs
            label="Pricing details"
            tabs={[
              {
                id: "billing",
                label: "How billing works",
                content: (
                  <div className="split">
                    <div className="panel pad"><h3>How plug and play is billed</h3><ul className="dot-list">{billing.map((b) => <li key={b}>{b}</li>)}</ul></div>
                    <div className="panel pad"><h3>Other terms</h3><ul className="term-list">{plugTerms.map((t) => <li key={t}><span>{t}</span><TODO source="content/pricing.md" inline>to be provided</TODO></li>)}</ul></div>
                  </div>
                ),
              },
              {
                id: "turnkey",
                label: "Turnkey",
                content: (
                  <div className="stack">
                    <div className="panel table-wrap">
                      <table className="data-table">
                        <caption className="sr-only">Turnkey capex and power cost by capacity</caption>
                        <thead><tr><th scope="col">Capacity</th><th scope="col" className="num">Capex</th><th scope="col" className="num">Power, 30 days at full load</th></tr></thead>
                        <tbody>{turnkeySizes.map((s) => <tr key={s.mw}><th scope="row">{s.mw} MW</th><td className="num">{whole(s.capex)}</td><td className="num">from {whole(s.power)}</td></tr>)}</tbody>
                      </table>
                    </div>
                    <p className="fine-print">Capex = MW × {pricing.turnkeyCapexPerMwLabel}. Power = MW × 1,000 kW × 24 h × 30 days × {pricing.turnkeyPowerFromLabel}. Power only; your proposal sets the final figures.</p>
                    <div className="panel pad"><h3>Agreed in your proposal</h3><ul className="term-list">{turnkeyTerms.map((t) => <li key={t}><span>{t}</span><TODO source="content/pricing.md" inline>to be provided</TODO></li>)}</ul></div>
                  </div>
                ),
              },
              {
                id: "compare",
                label: "Compare",
                content: (
                  <div className="panel table-wrap">
                    <table className="data-table">
                      <thead><tr><th scope="col"><span className="sr-only">Item</span></th><th scope="col">Plug and play</th><th scope="col">Turnkey</th></tr></thead>
                      <tbody>{compare.map((c) => <tr key={c.label}><th scope="row">{c.label}</th><td>{c.plug}</td><td>{c.turnkey}</td></tr>)}</tbody>
                    </table>
                  </div>
                ),
              },
            ]}
          />
        </div>
      </section>

      {/* CALCULATOR */}
      <section id="calculator" className="section alt" aria-labelledby="calculator-title">
        <div className="container">
          <SectionHead eyebrow="Power cost calculator" title="Estimate your hosting power bill">Pick a machine and a quantity to see the monthly power charge at our plug and play rate.</SectionHead>
          <PowerCalculator />
        </div>
      </section>

      {/* MACHINES */}
      <section id="machines" className="section" aria-labelledby="machines-title">
        <div className="container">
          <SectionHead eyebrow="Machines we host" title={`${models.length} models, air and hydro-cooled`}>Power draw, hash rate where we have it, and a 30-day power cost at the plug and play range. Ask us about any model not listed.</SectionHead>
          <Tabs
            label="Machines by cooling"
            tabs={[
              { id: "air-machines", label: `Air-cooled (${air.length})`, content: <div className="machines"><div className="panel machine-stage"><MinerTurntable name="air-cooled models" cooling="Air" /></div><MachineTable list={air} /></div> },
              { id: "hydro-machines", label: `Hydro-cooled (${hydro.length})`, content: <div className="machines"><div className="panel machine-stage"><MinerTurntable name="hydro-cooled models" cooling="Hydro" /></div><MachineTable list={hydro} /></div> },
            ]}
          />
        </div>
      </section>

      {/* SITES */}
      <section id="sites" className="section alt" aria-labelledby="sites-title">
        <div className="container">
          <SectionHead eyebrow="Sites and infrastructure" title="Our hosting sites around Abu Dhabi">{capacity.totalMw} MW across our sites all around Abu Dhabi, each with a site in-charge and on-site hosting technicians.</SectionHead>
          <Tabs
            label="Sites"
            tabs={[
              {
                id: "halls",
                label: "Finished halls",
                content: (
                  <div className="stack">
                    <div className="photo-feature"><SitePhoto photo={photos.hallLongRacks} priority sizes="(min-width: 1200px) 1168px, 100vw" /></div>
                    <div className="showcase">
                      <SitePhoto photo={photos.hallRackRow} sizes="(min-width: 900px) 30vw, 50vw" />
                      <SitePhoto photo={photos.hallOpenRacks} sizes="(min-width: 900px) 30vw, 50vw" />
                      <SitePhoto photo={photos.hallAislePads} sizes="(min-width: 900px) 30vw, 50vw" />
                    </div>
                    <div className="split">
                      <SitePhoto photo={photos.hallRackCloseup} crop sizes="(min-width: 900px) 45vw, 100vw" />
                      <SitePhoto photo={photos.hallMinersWired} crop sizes="(min-width: 900px) 45vw, 100vw" />
                    </div>
                    <div className="split">
                      <SitePhoto photo={photos.hallPadsAndRacks} crop sizes="(min-width: 900px) 45vw, 100vw" />
                      <SitePhoto photo={photos.hallMinerCloseupBlue} crop sizes="(min-width: 900px) 45vw, 100vw" />
                    </div>
                  </div>
                ),
              },
              {
                id: "hydro-cooling",
                label: "Hydro cooling",
                content: (
                  <div className="stack">
                    <p className="muted">Hydro miners sit in purpose-built containers. Each machine has its own coolant supply and return, and the heat is carried out to a closed-circuit cooling tower.</p>
                    <div className="photo-feature"><SitePhoto photo={photos.hydroContainerDusk} sizes="(min-width: 1200px) 1168px, 100vw" /></div>
                    <div className="showcase">
                      <SitePhoto photo={photos.hydroContainerAisle} sizes="(min-width: 900px) 30vw, 50vw" />
                      <SitePhoto photo={photos.hydroRackHoses} sizes="(min-width: 900px) 30vw, 50vw" />
                      <SitePhoto photo={photos.hydroRackRow} sizes="(min-width: 900px) 30vw, 50vw" />
                    </div>
                    <div className="split"><div className="console"><HydroLoop /></div><SitePhoto photo={photos.hydroManifoldCloseup} crop sizes="(min-width: 900px) 45vw, 100vw" /></div>
                  </div>
                ),
              },
              {
                id: "air-cooling",
                label: "Air cooling",
                content: (
                  <div className="stack">
                    <p className="muted">Fresh air is drawn through wet evaporative cooling pads, across the miners and out through exhaust fans.</p>
                    <div className="photo-feature"><SitePhoto photo={photos.hallCoolingPadWall} sizes="(min-width: 1200px) 1168px, 100vw" /></div>
                    <div className="showcase">
                      <SitePhoto photo={photos.hallPadCorridor} sizes="(min-width: 900px) 30vw, 50vw" />
                      <SitePhoto photo={photos.hallMinerFans} sizes="(min-width: 900px) 30vw, 50vw" />
                      <SitePhoto photo={photos.hallFanWallRacks} sizes="(min-width: 900px) 30vw, 50vw" />
                    </div>
                    <div className="photo-feature"><SitePhoto photo={photos.hallFanCorridor} sizes="(min-width: 1200px) 1168px, 100vw" /></div>
                  </div>
                ),
              },
            ]}
          />
        </div>
      </section>

      {/* QUALITY */}
      <section id="quality" className="section" aria-labelledby="quality-title">
        <div className="container">
          <SectionHead eyebrow="Quality control" title="A dedicated team for sites and machines">Clean air, healthy coolant and working machines. Our quality team follows a set routine at every site, writes everything down and raises problems early.</SectionHead>
          <Reveal className="panel qc-badge">
            <div className="qc-logo">
              {/* eslint-disable-next-line @next/next/no-img-element -- small static logo */}
              <img src="/brand/quality-control-logo.webp" width={882} height={442} alt="Segments Quality Control logo" />
            </div>
            <div className="qc-copy">
              <p className="eyebrow">Our quality team</p>
              <h3>{quality.team.name}</h3>
              <p className="muted">{quality.team.summary}</p>
              <div className="qc-stats">
                <div><b className="num"><CountUp value={quality.team.size} /></b><span>specialists dedicated to quality</span></div>
                <div><b>Weekly</b><span>filter cleaning in every hall</span></div>
                <div><b>Every machine</b><span>deep-cleaned for efficiency</span></div>
              </div>
            </div>
          </Reveal>
          <div className="qc-duties">
            {quality.team.duties.map((d, i) => (
              <Reveal key={d.title} delay={i * 0.05} className="panel feat-card"><h3>{d.title}</h3><p className="muted">{d.text}</p></Reveal>
            ))}
          </div>
          <Tabs
            label="Quality routines"
            tabs={[
              {
                id: "quality-air",
                label: "Air-cooled halls",
                content: (
                  <div className="stack">
                    <p className="muted">Desert dust is the enemy of an air-cooled hall. Here is one site&apos;s maintenance log for {r.month}.</p>
                    <div className="stats">
                      <div className="panel stat"><b className="num"><CountUp value={r.visits} /></b><span>Maintenance visits in the month</span></div>
                      <div className="panel stat"><b className="num"><CountUp value={r.manDays} /></b><span>Man-days of work</span></div>
                      <div className="panel stat"><b className="num"><CountUp value={r.giFilters} /></b><span>Mesh (GI) filters cleaned and replaced</span></div>
                      <div className="panel stat"><b className="num"><CountUp value={r.disposableFilters} /></b><span>Disposable filters cleaned and replaced</span></div>
                    </div>
                    <ul className="check-list">{quality.airWork.map((w) => <li key={w}><ClipboardCheck size={17} aria-hidden="true" /> {w}</li>)}</ul>
                    <div className="gallery">
                      {[photos.qcNewFiltersWall, photos.qcNewFiltersAisle, photos.qcMeshPrefilters, photos.qcFiltersReplaced, photos.qcMeshOutdoor, photos.qcCleanHall].map((p) => (
                        <SitePhoto key={p.src} photo={p} crop sizes="(min-width: 900px) 33vw, 50vw" />
                      ))}
                    </div>
                    <div className="panel table-wrap">
                      <table className="data-table">
                        <caption className="sr-only">Air filter cleaning and replacement schedule</caption>
                        <thead><tr><th scope="col">Filter</th><th scope="col">Schedule</th></tr></thead>
                        <tbody>{quality.team.filterSchedule.map((f) => <tr key={f.what}><th scope="row">{f.what}</th><td>{f.when}</td></tr>)}</tbody>
                      </table>
                    </div>
                  </div>
                ),
              },
              {
                id: "quality-hydro",
                label: "Hydro containers",
                content: (
                  <div className="stack">
                    <p className="muted">Once a week, early in the morning, the team follows the same nine steps on each hydro container. It takes about 110 minutes and ends with a signed, photographed log.</p>
                    <ol className="steps steps-9">
                      {quality.hydroSteps.map((s) => <li key={s.title} className="panel step"><h3>{s.title}</h3><p>{s.text}</p></li>)}
                    </ol>
                    <div className="split">
                      <div className="panel pad"><h3>Numbers checked every week</h3><dl className="spec-list">{quality.hydroTargets.map((t) => <div key={t.label}><dt>{t.label}</dt><dd className="num">{t.value}</dd></div>)}</dl><p className="fine-print">Targets from the site&apos;s inspection procedure. A reading outside them is escalated the same day.</p></div>
                      <div className="panel pad"><h3><ShieldCheck size={20} aria-hidden="true" className="inline-ico good" /> The two-water rule</h3><p className="muted">The coolant that runs through your miners lives in a sealed loop. Nothing but the approved coolant ever goes into it: no chemicals, no descaler, no tap water. Cleaning happens only on the open spray-water side of the cooling tower.</p></div>
                    </div>
                  </div>
                ),
              },
              {
                id: "quality-coolant",
                label: "Coolant",
                content: (
                  <div className="stack">
                    <div className="panel table-wrap">
                      <table className="data-table">
                        <thead><tr><th scope="col">Check</th><th scope="col">Standard</th></tr></thead>
                        <tbody>{quality.coolant.map((c) => <tr key={c.check}><th scope="row">{c.check}</th><td>{c.target}</td></tr>)}</tbody>
                      </table>
                    </div>
                    <p className="fine-print">Every check is logged with the date, the values and any top-ups.</p>
                  </div>
                ),
              },
              {
                id: "quality-calendar",
                label: "Calendar",
                content: (
                  <div className="split">
                    <div className="panel pad"><h3>The maintenance calendar</h3><ul className="term-list">{quality.schedule.map((s) => <li key={s.when}><strong>{s.when}</strong><span className="muted">{s.what}</span></li>)}</ul></div>
                    <div className="panel pad"><h3>Every job tracked to closure</h3><p className="muted">Each maintenance job goes on a tracking board with its site, its category (electrical, civil, mechanical and HVAC, plumbing, logistics) and its status, and stays there until it is closed.</p></div>
                  </div>
                ),
              },
            ]}
          />
        </div>
      </section>

      {/* REPORTING */}
      <section id="reporting" className="section alt" aria-labelledby="reporting-title">
        <div className="container">
          <SectionHead eyebrow="Monitoring and reporting" title="See what your machines are doing">Every machine is tracked, and every charge on your invoice can be traced to a machine and a day.</SectionHead>
          <ul className="check-grid">{services.monitoring.map((m) => <li key={m} className="panel"><Check size={18} aria-hidden="true" /> {m}</li>)}</ul>
          <Reveal className="report-block">
            <h3>Sample client report</h3>
            <p className="muted">An extract from a real September 2026 report. Client name, worker IDs, serial numbers, asset tags, IP addresses, pool addresses and site codes are removed, and charges are shown at an example rate inside our published range.</p>
            <SampleReport />
            <TODO source="assets/report-sample">Ganushi to approve this redacted extract before the site goes live</TODO>
          </Reveal>
          <div className="statement">
            <ShieldCheck size={26} aria-hidden="true" />
            <p><b>Mining is volatile. Your hosting bill shouldn&apos;t be a mystery.</b> We describe the hosting service only and make no promise of mining returns.</p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="section" aria-labelledby="how-title">
        <div className="container">
          <SectionHead eyebrow="How it works" title="From first enquiry to running machines" />
          <ol className="steps">
            <li className="panel step"><h3>Request a quote</h3><p>Send your machine models and quantity through the form below.</p></li>
            {[2, 3, 4].map((n) => <li key={n} className="panel step"><TODO source="content/contract-and-onboarding.md">Step title and description</TODO></li>)}
          </ol>
          <div className="panel pad terms">
            <h3>Contract terms</h3>
            <ul className="term-list">{contractTerms.map((t) => <li key={t}><strong>{t}</strong><TODO source="content/contract-and-onboarding.md" inline>to be provided</TODO></li>)}</ul>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="section alt" aria-labelledby="faq-title">
        <div className="container">
          <SectionHead eyebrow="FAQ" title="Common questions" />
          <div className="faq">
            {faqs.map((f) => (
              <details className="panel" key={f.question}>
                <summary>{f.question}</summary>
                <p>{f.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="section" aria-labelledby="contact-title">
        <div className="container">
          <SectionHead eyebrow="Contact" title="Request a hosting quote">Tell us about your fleet and we will reply by email with a quote.</SectionHead>
          <div className="contact">
            <div className="panel contact-info">
              <div><MapPin size={18} aria-hidden="true" /><span><small>Office</small><address>{contact.office}</address></span></div>
              <div><Mail size={18} aria-hidden="true" /><span><small>Email</small><b className="selectable">{contact.email}</b></span></div>
              <div><Phone size={18} aria-hidden="true" /><span><small>Phone</small><b className="selectable">{contact.phone}</b></span></div>
              <div><WhatsAppIcon size={20} /><span><small>WhatsApp</small>{contact.whatsapp ? <a href={contact.whatsappUrl} target="_blank" rel="noopener noreferrer">{contact.whatsapp}</a> : <TODO source="content/contact.md" inline>WhatsApp number</TODO>}</span></div>
              <div><User size={18} aria-hidden="true" /><span><small>Your contact</small>{contact.person ? <b>{contact.person}</b> : <TODO source="content/contact.md" inline>Name and title</TODO>}</span></div>
              <div><Clock size={18} aria-hidden="true" /><span><small>Hours</small>{contact.hours ? <b>{contact.hours}</b> : <TODO source="content/contact.md" inline>Office hours</TODO>}</span></div>
              <ul className="contact-points">
                <li><Check size={16} aria-hidden="true" /> From {pricing.plugFromLabel} per kWh, billed on running days</li>
                <li><Fan size={16} aria-hidden="true" /> Air and hydro-cooled halls</li>
              </ul>
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
