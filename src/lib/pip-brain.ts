// Pip, the Segments hosting assistant (Ganushi KC, 4 Nov 2026).
// Scripted: every answer is built from the facts in site.ts and models.ts, so Pip can never invent a price,
// a capacity or a promise. Anything it cannot answer is handed to WhatsApp. No mining-profit talk (CLAUDE.md).
import { models, usd } from "./models";
import { capacity, contact, pricing, repair, sites, tierFor } from "./site";

export type PipReply = {
  text: string;
  /** Quick replies shown under the answer. */
  chips?: string[];
  /** A section to offer: "Show me" scrolls there. */
  go?: { id: string; label: string };
  /** Offer the WhatsApp hand-off button. */
  whatsapp?: boolean;
};

export const PIP = {
  name: "Pip",
  role: "Segments hosting assistant",
  greeting: `Hi there! I'm Pip, the Segments hosting assistant. I'm here to help with any enquiries about hosting your miners with us. How can I help you?`,
  starters: ["What does hosting cost?", "Which machines do you host?", "How does repair work?", "How do I get started?", "Talk to a person"],
  whatsappUrl: (topic?: string) => {
    const base = contact.whatsappUrl;
    const msg = topic ? `Hi Segments, I was chatting with Pip on your website about: ${topic.slice(0, 140)}` : "Hi Segments, I was chatting with Pip on your website and would like to talk to someone.";
    return `${base}?text=${encodeURIComponent(msg)}`;
  },
};

const has = (t: string, ...words: (string | RegExp)[]) => words.some((w) => (typeof w === "string" ? t.includes(w) : w.test(t)));
const kwh = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 0 });

const tiersText = pricing.tiers.map((t) => `${t.rateLabel} per kWh for ${t.label.toLowerCase()}`).join(", ");

/** Finds a model named in the text, matching on the name with or without the maker. */
function findModel(t: string) {
  const norm = (s: string) => s.toLowerCase().replace(/antminer|whatsminer|iceriver|bitmain/g, "").replace(/[^a-z0-9+]/g, "");
  const n = norm(t);
  return [...models].sort((a, b) => norm(b.name).length - norm(a.name).length).find((m) => n.includes(norm(m.name)));
}

function quantityIn(t: string) {
  const m = t.match(/(?<![a-z])(\d{1,4})\s*(?:x|×|units?|machines?|miners?|pcs|pieces)?\b/);
  const q = m ? parseInt(m[1], 10) : 0;
  return q > 0 && q < 10000 ? q : 0;
}

