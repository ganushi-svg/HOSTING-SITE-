"use client";

import { useEffect, useState } from "react";
import { capacity, quality } from "@/lib/site";
import { sunElevation } from "./DayNight";

/**
 * "Operations at a glance" (Ganushi, 5 Nov 2026; theme-earth). Small visualisations of figures the site already
 * publishes, never live readings: uptime and capacity from content/performance.md, machines hosted, the coolant
 * loop rating (35 °C supply, 45 °C return; content/cooling-structure.md) and the coolant flow target (content/quality.md).
 * The only live element is the Abu Dhabi clock and whether it is day or night there, from the visitor's own clock.
 * Motion: bars grow with scaleX and the ring rotates in, once, when the panel enters the screen.
 */
const HUB = { lat: 24.45, lon: 54.4 };

export function OpsPanel() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const tick = () => setNow(new Date());
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, 30_000);
    return () => { clearTimeout(first); clearInterval(id); };
  }, []);
  const time = now ? new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Dubai", hour: "2-digit", minute: "2-digit" }).format(now) : "--:--";
  const day = now ? sunElevation(now, HUB.lat, HUB.lon) > -0.8 : true;
  const flow = quality.hydroTargets.find((t) => /flow/i.test(t.label))?.value ?? "≥ 85 m³/h";
  const ring = 2 * Math.PI * 34, up = capacity.uptimePct / 100;

  return (
    <section className="ops" aria-label="Operations at a glance">
      <div className="ops-head">
        <p className="eyebrow">Operations at a glance</p>
        <p className="ops-clock"><span className={`ops-dot${day ? " is-day" : ""}`} aria-hidden="true" />Abu Dhabi <b className="num">{time}</b> GST · {day ? "daytime" : "night-time"} · technicians on site 24/7</p>
      </div>
      <div className="ops-grid">
        <div className="ops-tile">
          <svg viewBox="0 0 84 84" className="ops-ring" aria-hidden="true">
            <circle cx="42" cy="42" r="34" className="ops-ring-track" />
            <circle cx="42" cy="42" r="34" className="ops-ring-value" strokeDasharray={`${(ring * up).toFixed(1)} ${ring.toFixed(1)}`} transform="rotate(-90 42 42)" />
          </svg>
          <div><b className="num">{capacity.uptimePct}%</b><span>Uptime</span></div>
        </div>
        <div className="ops-tile ops-tile-bar">
          <div><b className="num">{capacity.totalMw} MW</b><span>Operating capacity, Abu Dhabi</span></div>
          <div className="ops-bars" aria-hidden="true">{Array.from({ length: 9 }, (_, i) => <i key={i} style={{ animationDelay: `${i * 0.07}s`, transform: `scaleY(${0.45 + ((i * 37) % 55) / 100})` }} />)}</div>
        </div>
        <div className="ops-tile">
          <div><b className="num">{capacity.machinesHosted.toLocaleString("en-US")}+</b><span>Machines hosted</span></div>
          <div className="ops-grid-dots" aria-hidden="true">{Array.from({ length: 30 }, (_, i) => <i key={i} style={{ animationDelay: `${((i * 7) % 30) * 0.12}s` }} />)}</div>
        </div>
        <div className="ops-tile ops-tile-loop">
          <div><b className="num">35 °C → 45 °C</b><span>Hydro loop rating, supply to return · flow {flow}</span></div>
          <div className="ops-loop" aria-hidden="true"><span className="ops-loop-fill" /><span className="ops-loop-pulse" /></div>
        </div>
      </div>
      <p className="fine-print ops-note">Published operating figures, not live readings.</p>
    </section>
  );
}
