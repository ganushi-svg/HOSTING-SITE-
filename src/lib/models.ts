// Machine models with their own hosting page. Source: content/models.md.
// Wattage is the fleet nameplate figure unless `wattsSource` says otherwise.
import { pricing } from "./site";

export type Model = {
  slug: string;
  name: string;
  maker: "Bitmain" | "MicroBT" | "IceRiver";
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

// Turntable renders supplied by Ganushi KC, 30 Oct 2026 (content/models.md › Renders): one hydro unit and one
// air-cooled Antminer, used as a representative render for every model of that cooling type.
// Not the exact model and not a product photo. The white studio background is cut out to transparency
// (animated WebP, 15 fps) so the miner sits on the dark glass panels.
export function turntableFor(cooling: Model["cooling"]) {
  const key = cooling === "Hydro" ? "hydro" : "air";
  return { animated: `/miners/turntable/${key}.webp`, still: `/miners/turntable/${key}-still.webp` };
}

const tab = "Fleet nameplate table";

export const models: Model[] = [
  { slug: "antminer-z15-pro", name: "Antminer Z15 Pro", maker: "Bitmain", cooling: "Air", watts: 2780, hashrate: "840 kSol/s", algorithm: "Equihash", coins: "Zcash", wattsSource: "Bitmain official listing (shop.bitmain.com), 5 Nov 2026", featured: true },
  { slug: "antminer-s21-xp", name: "Antminer S21 XP", maker: "Bitmain", cooling: "Air", watts: 3645, hashrate: "270 TH/s", algorithm: "SHA-256", coins: "Bitcoin", wattsSource: tab },
  { slug: "antminer-s21-plus", name: "Antminer S21+", maker: "Bitmain", cooling: "Air", watts: 3564, hashrate: "235 TH/s", algorithm: "SHA-256", coins: "Bitcoin", wattsSource: tab },
  { slug: "antminer-s21", name: "Antminer S21", maker: "Bitmain", cooling: "Air", watts: 3500, hashrate: "200 TH/s", algorithm: "SHA-256", coins: "Bitcoin", wattsSource: tab },
  { slug: "antminer-s19-xp", name: "Antminer S19 XP", maker: "Bitmain", cooling: "Air", watts: 3010, hashrate: "140 TH/s", algorithm: "SHA-256", coins: "Bitcoin", wattsSource: tab },
  { slug: "whatsminer-m30s-plus-plus", name: "Whatsminer M30S++", maker: "MicroBT", cooling: "Air", watts: 3472, hashrate: "112 TH/s", algorithm: "SHA-256", coins: "Bitcoin", wattsSource: tab },
  { slug: "antminer-l9", name: "Antminer L9", maker: "Bitmain", cooling: "Air", watts: 3360, hashrate: "17 GH/s", algorithm: "Scrypt", coins: "Litecoin, Dogecoin", wattsSource: tab },
  { slug: "antminer-l7", name: "Antminer L7", maker: "Bitmain", cooling: "Air", watts: 3260, wattsNote: "3,425 W for the 9,500 MH/s variant", hashrate: "9,500 MH/s variant hosted", algorithm: "Scrypt", coins: "Litecoin, Dogecoin", wattsSource: tab },
  { slug: "antminer-d9", name: "Antminer D9", maker: "Bitmain", cooling: "Air", watts: 3060, hashrate: "1,770 GH/s", algorithm: "X11", coins: "Dash", wattsSource: tab },
  { slug: "antminer-ks5", name: "Antminer KS5", maker: "Bitmain", cooling: "Air", watts: 3000, hashrate: "20 TH/s", algorithm: "kHeavyHash", coins: "Kaspa", wattsSource: tab },
  // Added 12 Nov 2026 (Ganushi KC: "all four"): Aleo and Alephium machines, manufacturer specifications (content/models.md).
  { slug: "iceriver-ae3", name: "IceRiver ALEO AE3", maker: "IceRiver", cooling: "Air", watts: 3400, hashrate: "2 GH/s", algorithm: "zkSNARK", coins: "Aleo", wattsSource: "IceRiver specification (Kryptex, MiningBoard), 12 Nov 2026" },
  { slug: "iceriver-ae2", name: "IceRiver ALEO AE2", maker: "IceRiver", cooling: "Air", watts: 1300, hashrate: "720 MH/s", algorithm: "zkSNARK", coins: "Aleo", wattsSource: "IceRiver specification (Kryptex), 12 Nov 2026" },
  { slug: "antminer-al1", name: "Antminer AL1", maker: "Bitmain", cooling: "Air", watts: 3730, hashrate: "16.6 TH/s", algorithm: "Blake3", coins: "Alephium", wattsSource: "Bitmain official listing (shop.bitmain.com), 12 Nov 2026" },
  { slug: "iceriver-al3", name: "IceRiver AL3", maker: "IceRiver", cooling: "Air", watts: 3500, hashrate: "15 TH/s", algorithm: "Blake3", coins: "Alephium", wattsSource: "IceRiver specification (Kryptex, MiningBoard, Hashrate.no), 12 Nov 2026" },
  { slug: "antminer-s21-xp-hydro", name: "Antminer S21 XP Hydro", maker: "Bitmain", cooling: "Hydro", watts: 5676, hashrate: "473 TH/s", algorithm: "SHA-256", coins: "Bitcoin", wattsSource: tab },
  { slug: "antminer-s21-plus-hydro", name: "Antminer S21+ Hydro", maker: "Bitmain", cooling: "Hydro", watts: 5370, hashrate: "358 TH/s", algorithm: "SHA-256", coins: "Bitcoin", wattsSource: tab },
  { slug: "antminer-s21-hydro", name: "Antminer S21 Hydro", maker: "Bitmain", cooling: "Hydro", watts: 5360, hashrate: "335 TH/s", algorithm: "SHA-256", coins: "Bitcoin", wattsSource: tab },
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
