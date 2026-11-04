"use client";

import { useEffect, useId, useState } from "react";
import { models, usd } from "@/lib/models";
import { pricing } from "@/lib/site";

const EVENT = "estimate-model";
const CUSTOM = "custom";
const kwhFmt = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 0 });

/**
 * Hosting power cost only: watts × 24 h × running days ÷ 1,000 × rate (content/pricing.md).
 * Shows the bill at both ends of the plug and play range. It never estimates mining revenue or returns (CLAUDE.md).
 */
export function PowerCalculator() {
  const id = useId();
  const [slug, setSlug] = useState(models[0].slug);
  const [watts, setWatts] = useState(models[0].watts);
  const [qty, setQty] = useState(10);
  const [days, setDays] = useState(30);

  useEffect(() => {
    const pick = (e: Event) => {
      const m = models.find((x) => x.slug === (e as CustomEvent<string>).detail);
      if (!m) return;
      setSlug(m.slug);
      setWatts(m.watts);
    };
    window.addEventListener(EVENT, pick);
    return () => window.removeEventListener(EVENT, pick);
  }, []);

  const choose = (value: string) => {
    setSlug(value);
    const m = models.find((x) => x.slug === value);
    if (m) setWatts(m.watts);
  };

  const n = Math.max(0, qty || 0);
  const d = Math.min(31, Math.max(0, days || 0));
  const w = Math.max(0, watts || 0);
  const kwhPerMachine = (w * 24 * d) / 1000;
  const kwh = kwhPerMachine * n;
  // 100+ machines get the confirmed bulk rate; smaller fleets fall somewhere in the published range.
  const bulk = n >= pricing.bulkMinMachines;
  const lo = bulk ? pricing.bulkRateUsd : pricing.plugFromUsd;
  const hi = bulk ? pricing.bulkRateUsd : pricing.plugToUsd;
  const from = kwh * lo;
  const to = kwh * hi;
  const money = (a: number, b: number) => (a === b ? usd(a) : `${usd(a)} – ${usd(b)}`);

  return (
    <div className="calc">
      <form className="panel calc-form" onSubmit={(e) => e.preventDefault()}>
        <label className="full" htmlFor={`${id}-model`}>Machine
          <select id={`${id}-model`} value={slug} onChange={(e) => choose(e.target.value)}>
            <optgroup label="Air-cooled">
              {models.filter((m) => m.cooling === "Air").map((m) => <option key={m.slug} value={m.slug}>{m.name} · {m.watts.toLocaleString("en-US")} W</option>)}
            </optgroup>
            <optgroup label="Hydro-cooled">
              {models.filter((m) => m.cooling === "Hydro").map((m) => <option key={m.slug} value={m.slug}>{m.name} · {m.watts.toLocaleString("en-US")} W</option>)}
            </optgroup>
            <option value={CUSTOM}>Other model (enter watts)</option>
          </select>
        </label>
        <label htmlFor={`${id}-w`}>Power per machine (W)
          <input id={`${id}-w`} type="number" inputMode="numeric" min={0} step={10} value={watts} onChange={(e) => { setWatts(+e.target.value); setSlug(CUSTOM); }} />
        </label>
        <label htmlFor={`${id}-n`}>Number of machines
          <input id={`${id}-n`} type="number" inputMode="numeric" min={1} step={1} value={qty} onChange={(e) => setQty(+e.target.value)} />
        </label>
        <label className="full" htmlFor={`${id}-d`}>Running days in the month: <b className="num">{d}</b>
          <input id={`${id}-d`} type="range" min={1} max={31} value={d} onChange={(e) => setDays(+e.target.value)} />
        </label>
      </form>
      <div className="panel calc-out" aria-live="polite">
        <p className="eyebrow">Hosting power bill · {d} running days</p>
        <div className="calc-rows">
          <div><span>Energy per machine</span><b className="num">{kwhFmt(kwhPerMachine)} kWh</b></div>
          <div><span>Energy, whole fleet</span><b className="num">{kwhFmt(kwh)} kWh</b></div>
          <div><span>Per machine</span><b className="num">{money(kwhPerMachine * lo, kwhPerMachine * hi)}</b></div>
        </div>
        <div className="calc-total">
          <span>Whole fleet</span>
          <b className="num">{bulk ? usd(from) : <>{usd(from)}<small> to </small>{usd(to)}</>}</b>
        </div>
        <p className="fine-print">
          {bulk
            ? <>At {pricing.bulkRateLabel} per kWh, the rate for {pricing.bulkMinMachines}+ machines. Power only.</>
            : <>At {pricing.plugRangeLabel} per kWh; fleets of {pricing.bulkMinMachines}+ machines get {pricing.bulkRateLabel}. Power only.</>}
          Days a machine is offline are not charged. This is a hosting cost, not a mining profit estimate.
        </p>
      </div>
    </div>
  );
}

/** Small button in the machines table that loads a model into the calculator and scrolls to it. */
export function EstimateButton({ slug, name }: { slug: string; name: string }) {
  return (
    <button
      type="button"
      className="link-button"
      onClick={() => {
        window.dispatchEvent(new CustomEvent(EVENT, { detail: slug }));
        document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }}
      aria-label={`Estimate the power cost for the ${name}`}
    >
      Estimate
    </button>
  );
}
