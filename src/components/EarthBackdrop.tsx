/**
 * Earth theme backdrop (Ganushi, 5 Nov 2026; branch theme-earth). A fixed, page-wide scene behind every section:
 * a deep blue-to-violet sky, a dot-matrix world map (public/earth/dotmap.webp, generated from the globe texture),
 * and a live network: the published client cities (the same ones the globe shows, no others) linked to Segments in
 * Abu Dhabi by curved links that carry data packets. Two depth layers drift at different speeds as the page scrolls
 * (CSS scroll-driven animation), and the hub breathes. Server component: pure SVG and CSS, transform and opacity only.
 */
import { DayNight } from "./DayNight";

const W = 2400, H = 1200;
// lon/lat projected onto the 2400x1200 map, 78N to 60S (same projection as public/earth/dotmap.webp)
const proj = (lon: number, lat: number): [number, number] => [((lon + 180) / 360) * W, ((78 - lat) / 138) * H];
const HUB = proj(54.4, 24.45);
const CITIES: { name: string; p: [number, number]; major?: boolean }[] = [
  { name: "New York", p: proj(-74.0, 40.7), major: true },
  { name: "Texas", p: proj(-95.4, 29.8) },
  { name: "London", p: proj(-0.1, 51.5), major: true },
  { name: "Amsterdam", p: proj(4.9, 52.4) },
  { name: "Frankfurt", p: proj(8.7, 50.1), major: true },
  { name: "Paris", p: proj(2.3, 48.9) },
  { name: "Zurich", p: proj(8.5, 47.4) },
  { name: "Madrid", p: proj(-3.7, 40.4) },
  { name: "Stockholm", p: proj(18.1, 59.3), major: true },
  { name: "Warsaw", p: proj(21.0, 52.2) },
];
const arc = ([x1, y1]: [number, number], [x2, y2]: [number, number]) => {
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, d = Math.hypot(x2 - x1, y2 - y1);
  return `M${x1.toFixed(1)} ${y1.toFixed(1)} Q${mx.toFixed(1)} ${(my - d * 0.28).toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`;
};
// a light mesh between neighbouring client cities, like a network constellation
const MESH: [number, number][] = [[2, 3], [3, 4], [4, 6], [5, 6], [2, 5], [4, 9], [8, 9], [5, 7], [0, 1]];

export function EarthBackdrop() {
  return (
    <div className="earth-backdrop" aria-hidden="true">
      <div className="eb-sky" />
      <div className="eb-layer eb-far">
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice">
          <image href="/earth/dotmap.webp" x="0" y="0" width={W} height={H} />
          <DayNight />
        </svg>
      </div>
      <div className="eb-layer eb-near">
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice">
          <defs>
            <radialGradient id="eb-node"><stop offset="0" stopColor="#ffffff" stopOpacity="1" /><stop offset="0.35" stopColor="#dbe7ff" stopOpacity="0.85" /><stop offset="1" stopColor="#8fb4ff" stopOpacity="0" /></radialGradient>
            <radialGradient id="eb-hub"><stop offset="0" stopColor="#ffffff" /><stop offset="0.3" stopColor="#bfe0ff" stopOpacity="0.9" /><stop offset="1" stopColor="#7c9cff" stopOpacity="0" /></radialGradient>
            <linearGradient id="eb-link" x1="0" x2="1"><stop offset="0" stopColor="#ffffff" stopOpacity="0.12" /><stop offset="1" stopColor="#ffffff" stopOpacity="0.55" /></linearGradient>
          </defs>
          {MESH.map(([a, b]) => <path key={`m${a}-${b}`} d={`M${CITIES[a].p[0]} ${CITIES[a].p[1]} L${CITIES[b].p[0]} ${CITIES[b].p[1]}`} className="eb-mesh" />)}
          {CITIES.map((c, i) => {
            const d = arc(c.p, HUB);
            return (
              <g key={c.name}>
                <path d={d} className="eb-link" />
                <circle r="4.5" className="eb-packet">
                  <animateMotion dur={`${(5 + (i % 4) * 1.1).toFixed(1)}s`} begin={`-${(i * 0.9).toFixed(1)}s`} repeatCount="indefinite" path={d} />
                </circle>
              </g>
            );
          })}
          {CITIES.map((c, i) => (
            <g key={`n-${c.name}`} transform={`translate(${c.p[0].toFixed(1)} ${c.p[1].toFixed(1)})`}>
              <circle r={c.major ? 34 : 22} fill="url(#eb-node)" className="eb-glow" style={{ animationDelay: `${(i * 0.6).toFixed(1)}s` }} />
              <circle r={c.major ? 7 : 5} className="eb-core" />
            </g>
          ))}
          <g transform={`translate(${HUB[0].toFixed(1)} ${HUB[1].toFixed(1)})`}>
            <circle r="120" className="eb-hub-ring" />
            <circle r="120" className="eb-hub-ring eb-hub-ring-2" />
            <circle r="70" fill="url(#eb-hub)" className="eb-hub-glow" />
            <circle r="11" className="eb-core eb-core-hub" />
          </g>
        </svg>
      </div>
      <div className="eb-grain" />
    </div>
  );
}
