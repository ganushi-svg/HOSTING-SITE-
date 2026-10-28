import type { Metadata } from "next";
import { HydroLoop } from "@/components/HydroLoop";
import { PageHero } from "@/components/PageHero";
import { QuoteCallout } from "@/components/QuoteCallout";
import { Reveal } from "@/components/Reveal";
import { SitePhoto } from "@/components/SitePhoto";
import { SiteVideo } from "@/components/SiteVideo";
import { TODO } from "@/components/TODO";
import { capacity, photos, site, sites, siteVideo } from "@/lib/site";

export const metadata: Metadata = {
  title: "Hosting Sites and Infrastructure",
  description: `Segments Cloud runs ${capacity.totalMw} MW across ${sites.activeCount} mining hosting sites in the ${site.serviceArea}, with air-cooled halls and a hydro-cooled zone. See photos and video from our sites.`,
  alternates: { canonical: "/sites" },
};

const halls = [photos.rackRows, photos.powerDistribution];

export default function SitesPage() {
  return (
    <main id="main" className="subpage">
      <div className="container">
        <PageHero
          kicker="Sites and infrastructure"
          title="Our hosting sites"
          highlight={`in the ${site.serviceArea}.`}
          lede={`${capacity.totalMw} MW across ${sites.activeCount} active sites, each with a site in-charge and on-site hosting technicians.`}
        />

        <section className="subpage-block grid-3" aria-label="Site facts">
          <div className="stat"><span className="section-kicker">Capacity</span><span className="stat-value">{capacity.totalMw} MW</span><span className="stat-label">Operating power capacity across our sites</span></div>
          <div className="stat"><span className="section-kicker">Sites</span><span className="stat-value">{sites.activeCount}</span><span className="stat-label">Active hosting sites in the {site.serviceArea}</span></div>
          <div className="stat"><span className="section-kicker">Cooling</span><ul className="dot-list">{sites.cooling.map((c) => <li key={c}>{c}</li>)}</ul></div>
        </section>

        <section className="subpage-block" aria-labelledby="halls-title">
          <span className="section-kicker">Finished halls</span>
          <h2 id="halls-title">Ready for your machines</h2>
          <div className="showcase">
            <Reveal className="showcase-video"><SiteVideo src={siteVideo.src} poster={siteVideo.poster} label={siteVideo.caption} caption={siteVideo.caption} /></Reveal>
            <Reveal delay={0.08} className="showcase-tall"><SitePhoto photo={photos.finishedHallAisle} sizes="(min-width: 880px) 30vw, 100vw" /></Reveal>
            <Reveal delay={0.16} className="showcase-tall"><SitePhoto photo={photos.rackAisle} sizes="(min-width: 880px) 30vw, 100vw" /></Reveal>
          </div>
          <div className="photo-grid" style={{ marginTop: 24 }}>
            {halls.map((p, i) => <Reveal key={p.src} delay={i * 0.08}><SitePhoto photo={p} crop /></Reveal>)}
          </div>
        </section>

        <section className="subpage-block" aria-labelledby="hydro-title">
          <span className="section-kicker">Hydro cooling</span>
          <h2 id="hydro-title">How our hydro zone keeps miners cool</h2>
          <div className="split hydro-split">
            <Reveal><HydroLoop /></Reveal>
            <Reveal delay={0.1}><SitePhoto photo={photos.hydroPumps} crop /></Reveal>
          </div>
        </section>

        <section className="subpage-block" aria-labelledby="air-title">
          <span className="section-kicker">Air cooling</span>
          <h2 id="air-title">Exhaust-fan halls and open sites</h2>
          <div className="photo-grid">
            <Reveal><SitePhoto photo={photos.hallFanWall} crop /></Reveal>
            <Reveal delay={0.08}><SitePhoto photo={photos.siteExterior} crop /></Reveal>
          </div>
          <div style={{ marginTop: 24 }}><TODO source="assets/photos">Photos of the requested site and of hydro halls with machines running</TODO></div>
        </section>

        <QuoteCallout />
      </div>
    </main>
  );
}
