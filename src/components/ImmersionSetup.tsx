import { SiteVideo } from "./SiteVideo";
import { immersionSetup, airSetup3d, hydroSetup3d } from "@/lib/site";
import "./immersion-setup.css";

/**
 * Immersion cooling system (Ganushi, 14 Nov 2026), the third setup after the hydro container. A 10-second 3D motion of
 * Segments' immersion container, rendered from her immersion build model with the maker's marks replaced by the
 * Segments mark: a slow swing that opens into a cutaway of the dielectric tank. Next to it, a short overview like the
 * other two setups and the four-step heat loop. Concept model: no capacity or performance figures (content/sites.md).
 */
type Setup3dData = typeof immersionSetup;
const DATA: Record<"immersion" | "air" | "hydro", Setup3dData> = { immersion: immersionSetup, air: airSetup3d, hydro: hydroSetup3d };

/** The same 3D-motion-plus-overview pane for the air-cooled and hydro setups (Ganushi, 14 Nov 2026). */
export function Setup3D({ kind }: { kind: "immersion" | "air" | "hydro" }) {
  return <ImmersionSetup data={DATA[kind]} />;
}

export function ImmersionSetup({ data }: { data?: Setup3dData } = {}) {
  const s = data ?? immersionSetup;
  return (
    <div className="imm-pane">
      <div className="imm-visual">
        <SiteVideo src={s.video.src} poster={s.video.poster} label={s.video.label} caption={s.video.caption} />
        <span className="imm-tag">{s.tag}</span>
      </div>
      <div className="panel imm-card">
        <p className="eyebrow">{s.eyebrow}</p>
        <h4>{s.title}</h4>
        <p className="muted">{s.intro}</p>
        <ul className="dot-list">{s.points.map((p) => <li key={p}>{p}</li>)}</ul>
        <ol className="imm-loop" aria-label={s.loopLabel}>
          {s.loop.map((l, i) => (
            <li key={l.title} className={`is-${l.tone}`}>
              <span className="num">{i + 1}</span>
              <div><b>{l.title}</b><small>{l.text}</small></div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
