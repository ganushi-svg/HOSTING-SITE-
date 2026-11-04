import data from "@/lib/globe-data.json";

/**
 * Hero globe: a dot-map of the world (orthographic, Natural Earth land via world-atlas, pre-rendered offline into
 * src/lib/globe-data.json) with light arcs from client regions in the USA and Europe to Segments in Abu Dhabi.
 * Regions from Ganushi KC, 4 Nov 2026 (content/performance.md). Pure SVG and CSS, no runtime library.
 */
const usa = ["ny", "tx"];
const europe = ["london", "frankfurt", "paris", "amsterdam", "zurich", "stockholm", "madrid", "warsaw"];

export function Globe() {
  const [cx, cy] = data.c;
  const r = data.r;
  const p = data.points as unknown as Record<string, [number, number]>;
  const arcs = data.arcs as Record<string, string>;
  const order = [...usa, ...europe];
  return (
    <figure className="globe" aria-label="Map showing hosting clients in the USA and Europe connected to Segments in Abu Dhabi">
      <svg viewBox="0 0 520 520" role="img" aria-hidden="true">
        <defs>
          <radialGradient id="g-sphere" cx="38%" cy="32%" r="75%">
            <stop offset="0" stopColor="#1b3a8f" stopOpacity="0.55" />
            <stop offset="0.6" stopColor="#0a1638" stopOpacity="0.9" />
            <stop offset="1" stopColor="#04070f" stopOpacity="1" />
          </radialGradient>
          <radialGradient id="g-rim" cx="50%" cy="50%" r="50%">
            <stop offset="0.86" stopColor="#4c8dff" stopOpacity="0" />
            <stop offset="0.97" stopColor="#4c8dff" stopOpacity="0.55" />
            <stop offset="1" stopColor="#4c8dff" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="g-arc" x1="0" x2="1">
            <stop offset="0" stopColor="#22d3ee" stopOpacity="0.15" />
            <stop offset="1" stopColor="#fbd24e" stopOpacity="1" />
          </linearGradient>
        </defs>
        <circle cx={cx} cy={cy} r={r + 14} fill="url(#g-rim)" />
        <circle cx={cx} cy={cy} r={r} fill="url(#g-sphere)" stroke="rgba(120,170,255,0.35)" />
        <g className="globe-grid" fill="none" stroke="rgba(120,170,255,0.10)">
          {[-60, -30, 0, 30, 60].map((d) => <ellipse key={`p${d}`} cx={cx} cy={cy + (d / 90) * r * 0.55} rx={r * Math.cos((d * Math.PI) / 180)} ry={r * 0.16 * Math.cos((d * Math.PI) / 180)} />)}
          {[0.25, 0.55, 0.85].map((k) => <ellipse key={`m${k}`} cx={cx} cy={cy} rx={r * k} ry={r} />)}
        </g>
        <g className="globe-dots" fill="none" stroke="#8fb8ff" strokeWidth="2.6" strokeLinecap="round" dangerouslySetInnerHTML={{ __html: data.dots.join("") }} />
        <g className="globe-arcs" fill="none" strokeLinecap="round">
          {order.map((k, i) => (
            <g key={k} style={{ ["--d" as string]: `${(i % 6) * 0.55}s` }}>
              <path d={arcs[k]} stroke="rgba(120,190,255,0.28)" strokeWidth="1.2" />
              <path d={arcs[k]} stroke="url(#g-arc)" strokeWidth="2.4" pathLength={1} className="arc" />
              <circle r="3" fill="#fff" className="arc-dot">
                <animateMotion dur="3.3s" begin={`${(i % 6) * 0.55}s`} repeatCount="indefinite" path={arcs[k]} keyPoints="0;1" keyTimes="0;1" calcMode="linear" />
              </circle>
              <circle cx={p[k][0]} cy={p[k][1]} r="3.2" fill="#22d3ee" />
            </g>
          ))}
        </g>
        <g className="globe-hub" transform={`translate(${p.abu[0]} ${p.abu[1]})`}>
          <circle r="16" className="hub-ring" fill="none" stroke="#fbd24e" strokeWidth="2" />
          <circle r="26" className="hub-ring hub-ring-2" fill="none" stroke="#fbd24e" strokeWidth="1.5" />
          <circle r="6.5" fill="#fbd24e" stroke="#2a1a02" strokeWidth="1.5" />
        </g>
        <text x={p.ny[0] - 6} y={p.ny[1] - 14} className="globe-label">USA</text>
        <text x={p.frankfurt[0] - 10} y={p.frankfurt[1] - 22} className="globe-label">Europe</text>
      </svg>
      <figcaption className="globe-pin globe-pin-below" style={{ left: `${(p.abu[0] / 520) * 100}%`, top: `${(p.abu[1] / 520) * 100}%` }}>
        <b>Segments</b><span>Abu Dhabi</span>
      </figcaption>
    </figure>
  );
}
