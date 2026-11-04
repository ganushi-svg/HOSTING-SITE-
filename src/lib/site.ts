// Every fact on the site lives here and names the content/ file it comes from.
// If a fact is not in content/, it stays null and the page shows a visible TODO marker.

const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "";

export const site = {
  // CLAUDE.md
  name: "Segments Cloud",
  legalNames: ["Segments Cloud Computing LLC", "Segments Cloud Electronics LLC"], // TODO: confirm which entity contracts with hosting clients (CLAUDE.md)
  serviceArea: "UAE", // content/contact.md
  description:
    "ASIC mining hosting in the UAE: 45 MW of operating capacity at sites around Abu Dhabi, plug and play hosting from $0.058 per kWh, turnkey builds, air and hydro-cooled halls, in-house repair and monthly power reports.",
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
  // content/contact.md (Ganushi KC, 4 Nov 2026)
  person: "Ganushi KC" as string | null,
  personTitle: "Operations Manager",
  hours: "10:00 AM – 6:00 PM (UAE time)" as string | null,
  phoneUrl: "tel:+971542119496",
};

export const pricing = {
  // content/pricing.md › Plug and play hosting
  plugFromUsd: 0.058,
  plugToUsd: 0.068,
  plugFromLabel: "$0.058",
  plugRangeLabel: "$0.058 – $0.068",
  // content/pricing.md › tiers (Ganushi KC, 4 Nov 2026), largest fleet first.
  // content/pricing.md › setup and deposit (Ganushi KC, 4 Nov 2026)
  setupFeePerKwUsd: 100,
  setupFeeLabel: "USD 100 per kW",
  depositLabel: "One month of power",
  minimumTermLabel: "12 months",
  currenciesLabel: "USD or AED",
  // content/pricing.md and content/contract-and-onboarding.md (Ganushi KC, 4 Nov 2026)
  paymentMethodsLabel: "USDT, AED (bank transfer or cash) or BTC",
  rateBasisLabel: "Calculated from each miner's power consumption",
  minimumFleetLabel: "None, any quantity is welcome",
  invoicingLabel: "Shared at the start of every month in your client group",
  deliveryLabel: "We deliver and collect; charges quoted by quantity; fully wrapped and bubble-wrapped",
  // content/contract-and-onboarding.md (Ganushi KC, 4 Nov 2026)
  noticePeriodLabel: "Usually 2 months, as agreed in each client's hosting contract",
  whoCanHostLabel: "Individuals and companies of any size",
  tiers: [
    { min: 100, label: "100+ machines", rateUsd: 0.058, rateLabel: "$0.058" },
    { min: 50, label: "50 – 99 machines", rateUsd: 0.062, rateLabel: "$0.062" },
    { min: 1, label: "Under 50 machines", rateUsd: 0.068, rateLabel: "$0.068" },
  ],
  // content/pricing.md › Turnkey solution
  turnkeyPowerFromUsd: 0.039,
  turnkeyPowerFromLabel: "$0.039",
  turnkeyCapexPerMwUsd: 300_000,
  turnkeyCapexPerMwLabel: "USD 300,000",
  // Rate used to recalculate the sample report: an example inside the plug and play range.
  sampleRateUsd: 0.06,
};

/** Plug and play rate tier for a fleet size (content/pricing.md › tiers). */
export const tierFor = (machines: number) => pricing.tiers.find((t) => machines >= t.min) ?? pricing.tiers[pricing.tiers.length - 1];

export const capacity = {
  // content/performance.md
  totalMw: 45,
  uptimePct: 95, // Ganushi KC, 4 Nov 2026
  clientRegionsLabel: "Europe, the USA and beyond", // Ganushi KC, 4 Nov 2026: ongoing clients in many countries; no count published
};

