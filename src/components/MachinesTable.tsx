"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { monthlyEstimate, usd, type Model } from "@/lib/models";
import { EstimateButton } from "./PowerCalculator";

/**
 * Supported hardware beside the calculator (Ganushi, 4 Nov 2026): the five flagship models by default, then a
 * "Show all 16 models" toggle. Every row has an Estimate button that pre-fills the calculator. Facts from models.ts.
 */
export function MachinesTable({ models, flagships }: { models: Model[]; flagships: string[] }) {
  const [all, setAll] = useState(false);
  const list = all ? models : flagships.map((slug) => models.find((m) => m.slug === slug)).filter((m): m is Model => Boolean(m));
  return (
    <div className="hardware">
      <div className="panel table-wrap">
        <table className="data-table">
          <caption className="sr-only">Supported machines: power draw, hash rate and 30-day power cost at the plug and play range</caption>
          <thead>
            <tr>
              <th scope="col">Model</th>
              <th scope="col">Cooling</th>
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
                    {m.wattsNote && <small className="cell-note">{m.wattsNote}</small>}
                  </th>
                  <td><span className={`cool-pill cool-${m.cooling.toLowerCase()}`}>{m.cooling}</span></td>
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
      <div className="hardware-foot">
        <p className="muted">{all ? `All ${models.length} models in our table. Ask us about any model not listed.` : `${list.length} flagship models shown. Ask us about any model not listed.`}</p>
        <button type="button" className="button button-outline hardware-toggle" aria-expanded={all} onClick={() => setAll((v) => !v)}>
          {all ? "Show flagship models only" : `Show all ${models.length} models`} <ChevronDown size={18} aria-hidden="true" className={all ? "is-up" : ""} />
        </button>
      </div>
    </div>
  );
}
