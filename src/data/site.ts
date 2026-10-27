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
