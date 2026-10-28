// Every fact on the site lives here and names the content/ file it comes from.
// If a fact is not in content/, it stays null and the page shows a visible TODO marker.

const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "";

export const site = {
  // CLAUDE.md
  name: "Segments Cloud",
  legalNames: ["Segments Cloud Computing LLC", "Segments Cloud Electronics LLC"], // TODO: confirm which entity contracts with hosting clients (CLAUDE.md)
  serviceArea: "UAE", // content/contact.md
  description:
    "ASIC mining hosting in the UAE: 45 MW of operating capacity, plug and play hosting from $0.058 per kWh, turnkey builds, air and hydro-cooled halls, in-house repair and monthly power reports.",
  // TODO: set NEXT_PUBLIC_SITE_URL to the real domain once approved (CLAUDE.md › Domain)
  url: (process.env.NEXT_PUBLIC_SITE_URL || vercelUrl || "http://localhost:3000").replace(/\/$/, ""),
  // Keep the preview out of search engines until management approves the launch.
  allowIndexing: process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true",
} as const;

export const contact = {
  // content/contact.md
  office: "Office 2712, Concord Tower, Media City, Dubai",
  email: "ganushi@segments.ae",
  phone: "+971 54 211 9496",
  whatsapp: "+971 54 211 9496" as string | null,
  whatsappUrl: "https://wa.me/971542119496",
  person: null as string | null, // TODO: content/contact.md
  hours: null as string | null, // TODO: content/contact.md
};

export const pricing = {
  // content/pricing.md › Plug and play hosting
  plugFromUsd: 0.058,
  plugToUsd: 0.068,
  plugFromLabel: "$0.058",
  plugRangeLabel: "$0.058 – $0.068",
  // content/pricing.md › Turnkey solution
  turnkeyPowerFromUsd: 0.039,
  turnkeyPowerFromLabel: "$0.039",
  turnkeyCapexPerMwUsd: 300_000,
  turnkeyCapexPerMwLabel: "USD 300,000",
  // Rate used to recalculate the sample report: an example inside the plug and play range.
  sampleRateUsd: 0.06,
};

export const capacity = {
  // content/performance.md
  totalMw: 45,
};

export const nav = [
  { href: "/services", label: "Services" },
  { href: "/models", label: "Models" },
  { href: "/pricing", label: "Pricing" },
  { href: "/turnkey", label: "Turnkey" },
  { href: "/sites", label: "Sites" },
  { href: "/monitoring", label: "Monitoring" },
  { href: "/how-it-works", label: "How it works" },
];

export const sites = {
  // content/sites.md
  activeCount: 8, // TODO: Ganushi to confirm (content/sites.md)
  cooling: ["Air-cooled halls at every site", "A hydro-cooled zone for hydro models"],
};

export type Photo = { src: string; w: number; h: number; alt: string; caption: string };

export const photos = {
  // content/sites.md › Photos. Originals in assets/photos. Captions name no site, per content/sites.md.
  finishedHallAisle: { src: "/photos/finished-hall-aisle-1600.webp", w: 596, h: 1280, alt: "Long air-cooled hall with lit racks on both sides and a clean tiled floor", caption: "Finished air-cooled hall, ready for machines. UAE site, September 2025" },
  rackRows: { src: "/photos/rack-rows-pdu-1600.webp", w: 1280, h: 720, alt: "Steel racks fitted with vertical power distribution strips and network cabling", caption: "Racks wired with power strips and network cabling, September 2025" },
  rackAisle: { src: "/photos/rack-aisle-1600.webp", w: 596, h: 1280, alt: "Rows of mining racks along a finished hall", caption: "Rack rows in a finished hall, September 2025" },
  powerDistribution: { src: "/photos/power-distribution-1600.webp", w: 1280, h: 720, alt: "Wall-mounted electrical distribution boards with breakers and indicator lights", caption: "Power distribution boards for a hall, September 2025" },
  hallFanWall: { src: "/photos/hall-fan-wall-1600.webp", w: 1600, h: 1200, alt: "Row of large exhaust fans along the wall of an air-cooled mining hall", caption: "Exhaust fan wall in an air-cooled hall, August 2025" },
  siteExterior: { src: "/photos/site-exterior-1600.webp", w: 960, h: 1280, alt: "Arched mining halls on open desert ground at a Segments Cloud site", caption: "Mining halls at a UAE site, September 2025" },
  hydroPumps: { src: "/photos/hydro-pumps-1600.webp", w: 1280, h: 961, alt: "Water tank with two pumps and pipework beside a hall wall at night", caption: "Pumps and tank for a hydro-cooled hall, September 2025" }, // TODO: confirm caption (content/sites.md)
} satisfies Record<string, Photo>;

