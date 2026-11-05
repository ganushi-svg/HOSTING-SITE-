"use client";

import { useId, useState } from "react";
import type React from "react";
import { airLayers, hydroLayers } from "@/lib/cooling-layout";

/**
 * Interactive section drawing of a cooling system (Ganushi, 4 Nov 2026): the air-cooled hall from drawing SC-CH-01
 * and the hydro container from its commissioning plan (content/cooling-structure.md). Each numbered layer can be
 * hovered, clicked or tabbed to: it lights up in the drawing and its role is explained beside it. Air and coolant
 * flow are animated with SVG animateMotion dots, fans and water with transform and opacity only.
 */
export function CoolingLayout({ kind }: { kind: "air" | "hydro" }) {
  const layers = kind === "air" ? airLayers : hydroLayers;
  const [active, setActive] = useState(0);
  const id = useId();
  const current = layers[active];
  const props = { active: layers[active].id, pick: (lid: string) => setActive(layers.findIndex((l) => l.id === lid)) };
  // 3D tilt that follows the pointer (Ganushi, 5 Nov 2026): CSS variables only, so no re-render and transform-only motion.
  const tilt = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    e.currentTarget.style.setProperty("--ry", `${(x * 10).toFixed(2)}deg`);
    e.currentTarget.style.setProperty("--rx", `${(-y * 7).toFixed(2)}deg`);
  };
  const untilt = (e: React.PointerEvent<HTMLDivElement>) => { e.currentTarget.style.setProperty("--ry", "0deg"); e.currentTarget.style.setProperty("--rx", "0deg"); };

  return (
    <section className={`layout layout-${kind}`} aria-labelledby={`${id}-t`}>
      <div className="layout-head">
        <p className="eyebrow">{kind === "air" ? "Air-cooled mining system" : "Hydro-cooling mining system"}</p>
        <h3 id={`${id}-t`}>{kind === "air" ? "Follow the air through the hall, layer by layer" : "Follow the coolant from the miners to the tower"}</h3>
        <p className="muted">{kind === "air" ? "A section through one hall, drawn from our hall drawing. Tap a layer to see what it does." : "A section through one container and its cooling tower. Tap a layer to see what it does."}</p>
      </div>
      <div className="layout-body">
        <div className="panel layout-stage" onPointerMove={tilt} onPointerLeave={untilt}>
          <div className="sec-3d">
            <div className="sec-float">{kind === "air" ? <AirSection {...props} /> : <HydroSection {...props} />}</div>
          </div>
        </div>
        <div className="layout-side">
          <ol className="layout-list">
            {layers.map((l, i) => (
              <li key={l.id}>
                <button type="button" className={i === active ? "is-active" : ""} onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)} onClick={() => setActive(i)} aria-pressed={i === active}>
                  <b>{String(i + 1).padStart(2, "0")}</b><span>{l.name}</span>{l.dim && <small>{l.dim}</small>}
                </button>
              </li>
            ))}
          </ol>
          <div className="panel layout-role" aria-live="polite">
            <p className="eyebrow">Layer {String(active + 1).padStart(2, "0")} · {current.name}</p>
            <p>{current.role}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

type SectionProps = { active: string; pick: (id: string) => void };
const g = (lid: string, p: SectionProps, extra = "") => ({
  className: `lay${p.active === lid ? " is-active" : ""}${extra ? ` ${extra}` : ""}`,
  onMouseEnter: () => p.pick(lid),
  onClick: () => p.pick(lid),
  tabIndex: -1,
});

function Num({ n, x, y }: { n: number; x: number; y: number }) {
  return (
    <g className="lay-num" transform={`translate(${x} ${y})`}>
      <circle r="9" />
      <text y="3.5">{String(n).padStart(2, "0")}</text>
    </g>
  );
}

/** Dots travelling along a path, staggered. */
function Flow({ d, n = 4, dur = 6, className = "", begin = 0, r = 2.6 }: { d: string; n?: number; dur?: number; className?: string; begin?: number; r?: number }) {
  return (
    <g className={`flow ${className}`}>
      {Array.from({ length: n }, (_, i) => (
        <circle key={i} r={r}>
          <animateMotion dur={`${dur}s`} begin={`-${(begin + (i * dur) / n).toFixed(2)}s`} repeatCount="indefinite" path={d} />
        </circle>
      ))}
    </g>
  );
}