export const quality = {
  // content/quality.md
  team: {
    name: "Segments Quality Control", // Ganushi KC, 4 Nov 2026, with the team logo (public/brand/quality-control-logo.webp)
    // Size, filter intervals and deep cleaning: Ganushi KC, 4 Nov 2026 (content/quality.md)
    size: 10,
    summary: "Segments Quality Control is a team of 10 people who look after nothing but quality at our sites. They keep the air clean in every hall, check the coolant in every hydro container, deep-clean the machines, and log each job until it is closed.",
    duties: [
      { title: "Air filters", text: "Intake filters cleaned every week. Disposable filters replaced every month. Mesh (GI) pre-filters replaced every 3 to 4 months, judged by inspecting their condition." },
      { title: "Machine deep cleaning", text: "Every hosted machine is deep-cleaned to clear dust from fans and boards, so it runs cooler and more efficiently." },
      { title: "Hydro containers", text: "A nine-step inspection every week and regular coolant testing against set standards." },
      { title: "Tracking and logs", text: "Every check is logged and every maintenance job stays on the tracking board until it is closed." },
    ],
    filterSchedule: [
      { what: "Intake filters", when: "Cleaned weekly" },
      { what: "Disposable filters", when: "Replaced monthly" },
      { what: "Mesh (GI) pre-filters", when: "Replaced every 3–4 months, by condition" },
    ],
  },
  airReport: { visits: 3, manDays: 13, giFilters: 272, disposableFilters: 272, month: "August 2026" },
  airWork: [
    "Mesh (GI) pre-filters and disposable intake filters cleaned, then replaced the next day.",
    "Floors cleaned across the data center, warehouse and office areas.",
    "Fan motors fixed and pipes cleaned.",
  ],
  hydroSteps: [
    { title: "Walk-around", text: "Look, listen and smell for drips, new noises and alarms." },
    { title: "Record the numbers", text: "Temperatures, pressures and coolant flow, compared with last week." },
    { title: "Sump check", text: "Spray-water level, clarity and dissolved solids." },
    { title: "Pump filter", text: "Spray-pump suction filter washed and refitted." },
    { title: "Louvres and grilles", text: "Air inlets brushed clear of desert dust." },
    { title: "Nozzles", text: "Every spray nozzle checked for a full, even cone." },
    { title: "Inside the container", text: "Hoses, quick-connects, leak-detection belt and pumps." },
    { title: "Coolant reserve", text: "Make-up tank level on the sight glass." },
    { title: "Coil and close-out", text: "Coil checked for scale, log signed and photographed." },
  ],
  hydroTargets: [
    { label: "Coolant flow", value: "≥ 85 m³/h" },
    { label: "Return pressure", value: "> 0.05 MPa" },
    { label: "Make-up tank", value: "≥ 2/3 full" },
  ],
  coolant: [
    { check: "Water used", target: "Distilled or deionised only, never tap water" },
    { check: "Visual and level", target: "Weekly: no rust, sediment or algae; top up with the same coolant only" },
    { check: "pH", target: "7.0 to 9.0" },
    { check: "Conductivity", target: "Under 5 µS/cm for deionised water" },
    { check: "Glycol mix", target: "30 to 50% (refractometer)" },
    { check: "Tubing and fittings", target: "Quarterly check for corrosion, leaks and deposits" },
    { check: "Flush", target: "When coolant is over 6 months old or contaminated" },
  ],
  // Grouped by frequency for the Calendar tab timeline. kind: "air" | "hydro" | "all".
  schedule: [
    { when: "Daily", tasks: [{ kind: "hydro", what: "Water levels and readings checked" }] },
    { when: "Weekly", tasks: [{ kind: "air", what: "Intake filters cleaned" }, { kind: "hydro", what: "Nine-step cleaning and inspection, with a signed log" }] },
    { when: "Monthly", tasks: [{ kind: "air", what: "Disposable filters replaced" }] },
    { when: "Every 3–4 months", tasks: [{ kind: "air", what: "Mesh (GI) pre-filters replaced, based on inspection" }] },
    { when: "Every 6 months", tasks: [{ kind: "hydro", what: "Coolant pH test and pipe leak survey" }] },
    { when: "Yearly", tasks: [{ kind: "hydro", what: "Coolant lab test before summer" }] },
  ] as { when: string; tasks: { kind: "air" | "hydro"; what: string }[] }[],
};

