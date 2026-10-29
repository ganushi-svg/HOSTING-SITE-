import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Droplets, Fan } from "lucide-react";
import { MinerArt } from "@/components/MinerArt";
import { monthlyEstimate, renderFor, usd, type Model } from "@/lib/models";

/** Clickable model card: the whole card opens the model's hosting page. */
export function ModelCard({ m }: { m: Model }) {
  const est = monthlyEstimate(m.watts);
  const render = renderFor(m.slug);
  return (
    <Link href={`/models/${m.slug}`} className={m.featured ? "model-card model-card-featured" : "model-card"}>
      <div className="model-card-art">
        {render ? (
          <Image className="model-render" src={render.poster} alt={`3D render of the ${m.name}`} width={960} height={720} sizes="(min-width: 1100px) 300px, (min-width: 600px) 45vw, 90vw" />
        ) : (
          <MinerArt id={m.slug} cooling={m.cooling} algorithm={m.algorithm} />
        )}
      </div>
      <div className="model-card-top">
        <span className="model-badge">{m.cooling === "Hydro" ? <Droplets size={14} aria-hidden="true" /> : <Fan size={14} aria-hidden="true" />} {m.cooling}-cooled</span>
        {m.featured && <span className="model-badge model-badge-gold">Featured</span>}
      </div>
      <h3>{m.name}</h3>
      <dl className="model-specs">
        <div><dt>Power</dt><dd>{m.watts.toLocaleString("en-US")} W</dd></div>
        <div><dt>Algorithm</dt><dd>{m.algorithm}</dd></div>
        <div><dt>Power cost / 30 days</dt><dd>{usd(est.from)} – {usd(est.to)}</dd></div>
      </dl>
      <span className="service-link">View full hosting details <ArrowUpRight size={16} aria-hidden="true" /></span>
    </Link>
  );
}
