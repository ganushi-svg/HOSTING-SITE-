import { SiteVideo } from "./SiteVideo";
import { TODO } from "./TODO";
import { siteCameras } from "@/lib/site";

/**
 * Site camera recordings (Ganushi, 12–13 Nov 2026): two clips from the site cameras as a small monitoring wall under the
 * sample dashboards. Each tile has a title bar above the picture (recording dot, camera number, caption, "Recorded on
 * site"), so nothing covers the camera's own date stamp. Recorded footage is never called live (her choice). Before a clip
 * is added it is trimmed, compressed and checked: no people, number plates, camera positions, entrances or other
 * security detail (CLAUDE.md › Rules).
 */
export function SiteCameras() {
  if (siteCameras.length === 0) return <TODO source="Ganushi">Two site camera recordings from her Drive folder</TODO>;
  return (
    <div className="site-cams">
      <div className="site-cams-head">
        <h4>Site cameras</h4>
        <p className="muted">Two of the cameras our team watches over the halls, recorded on site. Each clip plays as a silent loop.</p>
      </div>
      <div className="site-cams-grid">
        {siteCameras.map((c) => (
          <div key={c.src} className="cam-tile">
            <div className="cam-bar">
              <span className="cam-rec"><i aria-hidden="true" />{c.cam}</span>
              <span className="cam-cap">{c.caption}</span>
              <span className="cam-when">Site camera · Recorded on site</span>
            </div>
            <SiteVideo src={c.src} poster={c.poster} label={`Site camera recording: ${c.caption}`} caption={c.caption} />
          </div>
        ))}
      </div>
    </div>
  );
}