// Sections of the single page, in order. The header tab bar jumps to each one.
export const sections = [
  { id: "overview", label: "Overview" },
  { id: "services", label: "Services" },
  { id: "pricing", label: "Pricing" },
  { id: "calculator", label: "Power cost" },
  { id: "machines", label: "Machines" },
  { id: "sites", label: "Sites" },
  { id: "quality", label: "Quality" },
  { id: "repair", label: "Repair" },
  { id: "reporting", label: "Reporting" },
  { id: "how-it-works", label: "How it works" },
  { id: "faq", label: "FAQ" },
  { id: "contact", label: "Contact" },
] as const;

// Plain-language explainers for the two cooling systems (Sites tabs). Facts from content/sites.md, content/quality.md
// and content/models.md; general descriptions of how each system works, no performance figures.
export const coolingSystems = {
  hydro: {
    title: "What is a hydro container?",
    what: "A hydro container is a sealed, purpose-built unit where every miner is cooled by liquid instead of air. Each machine has its own coolant supply and return hose. The coolant takes the heat out of the machine, carries it to a closed-circuit cooling tower outside, and comes back cooled to go round again.",
    differs: "In an air-cooled hall the miners are cooled by large volumes of outside air. Hydro miners sit in a sealed coolant loop instead, so they have no fans pulling desert dust through them.",
    benefits: [
      "Built for high-power hydro models such as the Antminer S21 XP Hydro (5,676 W)",
      "Sealed loop filled with deionised or distilled water only, pH kept between 7.0 and 9.0",
      "No machine fans to clog with dust",
      "A nine-step inspection every week by Segments Quality Control",
    ],
  },
  air: {
    title: "What is an air-cooled hall?",
    what: "Air-cooled miners sit on open racks in large halls. Fresh air is drawn in through wet evaporative cooling pads, which cool it as the water evaporates. The miners' own fans pull that air through each machine, and exhaust fans push the warm air out of the hall.",
    differs: "There is no coolant loop to look after, and almost every ASIC model can run in it, from the Antminer Z15 Pro to the L9 and KS5. Cooling depends on air flow, so clean filters and clean machines matter most.",
    benefits: [
      "Hosts the widest range of air-cooled models",
      "Intake filters cleaned weekly and disposable filters replaced monthly",
      "Mesh (GI) pre-filters replaced every 3 to 4 months, by condition",
      "Every machine deep-cleaned to keep it running efficiently",
    ],
  },
  choose: "Your machine model decides: hydro models are hosted in hydro containers, air-cooled models in our halls.",
};

export const sites = {
  // content/sites.md
  area: "around Abu Dhabi", // Ganushi, 3 Nov 2026: sites are described at Abu Dhabi level; no site count is published
  cooling: ["Air-cooled halls at every site", "A hydro-cooled zone for hydro models"],
};

export type Photo = { src: string; w: number; h: number; alt: string; caption: string };

