// Privacy notice and terms of use (Ganushi KC, 12 Nov 2026: "provide the common one, get an idea from www.segments.ae").
// Drafted from the structure of the privacy policy and terms on www.segments.ae (read 12 Nov 2026), rewritten for what
// this site actually does: an enquiry form, Pip (answers through Claude), WhatsApp links and browser storage for Pip.
// No analytics or advertising tools run on this site. Both texts are drafts for the company's legal advisor to approve
// before the public launch (CLAUDE.md › Before public launch). Facts come from site.ts and content/.
import { contact, legal, pricing } from "./site";

export type LegalSection = { heading: string; body: string[] };

export const legalUpdated = "12 November 2026";

export const privacyNotice: LegalSection[] = [
  {
    heading: "Who is responsible",
    body: [
      `${legal.contractingEntity} ("Segments"), ${contact.office}, is responsible for the personal data collected through this website. Questions about your data: ${contact.email}.`,
    ],
  },
  {
    heading: "What we collect",
    body: [
      "From the enquiry form: your name, work email, company, fleet tier, machine models and message, and your agreement to be contacted.",
      "From Pip, our hosting assistant: the messages you type. If you ask Pip to send an enquiry for you, the details you confirm are sent to our team like a form enquiry.",
      "Technical data: your IP address, used briefly to limit the number of messages and enquiries from one connection, and the standard request logs kept by our hosting provider.",
    ],
  },
  {
    heading: "Why we use it",
    body: [
      "To reply to your hosting enquiry, prepare a quote and, if you go ahead, set up your hosting contract. We rely on your consent, given in the form, and on the steps you ask us to take before a contract.",
      "To keep the site secure and prevent spam and abuse.",
      "We do not sell your data and do not use it for advertising.",
    ],
  },
  {
    heading: "Who receives it",
    body: [
      `The ${contact.person ? `sales team, including ${contact.person}, our ${contact.personTitle},` : "sales team"} and the operations team who prepare your quote.`,
      "Service providers who run parts of the site for us: Vercel (website hosting), Resend (delivers form enquiries by email) and Anthropic (generates Pip's answers from the messages you type). If you choose to contact us on WhatsApp, WhatsApp's own terms apply to that chat.",
      "These providers may process data outside the UAE, only to provide their service to us.",
    ],
  },
  {
    heading: "What your browser stores",
    body: [
      "This site sets no analytics or advertising cookies. Your browser keeps where you placed Pip on the screen, and, for the current visit only, whether Pip's welcome card and tips were already shown. This stays in your browser and is never sent to us.",
    ],
  },
  {
    heading: "How long we keep it",
    body: [
      "Only as long as we need it for the purposes above, for your hosting contract if you become a client, and for our legal, dispute and accounting obligations.",
    ],
  },
  {
    heading: "Your rights",
    body: [
      `You can ask to see, correct or delete your data, object to its use or withdraw your consent at any time by emailing ${contact.email}. We reply under applicable UAE data protection law.`,
    ],
  },
];

export const termsOfUse: LegalSection[] = [
  {
    heading: "About these terms",
    body: [
      `This website is operated by ${legal.contractingEntity} ("Segments"), ${contact.office}. These terms apply to your use of the site, the calculator and Pip. Hosting itself is provided only under a signed hosting contract, which prevails over anything on this site.`,
    ],
  },
  {
    heading: "Rates, capacity and specifications",
    body: [
      "Rates, power capacity, timelines and machine specifications on this site are given in good faith for information. They are confirmed only in your written quote and hosting contract.",
      "The calculator estimates your hosting power bill only. It is not an offer, and your actual charge is the one on your monthly invoice.",
    ],
  },
  {
    heading: "Hosting contracts",
    body: [
      `Every hosting client signs a written contract with ${legal.contractingEntity}. ${legal.signing}`,
      `Plug and play hosting has a minimum term of ${pricing.minimumTermLabel}, a setup fee of ${pricing.setupFeeLabel} and a deposit of one month of hosting, as set out in the contract. Hosting starts once the site has capacity for your machines and the contract, setup fee and deposit are in place.`,
    ],
  },
  {
    heading: "Mining risk",
    body: [
      "Segments provides hosting: power, cooling, operations and repair for your machines. Mining results depend on network difficulty, coin prices, pool performance, machine efficiency and uptime. Coin prices can fall as well as rise, and we make no promise of profit or returns. Nothing on this site is financial or investment advice.",
    ],
  },
  {
    heading: "Pip, our hosting assistant",
    body: [
      "Pip is an automated assistant that answers from the facts published on this site. Its answers can be incomplete, so rely on your quote and contract for anything binding, and do not share passwords, wallet keys or payment details in the chat.",
    ],
  },
  {
    heading: "Acceptable use",
    body: [
      "Do not use this site, the form or Pip for unlawful activity, fraud, sanctions evasion, spam, interference with the site, or to misrepresent your identity or the source of your funds.",
    ],
  },
  {
    heading: "Names, photos and logos",
    body: [
      "The Segments name, logo, site photos and videos belong to Segments. Manufacturer names, product images and logos (such as Bitmain, Antminer, IceRiver, MicroBT and Whatsminer) belong to their owners and are shown only to identify the machines we host.",
    ],
  },
  {
    heading: "Liability",
    body: [
      "The site is provided as it is. As far as the law allows, Segments is not liable for losses from relying on the information on this site; liability for hosting is set by your hosting contract.",
    ],
  },
  {
    heading: "Governing law and contact",
    body: [
      `These terms are governed by the laws of the United Arab Emirates as applied in the Emirate of Dubai. Questions about these terms: ${contact.email}.`,
    ],
  },
];