export const siteVideo = {
  // content/sites.md › Video. Drive › site folder › installed. Muted, first 5 seconds, no people.
  src: "/video/installed-miners.mp4",
  poster: "/video/installed-miners-poster.webp",
  caption: "Installed miners and power strips in an air-cooled hall at a UAE site",
};

export const services = {
  // content/services.md
  power: ["Power capacity is tracked for every site and zone.", "Load is read from the fleet platform before new machines are placed."],
  cooling: ["Air-cooled halls for air-cooled ASICs.", "A hydro-cooled zone for hydro models."],
  operations: [
    "On-site hosting technicians and a site in-charge at each site.",
    "In-house repair: pickup from the site, intake and diagnosis at the Segments repair center, quote, repair and return to the rack.",
    "You approve each repair quote before work starts.",
    "Spare fans, PSU fans and cables held in the Segments warehouse.",
  ],
  monitoring: [
    "Every machine tracked on the fleet platform: status, hash rate, last share and repair state.",
    "Your fleet data synced daily.",
    "A monthly power and hosting report with running days, energy and charge for each machine.",
    "A repair log showing every stage of each repair.",
  ],
  modelsAir: ["Antminer Z15 Pro", "S21 XP", "S21+", "S21", "S19 XP", "L9", "L7", "D9", "KS5", "Whatsminer M30S++", "IceRiver AL3"],
  modelsHydro: ["Antminer S21 XP Hydro", "S21+ Hydro", "S21 Hydro", "S19 XP Hydro", "S19 Pro+ Hydro", "S19 Pro Hydro"],
};

export const billing = [
  // content/pricing.md › How the charge is calculated
  "Plug and play rate from $0.058 to $0.068 per kWh, set by the number of machines you host.",
  "Charge per machine = watts × 24 hours × running days ÷ 1,000 × rate.",
  "Running days come from your pool data: an offline machine counts up to its last share.",
  "Days a machine is offline are not charged.",
  "Wattage is the measured or nameplate figure for the model.",
  "Repair costs, if any, appear on the same invoice.",
];

// content/faq.md: every answer restates facts from the content/ files named there.
export const faqs = [
  {
    question: "What does hosting include?",
    answer:
      "Space in an air-cooled hall or a hydro-cooled zone, on-site hosting technicians, in-house repair, and monitoring of every machine with a monthly power and hosting report.",
  },
  {
    question: "How is my hosting charge calculated?",
    answer:
      "Plug and play hosting costs $0.058 to $0.068 per kWh depending on how many machines you host. Each machine is billed as watts × 24 hours × running days ÷ 1,000 × rate. Running days come from your pool data, and days a machine is offline are not charged.",
  },
  {
    question: "Which machines can you host?",
    answer:
      "We run air-cooled models such as the Antminer Z15 Pro, S21 series, S19 XP, L9, L7, D9 and KS5, and hydro models such as the S21 XP Hydro and S21+ Hydro. Each has its own page under Models. Ask us about any model not listed.",
  },
  {
    question: "What is the turnkey solution?",
    answer:
      "A dedicated build for larger fleets, with power from $0.039 per kWh and capex of USD 300,000 per MW. See the Turnkey page for details and ask us for a proposal.",
  },
  {
    question: "What happens when a machine breaks?",
    answer:
      "It is picked up from the site, diagnosed at the Segments repair center and quoted. You approve the quote before work starts, and the repair cost appears on your hosting invoice.",
  },
  {
    question: "Will hosting guarantee mining profit?",
    answer:
      "No. Mining results depend on network difficulty, Bitcoin price, machine efficiency, pool fees and downtime. We describe the hosting service only and make no promise of returns.",
  },
];
