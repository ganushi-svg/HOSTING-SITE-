// Machine models with their own hosting page. Source: content/models.md.
// Wattage is the fleet nameplate figure unless `wattsSource` says otherwise.
import { pricing } from "./site";

export type Model = {
  slug: string;
  name: string;
  maker: "Bitmain" | "MicroBT";
  cooling: "Air" | "Hydro";
  watts: number;
  wattsNote?: string;
  hashrate?: string;
  algorithm: string;
  coins: string;
  wattsSource: string;
  featured?: boolean;
  todo?: string;
};

// 3D renders from the Miner Studio pack (content/models.md › Renders): locally authored, photo-guided
// presentation models, not product photos or manufacturer CAD. The KS5 render and model were built from the
// pack's own geometry (classic chassis).
const rendered = new Set([
  "antminer-z15-pro", "antminer-s21-xp", "antminer-s21-plus", "antminer-s21", "antminer-s19-xp", "whatsminer-m30s-plus-plus",
  "antminer-l9", "antminer-l7", "antminer-d9", "antminer-s21-xp-hydro", "antminer-s21-plus-hydro", "antminer-s21-hydro",
  "antminer-s19-xp-hydro", "antminer-s19-pro-plus-hydro", "antminer-s19-pro-hydro", "antminer-ks5",
]);
const looped = new Set(["antminer-z15-pro", "antminer-s21-xp-hydro"]);

export function renderFor(slug: string) {
  if (!rendered.has(slug)) return null;
  return {
    poster: `/miners/posters/${slug}.webp`,
    model: `/miners/models/${slug}.glb`,
    video: looped.has(slug) ? `/miners/video/${slug}-loop.mp4` : undefined,
    videoPoster: looped.has(slug) ? `/miners/video/${slug}-poster.webp` : undefined,
  };
}

const tab = "Fleet nameplate table";

export const models: Model[] = [
  { slug: "antminer-z15-pro", name: "Antminer Z15 Pro", maker: "Bitmain", cooling: "Air", watts: 2780, hashrate: "840 kSol/s", algorithm: "Equihash", coins: "Zcash", wattsSource: "Bitmain published specification", featured: true, todo: "Confirm wattage and hash rate against our hosted units (content/models.md)" },
  { slug: "antminer-s21-xp", name: "Antminer S21 XP", maker: "Bitmain", cooling: "Air", watts: 3645, algorithm: "SHA-256", coins: "Bitcoin", wattsSource: tab },
  { slug: "antminer-s21-plus", name: "Antminer S21+", maker: "Bitmain", cooling: "Air", watts: 3564, hashrate: "235 TH/s", algorithm: "SHA-256", coins: "Bitcoin", wattsSource: tab },
  { slug: "antminer-s21", name: "Antminer S21", maker: "Bitmain", cooling: "Air", watts: 3500, algorithm: "SHA-256", coins: "Bitcoin", wattsSource: tab },
  { slug: "antminer-s19-xp", name: "Antminer S19 XP", maker: "Bitmain", cooling: "Air", watts: 3010, algorithm: "SHA-256", coins: "Bitcoin", wattsSource: tab },
  { slug: "whatsminer-m30s-plus-plus", name: "Whatsminer M30S++", maker: "MicroBT", cooling: "Air", watts: 3472, algorithm: "SHA-256", coins: "Bitcoin", wattsSource: tab },
  { slug: "antminer-l9", name: "Antminer L9", maker: "Bitmain", cooling: "Air", watts: 3360, hashrate: "17 GH/s", algorithm: "Scrypt", coins: "Litecoin, Dogecoin", wattsSource: tab },
  { slug: "antminer-l7", name: "Antminer L7", maker: "Bitmain", cooling: "Air", watts: 3260, wattsNote: "3,425 W for the 9,500 MH/s variant", hashrate: "9,500 MH/s variant hosted", algorithm: "Scrypt", coins: "Litecoin, Dogecoin", wattsSource: tab },
  { slug: "antminer-d9", name: "Antminer D9", maker: "Bitmain", cooling: "Air", watts: 3060, algorithm: "X11", coins: "Dash", wattsSource: tab },
  { slug: "antminer-ks5", name: "Antminer KS5", maker: "Bitmain", cooling: "Air", watts: 3000, algorithm: "kHeavyHash", coins: "Kaspa", wattsSource: tab },
  { slug: "antminer-s21-xp-hydro", name: "Antminer S21 XP Hydro", maker: "Bitmain", cooling: "Hydro", watts: 5676, hashrate: "473 TH/s", algorithm: "SHA-256", coins: "Bitcoin", wattsSource: tab },
  { slug: "antminer-s21-plus-hydro", name: "Antminer S21+ Hydro", maker: "Bitmain", cooling: "Hydro", watts: 5370, hashrate: "358 TH/s", algorithm: "SHA-256", coins: "Bitcoin", wattsSource: tab },
  { slug: "antminer-s21-hydro", name: "Antminer S21 Hydro", maker: "Bitmain", cooling: "Hydro", watts: 5360, algorithm: "SHA-256", coins: "Bitcoin", wattsSource: tab },
  { slug: "antminer-s19-xp-hydro", name: "Antminer S19 XP Hydro", maker: "Bitmain", cooling: "Hydro", watts: 5304, hashrate: "246–257 TH/s", algorithm: "SHA-256", coins: "Bitcoin", wattsSource: tab },
  { slug: "antminer-s19-pro-plus-hydro", name: "Antminer S19 Pro+ Hydro", maker: "Bitmain", cooling: "Hydro", watts: 5445, hashrate: "184 TH/s", algorithm: "SHA-256", coins: "Bitcoin", wattsSource: tab },
  { slug: "antminer-s19-pro-hydro", name: "Antminer S19 Pro Hydro", maker: "Bitmain", cooling: "Hydro", watts: 5445, hashrate: "177 TH/s", algorithm: "SHA-256", coins: "Bitcoin", wattsSource: tab },
];

export const getModel = (slug: string) => models.find((m) => m.slug === slug);

/** Power-only estimate for 30 running days: watts × 24 h × 30 ÷ 1,000 × rate (content/models.md). */
export function monthlyEstimate(watts: number) {
  const kwh = (watts * 24 * 30) / 1000;
  return { kwh, from: kwh * pricing.plugFromUsd, to: kwh * pricing.plugToUsd };
}

export const usd = (n: number) => `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
