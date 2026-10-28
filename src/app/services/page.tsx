import type { Metadata } from "next";
import { Droplets, FileBarChart, Wrench, Zap } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { QuoteCallout } from "@/components/QuoteCallout";
import { TODO } from "@/components/TODO";
import { services } from "@/lib/site";

export const metadata: Metadata = {
  title: "Hosting Services",
  description: "What Segments Cloud mining hosting includes: tracked power, air and hydro cooling, on-site technicians, in-house repair and per-machine monitoring.",
  alternates: { canonical: "/services" },
};

const groups = [
  { id: "power", icon: Zap, title: "Power", items: services.power },
  { id: "cooling", icon: Droplets, title: "Cooling", items: services.cooling },
  { id: "operations", icon: Wrench, title: "Operations and repair", items: services.operations },
  { id: "monitoring", icon: FileBarChart, title: "Monitoring", items: services.monitoring },
];

export default function ServicesPage() {
  return (
    <main id="main" className="subpage">
      <div className="container">
        <PageHero kicker="Services" title="What hosting" highlight="includes.">
          <TODO source="content/services.md">One-paragraph overview of the hosting service</TODO>
        </PageHero>

        <section className="subpage-block grid-2" aria-label="Service groups">
          {groups.map((g) => (
            <article id={g.id} key={g.id} className="panel">
              <h2><g.icon size={22} aria-hidden="true" style={{ color: "var(--accent)", verticalAlign: "-3px", marginRight: 10 }} />{g.title}</h2>
              <ul className="dot-list">{g.items.map((i) => <li key={i}>{i}</li>)}</ul>
            </article>
          ))}
        </section>

        <section className="subpage-block" aria-labelledby="models-title">
          <span className="section-kicker">Machines</span>
          <h2 id="models-title">Models we host today</h2>
          <p className="section-lede">Ask us about any model not listed here.</p>
          <div className="grid-2">
            <div className="panel"><h3 style={{ marginTop: 0 }}>Air-cooled</h3><ul className="chips">{services.modelsAir.map((m) => <li key={m}>{m}</li>)}</ul></div>
            <div className="panel"><h3 style={{ marginTop: 0 }}>Hydro-cooled</h3><ul className="chips">{services.modelsHydro.map((m) => <li key={m}>{m}</li>)}</ul></div>
          </div>
        </section>

        <QuoteCallout />
      </div>
    </main>
  );
}
