// Published internals of each hosted model, for the calculator's teardown illustration (Ganushi, 16 Nov 2026:
// "inspect the proper models' inside parts"). Source: content/models.md › Internals, researched 16 Nov 2026 from
// Bitmain support specification pages and user guides, MicroBT manuals and repair guides; reseller-only claims are
// left out. A field that no reliable source states is left empty, and the drawing shows that part as the typical
// layout without a count or name. Dimensions are L × W × H in mm as the manufacturer publishes them.
import type { Model } from "./models";

export type Internals = {
  key: string;
  cooling: Model["cooling"];
  hashboards?: number;
  fans?: { front: number; rear: number };
  fanSize?: string;
  psu?: { name?: string; mount?: "top" | "internal" };
  control?: string;
  ports?: { count: number; type?: string };
  coldPlates?: boolean;
  dimsMm?: [number, number, number];
  /** true when the main parts (boards, fans or ports, PSU) are all published */
  confirmed: boolean;
  note: string;
};

type Entry = Omit<Internals, "key" | "cooling" | "note" | "confirmed"> & { maker: string; confirmed: boolean };

const E: Record<string, Entry> = {
  // Air-cooled
  "antminer-z15-pro": { maker: "Bitmain", hashboards: 3, fans: { front: 1, rear: 1 }, psu: { name: "APW12" }, dimsMm: [428, 195, 290], confirmed: true },
  "antminer-s21-xp": { maker: "Bitmain", hashboards: 3, fans: { front: 2, rear: 2 }, psu: { name: "APW171215" }, dimsMm: [449, 219, 293], confirmed: true },
  "antminer-s21-plus": { maker: "Bitmain", psu: { name: "APW171215" }, dimsMm: [450, 219, 293], confirmed: false },
  "antminer-s21": { maker: "Bitmain", hashboards: 3, fans: { front: 2, rear: 2 }, psu: { name: "APW17" }, control: "Amlogic control board", dimsMm: [400, 195, 290], confirmed: true },
  "antminer-s19-xp": { maker: "Bitmain", hashboards: 3, fans: { front: 2, rear: 2 }, fanSize: "12038", psu: { name: "APW12", mount: "top" }, control: "Zynq control board", dimsMm: [400, 195.5, 290], confirmed: true },
  "whatsminer-m30s-plus-plus": { maker: "MicroBT", hashboards: 3, fans: { front: 1, rear: 1 }, fanSize: "14 cm", psu: { name: "P221B/P222B" }, control: "CB6 control board", dimsMm: [430, 155, 226], confirmed: true },
  "antminer-l9": { maker: "Bitmain", hashboards: 3, fans: { front: 2, rear: 2 }, fanSize: "12038", psu: { name: "APW171215" }, control: "CV1835 control board", dimsMm: [400, 195, 290], confirmed: true },
  "antminer-l7": { maker: "Bitmain", hashboards: 4, fans: { front: 2, rear: 2 }, psu: { name: "APW12" }, control: "Zynq control board", dimsMm: [370, 195.5, 290], confirmed: true },
  "antminer-d9": { maker: "Bitmain", fans: { front: 2, rear: 2 }, fanSize: "12038", psu: { name: "APW12" }, dimsMm: [430, 195.5, 290], confirmed: false },
  "antminer-ks5": { maker: "Bitmain", fans: { front: 2, rear: 2 }, fanSize: "12038", psu: { name: "APW171215A" }, dimsMm: [430, 195.5, 290], confirmed: false },
  "antminer-al1": { maker: "Bitmain", dimsMm: [430, 195, 290], confirmed: false },
  "iceriver-ae3": { maker: "IceRiver", dimsMm: [370, 195, 290], confirmed: false },
  "iceriver-ae2": { maker: "IceRiver", confirmed: false },
  "iceriver-al3": { maker: "IceRiver", dimsMm: [430, 195, 290], confirmed: false },
  // Hydro: Bitmain lists no fans for its hydro units; whether each hashboard has its own cold plate is not published.
  "antminer-s21-xp-hydro": { maker: "Bitmain", hashboards: 3, psu: { name: "APW11" }, control: "Hyd. series control board", ports: { count: 2, type: "OD10 quick connectors" }, dimsMm: [339, 173, 207], confirmed: true },
  "antminer-s21-plus-hydro": { maker: "Bitmain", ports: { count: 2, type: "OD10" }, dimsMm: [339, 173, 207], confirmed: false },
  "antminer-s21-hydro": { maker: "Bitmain", hashboards: 3, psu: { name: "APW11" }, control: "Hyd. series control board", ports: { count: 2, type: "OD10 quick connectors" }, dimsMm: [339, 173, 207], confirmed: true },
  "antminer-s19-xp-hydro": { maker: "Bitmain", hashboards: 3, psu: { name: "APW11" }, control: "Hyd. series control board", ports: { count: 2, type: "OD10 quick connectors" }, dimsMm: [410, 170, 209], confirmed: true },
  "antminer-s19-pro-plus-hydro": { maker: "Bitmain", ports: { count: 2, type: "OD10" }, dimsMm: [410, 196, 209], confirmed: false },
  "antminer-s19-pro-hydro": { maker: "Bitmain", psu: { name: "APW11" }, dimsMm: [410, 196, 209], confirmed: false },
};

export function internalsFor(slug: string | undefined, cooling: Model["cooling"]): Internals {
  const e = slug ? E[slug] : undefined;
  if (!e) return { key: `typical-${cooling}`, cooling, confirmed: false, note: "Illustration · typical ASIC layout" };
  const { maker, confirmed, ...rest } = e;
  return {
    ...rest, key: slug!, cooling, confirmed,
    note: confirmed ? `Illustration · parts as published by ${maker}` : `Illustration · ${maker} parts where published, others typical`,
  };
}
