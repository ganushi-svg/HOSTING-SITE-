// Facts shown on the site. Each value names the content/ file it comes from.
// If a fact is not in content/, it stays null and the page shows a TODO marker.

export const company = {
  // CLAUDE.md
  legalNames: ['Segments Cloud Computing LLC', 'Segments Cloud Electronics LLC'],
  brand: 'Segments Cloud',
  serviceArea: 'UAE', // content/contact.md
};

export const contact = {
  // content/contact.md
  office: 'Office 2712, Concord Tower, Media City, Dubai',
  email: 'ganushi@segments.ae',
  phone: '+971 54 211 9496',
  whatsapp: null as string | null, // TODO: content/contact.md
  person: null as string | null, // TODO: content/contact.md
  hours: null as string | null, // TODO: content/contact.md
};

export const pricing = {
  // content/pricing.md
  ratePerKwhUsd: 0.06,
  rateLabel: '$0.060',
};

export const nav = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/sites', label: 'Sites' },
  { href: '/monitoring', label: 'Monitoring' },
  { href: '/how-it-works', label: 'How it works' },
  { href: '/contact', label: 'Contact' },
];

export const sites = {
  // content/sites.md
  activeCount: 8, // TODO: Ganushi to confirm (content/sites.md)
  cooling: ['Air-cooled halls at every site', 'A hydro-cooled zone for hydro models'],
};

export const photos = {
  // content/sites.md › Photos. Files in public/photos, originals in assets/photos.
  hallFanWall: { name: 'hall-fan-wall', w: 1600, h: 1200, alt: 'Row of large exhaust fans along the wall of an air-cooled mining hall during fit-out', caption: 'Exhaust fan wall in an air-cooled hall during fit-out, August 2025' },
  siteExterior: { name: 'site-exterior', w: 960, h: 1280, alt: 'Arched mining halls on open desert ground at a Segments Cloud site', caption: 'Mining halls at a UAE site, September 2025' },
  coolingUnit: { name: 'cooling-unit', w: 1201, h: 1600, alt: 'White louvred equipment unit being installed next to scaffolding', caption: 'Equipment installation on site, September 2025' },
  hydroPumps: { name: 'hydro-pumps', w: 1280, h: 961, alt: 'Water tank with two pumps and pipework beside a hall wall at night', caption: 'Pumps and tank for a hydro-cooled hall during installation, September 2025' },
};

export const services = {
  // content/services.md
  power: ['Power capacity is tracked for every site and zone.', 'Load is read from the fleet platform before new machines are placed.'],
  cooling: ['Air-cooled halls for air-cooled ASICs.', 'A hydro-cooled zone for hydro models.'],
  operations: [
    'On-site hosting technicians and a site in-charge at each site.',
    'In-house repair: pickup from the site, intake and diagnosis at the Segments repair center, quote, repair and return to the rack.',
    'You approve each repair quote before work starts.',
    'Spare fans, PSU fans and cables held in the Segments warehouse.',
  ],
  monitoring: [
    'Every machine tracked on the fleet platform: status, hash rate, last share and repair state.',
    'Your fleet data synced daily.',
    'A monthly power and hosting report with running days, energy and charge for each machine.',
    'A repair log showing every stage of each repair.',
  ],
  modelsAir: ['Antminer S21 XP', 'S21+', 'S21', 'S19 XP', 'L9', 'L7', 'D9', 'KS5', 'Whatsminer M30S++', 'IceRiver AL3'],
  modelsHydro: ['Antminer S21 XP Hydro', 'S21+ Hydro', 'S21 Hydro', 'S19 XP Hydro', 'S19 Pro+ Hydro', 'S19 Pro Hydro'],
};

export const billing = [
  // content/pricing.md › How the charge is calculated
  'Charge per machine = watts × 24 hours × running days ÷ 1,000 × rate.',
  'Running days come from your pool data: an offline machine counts up to its last share.',
  'Days a machine is offline are not charged.',
  'Wattage is the measured or nameplate figure for the model.',
  'Repair costs, if any, appear on the same invoice.',
];