export const photos = {
  // content/sites.md › Photos. Originals in assets/photos. Captions name no site, per content/sites.md.
  finishedHallAisle: { src: "/photos/finished-hall-aisle-1600.webp", w: 596, h: 1280, alt: "Long air-cooled hall with lit racks on both sides and a clean tiled floor", caption: "Finished air-cooled hall, ready for machines. Abu Dhabi site, September 2025" },
  rackRows: { src: "/photos/rack-rows-pdu-1600.webp", w: 1280, h: 720, alt: "Steel racks fitted with vertical power distribution strips and network cabling", caption: "Racks wired with power strips and network cabling, September 2025" },
  rackAisle: { src: "/photos/rack-aisle-1600.webp", w: 596, h: 1280, alt: "Rows of mining racks along a finished hall", caption: "Rack rows in a finished hall, September 2025" },
  powerDistribution: { src: "/photos/power-distribution-1600.webp", w: 1280, h: 720, alt: "Wall-mounted electrical distribution boards with breakers and indicator lights", caption: "Power distribution boards for a hall, September 2025" },
  hallFanWall: { src: "/photos/hall-fan-wall-1600.webp", w: 1600, h: 1200, alt: "Row of large exhaust fans along the wall of an air-cooled mining hall", caption: "Exhaust fan wall in an air-cooled hall, August 2025" },
  siteExterior: { src: "/photos/site-exterior-1600.webp", w: 960, h: 1280, alt: "Arched mining halls on open desert ground at a Segments Cloud site", caption: "Mining halls at an Abu Dhabi site, September 2025" },
  qcNewFiltersWall: { src: "/photos/qc-new-filters-wall-1600.webp", w: 1200, h: 1600, alt: "Wall of new blue disposable air filters in a diamond frame along a hall's air intake", caption: "New intake filters fitted along a hall wall, October 2026" },
  qcNewFiltersAisle: { src: "/photos/qc-new-filters-aisle-1600.webp", w: 1600, h: 1200, alt: "Long corridor lined with fresh blue intake filters", caption: "Fresh filters along an intake corridor, October 2026" },
  qcMeshPrefilters: { src: "/photos/qc-mesh-prefilters-1600.webp", w: 1200, h: 1600, alt: "Steel frame holding mesh pre-filters in front of a hall's intake wall", caption: "Mesh pre-filters in front of the intake wall, October 2026" },
  qcMeshOutdoor: { src: "/photos/qc-mesh-outdoor-1600.webp", w: 1600, h: 1200, alt: "Outdoor intake wall covered with mesh filter panels beside palm trees", caption: "Outdoor mesh pre-filter wall, October 2026" },
  qcFiltersReplaced: { src: "/photos/qc-filters-replaced-1600.webp", w: 1200, h: 1600, alt: "Used filter frames leaning against a wall after removal", caption: "Used filter frames taken out for replacement, October 2026" },
  qcCleanHall: { src: "/photos/qc-clean-hall-1600.webp", w: 860, h: 1600, alt: "Clean, empty hall floor in front of mesh filter walls", caption: "Hall floor after cleaning, October 2026" },
  // content/sites.md › Photos (finished hall, professional shoot, added 3 Nov 2026). Air-cooled hall with evaporative cooling pads.
  hallLongRacks: { src: "/photos/hall-long-racks-1920.webp", w: 1920, h: 1282, alt: "Long, bright mining hall with a row of racks full of running miners on a white tiled floor", caption: "Finished hall with racks of running miners, Abu Dhabi site" },
  hallPadsAndRacks: { src: "/photos/hall-pads-and-racks-1920.webp", w: 1920, h: 1282, alt: "Hall with an evaporative cooling-pad wall on one side and racks of miners on the other", caption: "Cooling-pad wall facing the miner racks, Abu Dhabi site" },
  hallAislePads: { src: "/photos/hall-aisle-pads-1920.webp", w: 1282, h: 1920, alt: "Clean aisle between miner racks and a cooling-pad wall", caption: "Clean aisle between racks and cooling pads" },
  hallRackRow: { src: "/photos/hall-rack-row-1920.webp", w: 1282, h: 1920, alt: "Row of steel racks loaded with miners along a hall wall", caption: "A full row of hosted miners" },
  hallRackCloseup: { src: "/photos/hall-rack-closeup-1920.webp", w: 1920, h: 1282, alt: "Close-up of miners on racks with labelled power cables and green status lights on the power strips", caption: "Miners on labelled power strips, every cable tagged" },
  hallMinersWired: { src: "/photos/hall-miners-wired-1920.webp", w: 1920, h: 1282, alt: "Miners stacked on shelves with network and power cables neatly routed to a power distribution unit", caption: "Power and network cabling to each machine" },
  hallCoolingPadWall: { src: "/photos/hall-cooling-pad-wall-1920.webp", w: 1920, h: 1282, alt: "Long wall of honeycomb evaporative cooling pads along a clean hall", caption: "Evaporative cooling-pad wall in an air-cooled hall" },
  hallPadCorridor: { src: "/photos/hall-pad-corridor-1920.webp", w: 1282, h: 1920, alt: "Narrow corridor lined on both sides with tall evaporative cooling pads", caption: "Cooling-pad corridor that feeds fresh air to the hall" },
  hallFanWallRacks: { src: "/photos/hall-fan-wall-racks-1920.webp", w: 1920, h: 1282, alt: "Aisle with large exhaust fans on one side and racks of miners on the other", caption: "Exhaust fans opposite the miner racks" },
  hallMinerFans: { src: "/photos/hall-miner-fans-1600.webp", w: 1068, h: 1600, alt: "Close-up of miner cooling fans mounted in a steel rack", caption: "Miner fans pulling air through the rack" },
  // content/sites.md › Photos (hydro zone and second hall, professional shoot, added 4 Nov 2026). Tone-corrected with Adobe Lightroom auto tone.
  hydroContainerDusk: { src: "/photos/hydro-container-dusk-1920.webp", w: 1920, h: 1282, alt: "White hydro-cooling container with louvred vents at dusk", caption: "Hydro container at dusk, Abu Dhabi site" },
  hydroContainerAisle: { src: "/photos/hydro-container-aisle-1920.webp", w: 1440, h: 1920, alt: "Aisle inside a hydro container with racks of hydro miners and coolant hoses on both sides", caption: "Inside a hydro container: miners on both sides of the aisle" },
  hydroRackHoses: { src: "/photos/hydro-rack-hoses-1920.webp", w: 1440, h: 1920, alt: "Rack of hydro miners, each connected to coolant supply and return hoses", caption: "Every hydro miner on its own coolant loop" },
  hydroRackRow: { src: "/photos/hydro-rack-row-1920.webp", w: 1440, h: 1920, alt: "Long rack of hydro miners with neatly routed coolant hoses", caption: "A full rack of hydro miners" },
  hydroManifoldCloseup: { src: "/photos/hydro-manifold-closeup-1920.webp", w: 1282, h: 1920, alt: "Close-up of coolant hoses and quick-connect fittings on hydro miners", caption: "Coolant hoses and quick-connect fittings" },
  hallMinerCloseupBlue: { src: "/photos/hall-miner-closeup-blue-1920.webp", w: 1920, h: 1282, alt: "Close-up of air-cooled miners in blue light", caption: "Air-cooled miners running, Abu Dhabi site" },
  hallFanCorridor: { src: "/photos/hall-fan-corridor-1920.webp", w: 1920, h: 1440, alt: "Corridor with a wall of exhaust fans on one side and racks of miners on the other", caption: "Exhaust-fan corridor beside the miner racks" },
  hallOpenRacks: { src: "/photos/hall-open-racks-1920.webp", w: 1440, h: 1920, alt: "Steel racks of air-cooled miners with power and network cabling", caption: "Racks of air-cooled miners" },
  hydroPumps: { src: "/photos/hydro-pumps-1600.webp", w: 1280, h: 961, alt: "Water tank with two pumps and pipework beside a hall wall at night", caption: "Pumps and tank for a hydro-cooled hall, September 2025" }, // TODO: confirm caption (content/sites.md)
} satisfies Record<string, Photo>;

