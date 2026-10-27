// Redacted extract of a real client report (content/services.md › Monitoring).
// Source: Drive › September 2026 power and hosting report, Sheet 1, first two rows.
// Removed: client name, worker IDs, serial numbers, asset tags, IP addresses, pool addresses, site codes.
// Charges recalculated at the published rate (content/pricing.md); watts and days are as reported.

export const RATE = 0.06;

export const reportMeta = {
  title: 'Monthly power and hosting report',
  period: '01 Sep – 30 Sep 2026 (30 days)',
  billingHours: 24,
};

type Row = { unit: string; model: string; watts: number; runningDays: number; uptimeBasis: string; basis: string; notes: string };

const raw: Row[] = [
  { unit: 'Unit 1', model: 'Antminer L9 (17G)', watts: 3360, runningDays: 28.2, uptimeBasis: '94.00%', basis: 'Ran 1 Sep → last share 29 Sep', notes: 'PSU repair logged 2 Sep; offline 29 Sep' },
  { unit: 'Unit 2', model: 'Antminer S21+ (235T)', watts: 3564, runningDays: 0, uptimeBasis: '0.00%', basis: 'Offline all of September', notes: 'Offline since 28 Jun; PSU repair 8 Sep' },
];

export const reportRows = raw.map((r) => {
  const kwh = (r.watts * reportMeta.billingHours * r.runningDays) / 1000;
  return { ...r, downtimeDays: +(30 - r.runningDays).toFixed(1), kwh, charge: kwh * RATE };
});