function Fan({ x, y, r }: { x: number; y: number; r: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={r} className="fan-ring" />
      <g className="fan-blades">
        {[0, 90, 180, 270].map((a) => <path key={a} transform={`rotate(${a})`} d={`M0 0 C ${r * 0.3} ${-r * 0.3}, ${r * 0.9} ${-r * 0.6}, ${r * 0.9} ${-r * 0.1} C ${r * 0.5} 0, ${r * 0.2} 0, 0 0 Z`} />)}
      </g>
      <circle r={r * 0.15} className="fan-hub" />
    </g>
  );
}

function AirSection(p: SectionProps) {
  const floorY = 252, ceilY = 34;
  return (
    <svg viewBox="0 0 760 290" className="section" role="img" aria-label="Section through an air-cooled hall, from the intake hood on the left to the exhaust fans on the right">
      <defs>
        <pattern id="sec-grid-p" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0 H0 V20" fill="none" stroke="rgba(124,196,255,.12)" strokeWidth="1" /></pattern>
        <pattern id="sec-honey" width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="1.6" fill="none" stroke="rgba(255,255,255,.45)" strokeWidth="0.6" /></pattern>
        <linearGradient id="sec-temp" x1="0" x2="1"><stop offset="0" stopColor="#22d3ee" stopOpacity="0.16" /><stop offset="0.55" stopColor="#22d3ee" stopOpacity="0.03" /><stop offset="0.75" stopColor="#ff8a65" stopOpacity="0.06" /><stop offset="1" stopColor="#ff8a65" stopOpacity="0.2" /></linearGradient>
      </defs>
      <rect x="0" y="0" width="760" height="290" className="sec-grid" />
      <rect x="62" y={ceilY} width="496" height={floorY - ceilY} fill="url(#sec-temp)" />
      {/* slab and roof */}
      <rect x="0" y={floorY} width="760" height="10" className="slab" />
      <rect x="62" y={ceilY - 8} width="560" height="8" className="slab" />
      <path d={`M62 ${ceilY - 8} l16 -10 h560 l-16 10z`} className="lid" /><path d={`M622 ${ceilY - 8} l16 -10 v${floorY - ceilY + 8} l-16 -10z`} className="lid lid-side" />
      {/* measured dimensions from drawing SC-CH-01, in mm */}
      <g className="dims">
        {([[62, 152, "940"], [152, 242, "880"], [242, 378, "1,500 clear"], [378, 432, "500"], [432, 558, "1,500"]] as [number, number, string][]).map(([a, b, t]) => (
          <g key={`${t}-${a}`}><line x1={a} y1={floorY + 18} x2={b} y2={floorY + 18} /><line x1={a} y1={floorY + 13} x2={a} y2={floorY + 23} /><line x1={b} y1={floorY + 13} x2={b} y2={floorY + 23} /><text x={(a + b) / 2} y={floorY + 15}>{t} mm</text></g>
        ))}
      </g>
      {/* outside labels */}
      <text x="6" y="246" className="zone-label">Outside</text>
      <text x="650" y="22" className="zone-label">Outside</text>
      {/* 1 hood */}
      <g {...g("hood", p)}>
        <path d="M62 60 L14 90 L14 196 L62 226 Z" className="zone-fill" />
        <path d="M62 60 L14 90 M14 196 L62 226" className="line" />
        {Array.from({ length: 7 }, (_, i) => <line key={i} x1="18" y1={100 + i * 14} x2="58" y2={100 + i * 14} className="mesh" />)}
        <Num n={1} x={38} y={48} />
      </g>
      {/* 2 filters */}
      <g {...g("filters", p)}>
        <rect x="62" y={ceilY} width="12" height={floorY - ceilY} className="filter" />
        {Array.from({ length: 11 }, (_, i) => <line key={i} x1="62" y1={ceilY + 8 + i * 20} x2="74" y2={ceilY + 20 + i * 20} className="hatch" />)}
        <Num n={2} x={68} y={22} />
      </g>
      {/* 3 corridor */}
      <g {...g("corridor1", p)}>
        <rect x="74" y={ceilY} width="78" height={floorY - ceilY} className="zone-fill" />
        <text x="113" y="150" className="zone-text" transform="rotate(-90 113 150)">Filter corridor</text>
        <Num n={3} x={113} y={22} />
      </g>
      {/* 4 wet pad */}
      <g {...g("wet", p)}>
        <rect x="152" y="58" width="14" height={floorY - 58 - 40} className="pad pad-wet" /><rect x="152" y="58" width="14" height={floorY - 58 - 40} fill="url(#sec-honey)" />
        <rect x="150" y={floorY - 40} width="18" height="40" className="curb" />
        <rect x="146" y="44" width="26" height="12" rx="3" className="header" />
        <text x="159" y="53" className="tiny">water</text>
        {[0, 1, 2].map((i) => (
          <circle key={i} r="1.8" className="drop"><animateMotion dur="2.4s" begin={`-${i * 0.8}s`} repeatCount="indefinite" path={`M${155 + i * 4} 62 L${155 + i * 4} ${floorY - 42}`} /></circle>
        ))}
        <Num n={4} x={159} y={22} />
      </g>
      {/* 5 service corridor */}
      <g {...g("corridor2", p)}>
        <rect x="168" y={ceilY} width="72" height={floorY - ceilY} className="zone-fill" />
        <text x="204" y="150" className="zone-text" transform="rotate(-90 204 150)">Service corridor</text>
        <Num n={5} x={204} y={22} />
      </g>
      {/* 6 dry pad */}
      <g {...g("dry", p)}>
        <rect x="242" y="58" width="14" height={floorY - 58 - 40} className="pad pad-dry" /><rect x="242" y="58" width="14" height={floorY - 58 - 40} fill="url(#sec-honey)" />
        <rect x="240" y={floorY - 40} width="18" height="40" className="curb" />
        <Num n={6} x={249} y={22} />
      </g>
      {/* 7 cold aisle */}
      <g {...g("cold", p)}>
        <rect x="258" y={ceilY} width="120" height={floorY - ceilY} className="zone-fill zone-cold" />
        <text x="318" y="60" className="zone-text">Cold aisle</text>
        <Num n={7} x={318} y={22} />
      </g>
      {/* 8 racks through rack board */}
      <g {...g("racks", p)}>
        <rect x="378" y={ceilY} width="4" height={floorY - ceilY} className="board" />
        <rect x="428" y={ceilY} width="4" height={floorY - ceilY} className="board" />
        {[0, 1, 2, 3].map((i) => (
          <g key={i} transform={`translate(382 ${70 + i * 44})`}>
            <rect width="46" height="38" rx="3" className="miner" />
            <Fan x={36} y={19} r={11} />
            <rect x="4" y="6" width="22" height="26" rx="2" className="miner-body" />
            <circle cx="8" cy="10" r="1.6" className="led-mini" style={{ animationDelay: `${i * 0.4}s` }} />
          </g>
        ))}
        <text x="405" y={floorY - 6} className="tiny">rack board</text>
        <Num n={8} x={405} y={22} />
      </g>
      {/* 9 hot aisle */}
      <g {...g("hot", p)}>
        <rect x="432" y={ceilY} width="126" height={floorY - ceilY} className="zone-fill zone-hot" />
        <text x="495" y="60" className="zone-text">Hot aisle</text>
        <Num n={9} x={495} y={22} />
      </g>
      {/* 10 exhaust fans */}
      <g {...g("fans", p)}>
        <rect x="558" y={ceilY} width="6" height={floorY - ceilY} className="board" />
        <rect x="618" y={ceilY} width="6" height={floorY - ceilY} className="board" />
        <rect x="564" y="80" width="54" height="130" rx="4" className="fan-box" />
        <Fan x={591} y={145} r={26} />
        <Num n={10} x={591} y={22} />
        <path d="M628 110 l24 0 m-6 -6 l6 6 -6 6 M628 180 l24 0 m-6 -6 l6 6 -6 6" className="arrow-hot" />
      </g>
      {/* airflow */}
      {[92, 142, 192].map((y, i) => <Flow key={y} d={`M-6 ${y} L384 ${y}`} n={5} dur={7} className="flow-cool" begin={i * 0.7} />)}
      {[92, 142, 192].map((y, i) => <Flow key={y} d={`M428 ${y} L652 ${y}`} n={3} dur={4} className="flow-hot" begin={i * 0.5} />)}
      <text x="12" y={floorY + 36} className="legend"><tspan className="lg-cool">●</tspan> cool air <tspan className="lg-hot" dx="14">●</tspan> hot air <tspan className="lg-water" dx="14">●</tspan> water</text>
    </svg>
  );
}