// Hydro videos (Ganushi KC, 4 Nov 2026). Re-encoded 720p 30 fps, no audio. Captions name no site.
export const hydroVideos = [
  { src: "/video/hydro-container-walk.mp4", poster: "/video/hydro-container-walk-poster.webp", caption: "Walk-through of a hydro container, Abu Dhabi site" },
  { src: "/video/hydro-site-tour.mp4", poster: "/video/hydro-site-tour-poster.webp", caption: "Hydro racks, coolant manifold and dry coolers, Abu Dhabi site" },
];

// Air-cooled hall videos (Ganushi KC, 4 Nov 2026). Source clips had ~4 real frames per second; sped up 2x and
// motion-interpolated to 30 fps so they play at normal speed. No audio. Captions name no site.
export const airVideos = {
  wide: { src: "/video/air-fans-tour.mp4", poster: "/video/air-fans-tour-poster.webp", caption: "Exhaust fans, cooling pads and miner racks in an air-cooled hall, Abu Dhabi site" },
  tall: { src: "/video/air-hall-tour.mp4", poster: "/video/air-hall-tour-poster.webp", caption: "Inside a finished air-cooled hall, Abu Dhabi site" },
};

// Hydro container at night (Ganushi KC, 4 Nov 2026): replaces the dusk container photo. 2.8 s clip played forward then
// back as a seamless 5.6 s loop; 720p, 30 fps, no audio.
export const hydroContainerVideo = { src: "/video/hydro-container-night.mp4", poster: "/video/hydro-container-night-poster.webp", caption: "Hydro container at night, Abu Dhabi site" };

