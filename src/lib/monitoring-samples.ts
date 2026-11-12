// Sample monitoring views (Ganushi KC, 12 Nov 2026: "all three sample in a very good way where clients won't get
// disturbed"). Cleaned-up samples of three internal dashboards: the sites operations status deck, the Foreman site power
// planner and the repair-team monitoring board. Every figure here is ILLUSTRATIVE, not a live reading and not client
// data; halls, clients and jobs carry generic labels, and no site name, person, IP or wallet appears
// (content/services.md › Monitoring samples). The page labels each view "Sample view · illustrative figures".

export type Kpi = { label: string; value: string; note?: string };
export type Pill = "ok" | "watch" | "risk" | "info";

export const siteStatusSample = {
  title: "Site status",
  intro: "How a site looks to our operations team: machines reporting, health, temperatures and anything that needs a look.",
  kpis: [
    { label: "Machines reporting", value: "468" },
    { label: "Healthy", value: "97.4%" },
    { label: "Offline, last 24 h", value: "3" },
    { label: "Back from repair, 2 weeks", value: "21" },
    { label: "Median max chip temp", value: "73 °C" },
    { label: "Fleet data synced", value: "Daily" },
  ] as Kpi[],
  tempLimit: 80,
  temps: [
    { hall: "Hall A", c: 71 },
    { hall: "Hall B", c: 74 },
    { hall: "Hall C", c: 76 },
    { hall: "Hall D", c: 72 },
    { hall: "Hall E", c: 78 },
    { hall: "Hall F", c: 70 },
  ],
  halls: [
    { hall: "Hall A", status: "Normal", pill: "ok" as Pill, miners: 96, note: "All machines hashing" },
    { hall: "Hall B", status: "Normal", pill: "ok" as Pill, miners: 84, note: "Pads cleaned this week" },
    { hall: "Hall E", status: "Watch", pill: "watch" as Pill, miners: 72, note: "Intake filters booked for change" },
    { hall: "Hall F", status: "Normal", pill: "ok" as Pill, miners: 64, note: "Two units back from repair" },
  ],
};

export const powerSample = {
  title: "Power headroom",
  intro: "Before a single machine is placed we check the hall's power: supply, a safety margin, the load already running and what is left.",
  kpis: [
    { label: "Supply capacity", value: "1,200 kW" },
    { label: "Safety margin", value: "15%" },
    { label: "Usable", value: "1,020 kW" },
    { label: "Running load", value: "870 kW" },
    { label: "Safe headroom", value: "150 kW" },
    { label: "Fleet efficiency", value: "17.5 J/TH" },
  ] as Kpi[],
  // One stacked bar of the supply: what runs now, what is free, and the margin we never use (kW).
  bar: [
    { key: "miners", label: "Miners", kw: 780 },
    { key: "cooling", label: "Cooling", kw: 70 },
    { key: "other", label: "Other loads", kw: 20 },
    { key: "free", label: "Safe headroom", kw: 150 },
    { key: "margin", label: "Safety margin", kw: 180 },
  ],
  halls: [
    { hall: "Hall 1", capacity: 400, load: 300, headroom: 40 },
    { hall: "Hall 2", capacity: 450, load: 330, headroom: 52 },
    { hall: "Hall 3", capacity: 350, load: 240, headroom: 58 },
  ],
};

export const repairSample = {
  title: "Repair tracking",
  intro: "Every repair is a ticket you can follow, from pickup at the rack to the machine hashing again.",
  kpis: [
    { label: "Open repair jobs", value: "12" },
    { label: "Within target time", value: "92%" },
    { label: "Quotes awaiting approval", value: "2" },
    { label: "In final testing", value: "3" },
    { label: "Back on the rack this week", value: "9" },
  ] as Kpi[],
  // Jobs at each of the five repair steps shown on the site (content/services.md › Operations and repair).
  stages: [
    { stage: "Site Pickup", jobs: 2 },
    { stage: "Intake & Diagnosis", jobs: 3 },
    { stage: "Quote Approval", jobs: 2 },
    { stage: "Repair", jobs: 3 },
    { stage: "Return to Rack & Verification", jobs: 2 },
  ],
  jobs: [
    { ticket: "RT-1042", client: "Client 01", model: "Antminer S21 XP", fault: "Fan", stage: "Return to Rack", sla: "On track", pill: "ok" as Pill },
    { ticket: "RT-1043", client: "Client 02", model: "Antminer S21+ Hydro", fault: "Hashboard", stage: "Repair", sla: "On track", pill: "ok" as Pill },
    { ticket: "RT-1044", client: "Client 03", model: "Antminer L9", fault: "Power supply", stage: "Quote Approval", sla: "Awaiting you", pill: "info" as Pill },
    { ticket: "RT-1045", client: "Client 01", model: "Antminer S19 XP", fault: "Network", stage: "Intake & Diagnosis", sla: "On track", pill: "ok" as Pill },
    { ticket: "RT-1046", client: "Client 04", model: "Antminer KS5", fault: "Control board", stage: "Repair", sla: "At risk", pill: "risk" as Pill },
  ],
};
