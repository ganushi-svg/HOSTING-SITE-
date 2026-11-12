import { SiteVideo } from "./SiteVideo";
import { TODO } from "./TODO";
import { siteCameras } from "@/lib/site";

/**
 * Site camera recordings (Ganushi, 12 Nov 2026): two clips from the site cameras, shown as silent loops with a
 * "Site camera · Recorded on site" badge (her choice: recorded footage is never called live). Before a clip is added it
 * must be trimmed, compressed and checked: faces, number plates and screen text blurred, and no camera positions,
 * entrances or other security detail visible (CLAUDE.md › Rules). Renders nothing until clips are added to site.ts.
 */
export function SiteCameras() {
  if (siteCameras.length === 0) return <TODO source="Ganushi">Two site camera recordings from her Drive folder</TODO>;
  return (
    <div className="site-cams">
      <div className="site-cams-grid">
        {siteCameras.map((c) => (
          <div key={c.src} className="cam-tile">
            <span className="cam-badge"><i aria-hidden="true" />Site camera · Recorded on site</span>
            <span className="cam-id" aria-hidden="true">{c.cam} · Abu Dhabi</span>
            <SiteVideo src={c.src} poster={c.poster} label={`Site camera recording, ${c.caption}`} caption={c.caption} />
          </div>
        ))}
      </div>
    </div>
  );
}
