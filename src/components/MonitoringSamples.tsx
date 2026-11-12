"use client";

import { useState } from "react";
import { Activity, Gauge, Wrench } from "lucide-react";
import { powerSample, repairSample, siteStatusSample, type Kpi, type Pill } from "@/lib/monitoring-samples";
import { services } from "@/lib/site";
import "./monitoring.css";

/**
 * How we watch your machines (Ganushi, 12 Nov 2026): sample views of three of Segments' own monitoring dashboards
 * (site status, power headroom, repair tracking), cleaned for the public site. Calm by design: one view at a time,
 * no blinking, every figure illustrative and labelled so (src/lib/monitoring-samples.ts). Motion is transform and opacity.
 */
const TABS = [
  { id: "status", label: "Site status", icon: Activity },
  { id: "power", label: "Power headroom", icon: Gauge },
  { id: "repair", label: "Repair tracking", icon: Wrench },
] as const;

function Kpis({ items }: { items: Kpi[] }) {
  return (
    <dl className="mon-kpis">
      {items.map((k) => (
        <div key={k.label}><dt>{k.label}</dt><dd className="num">{k.value}</dd></div>
      ))}
    </dl>
  );
}

const pillCls = (p: Pill) => `mon-pill is-${p}`;

function StatusView() {
  const s = siteStatusSample;
  const max = 90, min = 60;
  return (
    <>
      <Kpis items={s.kpis} />
      <div className="mon-split">
        <figure className="mon-chart" aria-label={`Median maximum chip temperature by hall, against a ${s.tempLimit} °C limit`}>
          <figcaption>Median max chip temperature by hall</figcaption>
          <div className="mon-bars">
            <span className="mon-limit" style={{ bottom: `${((s.tempLimit - min) / (max - min)) * 100}%` }}><i>{s.tempLimit} °C limit</i></span>
            {s.temps.map((t) => (
              <div key={t.hall} className="mon-bar-col">
                <span className={`mon-bar${t.c >= s.tempLimit - 3 ? " is-warm" : ""}`} style={{ transform: `scaleY(${(t.c - min) / (max - min)})` }} />
                <b className="num">{t.c}°</b>
                <small>{t.hall.replace("Hall ", "")}</small>
              </div>
            ))}
          </div>
        </figure>
        <div className="mon-table-wrap">
        <table className="mon-table">
          <thead><tr><th scope="col">Hall</th><th scope="col">Status</th><th scope="col" className="num">Miners</th><th scope="col">Note</th></tr></thead>
          <tbody>
            {s.halls.map((h) => (
              <tr key={h.hall}><th scope="row">{h.hall}</th><td><span className={pillCls(h.pill)}>{h.status}</span></td><td className="num">{h.miners}</td><td>{h.note}</td></tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </>
  );
}

function PowerView() {
  const s = powerSample;
  const total = s.bar.reduce((a, b) => a + b.kw, 0);
  return (
    <>
      <Kpis items={s.kpis} />
      <figure className="mon-chart" aria-label="Hall supply split into running load, safe headroom and safety margin">
        <figcaption>Where the supply goes</figcaption>
        <div className="mon-stack">
          {s.bar.map((b) => <span key={b.key} className={`seg-${b.key}`} style={{ flexGrow: b.kw }} title={`${b.label}: ${b.kw} kW`} />)}
        </div>
        <ul className="mon-legend">
          {s.bar.map((b) => <li key={b.key}><i className={`seg-${b.key}`} />{b.label} <b className="num">{b.kw} kW</b></li>)}
          <li className="mon-legend-total">Supply <b className="num">{total.toLocaleString("en-US")} kW</b></li>
        </ul>
      </figure>
      <div className="mon-table-wrap">
      <table className="mon-table">
        <thead><tr><th scope="col">Hall</th><th scope="col" className="num">Capacity</th><th scope="col" className="num">Running load</th><th scope="col" className="num">Safe headroom</th></tr></thead>
        <tbody>
          {s.halls.map((h) => (
            <tr key={h.hall}><th scope="row">{h.hall}</th><td className="num">{h.capacity} kW</td><td className="num">{h.load} kW</td><td className="num">{h.headroom} kW</td></tr>
          ))}
        </tbody>
      </table>
        </div>
    </>
  );
}

function RepairView() {
  const s = repairSample;
  const most = Math.max(...s.stages.map((x) => x.jobs));
  return (
    <>
      <Kpis items={s.kpis} />
      <div className="mon-split">
        <figure className="mon-chart" aria-label="Open repair jobs at each repair step">
          <figcaption>Open jobs at each repair step</figcaption>
          <ol className="mon-pipeline">
            {s.stages.map((x, i) => (
              <li key={x.stage}>
                <span className="mon-step num">{i + 1}</span>
                <span className="mon-stage">{x.stage}</span>
                <span className="mon-track"><span style={{ transform: `scaleX(${x.jobs / most})` }} /></span>
                <b className="num">{x.jobs}</b>
              </li>
            ))}
          </ol>
        </figure>
        <div className="mon-table-wrap">
        <table className="mon-table">
          <thead><tr><th scope="col">Ticket</th><th scope="col">Machine</th><th scope="col">Step</th><th scope="col">Status</th></tr></thead>
          <tbody>
            {s.jobs.map((j) => (
              <tr key={j.ticket}>
                <th scope="row"><span className="num">{j.ticket}</span><small>{j.client}</small></th>
                <td>{j.model}<small>{j.fault}</small></td>
                <td>{j.stage}</td>
                <td><span className={pillCls(j.pill)}>{j.sla}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </>
  );
}

export function MonitoringSamples() {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("status");
  const intro = tab === "status" ? siteStatusSample.intro : tab === "power" ? powerSample.intro : repairSample.intro;
  return (
    <div className="monitoring">
      <div className="monitoring-head">
        <p className="eyebrow">Monitoring</p>
        <h3>How we watch your machines</h3>
        <p className="muted">{services.monitoring.slice(0, 2).join(" ")} These are sample views of the dashboards our team works from.</p>
      </div>
      <div className="panel mon-panel">
        <div className="mon-top">
          <div className="mon-tabs" role="tablist" aria-label="Monitoring dashboards">
            {TABS.map((t) => (
              <button key={t.id} type="button" role="tab" id={`mon-tab-${t.id}`} aria-selected={tab === t.id} aria-controls={`mon-view-${t.id}`} tabIndex={tab === t.id ? 0 : -1}
                onClick={() => setTab(t.id)}
                onKeyDown={(e) => {
                  if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
                  const i = TABS.findIndex((x) => x.id === tab), n = TABS[(i + (e.key === "ArrowRight" ? 1 : TABS.length - 1)) % TABS.length];
                  setTab(n.id);
                  document.getElementById(`mon-tab-${n.id}`)?.focus();
                }}>
                <t.icon size={16} aria-hidden="true" /> {t.label}
              </button>
            ))}
          </div>
          <span className="mon-sample"><i aria-hidden="true" />Sample view · illustrative figures</span>
        </div>
        <div className="mon-view" role="tabpanel" id={`mon-view-${tab}`} aria-labelledby={`mon-tab-${tab}`} key={tab}>
          <p className="mon-intro">{intro}</p>
          {tab === "status" ? <StatusView /> : tab === "power" ? <PowerView /> : <RepairView />}
        </div>
      </div>
    </div>
  );
}