export function pipAnswer(input: string): PipReply {
  const t = input.toLowerCase().trim();
  const model = findModel(t);
  const qty = quantityIn(t);

  // Hard rule first: never talk profit or returns.
  if (has(t, "profit", "roi", "return", "earn", "revenue", "income", "payback", "how much will i make", "btc price", "bitcoin price")) {
    return {
      text: "I can't estimate mining revenue or profit, and Segments never promises returns. What I can do is show the hosting power bill for any machine on our list, which is the cost side you control. Want an estimate?",
      chips: ["Estimate power cost", "What does hosting cost?", "Talk to a person"],
      go: { id: "calculator", label: "Power cost calculator" },
    };
  }

  if (has(t, /^(hi|hello|hey|salam|hola|good (morning|afternoon|evening))\b/)) {
    return { text: `Hello! Ask me about pricing, machines, cooling, repair, reporting or how to get started. Or pick one below.`, chips: PIP.starters };
  }
  if (has(t, "thank", "thanks", "shukran", "cheers")) {
    return { text: "You're welcome! If you want to go further, I can connect you with Ganushi on WhatsApp any time.", chips: ["Talk to a person", "How do I get started?"] };
  }
  if (has(t, "who are you", "what are you", "your name", "are you a bot", "are you human", "are you real")) {
    return { text: `I'm Pip, the ${PIP.role}. I'm an automated helper that answers from the facts published on this site. For anything personal or detailed, a real person at Segments picks up on WhatsApp.`, chips: ["Talk to a person", "What does hosting cost?"] };
  }

  // Hand-off to a person.
  if (has(t, "person", "human", "someone", "agent", "manager", "ganushi", "whatsapp", "call", "phone", "number", "email", "contact", "speak", "talk to", "reach")) {
    return {
      text: `Of course. ${contact.person} (${contact.personTitle}) handles hosting enquiries. Call ${contact.phone} during office hours, ${contact.hours}, and WhatsApp the same number after hours. Email: ${contact.email}. Office: ${contact.office}.`,
      whatsapp: true,
      go: { id: "contact", label: "Contact card" },
      chips: ["Request a quote"],
    };
  }
  if (has(t, "quote", "proposal", "enquiry form", "get a price")) {
    return { text: "To get a quote, tell us your machine models and quantity. The fastest way is WhatsApp; the enquiry form on the Contact section works too.", whatsapp: true, go: { id: "contact", label: "Enquiry form" } };
  }

  // A model with a quantity: hosting power estimate from nameplate watts (hosting cost only).
  if (model && (qty || has(t, "cost", "bill", "price", "estimate", "how much", "power", "watt", "kwh", "month"))) {
    const n = qty || 1;
    const tier = tierFor(n);
    const perMachine = (model.watts * 24 * 30) / 1000;
    const fleetKw = (model.watts * n) / 1000;
    const lines = [
      `The ${model.name} is ${model.cooling === "Hydro" ? "a hydro-cooled" : "an air-cooled"} model drawing ${model.watts.toLocaleString("en-US")} W (${model.wattsSource}).`,
      `At ${tier.rateLabel} per kWh (${tier.label.toLowerCase()}) that is about ${kwh(perMachine)} kWh and ${usd(perMachine * tier.rateUsd)} per machine for a 30-day month.`,
    ];
    if (n > 1) lines.push(`For ${n} machines: about ${usd(perMachine * tier.rateUsd * n)} a month for power, a one-off setup fee of ${usd(fleetKw * pricing.setupFeePerKwUsd)} (${pricing.setupFeeLabel}, ${fleetKw.toLocaleString("en-US", { maximumFractionDigits: 1 })} kW) and a deposit of one month of hosting.`);
    lines.push("Days a machine is offline are not charged. This is the hosting cost only, not a mining estimate.");
    return { text: lines.join(" "), go: { id: "calculator", label: "Power cost calculator" }, chips: ["How is the charge calculated?", "Request a quote", "Which machines do you host?"] };
  }
  if (model) {
    return {
      text: `Yes, we host the ${model.name}: ${model.cooling === "Hydro" ? "hydro-cooled, so it goes into a hydro container" : "air-cooled, so it goes into one of our halls"}. Nameplate power ${model.watts.toLocaleString("en-US")} W${model.hashrate ? `, ${model.hashrate}` : ""}, ${model.algorithm} (${model.coins}). Tell me a quantity and I'll estimate the monthly power bill.`,
      chips: [`10 × ${model.name} cost`, "Which machines do you host?", "Request a quote"],
      go: { id: "machines", label: "Machines" },
    };
  }

  if (has(t, "setup fee", "set up fee", "setup", "one-off", "one off", "upfront")) {
    return { text: `The one-off setup fee is ${pricing.setupFeeLabel} of your fleet's power, plus a deposit of one month of hosting. Both are paid in ${pricing.currenciesLabel}. Example: 10 machines at 3,500 W is 35 kW, so a ${usd(3500)} setup fee.`, chips: ["What does hosting cost?", "How do I pay?"], go: { id: "pricing", label: "Pricing" } };
  }
  if (has(t, "deposit")) {
    return { text: `The deposit is ${pricing.depositLabel.toLowerCase()}: one month of hosting for your fleet, paid before the machines are racked.`, chips: ["Setup fee", "How do I pay?"] };
  }
  if (has(t, "pay", "payment", "usdt", "btc", "bitcoin", "aed", "currency", "bank", "cash", "invoice", "billing", "bill ")) {
    return { text: `Payment is in ${pricing.currenciesLabel}, by ${pricing.paymentMethodsLabel}. Invoices are ${pricing.invoicingLabel.toLowerCase()}, and you pay only for the days each machine actually ran.`, chips: ["How is the charge calculated?", "What does hosting cost?"], go: { id: "pricing", label: "Pricing" } };
  }
  if (has(t, "calculated", "formula", "running days", "offline", "downtime", "how is the charge")) {
    return { text: "Each machine is billed as watts × 24 hours × running days ÷ 1,000 × your rate. Running days come from your pool data: an offline machine counts up to its last share, and offline days are not charged.", chips: ["What does hosting cost?", "Show me a sample report"], go: { id: "reporting", label: "Reporting" } };
  }
  if (has(t, "turnkey", "turn key", "build", "own site", "mw", "megawatt", "capex")) {
    return { text: `Turnkey is a dedicated build for larger fleets: power from ${pricing.turnkeyPowerFromLabel} per kWh and capex of ${pricing.turnkeyCapexPerMwLabel} per MW. The detailed terms are set in your proposal, so this one is best discussed with Ganushi directly.`, whatsapp: true, go: { id: "pricing", label: "Turnkey tab" } };
  }
  if (has(t, "price", "pricing", "cost", "rate", "how much", "cheap", "fee", "kwh", "tariff", "charge")) {
    return { text: `Plug and play hosting is ${tiersText}. Power only, billed on the days each machine runs. One-off setup fee ${pricing.setupFeeLabel} plus a deposit of one month. Minimum term ${pricing.minimumTermLabel}.`, chips: ["Setup fee", "Estimate power cost", "How do I pay?"], go: { id: "pricing", label: "Pricing" } };
  }
  if (has(t, "estimate", "calculator", "calculate")) {
    return { text: "Tell me a model and a quantity, for example \"20 × S21 XP\", and I'll work out the monthly power bill. Or use the calculator on the page.", chips: ["20 × S21 XP cost", "10 × S21 XP Hydro cost"], go: { id: "calculator", label: "Power cost calculator" } };
  }

  if (has(t, "minimum", "how many machines", "small", "one machine", "single", "few machines", "quantity")) {
    return { text: `${pricing.minimumFleetLabel}. ${pricing.whoCanHostLabel} can host with us, from a single machine upwards. The rate simply follows your fleet size: ${tiersText}.`, chips: ["What does hosting cost?", "How do I get started?"] };
  }
  if (has(t, "contract", "term", "12 month", "notice", "cancel", "leave", "exit")) {
    return { text: `The minimum term is ${pricing.minimumTermLabel}. Notice period: ${pricing.noticePeriodLabel.toLowerCase()}. Everything is set out in the hosting contract you sign before racking.`, chips: ["How do I get started?", "Talk to a person"], go: { id: "how-it-works", label: "Contract terms" } };
  }

  if (has(t, "repair", "broken", "fail", "fault", "fix", "spare", "warranty", "hashboard", "psu")) {
    return { text: `${repair.summary}`, chips: ["Who pays for repairs?", "Show me the repair steps"], go: { id: "repair", label: "Segments Repair" } };
  }
  if (has(t, "who pays", "repair cost", "repair charge")) {
    return { text: "You approve every repair quote before work starts, and repair costs, if any, appear on the same monthly invoice as your hosting charge.", chips: ["How does repair work?", "How do I pay?"], go: { id: "repair", label: "Segments Repair" } };
  }
  if (has(t, "model", "machine", "miner", "asic", "which", "support", "antminer", "whatsminer", "s21", "s19", "l9", "l7", "ks5", "z15", "d9", "al3", "host ")) {
    const air = models.filter((m) => m.cooling === "Air").map((m) => m.name).join(", ");
    const hydro = models.filter((m) => m.cooling === "Hydro").map((m) => m.name).join(", ");
    return { text: `Air-cooled: ${air}. Hydro-cooled: ${hydro}. Name a model and I'll give you its power draw and monthly hosting cost. Not on the list? Ask us, we may still host it.`, chips: ["Antminer S21+ cost", "S21 XP Hydro cost", "Talk to a person"], go: { id: "machines", label: "Machines" } };
  }

  if (has(t, "hydro", "liquid", "water cool", "immersion", "container")) {
    return { text: "Hydro models are hosted in our hydro containers. Coolant runs through each miner in a sealed loop and gives up its heat in a cooling tower outside; nothing but approved coolant ever enters the loop. Every container gets a nine-step inspection each week.", chips: ["Which machines do you host?", "Air cooling?"], go: { id: "sites", label: "Hydro cooling" } };
  }
  if (has(t, "air", "cooling", "cool", "heat", "temperature", "hot", "dust", "fan", "filter")) {
    return { text: "Air-cooled models run in our halls: fresh air is pulled through mesh pre-filters and evaporative cooling pads, across the racks, and out through exhaust fan walls. Desert dust is the enemy, so filters are cleaned and replaced on a set schedule by the quality team.", chips: ["Hydro cooling?", "Quality checks"], go: { id: "sites", label: "Air cooling" } };
  }
  if (has(t, "where", "site", "location", "abu dhabi", "dubai", "uae", "address", "visit", "capacity")) {
    return { text: `Our hosting sites are ${sites.area}, with ${capacity.totalMw} MW of operating capacity, air-cooled halls at every site and a hydro-cooled zone for hydro models. The office is at ${contact.office}. Site visits are arranged through Ganushi.`, chips: ["Talk to a person", "See the sites"], go: { id: "sites", label: "Sites" } };
  }
  if (has(t, "uptime", "reliab", "downtime guarantee", "sla")) {
    return { text: `Uptime is ${capacity.uptimePct}%. Days a machine is offline are not charged, so our interest and yours are the same: keep it running.`, chips: ["Quality checks", "How does repair work?"], go: { id: "overview", label: "Key figures" } };
  }
  if (has(t, "quality", "maintenance", "inspection", "clean", "check")) {
    return { text: "A dedicated team, Segments Quality Control, runs the maintenance routine: filter cleaning and replacement in the air-cooled halls, a weekly nine-step inspection of every hydro container, and coolant checks with logged values.", chips: ["Hydro cooling?", "How does repair work?"], go: { id: "quality", label: "Quality" } };
  }
  if (has(t, "report", "monitor", "dashboard", "track", "hash", "status", "see my machines", "platform", "sample")) {
    return { text: "Every machine is tracked on our fleet platform: status, hash rate, last share and repair state, synced daily. Each month you get a power and hosting report with running days, energy and charge for every machine, plus a repair log. There's a sample report on the page.", chips: ["How is the charge calculated?", "How does repair work?"], go: { id: "reporting", label: "Sample report" } };
  }
  if (has(t, "deliver", "ship", "shipping", "transport", "pickup", "pick up", "collect", "send my machines", "logistics", "customs", "import")) {
    return { text: `${pricing.deliveryLabel}. Moves follow the hosting contract. For imports from abroad, talk to Ganushi so the paperwork is lined up before the machines ship.`, chips: ["How do I get started?", "Talk to a person"], go: { id: "how-it-works", label: "How it works" } };
  }
  if (has(t, "start", "begin", "onboard", "process", "how does it work", "how it works", "steps", "sign up", "join")) {
    return { text: "Six steps: request a quote with your models and quantity; agree the terms and sign the hosting contract (12 months minimum); pay the setup fee and one-month deposit; we collect and deliver your machines, fully wrapped; they're racked and appear on the fleet platform; then each month you get your invoice and report.", chips: ["Request a quote", "Setup fee", "Talk to a person"], go: { id: "how-it-works", label: "How it works" } };
  }
  if (has(t, "hours", "open", "when", "time", "office")) {
    return { text: `Office hours are ${contact.hours}. Call ${contact.phone} in those hours; after hours, WhatsApp the same number and we'll reply.`, whatsapp: true, go: { id: "contact", label: "Contact card" } };
  }
  if (has(t, "segments", "company", "about", "since", "experience", "history", "who is")) {
    return { text: `Segments Cloud has mined Bitcoin for its own account since 2017 and today operates ${capacity.totalMw} MW at sites ${sites.area}, hosting both air-cooled and hydro machines, with a site in-charge and technicians at every site and an in-house repair center.`, chips: ["What does hosting include?", "Talk to a person"], go: { id: "services", label: "Services" } };
  }
  if (has(t, "include", "service", "what do you offer", "what do i get")) {
    return { text: "Hosting includes space in an air-cooled hall or hydro container, power, cooling, on-site technicians, in-house repair with quotes you approve, monitoring of every machine and a monthly power and hosting report.", chips: ["What does hosting cost?", "How does repair work?"], go: { id: "services", label: "Services" } };
  }

  return {
    text: "I'm not sure about that one. I can help with pricing, machines, cooling, sites, quality, repair, reporting and how to get started. For anything else, Ganushi will answer you personally on WhatsApp.",
    chips: PIP.starters,
    whatsapp: true,
  };
}
