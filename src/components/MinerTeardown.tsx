/**
 * Teardown of the calculator miner (Ganushi, 16 Nov 2026): an isometric line illustration of the selected model's main
 * parts, pulled apart and labelled, which then fly together into the assembled machine before the render fades in and
 * powers up. The parts follow the model's published internals in src/lib/miner-internals.ts (content/models.md ›
 * Internals, each with its source): number of hashboards, fans front and rear, the power supply and how it is mounted,
 * the control board and, for hydro units, the coolant connectors. A model without published internals falls back to
 * the typical layout for its cooling type and says so. Geometry is computed once per model; motion is CSS transform
 * and opacity only (hologram.css).
 */
import { internalsFor, type Internals } from "@/lib/miner-internals";

type V3 = [number, number, number];
type Box = { o: V3; s: V3 };
type Part = { id: string; label?: string; boxes?: Box[]; fans?: { c: V3; r: number }[]; ports?: V3[]; ghost?: boolean; below?: boolean; off: V3; lx?: number; ly?: number };

const C30 = Math.cos(Math.PI / 6), S30 = 0.5;
const proj = ([x, y, z]: V3): [number, number] => [(x - y) * C30, (x + y) * S30 - z];

// Target box of each render in the 720 × 540 stage (alpha bounding box of the -calc.webp renders).
const TARGET = { Air: { x0: 196, y0: 60, x1: 503, y1: 372 }, Hydro: { x0: 128, y0: 86, x1: 592, y1: 470 } } as const;

/** Chassis size in drawing units: from the published L × W × H when known (longest side 1.6), else a typical shape. */
function chassis(int: Internals): V3 {
  if (int.dimsMm) {
    const [l, w, h] = int.dimsMm, m = Math.max(l, w, h);
    return [(l / m) * 1.6, (w / m) * 1.6, (h / m) * 1.6];
  }
  return int.cooling === "Hydro" ? [1.8, 1.0, 0.5] : [1.6, 0.9, 0.9];
}

function airParts(int: Internals): Part[] {
  const [L, W, H] = chassis(int);
  const n = int.hashboards ?? 3;
  const parts: Part[] = [{ id: "shell", label: "Chassis", ghost: true, boxes: [{ o: [0, 0, 0], s: [L, W, H] }], off: [0, 0, 0] }];
  // Hashboards stand on edge along the length, spread across the width.
  for (let i = 0; i < n; i++) {
    const y = W * (0.16 + (0.68 * (i + 0.5)) / n) - 0.015;
    parts.push({ id: `hb${i}`, label: i === 0 ? (int.hashboards ? `Hashboards ×${n}` : "Hashboards") : undefined, boxes: [{ o: [L * 0.09, y, H * 0.09], s: [L * 0.82, 0.03, H * 0.82] }], off: [0, -0.95 + (i * 0.8) / Math.max(1, n - 1), 0], lx: 40, ly: -14 });
  }
  // Fans on the two short ends, stacked vertically.
  const fanSet = (count: number, x: number) => {
    if (!count) return [];
    const r = Math.min(W, H / count) * 0.4;
    return Array.from({ length: count }, (_, i) => ({ c: [x, W / 2, (H * (i + 0.5)) / count] as V3, r }));
  };
  const front = int.fans?.front ?? 1, rear = int.fans?.rear ?? 1;
  const fanLabel = `${int.fans ? `Fans ×${front + rear}` : "Fans"}${int.fanSize ? ` · ${int.fanSize}` : ""}`;
  if (front) parts.push({ id: "fanF", label: fanLabel, below: true, fans: fanSet(front, 0), off: [-0.9, 0, 0] });
  if (rear) parts.push({ id: "fanR", label: front ? undefined : fanLabel, below: true, fans: fanSet(rear, L), off: [0.9, 0, 0] });
  // Power supply: on top for a separate APW unit, inside the rear end when built in.
  const psuLabel = int.psu?.name ? `${int.psu.name} PSU` : "Power supply";
  if (int.psu?.mount === "internal") parts.push({ id: "psu", label: psuLabel, boxes: [{ o: [L * 0.7, W * 0.12, H * 0.08], s: [L * 0.24, W * 0.76, H * 0.3] }], off: [0.75, 0.55, 0], lx: 30 });
  else parts.push({ id: "psu", label: psuLabel, boxes: [{ o: [L * 0.16, W * 0.17, H], s: [L * 0.6, W * 0.66, H * 0.28] }], off: [0, 0, 0.62], lx: -40 });
  parts.push({ id: "ctrl", label: int.control ?? "Control board", boxes: [{ o: [L * 0.76, W * 0.13, H * 0.66], s: [L * 0.19, W * 0.74, 0.03] }], off: [0.95, -0.55, 0.35] });
  return parts;
}