export const siteVideo = {
  // content/sites.md › Video. Drive › site folder › installed. Muted, first 5 seconds, no people.
  src: "/video/installed-miners.mp4",
  poster: "/video/installed-miners-poster.webp",
  caption: "Installed miners and power strips in an air-cooled hall at an Abu Dhabi site",
};

// Segments Repair, the in-house repair center (Ganushi KC, 4 Nov 2026: name, logo and video).
// Steps from content/services.md › Operations and repair; Bitmain training from content/services.md (confirmed 3 Nov 2026).
export const repair = {
  name: "Segments Repair",
  summary: "Segments Repair is our in-house repair center for hosted miners. Technicians trained by Bitmain diagnose faults down to the board on microscope rework and soldering stations, repair the machine and test it before it goes back to your rack. Common spare parts are kept in our own warehouse, and you approve every quote before work starts.",
  highlights: [
    { title: "Bitmain-trained technicians", text: "Diagnosis and repair by technicians trained by Bitmain." },
    { title: "Spares in stock", text: "Fans, PSU fans and cables held in the Segments warehouse." },
    { title: "You approve first", text: "No repair starts until you accept the quote." },
    { title: "Logged end to end", text: "Every stage appears in your repair log; the cost on your invoice." },
  ],
  steps: [
    { title: "Fault flagged", text: "The fleet platform shows a machine offline or under-hashing, and the site team raises it." },
    { title: "Pickup", text: "The machine is collected from its rack and taken to the repair center." },
    { title: "Intake and diagnosis", text: "It is logged on arrival and tested to find the faulty part." },
    { title: "Quote and approval", text: "You receive a repair quote and approve it before any work begins." },
    { title: "Repair and test", text: "The part is repaired or replaced, then the machine is tested." },
    { title: "Back to the rack", text: "It returns to your rack and the repair log and invoice are updated." },
  ],
  video: { src: "/video/segments-repair-30fps.mp4", poster: "/video/segments-repair-poster.webp", caption: "Inside the Segments Repair center" },
};

// content/contract-and-onboarding.md › Onboarding steps (4 Nov 2026)
export const onboarding = [
  { title: "Request a quote", text: "Tell us your machine models and quantity through the form below or on WhatsApp.", fact: "Any fleet size" },
  { title: "Agree the terms", text: "We confirm your rate for your fleet size and send the hosting contract to sign.", fact: "12-month minimum" },
  { title: "Setup fee and deposit", text: "Pay the one-off setup fee and a deposit of one month of hosting, in USD or AED.", fact: "USD 100 per kW" },
  { title: "Delivery to site", text: "We pick up and deliver your machines, with charges quoted by quantity. Every unit is fully wrapped against dust and bubble-wrapped against damage.", fact: "Fully wrapped, dust-free" },
  { title: "Racked and running", text: "Your machines go into an air-cooled hall or a hydro container and appear on our fleet platform.", fact: "Tracked per machine" },
  { title: "Monthly invoice and report", text: "At the start of each month your invoice and power report arrive in your client group: running days, energy and charge per machine.", fact: "Pay only for running days" },
];

