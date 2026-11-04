import type { Model } from "@/lib/models";

/**
 * The representative 3D miner render beside the power calculator (Ganushi, 4 Nov 2026). Each time a value
 * changes (the parent remounts it with a new key), the render dissolves into a blueprint of itself, current runs
 * in along the power lead, the fans spin up (coolant flows on hydro), and it settles back to the real render.
 * The blueprint is a pre-traced image (public/miners/turntable/*-blueprint.webp), so no filters are animated:
 * motion is transform and opacity, plus a short dash flow on a few SVG paths. Captioned as a representative render.
 */
const BLADES = Array.from({ length: 7 }, (_, i) => i * (360 / 7));

function Fan({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  const k = r / 50;
  return (
    <g transform={`translate(${cx} ${cy}) scale(${k})`}>
      <circle r={50} className="cm-fan-disc" />
      <g className="cm-fan">
        {BLADES.map((a) => (
          <path key={a} className="cm-blade" transform={`rotate(${a})`} d="M0 -8 C 14 -16, 26 -32, 12 -46 C 4 -34, -4 -22, 0 -8 Z" />
        ))}
        <circle r={9} className="cm-hub" />
      </g>
      <circle r={50} className="cm-fan-ring" />
    </g>
  );
}

const AIR = {
  lead: "M-20 520 C 120 515, 300 470, 362 352",
  lead2: "M-20 520 C 140 520, 330 480, 388 352",
  inner: "M375 330 V312 M375 300 V238 M375 172 V168 M340 318 H322 V240 M340 318 V100 H300",
  fans: [
    { cx: 250, cy: 168, r: 52 },
    { cx: 250, cy: 305, r: 52 },
    { cx: 376, cy: 135, r: 29 },
    { cx: 376, cy: 205, r: 29 },
    { cx: 376, cy: 274, r: 29 },
  ],
};
const HYDRO = {
  lead: "M-20 178 H158",
  inner: "M196 104 H140 M190 180 H226 V120",
  coolant: [
    "M232 205 C 170 215, 118 270, 126 330 C 132 382, 158 402, 186 410",
    "M218 100 C 205 150, 222 192, 246 205",
    "M272 100 C 258 150, 272 192, 284 205",
    "M330 100 C 318 150, 335 192, 362 205",
    "M240 345 C 205 362, 208 430, 240 436",
    "M292 345 C 258 362, 262 430, 292 436",
    "M322 345 C 300 362, 318 430, 352 440",
  ],
};

export function CalcMiner({ cooling, watts, qty }: { cooling: Model["cooling"]; watts: number; qty: number }) {
  const hydro = cooling === "Hydro";
  const key = hydro ? "hydro" : "air";
  const kw = ((watts * qty) / 1000).toLocaleString("en-US", { maximumFractionDigits: 1 });
  return (
    <figure className={`calc-miner${hydro ? " is-hydro" : ""}`}>
      <div className="cm-stage">
        <span className="cm-grid" aria-hidden="true" />
        {/* eslint-disable-next-line @next/next/no-img-element -- transparent WebP layers stacked for the effect */}
        <img className="cm-real" src={`/miners/turntable/${key}-calc.webp`} width={720} height={540} alt={`Representative ${key === "hydro" ? "hydro" : "air"}-cooled miner render powering up`} decoding="async" />
        {/* eslint-disable-next-line @next/next/no-img-element -- blueprint trace of the same render */}
        <img className="cm-print" src={`/miners/turntable/${key}-blueprint.webp`} width={720} height={540} alt="" aria-hidden="true" decoding="async" />
        <svg className="cm-fx" viewBox="0 0 720 540" aria-hidden="true">
          {hydro ? (
            <>
              <path className="cm-lead" d={HYDRO.lead} />
              <path className="cm-flow" d={HYDRO.lead} />
              <path className="cm-flow cm-flow-late" d={HYDRO.inner} />
              {HYDRO.coolant.map((d) => <path key={d} className="cm-flow cm-water" d={d} />)}
            </>
          ) : (
            <>
              <path className="cm-lead" d={AIR.lead} />
              <path className="cm-lead" d={AIR.lead2} />
              <path className="cm-flow" d={AIR.lead} />
              <path className="cm-flow" d={AIR.lead2} />
              <path className="cm-flow cm-flow-late" d={AIR.inner} />
              <g className="cm-fans">{AIR.fans.map((f) => <Fan key={`${f.cx}-${f.cy}`} {...f} />)}</g>
            </>
          )}
        </svg>
      </div>
      <figcaption>
        <span className="cm-status"><i aria-hidden="true" /> Powering up</span>
        <b className="num">{kw} kW</b>
        <span className="cm-note">Representative render, not the exact model</span>
      </figcaption>
    </figure>
  );
}
