import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { QuoteCallout } from "@/components/QuoteCallout";
import { SampleReport } from "@/components/SampleReport";
import { TODO } from "@/components/TODO";
import { services } from "@/lib/site";

export const metadata: Metadata = {
  title: "Monitoring and Reporting",
  description: "How Segments Cloud hosting clients see their machines, with a redacted sample of the monthly power and hosting report.",
  alternates: { canonical: "/monitoring" },
};

export default function MonitoringPage() {
  return (
    <main id="main" className="subpage">
      <div className="container">
        <PageHero kicker="Monitoring and reporting" title="See what your" highlight="machines are doing." lede="Every machine is tracked, and every charge on your invoice can be traced to a machine and a day." />

        <section className="subpage-block grid-2" aria-label="What you can see">
          {services.monitoring.map((m) => (
            <div className="panel" key={m}><ul className="dot-list"><li>{m}</li></ul></div>
          ))}
        </section>

        <section className="subpage-block" aria-labelledby="report-title">
          <span className="section-kicker">Sample</span>
          <h2 id="report-title">Sample client report</h2>
          <p className="section-lede">
            An extract from a real September 2026 report. Client name, worker IDs, serial numbers, asset tags, IP addresses, pool addresses and site codes are removed, and charges are shown at today&apos;s published rate.
          </p>
          <SampleReport />
          <div style={{ marginTop: 20 }}><TODO source="assets/report-sample">Ganushi to approve this redacted extract before the site goes live</TODO></div>
        </section>

        <QuoteCallout />
      </div>
    </main>
  );
}
