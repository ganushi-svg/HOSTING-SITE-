import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { QuoteCallout } from "@/components/QuoteCallout";
import { SitePhoto } from "@/components/SitePhoto";
import { TODO } from "@/components/TODO";
import { photos, site, sites, capacity } from "@/lib/site";

export const metadata: Metadata = {
  title: "Hosting Sites and Infrastructure",
  description: `Segments Cloud runs ${sites.activeCount} mining hosting sites in the ${site.serviceArea}, with air-cooled halls and a hydro-cooled zone. See photos from our sites.`,
  alternates: { canonical: "/sites" },
};

const gallery = [photos.hallFanWall, photos.hydroPumps, photos.siteExterior, photos.coolingUnit];

export default function SitesPage() {
  return (
    <main id="main" className="subpage">
      <div className="container">
        <PageHero
          kicker="Sites and infrastructure"
          title="Our hosting sites"
          highlight={`in the ${site.serviceArea}.`}
          lede={`${sites.activeCount} active sites, each with a site in-charge and on-site hosting technicians.`}
        />

        <section className="subpage-block grid-3" aria-label="Site facts">
          <div className="stat"><span className="section-kicker">Sites</span><span className="stat-value">{sites.activeCount}</span><span className="stat-label">Active hosting sites in the {site.serviceArea}</span></div>
          <div className="stat"><span className="section-kicker">Cooling</span><ul className="dot-list">{sites.cooling.map((c) => <li key={c}>{c}</li>)}</ul></div>
          <div className="stat"><span className="section-kicker">Capacity</span><span className="stat-value">{capacity.totalMw} MW</span><span className="stat-label">Operating power capacity across our sites</span></div>
        </section>

        <section className="subpage-block" aria-labelledby="photos-title">
          <span className="section-kicker">Photos</span>
          <h2 id="photos-title">From our sites</h2>
          <p className="section-lede">Photos taken by our team during installation.</p>
          <div className="photo-grid">
            {gallery.map((p) => <SitePhoto key={p.src} photo={p} crop />)}
          </div>
          <div style={{ marginTop: 24 }}><TODO source="assets/photos">Photos of finished halls with machines running, and a site video</TODO></div>
        </section>

        <QuoteCallout />
      </div>
    </main>
  );
}
