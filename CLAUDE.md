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
- `content/models.md` - machine models, nameplate power, algorithm
- `content/quality.md` - quality team, maintenance routines and standards
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
8. Models: one page per machine model (featured: Antminer Z15 Pro), from `content/models.md`
9. Turnkey: turnkey solution pricing and enquiry, from `content/pricing.md`
10. Quality: the dedicated quality team for sites and machines, from `content/quality.md`

## Stack
- Next.js 16 (App Router) + React 19 + TypeScript, Tailwind CSS 4 installed; styling and design tokens live in `src/app/globals.css`. Switched from Astro on 28 Oct 2026 (Ganushi's decision), based on the supplied crypto-mining-hosting starter kit.
- All facts in `src/lib/site.ts`, each naming its `content/` source. Pages in `src/app/*/page.tsx`. Favour Server Components; `"use client"` only for Nav, LeadForm, Reveal and SiteVideo. Miner and hydro-loop graphics are SVG illustrations, labelled as such, never product photos.
- Deploy on Vercel. Preview builds are `noindex` until `NEXT_PUBLIC_ALLOW_INDEXING=true` is set at launch.
- Enquiry form: `src/app/api/enquiry/route.ts` sends to ganushi@segments.ae through Resend. Keys in environment variables only (`RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `RESEND_TO_EMAIL`), never in the repo and never prefixed `NEXT_PUBLIC_`.
- Before public launch: shared rate limiting (e.g. Upstash), a bot check (e.g. Cloudflare Turnstile), verified sender domain with DMARC, legally approved privacy notice and terms.

## Design
- Professional, calm and infrastructure-grade. Trust matters more than flash.
- Dark premium look in Segments navy, blue and gold (Segments Cloud Design System, console theme). Gold is for the main call to action only. Mobile-first, accessible (4.5:1 contrast, alt text, keyboard focus, one H1 per page), respects reduced motion.
- The hero rack graphic is concept art and is labelled as such; never present it as a real site.
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
- `npm run lint` and `npm run typecheck` - must pass
- `npm run build` - production build, must pass before I review
- `npm start` - serve the production build

## How to work with me
- Plan first. For any new page or big change, propose the approach and wait for my approval.
- Ask before adding a dependency or changing the stack.
- Work in small steps and commit with clear messages.
- After each task, run the build, then tell me what changed and which TODOs remain.
- If a source file is empty or unclear, ask me instead of guessing.
