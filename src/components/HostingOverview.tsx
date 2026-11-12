import { ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { capacity, onboarding, services } from "@/lib/site";
import "./hosting-overview.css";

/**
 * "Hosting at a glance" under the key figures (Ganushi, 12 Nov 2026: a very good overview on the welcome page, so
 * visitors understand the setup). Who we are, from the approved Services wording (content/services.md › Overview),
 * then the six onboarding steps from quote to the first monthly report (content/contract-and-onboarding.md).
 * No new facts: everything comes from site.ts.
 */
export function HostingOverview() {
  const [first, second] = services.overview.split(/(?<=\.)\s+/);
  return (
    <section className="section hosting-overview" aria-labelledby="ho-title">
      <div className="container ho-grid">
        <div className="ho-intro">
          <p className="eyebrow">Hosting at a glance</p>
          <h2 id="ho-title">You own the machines. We run everything around them.</h2>
          <p className="lead">{first} {second}</p>
          <ul className="ho-facts" aria-label="What hosting with Segments means">
            <li><b className="num">{capacity.totalMw} MW</b><span>of power across Abu Dhabi</span></li>
            <li><b>24/7</b><span>technicians on site</span></li>
            <li><b>$0</b><span>for days a machine is offline</span></li>
          </ul>
          <a className="button" href="#contact">Start with a quote <ArrowRight size={18} aria-hidden="true" /></a>
        </div>
        <Reveal delay={0.08} className="panel ho-journey">
          <p className="ho-journey-title">From your first message to your first monthly report</p>
          <ol>
            {onboarding.map((s, i) => (
              <li key={s.title}>
                <span className="ho-step num" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                  <span className="ho-chip">{s.fact}</span>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
