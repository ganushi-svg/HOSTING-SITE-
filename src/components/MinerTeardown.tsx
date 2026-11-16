/**
 * Teardown of the calculator miner (Ganushi, 16 Nov 2026, "/teardown"): an isometric line illustration of a typical
 * ASIC's main parts, shown pulled apart and labelled, which then fly together into the assembled machine before the
 * render fades in and powers up. Generic layout by cooling type, not a specific model's internals, and labelled as an
 * illustration. Geometry is computed once here; the motion is CSS transform and opacity only (hologram.css).
 */
type V3 = [number, number, number];
type Box = { o: V3; s: V3 };
type Part = { id: string; label?: string; boxes?: Box[]; fan?: { c: V3; r: number; axis: "x" }; ports?: V3[]; ghost?: boolean; off: V3; lx?: number; ly?: number };

const C30 = Math.cos(Math.PI / 6), S30 = 0.5;
const proj = ([x, y, z]: V3): [number, number] => [(x - y) * C30, (x + y) * S30 - z];

const AIR: Part[] = [
  { id: "shell", label: "Chassis", ghost: true, boxes: [{ o: [0, 0, 0], s: [1.6, 0.9, 0.9] }], off: [0, 0, 0], lx: 40, ly: -8 },
  { id: "psu", label: "Power supply", boxes: [{ o: [0.25, 0.15, 0.9], s: [0.95, 0.6, 0.26] }], off: [0, 0, 0.62], lx: -70, ly: 8 },
  { id: "ctrl", label: "Control board", boxes: [{ o: [1.22, 0.12, 0.6], s: [0.3, 0.66, 0.03] }], off: [0.95, -0.55, 0.35] },
  { id: "hb1", label: "Hashboards ×3", boxes: [{ o: [0.14, 0.16, 0.08], s: [1.32, 0.03, 0.74] }], off: [0, -0.95, 0], lx: -10, ly: -14 },
  { id: "hb2", boxes: [{ o: [0.14, 0.44, 0.08], s: [1.32, 0.03, 0.74] }], off: [0, -0.55, 0] },
  { id: "hb3", boxes: [{ o: [0.14, 0.72, 0.08], s: [1.32, 0.03, 0.74] }], off: [0, -0.15, 0] },
  { id: "fanF", label: "Fans", fan: { c: [0, 0.45, 0.45], r: 0.36, axis: "x" }, off: [-0.95, 0, 0] },
  { id: "fanR", fan: { c: [1.6, 0.45, 0.45], r: 0.36, axis: "x" }, off: [0.95, 0, 0] },
];

const HYDRO: Part[] = [
  { id: "shell", label: "Chassis", ghost: true, boxes: [{ o: [0, 0, 0], s: [1.8, 1.0, 0.5] }], off: [0, 0, 0], lx: 40, ly: -8 },
  { id: "hb1", label: "Hashboards on cold plates ×3", boxes: [{ o: [0.12, 0.1, 0.36], s: [1.2, 0.8, 0.05] }], off: [0, 0, 1.25], lx: -20, ly: -10 },
  { id: "hb2", boxes: [{ o: [0.12, 0.1, 0.23], s: [1.2, 0.8, 0.05] }], off: [0, 0, 0.85] },
  { id: "hb3", boxes: [{ o: [0.12, 0.1, 0.1], s: [1.2, 0.8, 0.05] }], off: [0, 0, 0.45] },
  { id: "psu", label: "Power supply", boxes: [{ o: [1.38, 0.12, 0.06], s: [0.36, 0.76, 0.36] }], off: [0.95, 0, 0] },
  { id: "ctrl", label: "Control board", boxes: [{ o: [1.36, 0.1, 0.44], s: [0.36, 0.5, 0.03] }], off: [0.55, -0.6, 0.55] },
  { id: "ports", label: "Coolant in / out", ports: [[0, 0.3, 0.25], [0, 0.7, 0.25]], off: [-0.85, 0, 0] },
];

// Target box of each render in the 720 × 540 stage (alpha bounding box of the -calc.webp renders), slightly inset.
const TARGET = { Air: { x0: 196, y0: 60, x1: 503, y1: 372 }, Hydro: { x0: 128, y0: 86, x1: 592, y1: 470 } } as const;

function boxFaces({ o, s }: Box): [number, number][][] {
  const [x, y, z] = o, [w, d, h] = s;
  const P = (a: number, b: number, c: number) => proj([x + a, y + b, z + c]);
  return [
    [P(0, 0, h), P(w, 0, h), P(w, d, h), P(0, d, h)], // top
    [P(0, d, 0), P(w, d, 0), P(w, d, h), P(0, d, h)], // front-left (y = d)
    [P(w, 0, 0), P(w, d, 0), P(w, d, h), P(w, 0, h)], // front-right (x = w)
  ];
}
function ring(c: V3, r: number, n = 28, k = 1): [number, number][] {
  return Array.from({ length: n }, (_, i) => { const a = (i / n) * Math.PI * 2; return proj([c[0], c[1] + Math.cos(a) * r * k, c[2] + Math.sin(a) * r * k]); });
}

