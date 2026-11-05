# Segments hosting website

## Purpose
Public website for Segments Cloud's Bitcoin-mining hosting service in Dubai, UAE.
Goal: turn prospective hosting clients into enquiries.
Audience: miner owners, funds and fleet operators comparing hosting providers. They care about power cost, uptime, cooling, transparency and reporting.

## Company
- Legal names: Segments Cloud Computing LLC and Segments Cloud Electronics LLC. Use both names wherever a legal entity name appears (footer, terms, privacy). TODO: confirm which entity contracts with hosting clients.
- Office: Office 2712, Concord Tower, Media City, Dubai
- Email shown on site: marie@segments.ae (enquiries still delivered to ganushi@segments.ae until segments.ae is verified in Resend)
- Phone: +971 52 836 4053
- WhatsApp: see `content/contact.md`
- Domain: TODO
- Contact person shown on site: Marie, Sales Advisor (5 Nov 2026; replaced Ganushi KC, Operations Manager)

## Source of truth
Read these before writing or changing any page. If a fact is not in these files, it does not go on the site.

- `content/brand.md` - brand colors, fonts, tone
- `content/services.md` - what hosting includes
- `content/pricing.md` - pricing model
- `content/contract-and-onboarding.md` - contract terms and onboarding steps
- `content/sites.md` - sites, capacity, cooling
- `content/cooling-structure.md` - layer-by-layer structure of the air hall (drawing SC-CH-01) and hydro container, for the interactive section drawings
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
The site is ONE page (Ganushi, 3 Nov 2026) in a six-section executive flow (Ganushi, 4 Nov 2026), styled after the Segments Cloud Design System reference she shared. A sticky header holds the logo and the quote button; a floating glass dock at the bottom of the screen has one tab per section (Overview, Infrastructure, Pricing, Calculator, FAQ, Contact), a lit pill on the section being read and a slider-style scroll-progress line. Old page addresses (/pricing, /turnkey, /models/... and so on) redirect to the matching section in `next.config.ts`.
1. Overview (#overview): glowing navy hero with a rotating globe (canvas-drawn Earth from public/brand/earth-tex.webp; country-labelled client cities in the USA and Europe send pulsing light rays into Segments, Abu Dhabi; no client count shown) and two CTAs, then the four key figures (45 MW, Abu Dhabi, 95% uptime, 3,000+ machines; numbers from `content/performance.md`). The inline rate-card aside was removed on 4 Nov 2026.
2. Infrastructure (#infrastructure), "Abu Dhabi Infrastructure & Operations": four cards (#161022, #2D2342, rounded-2xl, at most three points each) that replace the former Services, Sites, Quality, Repair, Reporting and How-it-works sections: 45 MW across Abu Dhabi; air and hydro cooling built for the UAE heat; in-house Bitmain-trained repair (Site Pickup → Intake & Diagnosis → Quote Approval → Repair by Bitmain-trained technicians → Return to Rack & Verification; never "certified"); transparent pool-synced billing (daily sync, monthly per-machine report, offline days billed $0). Below the cards, "The two setups" (Ganushi, 4 Nov 2026): Air-cooled hall / Hydro container tabs, each the interactive layer-by-layer section drawing (CoolingLayout, ten numbered layers, animated air or coolant flow; content/cooling-structure.md). Three real site photos follow. The retired section components (CoolingLayout, CoolingExplainer, SampleReport, MinerTurntable, Faq, SiteVideo, Tabs, PipeViz art) stay in src/components for reuse.
3. Pricing (#pricing): the Plug and play and Turnkey cards (the Turnkey card lists the capex and the agreed terms: client-owned per agreement, 1 MW, 60 – 90 days, 24 – 36 months), a compact four-item "Key terms & settlement" bar (setup fee USD 100 per kW, deposit one month of power, minimum term 12 months, settlement USD or AED by USDT, AED or BTC from the client's own funds, so they keep 100% of the coins they mine) and the "Why miners host with Segments" strip (title, lead and the prices-can-fall note; its four points were dropped on 4 Nov 2026 because they repeated the Infrastructure and pricing cards, and `whyHost.points` stays in site.ts). Nothing on the page says Segments "never takes" mined coins: BTC is an accepted settlement method, so the wording is always "never asked to pay hosting in the coins you mine" (content/pricing.md). The old three-tab pricing tables were removed (4 Nov 2026).
4. Calculator & supported hardware (#calculator): the power-cost calculator (hosting power bill only, never mining revenue or profit) with the representative miner render (CalcMiner: dissolves into a pre-traced blueprint and powers up on each change) and the preset pills, then the machines table (MachinesTable: five flagship models by default, "Show all 16 models" toggle, Estimate button per row pre-fills the calculator; every model from `content/models.md` with its hash rate). Each Antminer row has a small thumbnail of Bitmain's official shop image, cut out with Adobe's background removal (public/miners/thumbs; Ganushi, 5 Nov 2026); the Whatsminer row shows a neutral fan tile (no MicroBT image permission). Specs were checked against shop.bitmain.com on 5 Nov 2026 (content/models.md).
5. FAQ (#faq): the first six `faqs` as collapsible accordions (#161022, #C084FC when open). All answers stay in the HTML; the remaining faqs stay in site.ts for Pip.
6. Contact (#contact): a digital visiting card for Marie (Sales Advisor, with photo and a downloadable vCard; Ganushi 5 Nov 2026) with Call (office hours 10 AM–6 PM) and WhatsApp (after hours) buttons on +971 52 836 4053, the enquiry form (Fleet tier dropdown: Under 50, 50–99, 100+ Plug & Play, Turnkey MW; a confirmation panel replaces the form after a successful send) and the draft privacy notice. The TODO component renders nothing on the page for the presentation; the markers stay in code and `grep -rn TODO src content` still lists them.
7. Pip (Ganushi, 4 Nov 2026): an animated hosting assistant in the bottom-right corner. With `ANTHROPIC_API_KEY` set (Vercel environment variable, never in the repo), `src/app/api/pip/route.ts` answers through Claude (`claude-opus-5-5`, `@anthropic-ai/sdk`, approved by Ganushi 4 Nov 2026) briefed only with the facts in `src/lib/pip-briefing.ts` (built from site.ts and models.ts) and four actions: estimate_power_cost (computed by our code), show_section (the six section ids), whatsapp_handoff (+971 52 836 4053, Marie, topic prefilled) and send_enquiry (emails the enquiry inbox through the shared `src/lib/enquiry.ts` after the visitor confirms). Guardrails in the briefing: hosting only, no profit or returns, no invented numbers, unknowns go to WhatsApp; 20 messages per conversation, 240 characters each, per-IP rate limit. Without the key, or if the call fails, the browser falls back to the scripted `src/lib/pip-brain.ts`. Pip is a full-body character (round body, arms with gold hands, legs with gold feet, antenna) standing on a glowing disc; it waves and says "Hi there! I'm Pip" 1.4 s after the page loads, its eyes follow the pointer, and it hops with a grin after a completed action. Visitors can drag Pip anywhere (position kept in localStorage); the chat panel never covers Pip. The WhatsApp pill sits clear above Pip. Moods: idle, wave, think (with a "Pip is thinking…" label), talk, happy, listen; all motion is transform and opacity.

## Stack
- Next.js 16 (App Router) + React 19 + TypeScript, Tailwind CSS 4 installed; styling and design tokens live in `src/app/globals.css`. Switched from Astro on 28 Oct 2026 (Ganushi's decision), based on the supplied crypto-mining-hosting starter kit.
- All facts in `src/lib/site.ts` and `src/lib/models.ts`, each naming its `content/` source. The single page is `src/app/page.tsx`. Favour Server Components; `"use client"` only for Nav (section tabs), Tabs (sub-tabs), PowerCalculator, LeadForm, Reveal, SiteVideo, MinerTurntable, Spotlight (cursor glow), CountUp, Pip (the assistant), Globe (canvas), CoolingLayout (layer picker), Faq (question rail) and PhotoLightbox. Model cards and pages show a turntable render on an acrylic glowing stage: one hydro render for all hydro models, one air-cooled render for all others (public/miners/turntable, supplied by Ganushi 30 Oct 2026), with no visible "representative render" caption or tag anywhere (removed at Ganushi's request, 4 Nov 2026; the alt text keeps the wording). The Hydro cooling and Air cooling tabs each have a plain-language explainer (CoolingExplainer: what the system is, how it differs, benefits; the closing "your machine model decides" line was removed at Ganushi's request, 4 Nov 2026) in place of the old hydro-loop illustration (Ganushi, 4 Nov 2026). Do not describe a render or illustration as a product photo in text or alt text.
- Deploy on Vercel. Preview builds are `noindex` until `NEXT_PUBLIC_ALLOW_INDEXING=true` is set at launch.
- SEO (Ganushi, 4 Nov 2026): title template, description, keywords, canonical, Open Graph and Twitter cards, a generated social image, robots and sitemap (src/app), and JSON-LD for Organization (with contact point), WebSite, Service (price from `pricing.plugFromUsd` per kWh), FAQPage (all `faqs`) and BreadcrumbList (all sections), built only from site.ts so no value is invented. One H1; every image has alt text. Launch checklist: set `NEXT_PUBLIC_SITE_URL` to the real domain and `NEXT_PUBLIC_ALLOW_INDEXING=true`, add the domain in Google Search Console and submit /sitemap.xml, and replace the preview address in the canonical and sitemap by setting the site URL.
- Enquiry form: `src/app/api/enquiry/route.ts` validates and `src/lib/enquiry.ts` sends to `contact.enquiryInbox` (ganushi@segments.ae, or RESEND_TO_EMAIL) through Resend (Pip's send_enquiry action uses the same sender). Keys in environment variables only (`RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `RESEND_TO_EMAIL`, `ANTHROPIC_API_KEY`), never in the repo and never prefixed `NEXT_PUBLIC_`.
- Before public launch: shared rate limiting (e.g. Upstash), a bot check (e.g. Cloudflare Turnstile), verified sender domain with DMARC, legally approved privacy notice and terms.

## Design
- Professional, calm and infrastructure-grade. Trust matters more than flash.
- Colour palette: "Segments purple" (Ganushi, 4 Nov 2026, content/brand.md): void #0B0711, surface #161022, border #2D2342, ice-white #F8FAFC, muted #94A3B8, Deep Violet #7C3AED for the primary CTA, Electric Orchid #C084FC for active states, key numbers and badges, Cyan #22D3EE only for live calculator outputs. Tokens are at the top of globals.css and the component layer is the "Segments purple theme" block at its end. Layout and motion below still apply; where they say blue or gold, read violet or orchid.
- "Midnight Glow" layout (Ganushi, 3 Nov 2026), on the Segments Cloud Design System layout: always dark, a deep navy-to-black ground with fixed blue glows and a faint grid, glass panels edged in glowing blue hairlines with a cursor spotlight, a live grid and scanning light in the hero, glowing tabs, and key numbers that count up into view. Space Grotesk headings, Inter body, JetBrains Mono for numbers. Rich motion. A faint, dimmed print of the hydro racks sits behind the page (public/brand/watermark-hydro.webp); its acrylic shine, the hero scanning beam and the card sheens were removed on 4 Nov 2026 (Ganushi: no reflex motion in the background, softer glow). Every box has a blue hairline inside and a faint gold hairline outside; boxes wrapped in Reveal run a gold light once around their frame each time they scroll into view. Performance rule (4 Nov 2026): keep motion to transform and opacity; no animated filters, box-shadows, conic gradients or full-screen moving layers, and no backdrop blur on content panels, so the site videos play without dropped frames. Deep Violet is for the main call to action only; primary buttons are violet pills with a soft purple glow, a light sweep and a sliding arrow (4 Nov 2026). Mobile-first, accessible (4.5:1 contrast, alt text, keyboard focus, one H1 per page). Motion stays on for everyone (Ganushi, 29 Oct 2026); visitors with reduced motion set get a slower, softer version, never none. The installed-miners video was replaced by a photo (Ganushi, 4 Nov 2026); all site videos play as silent loops with no controls or play buttons (Ganushi, 4 Nov 2026). Each video plays only while on screen.
- Real photos over stock images. Every site photo opens full screen in the PhotoLightbox (layout-mounted; arrows, swipe and keyboard move through the photos visible on the page); on hover a photo shows its caption and a gold zoom badge with a blue-and-gold inner frame (Ganushi, 4 Nov 2026). Take layout and tone cues from `content/references.md`, never copy their text or assets.
- Fast: compress images, no heavy libraries without asking.

## Rules (non-negotiable)
- Never invent prices, capacity, uptime, client counts, certifications or testimonials. Every number on the site must trace to a file in `content/`.
- No promises of mining profit, returns or investment language. Describe the hosting service only. The "keep your coins" argument (Pricing, FAQ, Pip; content/pricing.md, Ganushi 4 Nov 2026) is allowed because it describes the billing structure: hosting is invoiced in USD or AED from the client's own funds, so mined coins stay in the client's wallet. Always keep the "prices can fall as well as rise, no promise of returns" note with it.
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
