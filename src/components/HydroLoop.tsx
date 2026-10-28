/**
 * Animated glass diagram of a hydro cooling loop: miners, pumps and tank, heat exchanger.
 * Illustration of the principle only; labelled as such wherever it is used.
 */
export function HydroLoop() {
  return (
    <figure className="hydro-loop">
      <svg viewBox="0 0 720 300" role="img" aria-labelledby="hydro-loop-title hydro-loop-desc">
        <title id="hydro-loop-title">How a hydro cooling loop works</title>
        <desc id="hydro-loop-desc">Coolant flows from the pumps and tank through the hydro miners, carries their heat to a heat exchanger outside, and returns cooled.</desc>
        <defs>
          <linearGradient id="hl-glass" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.22" />
            <stop offset="1" stopColor="#6aa8ff" stopOpacity="0.06" />
          </linearGradient>
        </defs>

        {/* pipes */}
        <path className="art-flow art-flow-hot" d="M 250 80 H 470" fill="none" stroke="#ff9f6b" strokeWidth="6" strokeLinecap="round" />
        <path className="art-flow art-flow-cold" d="M 470 220 H 250" fill="none" stroke="#6ad0ff" strokeWidth="6" strokeLinecap="round" />
        <path className="art-flow art-flow-cold" d="M 160 250 V 230" fill="none" stroke="#6ad0ff" strokeWidth="6" strokeLinecap="round" />

        {/* hydro miners rack */}
        <g>
          <rect x="70" y="40" width="180" height="200" rx="14" fill="url(#hl-glass)" stroke="rgba(255,255,255,0.35)" />
          {[60, 104, 148, 192].map((y, i) => (
            <g key={y}>
              <rect x="88" y={y} width="144" height="32" rx="6" fill="rgba(106,168,255,0.16)" stroke="rgba(255,255,255,0.3)" />
              <circle className="art-led" style={{ animationDelay: `${i * 0.4}s` }} cx="102" cy={y + 16} r="3" fill="#34e39a" />
              <rect x="114" y={y + 13} width="80" height="6" rx="3" fill="rgba(255,255,255,0.18)" />
              <circle cx="214" cy={y + 9} r="4" fill="none" stroke="#ff9f6b" strokeWidth="2" />
              <circle cx="214" cy={y + 23} r="4" fill="none" stroke="#6ad0ff" strokeWidth="2" />
            </g>
          ))}
          <text x="160" y="30" textAnchor="middle" className="hl-label">Hydro miners</text>
        </g>

        {/* heat exchanger */}
        <g>
          <rect x="470" y="40" width="180" height="200" rx="14" fill="url(#hl-glass)" stroke="rgba(255,255,255,0.35)" />
          {[515, 605].map((cx) => (
            <circle key={cx} cx={cx} cy="140" r="34" fill="rgba(5,10,23,0.5)" stroke="rgba(255,255,255,0.3)" />
          ))}
          {[515, 605].map((cx) => (
            <g key={cx} className="art-fan" style={{ transformOrigin: `${cx}px 140px` }}>
              {[0, 90, 180, 270].map((a) => (
                <path key={a} d={`M ${cx} 140 q 8 -26 26 -22 q -10 12 -26 22 z`} fill="rgba(255,255,255,0.5)" transform={`rotate(${a} ${cx} 140)`} />
              ))}
            </g>
          ))}
          <text x="560" y="30" textAnchor="middle" className="hl-label">Heat exchanger</text>
          <text x="560" y="226" textAnchor="middle" className="hl-sub">Heat leaves the hall</text>
        </g>

        {/* pumps and tank */}
        <g>
          <ellipse cx="160" cy="272" rx="46" ry="16" fill="url(#hl-glass)" stroke="rgba(255,255,255,0.35)" />
          <text x="160" y="298" textAnchor="middle" className="hl-sub">Pumps and tank</text>
        </g>

        <text x="360" y="68" textAnchor="middle" className="hl-sub">Hot coolant out</text>
        <text x="360" y="246" textAnchor="middle" className="hl-sub">Cooled coolant back</text>
      </svg>
      <figcaption>Illustration of how a hydro cooling loop works. Not a drawing of a specific site.</figcaption>
    </figure>
  );
}
