/**
 * Glass ("acrylic") illustration of an ASIC miner, drawn in SVG. Air-cooled units get two spinning fans,
 * hydro units get coolant ports with flowing water. Illustration only, not a product photo.
 */
const tint: Record<string, string> = {
  "SHA-256": "#6aa8ff",
  Scrypt: "#5ee0d0",
  Equihash: "#f7be27",
  X11: "#b48cff",
  kHeavyHash: "#34e39a",
};

function Fan({ cx, cy, id }: { cx: number; cy: number; id: string }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r="27" fill={`url(#${id}-fanbg)`} stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" />
      <g className="art-fan" style={{ transformOrigin: `${cx}px ${cy}px` }}>
        {[0, 72, 144, 216, 288].map((a) => (
          <path key={a} d={`M ${cx} ${cy} q 6 -20 20 -18 q -8 10 -20 18 z`} fill="rgba(255,255,255,0.55)" transform={`rotate(${a} ${cx} ${cy})`} />
        ))}
        <circle cx={cx} cy={cy} r="5" fill="rgba(255,255,255,0.85)" />
      </g>
      <circle cx={cx} cy={cy} r="27" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="5" />
    </g>
  );
}

export function MinerArt({ id, cooling, algorithm, className = "" }: { id: string; cooling: "Air" | "Hydro"; algorithm: string; className?: string }) {
  const c = tint[algorithm] ?? "#6aa8ff";
  const hydro = cooling === "Hydro";
  return (
    <svg className={`miner-art ${className}`} viewBox="0 0 240 170" role="img" aria-label={`Illustration of a ${hydro ? "hydro" : "air"}-cooled miner`}>
      <defs>
        <linearGradient id={`${id}-face`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.30" />
          <stop offset="0.45" stopColor={c} stopOpacity="0.16" />
          <stop offset="1" stopColor="#0b1530" stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id={`${id}-top`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.40" />
          <stop offset="1" stopColor={c} stopOpacity="0.20" />
        </linearGradient>
        <linearGradient id={`${id}-side`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={c} stopOpacity="0.35" />
          <stop offset="1" stopColor="#0b1530" stopOpacity="0.7" />
        </linearGradient>
        <radialGradient id={`${id}-fanbg`}>
          <stop offset="0" stopColor={c} stopOpacity="0.45" />
          <stop offset="1" stopColor="#050a17" stopOpacity="0.6" />
        </radialGradient>
        <radialGradient id={`${id}-glow`}>
          <stop offset="0" stopColor={c} stopOpacity="0.55" />
          <stop offset="1" stopColor={c} stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="120" cy="150" rx="96" ry="12" fill={`url(#${id}-glow)`} />

      {hydro ? (
        <g>
          {/* slim hydro chassis */}
          <path d="M 40 46 L 64 30 L 214 30 L 190 46 Z" fill={`url(#${id}-top)`} stroke="rgba(255,255,255,0.4)" />
          <path d="M 190 46 L 214 30 L 214 118 L 190 134 Z" fill={`url(#${id}-side)`} stroke="rgba(255,255,255,0.25)" />
          <rect x="40" y="46" width="150" height="88" rx="6" fill={`url(#${id}-face)`} stroke="rgba(255,255,255,0.45)" />
          {[60, 74, 88, 102, 116].map((y) => <rect key={y} x="54" y={y} width="96" height="5" rx="2.5" fill="rgba(255,255,255,0.18)" />)}
          {/* coolant ports and pipes */}
          <circle cx="166" cy="70" r="9" fill="#0b1530" stroke="#ff9f6b" strokeWidth="3" />
          <circle cx="166" cy="106" r="9" fill="#0b1530" stroke="#6ad0ff" strokeWidth="3" />
          <path className="art-flow art-flow-hot" d="M 175 70 C 205 70 205 40 232 40" fill="none" stroke="#ff9f6b" strokeWidth="5" strokeLinecap="round" />
          <path className="art-flow art-flow-cold" d="M 232 136 C 205 136 205 106 175 106" fill="none" stroke="#6ad0ff" strokeWidth="5" strokeLinecap="round" />
          <circle className="art-led" cx="54" cy="128" r="2.6" fill="#34e39a" />
          <circle cx="64" cy="128" r="2.6" fill={c} />
        </g>
      ) : (
        <g>
          {/* air-cooled box */}
          <path d="M 30 50 L 58 30 L 218 30 L 190 50 Z" fill={`url(#${id}-top)`} stroke="rgba(255,255,255,0.4)" />
          <path d="M 190 50 L 218 30 L 218 118 L 190 138 Z" fill={`url(#${id}-side)`} stroke="rgba(255,255,255,0.25)" />
          {[44, 58, 72, 86, 100].map((y) => <line key={y} x1="196" y1={y + 4} x2="212" y2={y - 7} stroke="rgba(255,255,255,0.22)" strokeWidth="2" />)}
          <rect x="30" y="50" width="160" height="88" rx="7" fill={`url(#${id}-face)`} stroke="rgba(255,255,255,0.45)" />
          <Fan cx={72} cy={94} id={id} />
          <Fan cx={148} cy={94} id={id} />
          <circle className="art-led" cx="44" cy="62" r="2.6" fill="#34e39a" />
          <circle cx="54" cy="62" r="2.6" fill={c} />
          {/* PSU on top */}
          <path d="M 118 30 L 132 20 L 196 20 L 182 30 Z" fill="rgba(255,255,255,0.22)" stroke="rgba(255,255,255,0.35)" />
        </g>
      )}
      {/* glass highlight */}
      <path d={hydro ? "M 46 52 L 120 52 L 80 128 L 46 128 Z" : "M 36 56 L 110 56 L 70 132 L 36 132 Z"} fill="#ffffff" opacity="0.07" />
    </svg>
  );
}
