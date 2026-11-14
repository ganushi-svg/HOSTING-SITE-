"use client";

/**
 * Segments Cloud hosting landing page, "NOC Telemetry" design (Ganushi, 14 Nov 2026), for side-by-side comparison with
 * the violet and segments theme previews. Layout and styling follow Ganushi's brief; every fact (prices, capacity,
 * machine specs, cooling layers, FAQ, onboarding) is read from lib/ (copied from the hosting site's src/lib, which
 * names each content/ source), so nothing on this page is invented. Monitoring figures are samples and say so; the
 * site camera clips are recordings and are never called live.
 */

import React, { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import {
  Zap,
  Thermometer,
  Wrench,
  FileSpreadsheet,
  ArrowRight,
  CheckCircle2,
  Sliders,
  ChevronDown,
  MessageSquare,
  Mail,
  X,
  Globe,
  Calculator,
  Lock,
  Phone,
} from "lucide-react";
import { capacity, contact, faqs, onboarding, pricing, repair, site, siteCameras, tierFor, whyHost } from "@/lib/site";
import { models } from "@/lib/models";
import { airLayers, hydroLayers } from "@/lib/cooling-layout";
import { siteStatusSample } from "@/lib/monitoring-samples";

// UAE dirham is pegged to the US dollar at 3.6725 (Central Bank of the UAE). Used only to show the estimate in AED.
const AED_PER_USD = 3.6725;

const fmtInt = (n: number) => Math.round(n).toLocaleString("en-US");
const fmtNum = (n: number, d = 1) => n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });

const AIR_MEDIA = {
  video: { src: "/video/air-fans-tour.mp4", poster: "/video/air-fans-tour-poster.webp", caption: "Exhaust fans, cooling pads and racks at work · Abu Dhabi" },
  photos: [
    { src: "/photos/hall-pads-and-racks-1920.webp", alt: "Hall with an evaporative cooling-pad wall on one side and racks of miners on the other", caption: "Cooling pads facing the miner racks · Abu Dhabi" },
    { src: "/photos/hall-rack-closeup-1920.webp", alt: "Close-up of miners on racks with labelled power cables and green status lights on the power strips", caption: "Every power cable tagged to its machine · Abu Dhabi" },
  ],
};
const HYDRO_MEDIA = {
  video: { src: "/video/hydro-container-walk.mp4", poster: "/video/hydro-container-walk-poster.webp", caption: "Walking through a hydro container · Abu Dhabi" },
  photos: [
    { src: "/photos/hydro-container-aisle-1920.webp", alt: "Aisle inside a hydro container with racks of hydro miners and coolant hoses on both sides", caption: "Hydro miners on both sides of a container aisle · Abu Dhabi" },
    { src: "/photos/hydro-container-dusk-1920.webp", alt: "White hydro-cooling container with louvred vents at dusk", caption: "Hydro container at dusk · Abu Dhabi" },
  ],
};

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "infrastructure", label: "Infrastructure" },
  { id: "pricing", label: "Pricing" },
  { id: "calculator", label: "Calculator" },
  { id: "faq", label: "FAQ" },
  { id: "contact", label: "Contact" },
];

// Sample monthly report rows: illustrative machines on the 100+ tier, 30-day month. kWh = watts × 24 h × running days ÷ 1,000;
// charge = kWh × rate. Offline days are billed $0 (content/pricing.md).
function sampleReportRows() {
  const rate = pricing.tiers[0].rateUsd;
  const xp = models.find((m) => m.slug === "antminer-s21-xp")!;
  const xpHydro = models.find((m) => m.slug === "antminer-s21-xp-hydro")!;
  const rows = [
    { id: "Machine 01", m: xp, zone: "Air-cooled hall", days: 30 },
    { id: "Machine 02", m: xp, zone: "Air-cooled hall", days: 30 },
    { id: "Machine 03", m: xp, zone: "Air-cooled hall", days: 28.5 },
    { id: "Machine 04", m: xpHydro, zone: "Hydro container", days: 30 },
  ];
  return rows.map((r) => {
    const kwh = (r.m.watts * 24 * r.days) / 1000;
    return { ...r, offline: 30 - r.days, kwh, usd: kwh * rate, rate };
  });
}

const noopSubscribe = () => () => {};

const REPORT_ROWS = sampleReportRows();
const REPORT_TOTAL = REPORT_ROWS.reduce((s, r) => s + r.usd, 0);

const inputCls = "w-full rounded-xl border border-white/10 bg-[#0B0711] px-4 py-3 text-base normal-case font-sans text-white placeholder:text-slate-600 focus:border-[#22D3EE] focus:outline-none";