function hydroParts(int: Internals): Part[] {
  const [L, W, H] = chassis(int);
  const n = int.hashboards ?? 3;
  const parts: Part[] = [{ id: "shell", label: "Chassis", ghost: true, boxes: [{ o: [0, 0, 0], s: [L, W, H] }], off: [0, 0, 0] }];
  for (let i = 0; i < n; i++) {
    const z = H * (0.18 + (0.62 * (n - 1 - i)) / Math.max(1, n));
    parts.push({ id: `hb${i}`, label: i === 0 ? (int.hashboards ? `Hashboards ×${n}` : "Hashboards") : undefined, boxes: [{ o: [L * 0.07, W * 0.1, z], s: [L * 0.66, W * 0.8, 0.05] }], off: [0, 0, 1.25 - i * 0.4], lx: -20, ly: -10 });
  }
  const psuLabel = int.psu?.name ? `${int.psu.name} PSU` : "Power supply";
  if (int.psu?.mount === "top") parts.push({ id: "psu", label: psuLabel, boxes: [{ o: [L * 0.2, W * 0.15, H], s: [L * 0.55, W * 0.7, H * 0.4] }], off: [0, 0, 0.9], lx: -60 });
  else parts.push({ id: "psu", label: psuLabel, boxes: [{ o: [L * 0.77, W * 0.12, H * 0.12], s: [L * 0.2, W * 0.76, H * 0.72] }], off: [0.95, 0, 0] });
  parts.push({ id: "ctrl", label: int.control ?? "Control board", boxes: [{ o: [L * 0.76, W * 0.1, H * 0.88], s: [L * 0.2, W * 0.5, 0.03] }], off: [0.55, -0.6, 0.55] });
  const pc = int.ports?.count ?? 2;
  const ports: V3[] = Array.from({ length: pc }, (_, i) => [0, W * ((i + 1) / (pc + 1)), H * 0.5]);
  parts.push({ id: "ports", label: `Coolant in / out${int.ports?.type ? ` · ${int.ports.type}` : ""}`, ports, off: [-0.85, 0, 0] });
  return parts;
}

function boxFaces({ o, s }: Box): [number, number][][] {
  const [x, y, z] = o, [w, d, h] = s;
  const P = (a: number, b: number, c: number) => proj([x + a, y + b, z + c]);
  return [
    [P(0, 0, h), P(w, 0, h), P(w, d, h), P(0, d, h)],
    [P(0, d, 0), P(w, d, 0), P(w, d, h), P(0, d, h)],
    [P(w, 0, 0), P(w, d, 0), P(w, d, h), P(w, 0, h)],
  ];
}
function ring(c: V3, r: number, n = 28, k = 1): [number, number][] {
  return Array.from({ length: n }, (_, i) => { const a = (i / n) * Math.PI * 2; return proj([c[0], c[1] + Math.cos(a) * r * k, c[2] + Math.sin(a) * r * k]); });
}