export const services = {
  // content/services.md
  // The monitoring list as a four-step flow for the Reporting section.
  monitoringFlow: [
    { step: "Track", title: "Every machine on the fleet platform", text: "Each miner is watched on our fleet platform from the day it is racked.", chips: ["Status", "Hash rate", "Last share", "Repair state"] },
    { step: "Sync", title: "Fleet data synced daily", text: "Your machines' data is pulled together every day, so nothing waits for month end.", chips: ["Daily", "Per machine"] },
    { step: "Report", title: "A monthly power and hosting report", text: "One report per month shows exactly what you are billed for, machine by machine.", chips: ["Running days", "Energy kWh", "Charge"] },
    { step: "Repair log", title: "Every repair, stage by stage", text: "If a machine fails, you can follow it from pickup to diagnosis, quote, repair and back to the rack.", chips: ["Pickup", "Quote", "Repair", "Return"] },
  ],
  overview:
    "We have mined Bitcoin for our own account since 2017, so we know what it takes to keep machines running in the UAE heat. Today Segments Cloud operates 45 MW of power at sites all around Abu Dhabi and hosts both hydro and air-cooled machines, with a site in-charge and hosting technicians at every site. Our repair center is staffed by technicians trained by Bitmain. Every machine you send us is tracked on our fleet platform, and if one fails we collect it, diagnose it and send you a quote before any work starts. Each month you receive a report with every machine's running days, energy and charge. You pay only for the days it actually ran.",
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

// Why clients host with Segments: the hold-your-coins argument (content/pricing.md › Keep your coins, Ganushi KC, 4 Nov 2026).
export const whyHost = {
  eyebrow: "Why miners host with Segments",
  title: "Mine today. Keep every coin. Pay hosting from cash.",
  lead: "Our invoices are in USD or AED, settled from your own funds. Nothing obliges you to sell the coins your machines mine to cover hosting, so what you mine stays yours to hold or sell when you choose.",
  points: [
    { title: "Your coins stay in your wallet", text: "We never take payment in the coins you mine. Hold them, stake your own strategy, sell when you decide." },
    { title: "Pay only for running days", text: "A machine that is offline is not billed for those days. Your hosting cost tracks what actually ran." },
    { title: "From $0.058 per kWh, no minimum fleet", text: "Three rate tiers by fleet size, and one machine is welcome. The rate is set by the invoice, not by the market." },
    { title: "Every kilowatt-hour accounted for", text: "A monthly report shows running days, energy and charge per machine, so you always know what you paid for." },
  ],
  note: "Coin prices can fall as well as rise, and mining results depend on network difficulty, machine efficiency and uptime. We make no promise of returns; we keep your machines running and your coins yours.",
};

export const billing = [
  // content/pricing.md › How the charge is calculated
  "Plug and play rate set by the number of machines you host: $0.058 per kWh for 100 or more, $0.062 for 50 to 99, and $0.068 for fewer than 50.",
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
      "Plug and play hosting costs $0.058 per kWh for 100 or more machines, $0.062 for 50 to 99, and $0.068 for fewer than 50. Each machine is billed as watts × 24 hours × running days ÷ 1,000 × rate. Running days come from your pool data, and days a machine is offline are not charged.",
  },
  {
    question: "Which machines can you host?",
    answer:
      "We run air-cooled models such as the Antminer Z15 Pro, S21 series, S19 XP, L9, L7, D9 and KS5, and hydro models such as the S21 XP Hydro and S21+ Hydro. See the Machines section for each model's power draw and power cost. Ask us about any model not listed.",
  },
  {
    question: "What is the turnkey solution?",
    answer:
      "A dedicated build for larger fleets, with power from $0.039 per kWh and capex of USD 300,000 per MW. See the Turnkey tab under Pricing and ask us for a proposal.",
  },
  {
    question: "What happens when a machine breaks?",
    answer:
      "It is picked up from the site, diagnosed at the Segments repair center and quoted. You approve the quote before work starts, and the repair cost appears on your hosting invoice.",
  },
  {
    question: "How do I pay?",
    answer:
      "In USD or AED. We accept USDT, AED by bank transfer or cash, and BTC. A deposit of one month of hosting is held, and your hosting invoice is shared at the start of every month in your client group.",
  },
  {
    question: "Is there a minimum number of machines?",
    answer: "No. Individuals and companies of any size are welcome, with any number of machines. The rate is $0.068 per kWh under 50 machines, $0.062 for 50 to 99 and $0.058 for 100 or more.",
  },
  {
    question: "How do my machines get to the site?",
    answer: "We pick up, deliver and later return your machines, with charges quoted by quantity. Every unit is moved professionally: fully wrapped so no dust gets in, and bubble-wrapped so it arrives undamaged. Movements follow the hosting contract.",
  },
  {
    question: "Do I have to sell the coins I mine to pay for hosting?",
    answer:
      "No. Hosting is invoiced in USD or AED and settled from your own funds, in USDT, AED or BTC, so every coin your machines mine stays in your wallet. Many clients prefer to hold what they mine and decide for themselves when to sell, instead of selling each month to cover a bill. Coin prices can fall as well as rise and mining results depend on network difficulty, machine efficiency and uptime, so we make no promise of returns: our job is to keep your machines running and your coins yours.",
  },
];
