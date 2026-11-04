import type { Model } from "@/lib/models";

/**
 * Line illustration of a miner beside the power calculator (Ganushi, 4 Nov 2026). Each time a value changes
 * (the parent remounts it with a new key), it turns into a blueprint, current runs in along the power cable,
 * the fans spin up (or coolant starts flowing on hydro models), and it settles back to the solid view.
 * Motion is transform and opacity, plus a brief dash flow on two short SVG paths. An illustration, never a photo.
 */
const BLADES = Array.from({ length: 7 }, (_, i) => i * (360 / 7));

function Fan({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g>
      <rect className="cm-frame" x={cx - 52} y={cy - 52} width={104} height={104} rx={10} />
      <circle className="cm-ring" cx={cx} cy={cy} r={46} />
      <g className="cm-fan" style={{ transformOrigin: `${cx}px ${cy}px` }}>
        {BLADES.map((a) => (
          <path key={a} className="cm-blade" transform={`rotate(${a} ${cx} ${cy})`}
            d={`M${cx} ${cy - 9} C ${cx + 14} ${cy - 18}, ${cx + 24} ${cy - 34}, ${cx + 10} ${cy - 42} C ${cx + 2} ${cy - 30}, ${cx - 4} ${cy - 20}, ${cx} ${cy - 9} Z`} />
        ))}
        <circle className="cm-hub" cx={cx} cy={cy} r={10} />
      </g>
    </g>
  );
}

function Body({ hydro }: { hydro: boolean }) {
  return (
    <>
      {/* power cable into the PSU, then traces down to the board or fans */}
      <path className="cm-cable" d="M6 38 H252" />
      <rect className="cm-plug" x={2} y={31} width={14} height={14} rx={3} />
      <rect className="cm-psu" x={252} y={22} width={116} height={32} rx={6} />
      <path className="cm-vent" d="M266 30 V46 M276 30 V46 M286 30 V46 M296 30 V46 M306 30 V46" />
      <rect className="cm-chassis" x={40} y={60} width={328} height={140} rx={12} />
      {hydro ? (
        <>
          {[86, 112, 138, 164].map((y) => <rect key={y} className="cm-board" x={92} y={y} width={252} height={14} rx={3} />)}
          <path className="cm-loop" d="M40 96 H76 V170 H40" />
          <path className="cm-pipe" d="M0 96 H40 M0 170 H40" />
        </>
      ) : (
        <>
          <Fan cx={134} cy={130} />
          <Fan cx={274} cy={130} />
        </>
      )}
      <path className="cm-trace" d={hydro ? "M310 54 V86 M270 54 V70 H200 V86" : "M310 54 V78 M270 54 V70 H134 V78"} />
    </>
  );
}

export function CalcMiner({ cooling, watts, qty }: { cooling: Model["cooling"]; watts: number; qty: number }) {
  const hydro = cooling === "Hydro";
  const kw = ((watts * qty) / 1000).toLocaleString("en-US", { maximumFractionDigits: 1 });
  return (
    <figure className={`calc-miner${hydro ? " is-hydro" : ""}`}>
      <div className="cm-stage">
        <svg viewBox="0 0 400 210" role="img" aria-label={`Illustration of an ${hydro ? "hydro" : "air"}-cooled miner powering up`}>
          <defs>
            <linearGradient id="cm-metal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#2a3b5e" />
              <stop offset="1" stopColor="#111c33" />
            </linearGradient>
            <pattern id="cm-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M20 0 H0 V20" fill="none" stroke="rgba(124,196,255,.14)" strokeWidth="1" />
            </pattern>
          </defs>
          <g className="cm-real"><Body hydro={hydro} /></g>
          <g className="cm-print">
            <rect x="0" y="0" width="400" height="210" fill="url(#cm-grid)" />
            <Body hydro={hydro} />
            <path className="cm-dim" d="M40 206 H368 M40 202 V210 M368 202 V210" />
          </g>
          <path className={hydro ? "cm-flow cm-flow-water" : "cm-flow"} d={hydro ? "M0 96 H76 V170 H0" : "M6 38 H252"} />
          <path className="cm-flow cm-flow-late" d={hydro ? "M310 54 V86 M270 54 V70 H200 V86" : "M310 54 V78 M270 54 V70 H134 V78"} />
        </svg>
      </div>
      <figcaption>
        <span className="cm-status"><i aria-hidden="true" /> Powering up</span>
        <b className="num">{kw} kW</b>
        <span className="cm-note">Illustration, not a product photo</span>
      </figcaption>
    </figure>
  );
}