type Built = { id: string; label?: string; ghost?: boolean; polys: string[]; rings: string[]; spokes: string[]; tx: number; ty: number; lab: [number, number] };
function build(parts: Part[], t: { x0: number; y0: number; x1: number; y1: number }): Built[] {
  const raw = parts.map((p) => {
    const polys: [number, number][][] = [], rings: [number, number][][] = [], spokes: [number, number][][] = [];
    p.boxes?.forEach((b) => polys.push(...boxFaces(b)));
    p.fans?.forEach(({ c, r }) => {
      polys.push([proj([c[0], c[1] - r, c[2] - r]), proj([c[0], c[1] + r, c[2] - r]), proj([c[0], c[1] + r, c[2] + r]), proj([c[0], c[1] - r, c[2] + r])]);
      rings.push(ring(c, r, 28, 0.86), ring(c, r, 16, 0.22));
      for (let i = 0; i < 5; i++) { const a = (i / 5) * Math.PI * 2; spokes.push([proj([c[0], c[1] + Math.cos(a) * r * 0.22, c[2] + Math.sin(a) * r * 0.22]), proj([c[0], c[1] + Math.cos(a + 0.9) * r * 0.82, c[2] + Math.sin(a + 0.9) * r * 0.82])]); }
    });
    p.ports?.forEach((q) => { rings.push(ring(q, 0.07, 14)); polys.push([proj(q), proj([q[0] - 0.22, q[1], q[2]])]); });
    const [ox, oy] = proj([p.off[0] * 0.78, p.off[1] * 0.78, p.off[2] * 0.78]);
    return { p, polys, rings, spokes, ox, oy };
  });
  const pts = raw.filter((r) => !r.p.ports).flatMap((r) => [...r.polys.flat(), ...r.rings.flat()]);
  const minX = Math.min(...pts.map((q) => q[0])), maxX = Math.max(...pts.map((q) => q[0]));
  const minY = Math.min(...pts.map((q) => q[1])), maxY = Math.max(...pts.map((q) => q[1]));
  const k = Math.min((t.x1 - t.x0) / (maxX - minX), (t.y1 - t.y0) / (maxY - minY));
  const cx = (t.x0 + t.x1) / 2 - ((minX + maxX) / 2) * k, cy = (t.y0 + t.y1) / 2 - ((minY + maxY) / 2) * k;
  const fmt = (list: [number, number][], close: boolean) => list.map(([a, b], i) => `${i ? "L" : "M"}${(cx + a * k).toFixed(1)} ${(cy + b * k).toFixed(1)}`).join(" ") + (close ? " Z" : "");
  return raw.map(({ p, polys, rings, spokes, ox, oy }) => {
    const all = [...polys.flat(), ...rings.flat()];
    const topY = Math.min(...all.map((q) => q[1])), botY = Math.max(...all.map((q) => q[1])), midX = all.reduce((s, q) => s + q[0], 0) / all.length;
    // The chassis label sits under the machine so it never crowds the parts' labels above it.
    const ly = p.ghost || p.below ? cy + botY * k + 24 : cy + topY * k - 12;
    return {
      id: p.id, label: p.label, ghost: p.ghost,
      polys: polys.map((f) => fmt(f, f.length > 2)), rings: rings.map((f) => fmt(f, true)), spokes: spokes.map((f) => fmt(f, false)),
      tx: +(ox * k).toFixed(1), ty: +(oy * k).toFixed(1),
      // Keep every label inside the frame once its part is pulled apart (labels move with their part).
      lab: [+Math.min(690 - ox * k, Math.max(30 - ox * k, cx + midX * k + (p.ghost ? 0 : p.lx ?? 0))).toFixed(1), +Math.max(24 - oy * k, ly + (p.ghost ? 0 : p.ly ?? 0)).toFixed(1)],
    };
  });
}

const cache = new Map<string, Built[]>();

export function MinerTeardown({ slug, cooling }: { slug?: string; cooling: "Air" | "Hydro" }) {
  const int = internalsFor(slug, cooling);
  let parts = cache.get(int.key);
  if (!parts) { parts = build(cooling === "Hydro" ? hydroParts(int) : airParts(int), TARGET[cooling]); cache.set(int.key, parts); }
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
      <text x={360} y={526} className="td-note" textAnchor="middle">{int.note}</text>
    </svg>
  );
}
