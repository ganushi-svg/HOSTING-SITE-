import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ClipboardCheck, Droplets, Fan, ShieldCheck, Wrench } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { QuoteCallout } from "@/components/QuoteCallout";
import { Reveal } from "@/components/Reveal";
import { SitePhoto } from "@/components/SitePhoto";
import { TODO } from "@/components/TODO";
import { photos, quality, services, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Quality Control for Sites and Machines",
  description: `A dedicated Segments Cloud quality team keeps our ${site.serviceArea} halls, hydro containers and hosted machines in shape: filter changes, weekly hydro inspections, coolant testing and in-house repair.`,
  alternates: { canonical: "/quality" },
};

const r = quality.airReport;

export default function QualityPage() {
  return (
    <main id="main" className="subpage">
      <div className="container">
        <PageHero
          kicker="Quality control"
          title="A dedicated team"
          highlight="for sites and machines."
          lede="Clean air, healthy coolant and working machines do not happen by themselves. Our quality team works through a set routine at every site, writes everything down and raises problems early."
        >
          <div style={{ marginTop: 18 }}><TODO source="content/quality.md">Quality team name, size and who leads it</TODO></div>
        </PageHero>

        <section className="subpage-block grid-3" aria-label="What the team covers">
          {[
            { icon: Fan, title: "Air-cooled halls", text: "Intake filters, mesh pre-filters, fans and clean floors." },
            { icon: Droplets, title: "Hydro containers", text: "A weekly inspection routine and regular coolant testing." },
            { icon: Wrench, title: "Machines", text: "In-house repair, a repair log and a quote you approve first." },
          ].map((c, i) => (
            <Reveal key={c.title} delay={i * 0.07}>
              <div className="panel quality-tile"><c.icon size={26} aria-hidden="true" /><h2>{c.title}</h2><p>{c.text}</p></div>
            </Reveal>
          ))}
        </section>

        <section className="subpage-block" aria-labelledby="air-title">
          <span className="section-kicker">Air-cooled halls</span>
          <h2 id="air-title">Filters changed, halls kept clean</h2>
          <p className="section-lede">Desert dust is the enemy of an air-cooled hall. The team cleans and replaces the intake filters that keep it out. Here is one site&apos;s maintenance log for {r.month}.</p>
          <div className="stat-grid" style={{ marginTop: 24 }}>
            <div className="stat"><span className="stat-value">{r.visits}</span><span className="stat-label">Maintenance visits in the month</span></div>
            <div className="stat"><span className="stat-value">{r.manDays}</span><span className="stat-label">Man-days of work</span></div>
            <div className="stat"><span className="stat-value">{r.giFilters}</span><span className="stat-label">Mesh (GI) filters cleaned and replaced</span></div>
            <div className="stat"><span className="stat-value">{r.disposableFilters}</span><span className="stat-label">Disposable filters cleaned and replaced</span></div>
          </div>
          <ul className="check-list" style={{ marginTop: 24 }}>
            {quality.airWork.map((w) => <li key={w}><ClipboardCheck size={17} aria-hidden="true" /> {w}</li>)}
          </ul>
          <div className="quality-gallery">
            {[photos.qcNewFiltersWall, photos.qcNewFiltersAisle, photos.qcMeshPrefilters, photos.qcFiltersReplaced, photos.qcMeshOutdoor, photos.qcCleanHall].map((p, i) => (
              <Reveal key={p.src} delay={(i % 3) * 0.07}><SitePhoto photo={p} crop sizes="(min-width: 880px) 33vw, 100vw" /></Reveal>
            ))}
          </div>
          <TODO source="content/quality.md">How often intake filters are changed as a rule</TODO>
        </section>

        <section className="subpage-block" aria-labelledby="hydro-title">
          <span className="section-kicker">Hydro containers</span>
          <h2 id="hydro-title">A nine-step inspection, every week</h2>
          <p className="section-lede">Once a week, early in the morning, the team follows the same nine steps on each hydro container. It takes about 110 minutes and ends with a signed, photographed log.</p>
          <ol className="steps-grid">
            {quality.hydroSteps.map((s, i) => (
              <Reveal key={s.title} delay={(i % 3) * 0.06}>
                <li className="panel step-card"><span className="step-no">{String(i + 1).padStart(2, "0")}</span><h3>{s.title}</h3><p>{s.text}</p></li>
              </Reveal>
            ))}
          </ol>
          <div className="split" style={{ marginTop: 28 }}>
            <div className="rate-card">
              <span className="section-kicker">Numbers checked every week</span>
              <dl className="spec-list">{quality.hydroTargets.map((t) => <div key={t.label}><dt>{t.label}</dt><dd>{t.value}</dd></div>)}</dl>
              <p className="muted-line">Targets from the site&apos;s inspection procedure. A reading outside them is escalated the same day.</p>
            </div>
            <div className="panel">
              <h2><ShieldCheck size={22} aria-hidden="true" style={{ color: "var(--good)", verticalAlign: "-3px", marginRight: 10 }} />The two-water rule</h2>
              <p style={{ color: "var(--muted)", margin: 0, lineHeight: 1.7 }}>The coolant that runs through your miners lives in a sealed loop. Nothing but the approved coolant ever goes into it: no chemicals, no descaler, no tap water. Cleaning happens only on the open spray-water side of the cooling tower.</p>
            </div>
          </div>
        </section>

        <section className="subpage-block" aria-labelledby="coolant-title">
          <span className="section-kicker">Coolant quality</span>
          <h2 id="coolant-title">Coolant tested, not guessed</h2>
          <div className="table-wrap">
            <table className="data-table">
              <thead><tr><th scope="col">Check</th><th scope="col">Standard</th></tr></thead>
              <tbody>{quality.coolant.map((c) => <tr key={c.check}><th scope="row">{c.check}</th><td>{c.target}</td></tr>)}</tbody>
            </table>
          </div>
          <p className="fine-print">Every check is logged with the date, the values and any top-ups.</p>
        </section>

        <section className="subpage-block split" aria-label="Schedule and machines">
          <div className="panel">
            <h2>The maintenance calendar</h2>
            <ul className="term-list">{quality.schedule.map((s) => <li key={s.when}><strong>{s.when}</strong><span style={{ color: "var(--muted)" }}>{s.what}</span></li>)}</ul>
          </div>
          <div className="panel">
            <h2>Machine quality</h2>
            <ul className="check-list">{[...services.operations.slice(1, 3), ...services.monitoring.slice(0, 1), services.monitoring[3]].map((t) => <li key={t}><ClipboardCheck size={17} aria-hidden="true" /> {t}</li>)}</ul>
            <p style={{ marginBottom: 0 }}><Link href="/monitoring" className="text-link">See how we report <ArrowRight size={18} aria-hidden="true" /></Link></p>
          </div>
        </section>

        <section className="subpage-block" aria-labelledby="track-title">
          <span className="section-kicker">Nothing gets lost</span>
          <h2 id="track-title">Every job tracked to closure</h2>
          <p className="section-lede">Each maintenance job goes on a tracking board with its site, its category (electrical, civil, mechanical and HVAC, plumbing, logistics) and its status, and stays there until it is closed.</p>
        </section>

        <QuoteCallout title="Ask about our quality routine." text="Tell us about your fleet. We will send a hosting quote and answer any questions on how your machines are looked after." />
      </div>
    </main>
  );
}
