import { SiteVideo } from "./SiteVideo";
import { immersionSetup } from "@/lib/site";
import "./immersion-setup.css";

/**
 * Immersion cooling system (Ganushi, 14 Nov 2026), the third setup after the hydro container. A 10-second 3D motion of
 * Segments' immersion container, rendered from her immersion build model with the maker's marks replaced by the
 * Segments mark: a slow swing that opens into a cutaway of the dielectric tank. Next to it, a short overview like the
 * other two setups and the four-step heat loop. Concept model: no capacity or performance figures (content/sites.md).
 */
export function ImmersionSetup() {
  const s = immersionSetup;
  return (
    <div className="imm-pane">
      <div className="imm-visual">
        <SiteVideo src={s.video.src} poster={s.video.poster} label={s.video.label} caption={s.video.caption} />
        <span className="imm-tag">3D model · turns and opens the tank</span>
      </div>
      <div className="panel imm-card">
        <p className="eyebrow">Immersion cooling</p>
        <h4>{s.title}</h4>
        <p className="muted">{s.intro}</p>
        <ul className="dot-list">{s.points.map((p) => <li key={p}>{p}</li>)}</ul>
        <ol className="imm-loop" aria-label="How heat leaves the container">
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
