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
- Contact person shown on site: Ganushi KC, Operations Manager (4 Nov 2026)

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
The site is ONE page (Ganushi, 3 Nov 2026), styled after the Segments Cloud Design System reference she shared. A sticky header holds the logo and the quote button; a floating glass dock at the bottom of the screen (Ganushi, 4 Nov 2026) has one tab per section, a lit pill on the section being read and a slider-style scroll-progress line with a knob that runs from blue to gold (4 Nov 2026). Some sections have their own sub-tabs. Old page addresses (/pricing, /turnkey, /models/... and so on) redirect to the matching section in `next.config.ts`.
1. Overview: glowing navy hero with a globe (realistic shaded Earth with arcs from client regions in Europe and the USA into Segments, Abu Dhabi; no client count shown) and the plug and play rate card, then key figures (numbers from `content/performance.md`)
2. Services: what hosting includes
3. Pricing: plug and play and turnkey plan cards from `content/pricing.md`; sub-tabs How billing works / Turnkey / Compare
4. Power cost: calculator for the hosting power bill only (never mining revenue or profit), with the representative miner render (CalcMiner) that dissolves into a pre-traced blueprint (public/miners/turntable/*-blueprint.webp), powers up (current in, fans or coolant running) and settles back each time a value changes (Ganushi, 4 Nov 2026)
5. Machines: sub-tabs Air-cooled / Hydro-cooled, a table of every model from `content/models.md` (featured: Antminer Z15 Pro) beside the representative turntable render
6. Sites: sub-tabs Finished halls / Hydro cooling / Air cooling, with real photos and video (hydro containers, hydro racks and two hydro videos in the Hydro tab)
7. Quality: the dedicated team "Segments Quality Control" with its logo, from `content/quality.md`; sub-tabs Air-cooled halls / Hydro containers / Coolant / Calendar
8. Repair: "Segments Repair", the in-house repair center, with its logo, video and the six-step repair process (Ganushi, 4 Nov 2026)
9. Reporting: monitoring and a sample client report with illustrative figures (not client data, Ganushi 4 Nov 2026)
10. How it works: a six-step zig-zag onboarding journey (from content/contract-and-onboarding.md) and the contract terms
11. FAQ
12. Contact: a digital visiting card for Ganushi KC (Operations Manager, with photo and a downloadable vCard) with Call (office hours 10 AM–6 PM) and WhatsApp (after hours) buttons on +971 54 211 9496, enquiry form and the draft privacy notice

## Stack
- Next.js 16 (App Router) + React 19 + TypeScript, Tailwind CSS 4 installed; styling and design tokens live in `src/app/globals.css`. Switched from Astro on 28 Oct 2026 (Ganushi's decision), based on the supplied crypto-mining-hosting starter kit.
- All facts in `src/lib/site.ts` and `src/lib/models.ts`, each naming its `content/` source. The single page is `src/app/page.tsx`. Favour Server Components; `"use client"` only for Nav (section tabs), Tabs (sub-tabs), PowerCalculator, LeadForm, Reveal, SiteVideo, MinerTurntable, Spotlight (cursor glow) and CountUp. Model cards and pages show a turntable render on an acrylic glowing stage: one hydro render for all hydro models, one air-cooled render for all others (public/miners/turntable, supplied by Ganushi 30 Oct 2026), captioned as representative renders. The Hydro cooling and Air cooling tabs each have a plain-language explainer (CoolingExplainer: what the system is, how it differs, benefits) in place of the old hydro-loop illustration (Ganushi, 4 Nov 2026). Never present a render or illustration as a product photo.
- Deploy on Vercel. Preview builds are `noindex` until `NEXT_PUBLIC_ALLOW_INDEXING=true` is set at launch.
- Enquiry form: `src/app/api/enquiry/route.ts` sends to ganushi@segments.ae through Resend. Keys in environment variables only (`RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `RESEND_TO_EMAIL`), never in the repo and never prefixed `NEXT_PUBLIC_`.
- Before public launch: shared rate limiting (e.g. Upstash), a bot check (e.g. Cloudflare Turnstile), verified sender domain with DMARC, legally approved privacy notice and terms.

## Design
- Professional, calm and infrastructure-grade. Trust matters more than flash.
- "Midnight Glow" theme (Ganushi, 3 Nov 2026), on the Segments Cloud Design System layout: always dark, a deep navy-to-black ground with fixed blue glows and a faint grid, glass panels edged in glowing blue hairlines with a cursor spotlight, a live grid and scanning light in the hero, glowing tabs, and key numbers that count up into view. Space Grotesk headings, Inter body, JetBrains Mono for numbers. Rich motion. A faint, pre-tinted print of the hydro racks sits behind the page with an occasional acrylic shine (public/brand/watermark-hydro.webp). Performance rule (4 Nov 2026): keep motion to transform and opacity; no animated filters, box-shadows, conic gradients or full-screen moving layers, and no backdrop blur on content panels, so the site videos play without dropped frames. Gold is for the main call to action only; primary buttons are lit gold pills with a light sweep and a sliding arrow (4 Nov 2026). Mobile-first, accessible (4.5:1 contrast, alt text, keyboard focus, one H1 per page). Motion stays on for everyone (Ganushi, 29 Oct 2026); visitors with reduced motion set get a slower, softer version, never none. The installed-miners video was replaced by a photo (Ganushi, 4 Nov 2026); all site videos play as silent loops with no controls or play buttons (Ganushi, 4 Nov 2026). Each video plays only while on screen.
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