function HydroSection(p: SectionProps) {
  return (
    <svg viewBox="0 0 760 290" className="section" role="img" aria-label="Section through a hydro container and its cooling tower, following the coolant from the miners to the tower and back">
      <defs>
        <pattern id="sec-grid-p" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0 H0 V20" fill="none" stroke="rgba(124,196,255,.12)" strokeWidth="1" /></pattern>
        <pattern id="sec-honey" width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="1.6" fill="none" stroke="rgba(255,255,255,.45)" strokeWidth="0.6" /></pattern>
        <linearGradient id="sec-temp" x1="0" x2="1"><stop offset="0" stopColor="#22d3ee" stopOpacity="0.16" /><stop offset="0.55" stopColor="#22d3ee" stopOpacity="0.03" /><stop offset="0.75" stopColor="#ff8a65" stopOpacity="0.06" /><stop offset="1" stopColor="#ff8a65" stopOpacity="0.2" /></linearGradient>
        <radialGradient id="h-shadow"><stop offset="0" stopColor="#000" stopOpacity="0.55" /><stop offset="1" stopColor="#000" stopOpacity="0" /></radialGradient>
        <linearGradient id="h-face" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#9fd0ff" stopOpacity="0.22" /><stop offset="1" stopColor="#9fd0ff" stopOpacity="0.04" /></linearGradient>
        <clipPath id="h-clip-tank"><rect x="337" y="47" width="34" height="28" /></clipPath>
        <clipPath id="h-clip-basin"><rect x="525" y="207" width="150" height="42" /></clipPath>
        <clipPath id="h-clip-buffer"><rect x="703" y="153" width="42" height="94" /></clipPath>
      </defs>
      <rect x="0" y="0" width="760" height="290" className="sec-grid" />
      {/* ground shadows: the container and tower sit on the slab */}
      <ellipse cx="240" cy="256" rx="230" ry="9" fill="url(#h-shadow)" />
      <ellipse cx="610" cy="256" rx="110" ry="8" fill="url(#h-shadow)" />
      <rect x="0" y="252" width="760" height="10" className="slab" />
      {/* isometric lids give the container and tower some depth */}
      <path d="M40 34 l18 -12 h400 l-18 12z" className="lid" /><path d="M440 34 l18 -12 v218 l-18 -12z" className="lid lid-side" />
      <path d="M520 46 l14 -10 h160 l-14 10z" className="lid" /><path d="M680 46 l14 -10 v206 l-14 -10z" className="lid lid-side" />
      <g className="plume">
        {Array.from({ length: 9 }, (_, i) => {
          const x = 584 + (i % 5) * 8, dx = (i % 2 ? 1 : -1) * (4 + (i % 3) * 3), dur = 2.6 + (i % 3) * 0.5;
          return (
            <circle key={i} r={2.5 + (i % 3)}>
              <animateMotion dur={`${dur}s`} begin={`-${((i * dur) / 9).toFixed(2)}s`} repeatCount="indefinite" path={`M${x} 40 q${dx} -12 ${dx / 2} -32`} />
              <animate attributeName="opacity" values="0;0.55;0" dur={`${dur}s`} begin={`-${((i * dur) / 9).toFixed(2)}s`} repeatCount="indefinite" />
            </circle>
          );
        })}
      </g>
      <text x="48" y="24" className="zone-label">Container</text>
      <text x="548" y="24" className="zone-label">Outside · cooling tower</text>
      {/* container shell */}
      <rect x="40" y="34" width="400" height="218" rx="6" className="shell" />
      {Array.from({ length: 8 }, (_, i) => <line key={i} x1="44" y1={60 + i * 20} x2="56" y2={66 + i * 20} className="louvre" />)}
      {/* 1 miners + 2 manifolds: three racks */}
      {[0, 1, 2].map((r) => {
        const x = 72 + r * 72;
        return (
          <g key={r}>
            <g {...g("manifolds", p)}>
              <rect x={x - 8} y="60" width="5" height="170" className="pipe-supply" />
              <rect x={x + 50} y="60" width="5" height="170" className="pipe-return" />
              {[0, 1, 2, 3].map((i) => (
                <g key={i}>
                  <path d={`M${x - 3} ${80 + i * 40} h8`} className="hose" />
                  <path d={`M${x + 42} ${80 + i * 40} h8`} className="hose hose-r" />
                  <circle cx={x + 1} cy={80 + i * 40} r="1.8" className="valve" />
                </g>
              ))}
              {r === 2 && <Num n={2} x={x + 52} y={48} />}
            </g>
            <g {...g("miners", p)}>
              {[0, 1, 2, 3].map((i) => {
                const y = 68 + i * 40;
                return (
                  <g key={i}>
                    {/* 3D block: top and side faces behind the front plate */}
                    <path d={`M${x + 5} ${y} l5 -4 h37 l-5 4z`} className="m3-top" />
                    <path d={`M${x + 42} ${y} l5 -4 v26 l-5 4z`} className="m3-side" />
                    <rect x={x + 5} y={y} width="37" height="26" rx="3" className="miner hmine" />
                    <rect x={x + 7} y={y + 2} width="33" height="22" rx="2" className="heat" style={{ animationDelay: `${((r * 4 + i) % 6) * 0.45}s` }} />
                    <path d={`M${x + 10} ${y + 18} h20`} className="hash-bar" style={{ animationDelay: `${((r * 5 + i) % 7) * 0.3}s` }} />
                    <circle cx={x + 37} cy={y + 5} r="1.8" className="led-mini" style={{ animationDelay: `${((r * 4 + i) % 7) * 0.35}s` }} />
                  </g>
                );
              })}
              {r === 0 && <Num n={1} x={x + 24} y={48} />}
            </g>
          </g>
        );
      })}
      {/* 3 loop + 4 tank + 5 hx + 6 sensors: cooling unit */}
      <g {...g("loop", p)}>
        <path d="M60 240 H330" className="pipe-return-h" />
        <path d="M60 52 H330" className="pipe-supply-h" />
        <g transform="translate(300 200)"><circle r="12" className="pump" /><path d="M-6 -4 L6 0 L-6 4 Z" className="pump-vane" /></g>
        <text x="300" y="225" className="tiny">pump</text>
        <text x="300" y="186" className="readout readout-cold">≥ 85 m³/h</text>
        <Num n={3} x={196} y={240} />
      </g>
      <g {...g("tank", p)}>
        <rect x="334" y="44" width="40" height="34" rx="4" className="tank" />
        <g clipPath="url(#h-clip-tank)"><g className="wave"><path d="M297 60 q5 -3 10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 V76 H297z" className="tank-water" /></g></g>
        <line x1="366" y1="47" x2="366" y2="75" className="sight" />
        <text x="354" y="90" className="tiny">make-up ≥ 2/3</text>
        <Num n={4} x={354} y={34} />
      </g>
      <g {...g("hx", p)}>
        <rect x="334" y="104" width="54" height="80" rx="4" className="hx" />
        {Array.from({ length: 9 }, (_, i) => <line key={i} x1={339 + i * 6} y1="108" x2={339 + i * 6} y2="180" className="plate plate-pulse" style={{ animationDelay: `${(i * 0.14).toFixed(2)}s` }} />)}
        <path d="M336 106 l6 -5 h54 l-6 5z" className="m3-top" /><path d="M388 106 l6 -5 v78 l-6 5z" className="m3-side" />
        <text x="361" y="196" className="tiny">plate HX</text>
        <Num n={5} x={361} y={96} />
      </g>
      <g {...g("sensors", p)}>
        <rect x="396" y="44" width="36" height="46" rx="3" className="plc" />
        <rect x="400" y="48" width="28" height="18" rx="2" className="plc-screen" />
        {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={403 + i * 5} y="52" width="3" height="11" className="plc-bar" style={{ animationDelay: `${(i * 0.22).toFixed(2)}s` }} />)}
        <circle cx="406" cy="76" r="2.5" className="led" />
        <circle cx="414" cy="76" r="2.5" className="led led-2" />
        <text x="414" y="102" className="tiny">PLC</text>
        <path d="M60 247 H330" className="leak" />
        <circle r="2.4" className="leak-scan"><animateMotion dur="5s" repeatCount="indefinite" path="M60 247 H330 H60" /></circle>
        <text x="140" y="262" className="tiny">leak-detection strip</text>
        <circle cx="330" cy="52" r="3" className="sensor" /><circle cx="330" cy="240" r="3" className="sensor" />
        <Num n={6} x={414} y={34} />
      </g>
      {/* 7 pipework to tower */}
      <g {...g("pipes", p)}>
        <path d="M388 130 H520" className="pipe-tower-hot" />
        <path d="M388 170 H520" className="pipe-tower-cold" />
        <g transform="translate(454 130)"><circle r="6" className="v-ring" /><g className="bvalve"><circle r="6" /><line x1="-4" y1="-4" x2="4" y2="4" /></g></g>
        <g transform="translate(454 170)"><circle r="6" className="v-ring" style={{ animationDelay: "1.1s" }} /><g className="bvalve"><circle r="6" /><line x1="-4" y1="-4" x2="4" y2="4" /></g></g>
        <text x="500" y="124" className="readout readout-hot">45 °C return</text>
        <text x="500" y="186" className="readout readout-cold">35 °C supply</text>
        <Num n={7} x={454} y={108} />
      </g>
      {/* 8 tower */}
      <g {...g("tower", p)}>
        <rect x="520" y="46" width="160" height="206" rx="6" className="tower" />
        <Fan x={600} y={62} r={16} />
        <path d="M530 90 l8 6 8 -6 8 6 8 -6 8 6 8 -6 8 6 8 -6 8 6 8 -6 8 6 8 -6 8 6 8 -6 8 6 8 -6" className="eliminator" />
        <path d="M528 112 h144" className="coil" />
        <path d="M528 120 h144" className="coil" />
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={i} transform={`translate(${545 + i * 28} 134)`}>
            <path d="M-4 0 h8 l-4 6z" className="nozzle" />
            <circle r="1.6" className="drop"><animateMotion dur="1.8s" begin={`-${i * 0.3}s`} repeatCount="indefinite" path="M0 8 L0 60" /></circle>
            <circle r="1.6" className="drop"><animateMotion dur="1.8s" begin={`-${i * 0.3 + 0.9}s`} repeatCount="indefinite" path="M-6 8 L-6 60" /></circle>
          </g>
        ))}
        <rect x="530" y="146" width="140" height="52" className="fill" />
        {Array.from({ length: 10 }, (_, i) => <line key={i} x1={530 + i * 14} y1="146" x2={544 + i * 14} y2="198" className="hatch" />)}
        <text x="600" y="176" className="zone-text">fill</text>
        <Num n={8} x={600} y={34} />
      </g>
      {/* 9 basin */}
      <g {...g("basin", p)}>
        <rect x="524" y="206" width="152" height="44" className="basin" />
        <g clipPath="url(#h-clip-basin)"><g className="wave wave-slow"><path d="M484 221 q6 -3 12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0 V252 H484z" className="tank-water" /></g></g>
        {[545, 573, 601, 629, 657].map((cx, i) => <ellipse key={cx} cx={cx - 6} cy="221" rx="6" ry="1.8" className="ripple" style={{ animationDelay: `${(i * 0.36).toFixed(2)}s` }} />)}
        <circle cx="650" cy="224" r="4" className="float" />
        <rect x="536" y="226" width="12" height="18" className="strainer" />
        <text x="600" y="240" className="tiny">basin · strainer · blowdown</text>
        <Num n={9} x={600} y={262} />
      </g>
      {/* 10 supply */}
      <g {...g("supply", p)}>
        <rect x="700" y="150" width="48" height="100" rx="4" className="tank" />
        <g clipPath="url(#h-clip-buffer)"><g className="wave"><path d="M663 191 q5 -3 10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 V250 H663z" className="tank-water" /></g></g>
        <path d="M700 230 H676" className="pipe-water" />
        <text x="724" y="140" className="tiny">buffer tank</text>
        <Num n={10} x={724} y={122} />
      </g>
      {/* coolant down each supply manifold, through every miner, up each return manifold */}
      {[0, 1, 2].map((r) => {
        const x = 72 + r * 72;
        return (
          <g key={`mf-${r}`}>
            <Flow d={`M${x - 5.5} 60 V230`} n={3} dur={4} className="flow-coolant" begin={r * 0.5} r={1.8} />
            <Flow d={`M${x + 52.5} 230 V60`} n={3} dur={4} className="flow-hot" begin={r * 0.5 + 0.3} r={1.8} />
            {[0, 1, 2, 3].map((i) => <Flow key={i} d={`M${x - 4} ${80 + i * 40} H${x + 52}`} n={1} dur={2.8} className="flow-cross" begin={(r * 4 + i) * 0.37} r={1.5} />)}
          </g>
        );
      })}
      {/* flows: sealed loop (cyan) and tower water (blue) */}
      <Flow d="M330 240 H60 V52 H330 V130 H388" n={6} dur={7} className="flow-coolant" />
      <Flow d="M388 170 H520 V214 M520 214 H670 V140 H600 V112 M600 112 H388 V170" n={5} dur={8} className="flow-tower" />
      <text x="48" y="282" className="legend"><tspan className="lg-coolant">●</tspan> sealed coolant loop <tspan className="lg-tower" dx="14">●</tspan> tower water <tspan className="lg-water" dx="14">●</tspan> spray</text>
    </svg>
  );
}