type Built = { id: string; label?: string; ghost?: boolean; polys: string[]; rings: string[]; spokes: string[]; tx: number; ty: number; lab: [number, number] };
function build(parts: Part[], t: { x0: number; y0: number; x1: number; y1: number }) {
  const raw = parts.map((p) => {
    const polys: [number, number][][] = [], rings: [number, number][][] = [], spokes: [number, number][][] = [];
    p.boxes?.forEach((b) => polys.push(...boxFaces(b)));
    if (p.fan) {
      const { c, r } = p.fan;
      polys.push([proj([c[0], c[1] - r, c[2] - r]), proj([c[0], c[1] + r, c[2] - r]), proj([c[0], c[1] + r, c[2] + r]), proj([c[0], c[1] - r, c[2] + r])]);
      rings.push(ring(c, r, 28, 0.86), ring(c, r, 16, 0.22));
      for (let i = 0; i < 5; i++) { const a = (i / 5) * Math.PI * 2; spokes.push([proj([c[0], c[1] + Math.cos(a) * r * 0.22, c[2] + Math.sin(a) * r * 0.22]), proj([c[0], c[1] + Math.cos(a + 0.9) * r * 0.82, c[2] + Math.sin(a + 0.9) * r * 0.82])]); }
    }
    p.ports?.forEach((q) => { rings.push(ring(q, 0.07, 14)); polys.push([proj(q), proj([q[0] - 0.22, q[1], q[2]])]); });
    const [ox, oy] = proj([p.off[0] * 0.78, p.off[1] * 0.78, p.off[2] * 0.78]);
    return { p, polys, rings, spokes, ox, oy };
  });
  // Fit the assembled machine into the render's box.
  const pts = raw.filter((r) => !r.p.ports).flatMap((r) => [...r.polys.flat(), ...r.rings.flat()]);
  const minX = Math.min(...pts.map((q) => q[0])), maxX = Math.max(...pts.map((q) => q[0]));
  const minY = Math.min(...pts.map((q) => q[1])), maxY = Math.max(...pts.map((q) => q[1]));
  const k = Math.min((t.x1 - t.x0) / (maxX - minX), (t.y1 - t.y0) / (maxY - minY)) * 1.0;
  const cx = (t.x0 + t.x1) / 2 - ((minX + maxX) / 2) * k, cy = (t.y0 + t.y1) / 2 - ((minY + maxY) / 2) * k;
  const fmt = (list: [number, number][], close: boolean) => list.map(([a, b], i) => `${i ? "L" : "M"}${(cx + a * k).toFixed(1)} ${(cy + b * k).toFixed(1)}`).join(" ") + (close ? " Z" : "");
  return raw.map<Built>(({ p, polys, rings, spokes, ox, oy }) => {
    const all = [...polys.flat(), ...rings.flat()];
    const topY = Math.min(...all.map((q) => q[1])), botY = Math.max(...all.map((q) => q[1])), midX = all.reduce((s, q) => s + q[0], 0) / all.length;
    // The chassis label sits under the machine so it never crowds the parts' labels above it.
    const ly = p.ghost ? cy + botY * k + 26 : cy + topY * k - 12;
    return {
      id: p.id, label: p.label, ghost: p.ghost,
      polys: polys.map((f) => fmt(f, f.length > 2)), rings: rings.map((f) => fmt(f, true)), spokes: spokes.map((f) => fmt(f, false)),
      tx: +(ox * k).toFixed(1), ty: +(oy * k).toFixed(1),
      lab: [+(cx + midX * k + (p.ghost ? 0 : p.lx ?? 0)).toFixed(1), +(ly + (p.ghost ? 0 : p.ly ?? 0)).toFixed(1)],
    };
  });
}

const BUILT = { Air: build(AIR, TARGET.Air), Hydro: build(HYDRO, TARGET.Hydro) };

export function MinerTeardown({ cooling }: { cooling: "Air" | "Hydro" }) {
  const parts = BUILT[cooling];
  return (
    <svg className="cm-teardown" viewBox="0 0 720 540" aria-hidden="true">
      {parts.map((p) => (
        <g key={p.id} className={`td-part${p.ghost ? " td-ghost" : ""}`} style={{ ["--tx" as string]: `${p.tx}px`, ["--ty" as string]: `${p.ty}px` }}>
          {p.polys.map((d, i) => <path key={`p${i}`} d={d} className="td-face" />)}
          {p.rings.map((d, i) => <path key={`r${i}`} d={d} className="td-ring" />)}
          {p.spokes.map((d, i) => <path key={`s${i}`} d={d} className="td-spoke" />)}
          {p.label && <text x={p.lab[0]} y={p.lab[1]} className="td-label" textAnchor="middle">{p.label}</text>}
        </g>
      ))}
      <text x={360} y={526} className="td-note" textAnchor="middle">Illustration · typical ASIC layout</text>
    </svg>
  );
}
