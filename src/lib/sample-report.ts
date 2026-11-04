// Sample client report with illustrative figures (Ganushi KC, 4 Nov 2026: not real client data).
// Models and nameplate watts come from content/models.md via models.ts; running days are example values chosen to show
// the four situations a report can contain. Charges use the example rate inside the plug and play range (content/pricing.md).
// The report layout mirrors the real monthly report (content/services.md › Monitoring): running days, energy and charge per machine.
import { models } from "./models";
import { pricing } from "./site";

export const reportMeta = {
  title: "Monthly power and hosting report",
  period: "Example month, 30 days",
  billingHours: 24,
  days: 30,
  rate: pricing.sampleRateUsd,
};

const watts = (slug: string) => models.find((m) => m.slug === slug)?.watts ?? 0;

type Status = "running" | "partial" | "offline" | "new";

const raw: { unit: string; model: string; watts: number; runningDays: number; status: Status; basis: string; notes: string }[] = [
  { unit: "Unit 1", model: "Antminer S21+", watts: watts("antminer-s21-plus"), runningDays: 30, status: "running", basis: "Shares every day of the month", notes: "No events" },
  { unit: "Unit 2", model: "Antminer L9", watts: watts("antminer-l9"), runningDays: 26.5, status: "partial", basis: "Last share day 27, back on day 30", notes: "Fan replaced, repair logged" },
  { unit: "Unit 3", model: "Antminer S19 XP", watts: watts("antminer-s19-xp"), runningDays: 0, status: "offline", basis: "No shares this month", notes: "At Segments Repair, quote sent" },
  { unit: "Unit 4", model: "Antminer S21 XP Hydro", watts: watts("antminer-s21-xp-hydro"), runningDays: 12, status: "new", basis: "Racked on day 19", notes: "First month, pro-rated" },
];

export const reportRows = raw.map((r) => {
  const kwh = (r.watts * reportMeta.billingHours * r.runningDays) / 1000;
  return { ...r, downtimeDays: +(reportMeta.days - r.runningDays).toFixed(1), kwh, charge: kwh * reportMeta.rate };
});

export const reportTotals = reportRows.reduce(
  (t, r) => ({ machines: t.machines + 1, runningDays: t.runningDays + r.runningDays, kwh: t.kwh + r.kwh, charge: t.charge + r.charge }),
  { machines: 0, runningDays: 0, kwh: 0, charge: 0 },
);

export const statusLabel: Record<Status, string> = { running: "Ran all month", partial: "Partly offline", offline: "Offline, not charged", new: "Racked mid-month" };