export default function SegmentsHostingPage() {
  const [coolingTab, setCoolingTab] = useState<"air" | "hydro">("air");
  const [activeLayerIdx, setActiveLayerIdx] = useState<number>(0);
  const [showInvoiceModal, setShowInvoiceModal] = useState<boolean>(false);

  const [selectedSlug, setSelectedSlug] = useState<string>("antminer-s21-xp");
  const [quantity, setQuantity] = useState<number>(85);
  const [hostingMode, setHostingMode] = useState<"plug" | "turnkey">("plug");
  const [currency, setCurrency] = useState<"USD" | "AED">("USD");

  const [contactName, setContactName] = useState<string>("");
  const [contactCompany, setContactCompany] = useState<string>("");
  const [contactReach, setContactReach] = useState<string>("");
  const [contactFleetSummary, setContactFleetSummary] = useState<string>("");
  const [quoteLockedBanner, setQuoteLockedBanner] = useState<boolean>(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  // The footer year is read in the browser: with cacheComponents a build-time clock is not allowed in prerendered output.
  const year = useSyncExternalStore(noopSubscribe, () => new Date().getFullYear(), () => null);

  const currentLayers = coolingTab === "air" ? airLayers : hydroLayers;
  const activeLayer = currentLayers[activeLayerIdx] || currentLayers[0];
  const media = coolingTab === "air" ? AIR_MEDIA : HYDRO_MEDIA;

  const selectedMiner = useMemo(() => models.find((m) => m.slug === selectedSlug) || models[0], [selectedSlug]);

  useEffect(() => {
    if (!showInvoiceModal) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setShowInvoiceModal(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showInvoiceModal]);

  const calc = useMemo(() => {
    const qty = Math.max(1, Math.floor(quantity || 1));
    const unitKw = selectedMiner.watts / 1000;
    const totalKw = unitKw * qty;
    const totalMw = totalKw / 1000;
    const tier = tierFor(qty);
    const appliedRate = hostingMode === "turnkey" ? pricing.turnkeyPowerFromUsd : tier.rateUsd;
    const tierLabel = hostingMode === "turnkey" ? `Turnkey, from ${pricing.turnkeyPowerFromLabel}/kWh` : `${tier.label}, ${tier.rateLabel}/kWh`;
    const monthlyKwh = totalKw * 24 * 30;
    const monthlyPowerUsd = monthlyKwh * appliedRate;
    const setupFeeUsd = totalKw * pricing.setupFeePerKwUsd;
    const capexUsd = Math.max(1, totalMw) * pricing.turnkeyCapexPerMwUsd;
    const depositUsd = monthlyPowerUsd;

    let nudge: string | null = null;
    if (hostingMode === "plug") {
      const next = qty < 50 ? pricing.tiers[1] : qty < 100 ? pricing.tiers[0] : null;
      if (next) {
        const needed = next.min - qty;
        const saving = unitKw * 24 * 30 * (tier.rateUsd - next.rateUsd) * next.min;
        nudge = `Add ${needed} more machine${needed > 1 ? "s" : ""} (${next.min} total) to reach the ${next.rateLabel}/kWh tier: about $${fmtInt(saving)} less power cost a month on ${next.min} machines.`;
      }
    }
    const turnkeyShort = hostingMode === "turnkey" && totalMw < 1;
    return { qty, unitKw, totalKw, totalMw, appliedRate, tierLabel, monthlyKwh, monthlyPowerUsd, setupFeeUsd, capexUsd, depositUsd, nudge, turnkeyShort };
  }, [selectedMiner, quantity, hostingMode]);

  const money = (usd: number) => (currency === "USD" ? `USD ${fmtInt(usd)}` : `AED ${fmtInt(usd * AED_PER_USD)}`);

  const handleLockInQuote = () => {
    const summary = `${calc.qty} × ${selectedMiner.name} (${selectedMiner.cooling}) · ${fmtNum(calc.totalKw)} kW load · ${
      hostingMode === "turnkey" ? `Turnkey from ${pricing.turnkeyPowerFromLabel}/kWh` : `${tierFor(calc.qty).rateLabel}/kWh tier`
    } · est. ${money(calc.monthlyPowerUsd)} power per 30 days`;
    setContactFleetSummary(summary);
    setQuoteLockedBanner(true);
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  const enquiryText = useMemo(() => {
    return [
      "Hello Segments Cloud team, I would like a hosting quote.",
      contactFleetSummary && `Fleet: ${contactFleetSummary}`,
      contactName && `Name: ${contactName}`,
      contactCompany && `Company: ${contactCompany}`,
      contactReach && `Contact: ${contactReach}`,
    ].filter(Boolean).join("\n");
  }, [contactFleetSummary, contactName, contactCompany, contactReach]);

  const whatsappHref = `${contact.whatsappUrl}?text=${encodeURIComponent(enquiryText)}`;
  const mailHref = `mailto:${contact.email}?subject=${encodeURIComponent(`Hosting quote${contactCompany ? `: ${contactCompany}` : ""}`)}&body=${encodeURIComponent(enquiryText)}`;
  const canSend = contactName.trim().length > 0 && (contactFleetSummary.trim().length > 0 || contactReach.trim().length > 0);


  const maxTemp = 90, minTemp = 60;

  return (
    <div className="min-h-screen bg-[#0B0711] text-slate-100 noc-grid-bg pb-20 md:pb-0">
      {/* TOP TELEMETRY STRIP: published operating figures, not live readings */}
      <div className="border-b border-white/10 bg-[#110B1B]/90 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="inline-block w-2 h-2 rounded-full bg-[#10B981]" aria-hidden="true" />
            <span className="font-mono uppercase tracking-wider text-[#22D3EE]">NOC Telemetry · Abu Dhabi sites</span>
            <span className="hidden sm:inline font-mono text-slate-500">· published figures</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 font-mono tabular-nums text-slate-300">
            <span>CAPACITY: <strong className="text-white">{capacity.totalMw} MW</strong></span>
            <span className="hidden sm:inline text-white/20">|</span>
            <span>UPTIME: <strong className="text-[#10B981]">{capacity.uptimePct}%</strong></span>
            <span className="hidden md:inline text-white/20">|</span>
            <span className="hidden md:inline">MACHINES HOSTED: <strong className="text-white">{fmtInt(capacity.machinesHosted)}+</strong></span>
            <span className="hidden lg:inline text-white/20">|</span>
            <span className="hidden lg:inline">OFFLINE DAY BILLING: <strong className="text-[#C084FC]">$0.00</strong></span>
          </div>
        </div>
      </div>

      {/* STICKY HEADER */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0B0711]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <a href="#overview" className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-mark.webp" alt="Segments Cloud" width={32} height={36} className="w-8 h-9 object-contain" />
            <div>
              <span className="font-semibold tracking-tight text-white block leading-none">{site.name}</span>
              <small className="text-[11px] font-mono text-slate-400">Mining hosting · {site.serviceArea}</small>
            </div>
          </a>

          <nav aria-label="Page sections" className="hidden md:flex items-center gap-1 rounded-full border border-white/10 bg-[#161022]/90 px-2 py-1 text-xs font-medium text-slate-300">
            {SECTIONS.map((s) => (
              <a key={s.id} href={`#${s.id}`} className="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/5 transition">{s.label}</a>
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-medium text-slate-200 transition">
              <MessageSquare className="w-3.5 h-3.5 text-[#10B981]" aria-hidden="true" />
              WhatsApp
            </a>
            <a href="#contact" className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] text-xs font-semibold text-white shadow-lg shadow-[#7C3AED]/25 transition">
              Request a quote
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </header>

      <main id="main">
        {/* HERO */}
        <section id="overview" className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 border-b border-white/10 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#7C3AED]/40 bg-[#7C3AED]/10 text-[#C084FC] text-xs font-mono">
                <Globe className="w-3.5 h-3.5 text-[#22D3EE]" aria-hidden="true" />
                ASIC mining hosting · Abu Dhabi, UAE
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.08]">
                Host your mining machines with a team that runs{" "}
                <em className="not-italic text-transparent bg-clip-text bg-gradient-to-r from-[#C084FC] via-[#7C3AED] to-[#22D3EE] font-mono tabular-nums">
                  {capacity.totalMw} MW
                </em>
                .
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                Segments Cloud hosts ASIC miners for owners, funds and fleet operators: air and hydro-cooled halls, on-site technicians, in-house repair and per-machine billing.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a href="#calculator" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-semibold text-sm shadow-xl shadow-[#7C3AED]/30 transition">
                  <Sliders className="w-4 h-4" aria-hidden="true" />
                  Estimate power cost
                </a>
                <a href="#pricing" className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl border border-white/15 bg-[#161022] hover:bg-white/10 text-slate-200 font-medium text-sm transition">
                  1 MW+ Turnkey (from {pricing.turnkeyPowerFromLabel}/kWh)
                  <ArrowRight className="w-4 h-4 text-[#C084FC]" aria-hidden="true" />
                </a>
              </div>

              <div className="pt-4 grid grid-cols-3 gap-4 border-t border-white/10 max-w-xl">
                <div>
                  <div className="text-xs font-mono text-slate-400">MINING SINCE</div>
                  <div className="text-sm font-mono font-semibold text-white tabular-nums mt-0.5">2017 (own account)</div>
                </div>
                <div>
                  <div className="text-xs font-mono text-slate-400">OFFLINE BILLING</div>
                  <div className="text-sm font-mono font-semibold text-[#10B981] tabular-nums mt-0.5">$0 / offline day</div>
                </div>
                <div>
                  <div className="text-xs font-mono text-slate-400">REPAIR CENTER</div>
                  <div className="text-sm font-mono font-semibold text-[#22D3EE] mt-0.5">In-house, Bitmain-trained</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative rounded-2xl border border-white/10 bg-[#161022]/90 p-6 shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" aria-hidden="true" />
                    <span className="font-mono text-xs uppercase tracking-wider text-slate-300">Segments · Abu Dhabi, UAE</span>
                  </div>
                  <span className="font-mono text-xs text-[#22D3EE] tabular-nums">{capacity.totalMw} MW</span>
                </div>

                <div className="relative aspect-square max-h-[300px] mx-auto my-2 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/brand/globe-earth.webp" alt="Globe centred on the Middle East, where Segments hosts in Abu Dhabi" width={1040} height={1040} className="w-full h-full object-contain opacity-90" />
                  <div className="absolute bottom-3 inset-x-4 rounded-xl border border-white/15 bg-[#0B0711]/90 p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/logo-mark.webp" alt="" width={24} height={24} className="w-6 h-6 object-contain" />
                      <div>
                        <div className="text-xs font-bold text-white">Segments Abu Dhabi</div>
                        <div className="text-[10px] font-mono text-[#22D3EE]">Air &amp; hydro zones</div>
                      </div>
                    </div>
                    <span className="font-mono text-xs text-[#10B981] tabular-nums">{capacity.uptimePct}% uptime</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/10 text-xs text-slate-300 text-center">
                  <strong className="text-white font-mono tabular-nums">{fmtInt(capacity.clientsHosted)}+</strong> clients from {capacity.clientRegionsLabel} host with Segments
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* KEY FIGURES */}
        <section aria-label="Key figures" className="border-b border-white/10 bg-[#120D1D]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { v: `${capacity.totalMw} MW`, l: "Power capacity across Abu Dhabi", c: "text-white" },
              { v: `${fmtInt(capacity.clientsHosted)}+`, l: "Clients hosted", c: "text-[#C084FC]" },
              { v: `${capacity.uptimePct}%`, l: "Uptime", c: "text-[#10B981]" },
              { v: `${fmtInt(capacity.machinesHosted)}+`, l: "Machines hosted", c: "text-[#22D3EE]" },
            ].map((k) => (
              <div key={k.l} className="p-4 rounded-xl border border-white/5 bg-[#161022]/60">
                <div className={`text-3xl sm:text-4xl font-bold font-mono tabular-nums ${k.c}`}>{k.v}</div>
                <div className="text-xs sm:text-sm text-slate-400 mt-1">{k.l}</div>
              </div>
            ))}
          </div>
        </section>

        {/* HOSTING AT A GLANCE & ONBOARDING */}
        <section className="py-16 md:py-24 border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
              <p className="font-mono text-xs uppercase tracking-widest text-[#C084FC]">Hosting at a glance</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">You own the machines. We run everything around them.</h2>
              <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                We have mined Bitcoin for our own account since 2017, so we know what it takes to keep machines running in the UAE heat. Today Segments Cloud operates {capacity.totalMw} MW of power at sites all around Abu Dhabi and hosts both hydro and air-cooled machines, with a site in-charge and hosting technicians on site 24/7 at every site, and every site fully monitored.
              </p>

              <ul className="space-y-3 pt-2">
                <li className="flex items-center gap-3 p-3 rounded-xl border border-white/10 bg-[#161022]">
                  <b className="font-mono text-lg text-[#C084FC] tabular-nums w-16">{capacity.totalMw} MW</b>
                  <span className="text-sm text-slate-300">of power across Abu Dhabi</span>
                </li>
                <li className="flex items-center gap-3 p-3 rounded-xl border border-white/10 bg-[#161022]">
                  <b className="font-mono text-lg text-[#22D3EE] tabular-nums w-16">24/7</b>
                  <span className="text-sm text-slate-300">technicians on site</span>
                </li>
                <li className="flex items-center gap-3 p-3 rounded-xl border border-white/10 bg-[#161022]">
                  <b className="font-mono text-lg text-[#10B981] tabular-nums w-16">$0</b>
                  <span className="text-sm text-slate-300">for days a machine is offline</span>
                </li>
              </ul>

              <div className="pt-2">
                <a href="#contact" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-semibold text-sm transition">
                  Start with a quote
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </a>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <p className="font-mono text-xs uppercase tracking-widest text-slate-400 mb-4">From your first message to your first monthly report</p>
              <ol className="grid sm:grid-cols-2 gap-4">
                {onboarding.map((step, i) => (
                  <li key={step.title} className="rounded-2xl border border-white/10 bg-[#161022]/90 p-5 flex flex-col justify-between hover:border-[#7C3AED]/50 transition">
                    <div>
                      <div className="flex items-center justify-between mb-3 gap-2">
                        <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-[#7C3AED]/20 text-[#C084FC] tabular-nums">STEP {String(i + 1).padStart(2, "0")}</span>
                        <span className="font-mono text-[11px] text-[#22D3EE] text-right">{step.fact}</span>
                      </div>
                      <h3 className="text-base font-semibold text-white mb-1.5">{step.title}</h3>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{step.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* INFRASTRUCTURE & OPERATIONS */}
        <section id="infrastructure" className="py-16 md:py-24 border-b border-white/10 space-y-20 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="max-w-3xl space-y-3 mb-12">
              <p className="font-mono text-xs uppercase tracking-widest text-[#22D3EE]">Infrastructure &amp; operations</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Abu Dhabi Infrastructure &amp; Operations</h2>
              <p className="text-slate-300 text-base">One team runs the power, the cooling, the repair center and the billing, so every charge on your invoice traces to a machine and a day.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-white/10 bg-[#161022] p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs uppercase px-2.5 py-1 rounded bg-[#7C3AED]/20 text-[#C084FC]">{capacity.totalMw} MW</span>
                  <Zap className="w-5 h-5 text-[#C084FC]" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold text-white">Across Abu Dhabi</h3>
                <ul className="space-y-2.5 text-sm text-slate-300">
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" aria-hidden="true" /><span>Hosting sites all around Abu Dhabi, each with a named site in-charge</span></li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" aria-hidden="true" /><span>Hosting technicians on site 24/7, fully monitored</span></li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" aria-hidden="true" /><span>Power capacity tracked per site and zone; load read before machines are placed</span></li>
                </ul>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#161022] p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs uppercase px-2.5 py-1 rounded bg-[#22D3EE]/15 text-[#22D3EE]">Air &amp; hydro</span>
                  <Thermometer className="w-5 h-5 text-[#22D3EE]" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold text-white">Cooling built for the UAE heat</h3>
                <ul className="space-y-2.5 text-sm text-slate-300">
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-[#22D3EE] shrink-0 mt-0.5" aria-hidden="true" /><span>Air-cooled halls: filtered fresh air, evaporative pads and exhaust fan walls</span></li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-[#22D3EE] shrink-0 mt-0.5" aria-hidden="true" /><span>Hydro zone: sealed coolant loops with a weekly nine-step inspection per container</span></li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-[#22D3EE] shrink-0 mt-0.5" aria-hidden="true" /><span>Intake filters cleaned weekly, disposable filters replaced monthly, by Segments Quality Control</span></li>
                </ul>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#161022] p-6 space-y-4 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs uppercase px-2.5 py-1 rounded bg-amber-500/15 text-amber-300">In-house</span>
                    <Wrench className="w-5 h-5 text-amber-400" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Bitmain-trained repair</h3>
                  <ul className="space-y-2.5 text-sm text-slate-300">
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" aria-hidden="true" /><span>{repair.highlights[1].text}</span></li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" aria-hidden="true" /><span>You approve every quote before work starts; the cost lands on the same invoice</span></li>
                  </ul>
                </div>

                <div className="pt-3 border-t border-white/10">
                  <div className="text-[10px] font-mono uppercase text-amber-300 mb-2">In-house repair, five steps</div>
                  <ol className="grid grid-cols-5 gap-1 text-center font-mono text-[10px]">
                    {["Pickup", "Diagnosis", "Approval", "Repair", "Racked"].map((s, i) => (
                      <li key={s} className={`p-1.5 rounded bg-[#0B0711] border ${i === 2 ? "border-amber-400/40 text-amber-300" : i === 4 ? "border-[#10B981]/40 text-[#10B981]" : "border-white/10 text-slate-300"}`}>
                        {i + 1}. {s}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#161022] p-6 space-y-4 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs uppercase px-2.5 py-1 rounded bg-[#10B981]/15 text-[#10B981]">Pool-synced</span>
                    <FileSpreadsheet className="w-5 h-5 text-[#10B981]" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Transparent billing</h3>
                  <ul className="space-y-2.5 text-sm text-slate-300">
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" aria-hidden="true" /><span>Fleet data synced daily: status, hash rate, last share, repair state</span></li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" aria-hidden="true" /><span>Monthly report per machine: running days, energy kWh and charge</span></li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" aria-hidden="true" /><span>Offline days billed $0; running days come from your pool data</span></li>
                  </ul>
                </div>
                <button type="button" onClick={() => setShowInvoiceModal(true)} className="w-full py-3 px-4 rounded-xl border border-[#10B981]/40 bg-[#10B981]/10 hover:bg-[#10B981]/20 text-xs font-mono font-semibold text-[#10B981] flex items-center justify-center gap-2 transition">
                  <FileSpreadsheet className="w-4 h-4" aria-hidden="true" />
                  See a sample monthly per-machine report
                </button>
              </div>
            </div>
          </div>

          {/* 10-LAYER COOLING EXPLORER */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="rounded-3xl border border-white/10 bg-[#140E20] p-5 sm:p-8 lg:p-10 space-y-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-6">
                <div className="space-y-2">
                  <p className="font-mono text-xs uppercase tracking-widest text-[#22D3EE]">Our cooling setups</p>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white">How our air-cooled and hydro mining systems are built</h3>
                  <p className="text-sm text-slate-300">Pick a system, tap a layer to see what it does, then see it for real in the photos and video from our sites.</p>
                </div>

                <div className="inline-flex rounded-xl border border-white/10 bg-[#0B0711] p-1 self-start" role="tablist" aria-label="Cooling system">
                  <button type="button" role="tab" aria-selected={coolingTab === "air"} onClick={() => { setCoolingTab("air"); setActiveLayerIdx(0); }}
                    className={`px-4 py-2.5 rounded-lg text-xs font-mono font-semibold transition ${coolingTab === "air" ? "bg-[#7C3AED] text-white" : "text-slate-400 hover:text-white"}`}>
                    Air-cooled hall (10 layers)
                  </button>
                  <button type="button" role="tab" aria-selected={coolingTab === "hydro"} onClick={() => { setCoolingTab("hydro"); setActiveLayerIdx(0); }}
                    className={`px-4 py-2.5 rounded-lg text-xs font-mono font-semibold transition ${coolingTab === "hydro" ? "bg-[#22D3EE] text-[#0B0711]" : "text-slate-400 hover:text-white"}`}>
                    Hydro container (10 layers)
                  </button>
                </div>
              </div>

              <div className="grid lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-5 grid grid-cols-1 gap-1.5">
                  {currentLayers.map((layer, idx) => {
                    const isSelected = idx === activeLayerIdx;
                    return (
                      <button key={layer.id} type="button" aria-pressed={isSelected} onClick={() => setActiveLayerIdx(idx)}
                        className={`w-full min-h-[44px] text-left px-3.5 py-2.5 rounded-xl border text-xs flex items-center justify-between transition ${isSelected ? "border-[#22D3EE] bg-[#22D3EE]/10 text-white" : "border-white/5 bg-[#0B0711]/60 text-slate-400 hover:border-white/15"}`}>
                        <span className="flex items-center gap-2.5 min-w-0">
                          <span className={`font-mono font-bold tabular-nums ${isSelected ? "text-[#22D3EE]" : "text-slate-500"}`}>{String(idx + 1).padStart(2, "0")}</span>
                          <span className="font-medium truncate">{layer.name}</span>
                        </span>
                        {layer.dim && <span className="font-mono text-[10px] text-slate-500 shrink-0 ml-2">{layer.dim}</span>}
                      </button>
                    );
                  })}
                </div>

                <div className="lg:col-span-7 space-y-6">
                  <div className="rounded-2xl border border-[#22D3EE]/30 bg-[#0B0711] p-6 space-y-4" aria-live="polite">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs font-semibold text-[#22D3EE] uppercase">
                        Layer {String(activeLayerIdx + 1).padStart(2, "0")} · {coolingTab === "air" ? "Air-cooled hall" : "Hydro container"}
                      </span>
                      <span className="font-mono text-xs text-slate-400 tabular-nums">{activeLayerIdx + 1} of {currentLayers.length}</span>
                    </div>
                    <h4 className="text-xl font-bold text-white">{activeLayer.name}</h4>
                    <p className="text-sm text-slate-300 leading-relaxed">{activeLayer.role}</p>
                    {activeLayer.dim && <p className="font-mono text-xs text-[#C084FC]">{activeLayer.dim}</p>}
                    <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#7C3AED] to-[#22D3EE] origin-left transition-transform duration-300"
                        style={{ transform: `scaleX(${(activeLayerIdx + 1) / currentLayers.length})` }} />
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-[#0B0711] overflow-hidden">
                    <video key={coolingTab} autoPlay loop muted playsInline preload="metadata" poster={media.video.poster} aria-label={media.video.caption} className="w-full aspect-video object-cover">
                      <source src={media.video.src} type="video/mp4" />
                    </video>
                    <div className="p-3.5 text-xs font-mono text-slate-300 flex items-center justify-between gap-3">
                      <span>{media.video.caption}</span>
                      <span className="text-[#10B981] shrink-0">Recorded on site</span>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {media.photos.map((p, i) => (
                      <figure key={p.src} className="rounded-xl border border-white/10 bg-[#0B0711] overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.src} alt={p.alt} loading="lazy" className="w-full aspect-[4/3] object-cover" />
                        <figcaption className="p-3">
                          <div className={`font-mono text-[10px] uppercase ${i === 0 ? "text-[#C084FC]" : "text-[#22D3EE]"}`}>Site photo {String(i + 1).padStart(2, "0")}</div>
                          <p className="text-xs text-slate-300 font-medium mt-1">{p.caption}</p>
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* MONITORING & SITE CAMERAS */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 rounded-2xl border border-white/10 bg-[#161022] p-6 sm:p-8 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <p className="font-mono text-xs uppercase tracking-widest text-[#C084FC]">Monitoring</p>
                  <h3 className="text-2xl font-bold text-white mt-1">How we watch your machines</h3>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1.5 font-mono text-[11px] text-amber-300">
                  Sample view · illustrative figures
                </span>
              </div>
              <p className="text-sm text-slate-300">{siteStatusSample.intro}</p>

              <dl className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {siteStatusSample.kpis.map((k, i) => (
                  <div key={k.label} className={`p-3 rounded-xl bg-[#0B0711] border border-white/5 ${i === 4 ? "col-span-2 sm:col-span-1" : ""}`}>
                    <dt className="text-[11px] font-mono text-slate-400">{k.label}</dt>
                    <dd className={`text-lg font-mono font-bold tabular-nums mt-0.5 ${["text-[#10B981]", "text-white", "text-[#22D3EE]", "text-amber-400", "text-[#C084FC]"][i]}`}>{k.value}</dd>
                  </div>
                ))}
              </dl>

              <figure className="rounded-xl border border-white/10 bg-[#0B0711] p-5 space-y-4" aria-label={`Median maximum chip temperature by hall, sample figures, against a ${siteStatusSample.tempLimit} °C limit`}>
                <figcaption className="flex items-center justify-between text-xs font-mono gap-2">
                  <span className="text-slate-300">Median max chip temperature by hall</span>
                  <span className="text-amber-400">{siteStatusSample.tempLimit} °C limit</span>
                </figcaption>
                <div className="grid grid-cols-6 gap-3 pt-2 items-end">
                  {siteStatusSample.temps.map((h) => (
                    <div key={h.hall} className="flex flex-col items-center justify-end gap-1.5">
                      <span className="font-mono text-xs font-bold text-white tabular-nums">{h.c}°</span>
                      <div className="relative w-full bg-white/5 rounded-t-md h-24 overflow-hidden">
                        <div className={`absolute inset-0 rounded-t-md origin-bottom transition-transform duration-300 bg-gradient-to-t ${h.c >= siteStatusSample.tempLimit - 3 ? "from-amber-500 to-amber-300" : "from-[#7C3AED] to-[#22D3EE]"}`}
                          style={{ transform: `scaleY(${(h.c - minTemp) / (maxTemp - minTemp)})` }} />
                        <span className="absolute inset-x-0 border-t border-dashed border-amber-300" style={{ bottom: `${((siteStatusSample.tempLimit - minTemp) / (maxTemp - minTemp)) * 100}%` }} aria-hidden="true" />
                      </div>
                      <small className="font-mono text-xs text-slate-400">{h.hall.replace("Hall ", "")}</small>
                    </div>
                  ))}
                </div>
              </figure>
            </div>

            <div className="lg:col-span-5 rounded-2xl border border-white/10 bg-[#161022] p-6 sm:p-8 space-y-5">
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-[#10B981]">Site cameras</p>
                <h4 className="text-2xl font-bold text-white mt-1">Recorded on site</h4>
                <p className="text-sm text-slate-300 mt-1">Two of the cameras our team watches over the halls. These are short recordings, not live feeds.</p>
              </div>

              <div className="space-y-4">
                {siteCameras.map((c) => (
                  <div key={c.cam} className="rounded-xl border border-white/10 bg-[#0B0711] p-3 space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono gap-2">
                      <span className="text-[#10B981]">● {c.cam}</span>
                      <span className="text-slate-400 text-right">{c.caption}</span>
                    </div>
                    <video autoPlay loop muted playsInline preload="metadata" poster={c.poster} aria-label={`Site camera recording: ${c.caption}`} className="w-full aspect-video rounded-lg object-cover bg-[#161022]">
                      <source src={c.src} type="video/mp4" />
                    </video>
                    <div className="font-mono text-[10px] text-slate-500">Site camera · Recorded on site</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" className="py-16 md:py-24 border-b border-white/10 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
            <div className="max-w-2xl space-y-3">
              <p className="font-mono text-xs uppercase tracking-widest text-[#C084FC]">Pricing</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Two ways to host</h2>
              <p className="text-slate-300 text-base">Ship your machines to our halls on a per-kWh rate, or have capacity built for your fleet.</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="rounded-3xl border border-[#7C3AED]/50 bg-[#161022] p-6 sm:p-8 flex flex-col justify-between shadow-xl shadow-[#7C3AED]/10">
                <div className="space-y-6">
                  <span className="font-mono text-xs uppercase px-3 py-1 rounded-full bg-[#7C3AED]/20 text-[#C084FC]">Your machines, our halls</span>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Plug and play</h3>
                    <div className="mt-3 flex items-baseline gap-2">
                      <span className="text-4xl sm:text-5xl font-bold font-mono tabular-nums text-white">{pricing.plugFromLabel}</span>
                      <small className="font-mono text-sm text-slate-400">/ kWh, from</small>
                    </div>
                  </div>
                  <ul className="space-y-3 text-sm text-slate-200 border-t border-white/10 pt-6">
                    {pricing.tiers.map((t, i) => (
                      <li key={t.min} className="flex justify-between font-mono tabular-nums gap-3"><span>{t.label}</span><b className={i === 0 ? "text-[#10B981]" : "text-white"}>{t.rateLabel} / kWh</b></li>
                    ))}
                    <li className="pt-2 border-t border-white/5 text-slate-300">• Minimum fleet: {pricing.minimumFleetLabel.toLowerCase()}</li>
                    <li className="text-slate-300">• Air-cooled halls or the hydro zone</li>
                  </ul>
                </div>
                <div className="pt-8">
                  <a href="#calculator" onClick={() => setHostingMode("plug")} className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-semibold text-sm transition">
                    Calculate a plug &amp; play estimate <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </a>
                </div>
              </div>

              <div className="rounded-3xl border border-[#22D3EE]/40 bg-[#161022] p-6 sm:p-8 flex flex-col justify-between">
                <div className="space-y-6">
                  <span className="font-mono text-xs uppercase px-3 py-1 rounded-full bg-[#22D3EE]/15 text-[#22D3EE]">For larger fleets</span>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Turnkey solution</h3>
                    <div className="mt-3 flex items-baseline gap-2">
                      <span className="text-4xl sm:text-5xl font-bold font-mono tabular-nums text-[#22D3EE]">{pricing.turnkeyPowerFromLabel}</span>
                      <small className="font-mono text-sm text-slate-400">/ kWh, from</small>
                    </div>
                  </div>
                  <ul className="space-y-3 text-sm text-slate-200 border-t border-white/10 pt-6">
                    <li className="flex justify-between gap-3"><span className="text-slate-400">Capex per MW</span><b className="font-mono tabular-nums text-white text-right">{pricing.turnkeyCapexPerMwLabel} / MW</b></li>
                    {pricing.turnkeyTerms.map((t) => (
                      <li key={t.label} className="flex justify-between gap-3"><span className="text-slate-400">{t.label}</span><b className="text-white text-right">{t.value}</b></li>
                    ))}
                  </ul>
                </div>
                <div className="pt-8">
                  <a href="#contact"
                    onClick={() => {
                      setHostingMode("turnkey");
                      setContactFleetSummary(`Turnkey build from 1 MW (power from ${pricing.turnkeyPowerFromLabel}/kWh, capex ${pricing.turnkeyCapexPerMwLabel} per MW)`);
                    }}
                    className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl border border-[#22D3EE] bg-[#22D3EE]/10 hover:bg-[#22D3EE]/20 text-[#22D3EE] font-semibold text-sm transition">
                    Request a turnkey proposal <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#120D1D] p-6 sm:p-8 space-y-6">
              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
                <div><div className="text-xs font-mono text-slate-400">SETUP FEE</div><div className="text-base font-mono font-bold text-white tabular-nums mt-1">{pricing.setupFeeLabel}</div></div>
                <div><div className="text-xs font-mono text-slate-400">DEPOSIT</div><div className="text-base font-mono font-bold text-white mt-1">{pricing.depositLabel}</div></div>
                <div><div className="text-xs font-mono text-slate-400">MINIMUM TERM</div><div className="text-base font-mono font-bold text-white tabular-nums mt-1">{pricing.minimumTermLabel}</div></div>
                <div>
                  <div className="text-xs font-mono text-slate-400">SETTLEMENT</div>
                  <div className="text-sm font-semibold text-[#10B981] mt-1">{pricing.currenciesLabel}, by {pricing.paymentMethodsLabel}</div>
                </div>
              </div>
              <div className="border-t border-white/10 pt-5 space-y-2">
                <p className="text-sm text-slate-200"><b className="text-white">{whyHost.title}</b> {whyHost.lead}</p>
                <p className="text-xs text-slate-400">{whyHost.note}</p>
              </div>
            </div>
          </div>
        </section>

        {/* CALCULATOR */}
        <section id="calculator" className="py-16 md:py-24 border-b border-white/10 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-2">
                <p className="font-mono text-xs uppercase tracking-widest text-[#22D3EE]">Calculator &amp; supported hardware</p>
                <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Estimate your hosting power cost</h2>
                <p className="text-slate-300 text-sm sm:text-base">Select your ASIC model and fleet size to see the kW load, the monthly power bill, the setup fee and the deposit.</p>
              </div>
              <div className="inline-flex rounded-lg border border-white/10 bg-[#0B0711] p-1 text-xs font-mono self-start" role="group" aria-label="Currency">
                {(["USD", "AED"] as const).map((c) => (
                  <button key={c} type="button" aria-pressed={currency === c} onClick={() => setCurrency(c)} className={`px-4 py-2 rounded-md transition ${currency === c ? "bg-[#7C3AED] text-white" : "text-slate-400"}`}>{c}</button>
                ))}
              </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-5 rounded-2xl border border-white/10 bg-[#161022] p-6 space-y-6">
                <div className="space-y-2">
                  <label htmlFor="calc-model" className="text-xs font-mono uppercase text-slate-400">Machine model</label>
                  <div className="relative">
                    <select id="calc-model" value={selectedSlug} onChange={(e) => setSelectedSlug(e.target.value)}
                      className="w-full appearance-none rounded-xl border border-white/10 bg-[#0B0711] px-4 py-3 pr-10 text-base text-white focus:border-[#22D3EE] focus:outline-none">
                      {(["Air", "Hydro"] as const).map((cool) => (
                        <optgroup key={cool} label={`${cool}-cooled`}>
                          {models.filter((m) => m.cooling === cool).map((m) => (
                            <option key={m.slug} value={m.slug}>{m.name} · {m.hashrate} · {fmtInt(m.watts)} W</option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden="true" />
                  </div>
                  <p className="text-[11px] font-mono text-slate-500">{selectedMiner.algorithm} · {selectedMiner.coins} · {selectedMiner.cooling}-cooled</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <label htmlFor="calc-qty" className="text-xs font-mono uppercase text-slate-400">Number of machines</label>
                    <input type="number" inputMode="numeric" min={1} max={5000} value={quantity} aria-label="Number of machines"
                      onChange={(e) => setQuantity(Math.max(1, Math.min(5000, Number(e.target.value) || 1)))}
                      className="w-24 rounded-lg border border-white/10 bg-[#0B0711] px-3 py-2 text-right font-mono text-base text-white tabular-nums focus:border-[#22D3EE] focus:outline-none" />
                  </div>
                  <input id="calc-qty" type="range" min={1} max={500} value={Math.min(quantity, 500)} onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full accent-[#7C3AED] h-8" />
                  <div className="flex justify-between font-mono text-[10px] text-slate-500"><span>1</span><span>100</span><span>250</span><span>500</span></div>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-mono uppercase text-slate-400">Hosting model</span>
                  <div className="grid grid-cols-2 gap-2" role="group" aria-label="Hosting model">
                    <button type="button" aria-pressed={hostingMode === "plug"} onClick={() => setHostingMode("plug")}
                      className={`rounded-xl border px-3 py-3 text-xs font-semibold transition ${hostingMode === "plug" ? "border-[#7C3AED] bg-[#7C3AED]/20 text-white" : "border-white/10 text-slate-400"}`}>
                      Plug &amp; play
                    </button>
                    <button type="button" aria-pressed={hostingMode === "turnkey"} onClick={() => setHostingMode("turnkey")}
                      className={`rounded-xl border px-3 py-3 text-xs font-semibold transition ${hostingMode === "turnkey" ? "border-[#22D3EE] bg-[#22D3EE]/15 text-white" : "border-white/10 text-slate-400"}`}>
                      Turnkey (1 MW+)
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {[10, 50, 100, 300].map((n) => (
                    <button key={n} type="button" onClick={() => setQuantity(n)} className={`rounded-full border px-3 py-2 font-mono text-xs transition ${quantity === n ? "border-[#C084FC] text-[#C084FC]" : "border-white/10 text-slate-400 hover:text-white"}`}>{n} machines</button>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-7 rounded-2xl border border-[#22D3EE]/30 bg-[#0B0711] p-6 space-y-6" aria-live="polite">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono text-xs uppercase text-[#22D3EE]">Your estimate · 30 running days</span>
                  <span className="font-mono text-xs rounded-full border border-white/10 px-3 py-1 text-slate-300">{calc.tierLabel}</span>
                </div>

                <div>
                  <div className="text-xs font-mono text-slate-400">Monthly hosting power bill</div>
                  <div className="text-4xl sm:text-5xl font-bold font-mono tabular-nums text-[#22D3EE] mt-1">{money(calc.monthlyPowerUsd)}</div>
                  <div className="text-xs font-mono text-slate-500 mt-1">{fmtInt(calc.monthlyKwh)} kWh × ${calc.appliedRate.toFixed(3)}/kWh</div>
                </div>

                <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-[#161022] border border-white/5"><dt className="text-[11px] font-mono text-slate-400">Load per unit</dt><dd className="font-mono font-bold text-white tabular-nums mt-0.5">{fmtNum(calc.unitKw, 2)} kW</dd></div>
                  <div className="p-3 rounded-xl bg-[#161022] border border-white/5"><dt className="text-[11px] font-mono text-slate-400">Total load</dt><dd className="font-mono font-bold text-white tabular-nums mt-0.5">{calc.totalKw >= 1000 ? `${fmtNum(calc.totalMw, 2)} MW` : `${fmtNum(calc.totalKw)} kW`}</dd></div>
                  {hostingMode === "plug" ? (
                    <div className="p-3 rounded-xl bg-[#161022] border border-white/5"><dt className="text-[11px] font-mono text-slate-400">Setup fee (one-off)</dt><dd className="font-mono font-bold text-white tabular-nums mt-0.5">{money(calc.setupFeeUsd)}</dd></div>
                  ) : (
                    <div className="p-3 rounded-xl bg-[#161022] border border-white/5"><dt className="text-[11px] font-mono text-slate-400">Build capex, from</dt><dd className="font-mono font-bold text-white tabular-nums mt-0.5">{money(calc.capexUsd)}</dd></div>
                  )}
                  <div className="p-3 rounded-xl bg-[#161022] border border-white/5"><dt className="text-[11px] font-mono text-slate-400">Deposit (1 month)</dt><dd className="font-mono font-bold text-white tabular-nums mt-0.5">{money(calc.depositUsd)}</dd></div>
                </dl>

                {calc.nudge && <p className="rounded-xl border border-[#C084FC]/30 bg-[#7C3AED]/10 px-4 py-3 text-xs text-[#E9D5FF]">{calc.nudge}</p>}
                {calc.turnkeyShort && (
                  <p className="rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-xs text-amber-200">
                    Turnkey builds start at 1 MW; this fleet draws {fmtNum(calc.totalKw)} kW, so the capex shown is for the 1 MW minimum. Plug &amp; play suits fleets below 1 MW.
                  </p>
                )}

                <div className="flex flex-wrap gap-3 pt-1">
                  <button type="button" onClick={handleLockInQuote} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-semibold text-sm transition">
                    <Lock className="w-4 h-4" aria-hidden="true" />
                    Send this estimate for a quote
                  </button>
                </div>

                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Hosting power bill only: watts × 24 h × running days ÷ 1,000 × rate, for 30 running days. It is not a mining revenue or profit estimate. Days a machine is offline are billed $0.
                  {currency === "AED" && " AED shown at the fixed dirham peg of 3.6725 per US dollar."}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#161022] overflow-hidden">
              <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between gap-3">
                <h3 className="font-semibold text-white flex items-center gap-2"><Calculator className="w-4 h-4 text-[#22D3EE]" aria-hidden="true" />Supported hardware</h3>
                <span className="font-mono text-xs text-slate-400">{models.length} models</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-left font-mono text-[11px] uppercase text-slate-400">
                    <tr><th scope="col" className="px-6 py-3">Model</th><th scope="col" className="px-3 py-3">Cooling</th><th scope="col" className="px-3 py-3">Hash rate</th><th scope="col" className="px-3 py-3 text-right">Power</th><th scope="col" className="px-6 py-3"><span className="sr-only">Estimate</span></th></tr>
                  </thead>
                  <tbody>
                    {models.map((m) => (
                      <tr key={m.slug} className="border-t border-white/5">
                        <th scope="row" className="px-6 py-2.5 font-medium text-white text-left whitespace-nowrap">{m.name}<small className="block font-mono text-[10px] text-slate-500">{m.algorithm} · {m.coins}</small></th>
                        <td className="px-3 py-2.5 text-slate-300">{m.cooling}</td>
                        <td className="px-3 py-2.5 font-mono text-slate-300 tabular-nums whitespace-nowrap">{m.hashrate}</td>
                        <td className="px-3 py-2.5 font-mono text-slate-300 tabular-nums text-right whitespace-nowrap">{fmtInt(m.watts)} W</td>
                        <td className="px-6 py-2.5 text-right">
                          <button type="button" onClick={() => { setSelectedSlug(m.slug); document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth" }); }}
                            className="rounded-lg border border-white/10 px-3 py-2 font-mono text-[11px] text-[#22D3EE] hover:border-[#22D3EE]">Estimate</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-16 md:py-24 border-b border-white/10 scroll-mt-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
            <div className="space-y-2">
              <p className="font-mono text-xs uppercase tracking-widest text-[#C084FC]">FAQ</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Common questions</h2>
            </div>
            <ul className="space-y-3">
              {faqs.map((f, i) => {
                const open = openFaq === i;
                return (
                  <li key={f.question} className={`rounded-2xl border bg-[#161022] transition ${open ? "border-[#C084FC]/60" : "border-white/10"}`}>
                    <h3>
                      <button type="button" aria-expanded={open} aria-controls={`faq-${i}`} id={`faq-q-${i}`} onClick={() => setOpenFaq(open ? null : i)}
                        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left text-sm sm:text-base font-semibold text-white">
                        <span>{f.question}</span>
                        <ChevronDown className={`w-5 h-5 shrink-0 text-[#C084FC] transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
                      </button>
                    </h3>
                    <div id={`faq-${i}`} role="region" aria-labelledby={`faq-q-${i}`} hidden={!open} className="px-5 pb-5 text-sm text-slate-300 leading-relaxed">
                      {f.answer}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="py-16 md:py-24 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5 space-y-6">
              <p className="font-mono text-xs uppercase tracking-widest text-[#22D3EE]">Contact</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Request a hosting quote</h2>
              <p className="text-slate-300 text-sm sm:text-base">Send your machine models and quantity. {contact.person}, our {contact.personTitle}, replies with your rate and the hosting contract.</p>

              <div className="rounded-2xl border border-white/10 bg-[#161022] p-5 flex items-center gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={contact.photo} alt={`${contact.person}, ${contact.personTitle} at Segments Cloud`} width={64} height={64} className="w-16 h-16 rounded-xl object-cover" />
                <div className="min-w-0">
                  <div className="font-semibold text-white">{contact.person}</div>
                  <div className="text-xs text-slate-400">{contact.personTitle} · Segments Cloud</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <a href={contact.phoneUrl} className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-200 hover:bg-white/5"><Phone className="w-3.5 h-3.5" aria-hidden="true" />Call</a>
                    <a href={contact.whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-[#10B981]/40 px-3 py-2 text-xs text-[#10B981] hover:bg-[#10B981]/10"><MessageSquare className="w-3.5 h-3.5" aria-hidden="true" />WhatsApp</a>
                  </div>
                </div>
              </div>
              <ul className="text-xs text-slate-400 space-y-1 font-mono">
                <li>{contact.phone} · calls {contact.hours}, WhatsApp after hours</li>
                <li>{contact.email}</li>
                <li>{contact.office}</li>
              </ul>
            </div>

            <div className="lg:col-span-7 rounded-2xl border border-white/10 bg-[#161022] p-6 sm:p-8 space-y-5">
              {quoteLockedBanner && contactFleetSummary && (
                <div className="flex items-start justify-between gap-3 rounded-xl border border-[#22D3EE]/40 bg-[#22D3EE]/10 px-4 py-3 text-xs text-[#CFFAFE]">
                  <span><b className="text-white">Estimate added.</b> Your calculator figures are in the fleet details below.</span>
                  <button type="button" aria-label="Dismiss" onClick={() => setQuoteLockedBanner(false)} className="p-2 -m-2 text-slate-300 hover:text-white"><X className="w-4 h-4" aria-hidden="true" /></button>
                </div>
              )}
              <div className="grid sm:grid-cols-2 gap-4">
                <label className="space-y-1.5 text-xs font-mono uppercase text-slate-400">Full name *
                  <input value={contactName} onChange={(e) => setContactName(e.target.value)} autoComplete="name" maxLength={100} className={inputCls} />
                </label>
                <label className="space-y-1.5 text-xs font-mono uppercase text-slate-400">Company
                  <input value={contactCompany} onChange={(e) => setContactCompany(e.target.value)} autoComplete="organization" maxLength={150} className={inputCls} />
                </label>
              </div>
              <label className="block space-y-1.5 text-xs font-mono uppercase text-slate-400">Email or phone
                <input value={contactReach} onChange={(e) => setContactReach(e.target.value)} autoComplete="email" maxLength={200} className={inputCls} />
              </label>
              <label className="block space-y-1.5 text-xs font-mono uppercase text-slate-400">Fleet details
                <textarea value={contactFleetSummary} onChange={(e) => setContactFleetSummary(e.target.value)} rows={3} maxLength={1000}
                  placeholder="e.g. 85 × Antminer S21 XP, air-cooled, ready to ship next month" className={inputCls} />
              </label>
              <div className="flex flex-wrap gap-3 pt-1">
                <a href={canSend ? whatsappHref : undefined} aria-disabled={!canSend} target="_blank" rel="noopener noreferrer"
                  onClick={(e) => { if (!canSend) e.preventDefault(); }}
                  className={`inline-flex items-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-sm transition ${canSend ? "bg-[#7C3AED] hover:bg-[#6D28D9] text-white" : "bg-white/5 text-slate-500 cursor-not-allowed"}`}>
                  <MessageSquare className="w-4 h-4" aria-hidden="true" />
                  Get my hosting quote on WhatsApp
                </a>
                <a href={canSend ? mailHref : undefined} aria-disabled={!canSend}
                  onClick={(e) => { if (!canSend) e.preventDefault(); }}
                  className={`inline-flex items-center gap-2 px-5 py-3.5 rounded-xl border text-sm transition ${canSend ? "border-white/15 text-slate-200 hover:bg-white/5" : "border-white/5 text-slate-600 cursor-not-allowed"}`}>
                  <Mail className="w-4 h-4" aria-hidden="true" />
                  Send by email
                </a>
              </div>
              <p className="text-[11px] text-slate-500">Add your name and either your fleet details or how to reach you. Your message opens in WhatsApp or your email app, ready to send to {contact.person}.</p>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-[#0E0918]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid md:grid-cols-3 gap-8 text-sm text-slate-400">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-mark.webp" alt="" width={24} height={28} className="w-6 h-7 object-contain" />
              <span className="font-semibold text-white">{site.name}</span>
            </div>
            <address className="not-italic">{contact.office}</address>
            <p className="font-mono text-xs">{contact.email} · {contact.phone}</p>
          </div>
          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-6">
            {SECTIONS.map((s) => <a key={s.id} href={`#${s.id}`} className="py-2.5 hover:text-white">{s.label}</a>)}
          </nav>
          <div className="space-y-2 text-xs">
            <p>©{year ? ` ${year}` : ""} {site.legalNames.join(" · ")} · Dubai, UAE</p>
            <p>A hosting service. Mining returns are never guaranteed.</p>
          </div>
        </div>
      </footer>

      {/* MOBILE ACTION BAR */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-white/10 bg-[#0B0711]/95 backdrop-blur-xl px-4 py-3 grid grid-cols-[1fr_1fr_auto] gap-2">
        <a href="#calculator" className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/15 py-3 text-xs font-semibold text-slate-200"><Sliders className="w-4 h-4" aria-hidden="true" />Estimate</a>
        <a href="#contact" className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#7C3AED] py-3 text-xs font-semibold text-white">Request a quote</a>
        <a href={contact.whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="inline-flex items-center justify-center rounded-xl border border-[#10B981]/40 px-4 text-[#10B981]"><MessageSquare className="w-5 h-5" aria-hidden="true" /></a>
      </div>

      {/* SAMPLE REPORT MODAL */}
      {showInvoiceModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 p-0 sm:p-6" role="dialog" aria-modal="true" aria-labelledby="report-title" onClick={() => setShowInvoiceModal(false)}>
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl border border-white/10 bg-[#161022] p-6 space-y-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-xs uppercase text-[#10B981]">Monthly per-machine report</p>
                <h3 id="report-title" className="text-xl font-bold text-white mt-1">What your monthly report shows</h3>
                <span className="mt-2 inline-flex rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 font-mono text-[11px] text-amber-300">Sample report · illustrative figures</span>
              </div>
              <button type="button" onClick={() => setShowInvoiceModal(false)} aria-label="Close sample report" autoFocus className="rounded-lg border border-white/10 p-2.5 text-slate-300 hover:text-white"><X className="w-5 h-5" aria-hidden="true" /></button>
            </div>
            <div className="overflow-x-auto rounded-xl border border-white/10">
              <table className="w-full text-xs font-mono">
                <thead className="bg-[#0B0711] text-slate-400 text-left">
                  <tr><th scope="col" className="px-3 py-2.5">Machine</th><th scope="col" className="px-3 py-2.5">Model</th><th scope="col" className="px-3 py-2.5">Zone</th><th scope="col" className="px-3 py-2.5 text-right">Running days</th><th scope="col" className="px-3 py-2.5 text-right">Offline days</th><th scope="col" className="px-3 py-2.5 text-right">kWh</th><th scope="col" className="px-3 py-2.5 text-right">Charge</th></tr>
                </thead>
                <tbody className="text-slate-200 tabular-nums">
                  {REPORT_ROWS.map((r) => (
                    <tr key={r.id} className="border-t border-white/5">
                      <th scope="row" className="px-3 py-2.5 text-left text-white">{r.id}</th>
                      <td className="px-3 py-2.5 whitespace-nowrap">{r.m.name}</td>
                      <td className="px-3 py-2.5 whitespace-nowrap">{r.zone}</td>
                      <td className="px-3 py-2.5 text-right">{fmtNum(r.days)} / 30</td>
                      <td className={`px-3 py-2.5 text-right ${r.offline > 0 ? "text-[#10B981]" : ""}`}>{r.offline > 0 ? `${fmtNum(r.offline)} (billed $0)` : "0.0"}</td>
                      <td className="px-3 py-2.5 text-right">{fmtNum(r.kwh)}</td>
                      <td className="px-3 py-2.5 text-right">${fmtNum(r.usd, 2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot><tr className="border-t border-white/10 bg-[#0B0711]"><td colSpan={6} className="px-3 py-2.5 text-right text-slate-400">Total at ${REPORT_ROWS[0].rate.toFixed(3)}/kWh</td><td className="px-3 py-2.5 text-right font-bold text-white">${fmtNum(REPORT_TOTAL, 2)}</td></tr></tfoot>
              </table>
            </div>
            <p className="text-xs text-slate-400">Each machine is billed as watts × 24 h × running days ÷ 1,000 × rate. Running days come from your own pool data, so the 1.5 days Machine 03 was offline cost nothing. The real report arrives in your client group at the start of every month.</p>
          </div>
        </div>
      )}
    </div>
  );
}
