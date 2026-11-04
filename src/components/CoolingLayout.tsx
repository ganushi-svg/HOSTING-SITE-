"use client";

import { useId, useState } from "react";
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

  return (
    <section className={`layout layout-${kind}`} aria-labelledby={`${id}-t`}>
      <div className="layout-head">
        <p className="eyebrow">{kind === "air" ? "Inside an air-cooled hall" : "Inside a hydro container"}</p>
        <h3 id={`${id}-t`}>{kind === "air" ? "Follow the air through the hall, layer by layer" : "Follow the coolant from the miners to the tower"}</h3>
        <p className="muted">{kind === "air" ? "A section through one hall, drawn from our hall drawing. Tap a layer to see what it does." : "A section through one container and its cooling tower. Tap a layer to see what it does."}</p>
      </div>
      <div className="layout-body">
        <div className="panel layout-stage">
          {kind === "air" ? <AirSection {...props} /> : <HydroSection {...props} />}
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
function Flow({ d, n = 4, dur = 6, className = "", begin = 0 }: { d: string; n?: number; dur?: number; className?: string; begin?: number }) {
  return (
    <g className={`flow ${className}`}>
      {Array.from({ length: n }, (_, i) => (
        <circle key={i} r="2.6">
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
      {/* slab and roof */}
      <rect x="0" y={floorY} width="760" height="10" className="slab" />
      <rect x="62" y={ceilY - 8} width="560" height="8" className="slab" />
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
        <rect x="152" y="58" width="14" height={floorY - 58 - 40} className="pad pad-wet" />
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
        <rect x="242" y="58" width="14" height={floorY - 58 - 40} className="pad pad-dry" />
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
      <text x="12" y={floorY + 24} className="legend"><tspan className="lg-cool">●</tspan> cool air <tspan className="lg-hot" dx="14">●</tspan> hot air <tspan className="lg-water" dx="14">●</tspan> water</text>
    </svg>
  );
}

function HydroSection(p: SectionProps) {
  return (
    <svg viewBox="0 0 760 290" className="section" role="img" aria-label="Section through a hydro container and its cooling tower, following the coolant from the miners to the tower and back">
      <rect x="0" y="252" width="760" height="10" className="slab" />
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
              {[0, 1, 2, 3].map((i) => <rect key={i} x={x + 5} y={68 + i * 40} width="37" height="26" rx="3" className="miner hmine" />)}
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
        <Num n={3} x={196} y={240} />
      </g>
      <g {...g("tank", p)}>
        <rect x="334" y="44" width="40" height="34" rx="4" className="tank" />
        <rect x="337" y="59" width="34" height="16" className="tank-water" />
        <line x1="366" y1="47" x2="366" y2="75" className="sight" />
        <text x="354" y="90" className="tiny">make-up</text>
        <Num n={4} x={354} y={34} />
      </g>
      <g {...g("hx", p)}>
        <rect x="334" y="104" width="54" height="80" rx="4" className="hx" />
        {Array.from({ length: 9 }, (_, i) => <line key={i} x1={339 + i * 6} y1="108" x2={339 + i * 6} y2="180" className="plate" />)}
        <text x="361" y="196" className="tiny">plate HX</text>
        <Num n={5} x={361} y={96} />
      </g>
      <g {...g("sensors", p)}>
        <rect x="396" y="44" width="36" height="46" rx="3" className="plc" />
        <rect x="400" y="48" width="28" height="18" rx="2" className="plc-screen" />
        <circle cx="406" cy="76" r="2.5" className="led" />
        <circle cx="414" cy="76" r="2.5" className="led led-2" />
        <text x="414" y="102" className="tiny">PLC</text>
        <path d="M60 247 H330" className="leak" />
        <text x="140" y="262" className="tiny">leak-detection strip</text>
        <circle cx="330" cy="52" r="3" className="sensor" /><circle cx="330" cy="240" r="3" className="sensor" />
        <Num n={6} x={414} y={34} />
      </g>
      {/* 7 pipework to tower */}
      <g {...g("pipes", p)}>
        <path d="M388 130 H520" className="pipe-tower-hot" />
        <path d="M388 170 H520" className="pipe-tower-cold" />
        <g className="bvalve" transform="translate(454 130)"><circle r="6" /><line x1="-4" y1="-4" x2="4" y2="4" /></g>
        <g className="bvalve" transform="translate(454 170)"><circle r="6" /><line x1="-4" y1="-4" x2="4" y2="4" /></g>
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
        <rect x="524" y="220" width="152" height="30" className="tank-water" />
        <circle cx="650" cy="224" r="4" className="float" />
        <rect x="536" y="226" width="12" height="18" className="strainer" />
        <text x="600" y="240" className="tiny">basin · strainer · blowdown</text>
        <Num n={9} x={600} y={262} />
      </g>
      {/* 10 supply */}
      <g {...g("supply", p)}>
        <rect x="700" y="150" width="48" height="100" rx="4" className="tank" />
        <rect x="703" y="190" width="42" height="57" className="tank-water" />
        <path d="M700 230 H676" className="pipe-water" />
        <text x="724" y="140" className="tiny">buffer tank</text>
        <Num n={10} x={724} y={122} />
      </g>
      {/* flows: sealed loop (cyan) and tower water (blue) */}
      <Flow d="M330 240 H60 V52 H330 V130 H388" n={6} dur={7} className="flow-coolant" />
      <Flow d="M388 170 H520 V214 M520 214 H670 V140 H600 V112 M600 112 H388 V170" n={5} dur={8} className="flow-tower" />
      <text x="48" y="282" className="legend"><tspan className="lg-coolant">●</tspan> sealed coolant loop <tspan className="lg-tower" dx="14">●</tspan> tower water <tspan className="lg-water" dx="14">●</tspan> spray</text>
    </svg>
  );
}
