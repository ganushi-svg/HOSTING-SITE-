import { CheckCircle2, Info } from "lucide-react";
import { coolingSystems } from "@/lib/site";

/** Plain-language explainer for one cooling system (Sites tabs): what it is, how it differs, the benefits. */
export function CoolingExplainer({ kind }: { kind: "hydro" | "air" }) {
  const c = coolingSystems[kind];
  return (
    <article className={`panel explainer explainer-${kind}`}>
      <p className="eyebrow">{kind === "hydro" ? "Hydro cooling" : "Air cooling"} explained</p>
      <h3>{c.title}</h3>
      <p>{c.what}</p>
      <div className="explainer-diff">
        <Info size={18} aria-hidden="true" />
        <p><b>{kind === "hydro" ? "How it differs from air cooling" : "How it differs from hydro"}:</b> {c.differs}</p>
      </div>
      <h4>Benefits</h4>
      <ul>{c.benefits.map((b) => <li key={b}><CheckCircle2 size={17} aria-hidden="true" /> {b}</li>)}</ul>
      <p className="explainer-choose">{coolingSystems.choose}</p>
    </article>
  );
}
