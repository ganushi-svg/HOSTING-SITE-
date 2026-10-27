# Segments hosting website

## Purpose
Public website for Segments Cloud's Bitcoin-mining hosting service in Dubai, UAE.
Goal: turn prospective hosting clients into enquiries.
Audience: miner owners, funds and fleet operators comparing hosting providers. They care about power cost, uptime, cooling, transparency and reporting.

## Company
- Legal names: Segments Cloud Computing LLC and Segments Cloud Electronics LLC. Use both names wherever a legal entity name appears (footer, terms, privacy). TODO: confirm which entity contracts with hosting clients.
- Office: Office 2712, Concord Tower, Media City, Dubai
- Email: ganushi@segments.ae
- Phone: +971 54 211 9496
- WhatsApp: see `content/contact.md`
- Domain: TODO
- Contact person name and title shown on site: TODO

## Source of truth
Read these before writing or changing any page. If a fact is not in these files, it does not go on the site.

- `content/brand.md` - brand colors, fonts, tone
- `content/services.md` - what hosting includes
- `content/pricing.md` - pricing model
- `content/contract-and-onboarding.md` - contract terms and onboarding steps
- `content/sites.md` - sites, capacity, cooling
- `content/performance.md` - real uptime and client numbers
- `content/contact.md` - address, phone, email, WhatsApp
- `content/references.md` - 2-3 websites I like, for layout and tone only
- `assets/logo/` - logo files
- `assets/photos/` - real site photos and video
- `assets/report-sample/` - sample client report screenshot

Not provided yet (use TODO placeholders, do not invent): FAQ, certifications and licences, testimonials, about-us story, privacy policy and terms of use, Arabic version, analytics.

## Pages
1. Home: hero, proof strip (numbers from `content/performance.md`), services summary, sites teaser, enquiry call to action
2. Services
3. Pricing: present the model from `content/pricing.md`, with a "Request a quote" call to action
4. Sites and infrastructure: sites, capacity, cooling, real photos and video
5. Monitoring and reporting: the redacted sample client report
6. How it works: onboarding steps and contract terms
7. Contact: enquiry form and contact details

## Stack
- Astro + Tailwind CSS, static first. No backend or database until I ask.
- Deploy on Vercel.
- Enquiry form: send to ganushi@segments.ae through Resend. Keep the API key in an environment variable (`RESEND_API_KEY`), never in the repo.
- Define brand colors and fonts once (Tailwind config), then reuse them everywhere.

## Design
- Professional, calm and infrastructure-grade. Trust matters more than flash.
- Mobile-first, readable in light and dark mode, accessible (contrast, alt text, keyboard focus).
- Real photos over stock images. Take layout and tone cues from `content/references.md`, never copy their text or assets.
- Fast: compress images, no heavy libraries without asking.

## Rules (non-negotiable)
- Never invent prices, capacity, uptime, client counts, certifications or testimonials. Every number on the site must trace to a file in `content/`.
- No promises of mining profit, returns or investment language. Describe the hosting service only.
- The sample client report must be redacted: no client names, wallet addresses, IP addresses or worker names. Ask me if a screenshot looks unredacted.
- Describe sites at city or area level only. No exact coordinates, security or access details unless `content/sites.md` explicitly says to publish them.
- Leave visible `TODO` markers for anything missing. Before any deploy, run `grep -rn "TODO" src content` and list what remains.

## Commands
- `npm run dev` - local preview
- `npm run build` - production build, must pass before I review
- `npm run preview` - preview the built site

## How to work with me
- Plan first. For any new page or big change, propose the approach and wait for my approval.
- Ask before adding a dependency or changing the stack.
- Work in small steps and commit with clear messages.
- After each task, run the build, then tell me what changed and which TODOs remain.
- If a source file is empty or unclear, ask me instead of guessing.
