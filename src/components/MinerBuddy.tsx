import { useId } from "react";

/**
 * Pip, drawn as Miner buddy (Ganushi, 7 Nov 2026; made realistic 8 Nov 2026). The body is Bitmain's own Antminer L7
 * product photo (shop.bitmain.com, background removed with Adobe; public/brand/pip-miner.webp, used under the Bitmain
 * permission in content/models.md). On top, drawn in the photo's own perspective: a glass display built into the side
 * panel with light-bar eyes that follow the pointer, a motion blur over the two real front fans so they read as running
 * (faster while Pip thinks), an activity bar that pulses while it talks and a status LED.
 * Same 120 x 150 viewBox and `pip` class as before. Motion is transform and opacity only (pip-miner.css).
 */
export type PipMood = "idle" | "wave" | "think" | "talk" | "happy" | "listen";

// Photo placement: 444 x 469 crop shown 112 wide at (4, 23.7), so 1 photo px = 0.2523 svg units.
const S = 0.2523, X0 = 4, Y0 = 23.7;
// Side panel measured on the photo (TL 150,170 · TR 413,95 · BL 150,460): local 0..100 across and down.
const PANEL = `matrix(${(2.63 * S).toFixed(4)} ${(-0.75 * S).toFixed(4)} 0 ${(2.9 * S).toFixed(4)} ${(X0 + 150 * S).toFixed(3)} ${(Y0 + 170 * S).toFixed(3)})`;
// The two front fans (guard ellipses on the photo: centre x 58, y 238 and 383; radii 44 x 74), as unit-50 circles.
const FANS = [238, 383].map((cy) => `translate(${(X0 + 58 * S).toFixed(2)} ${(Y0 + cy * S).toFixed(2)}) scale(${((44 * S) / 50).toFixed(4)} ${((74 * S) / 50).toFixed(4)})`);

function Eyes({ mood }: { mood: PipMood }) {
  const cy = 33, w = 7, h = 13, xs = [39, 61];
  if (mood === "happy" || mood === "wave") {
    return (
      <g className="pc-look">
        {xs.map((x) => (
          <g key={x}>
            <path d={`M${x - w} ${cy + 3} q${w} ${-h * 0.9} ${w * 2} 0`} fill="none" stroke="#7ee8ff" strokeOpacity="0.35" strokeWidth={w * 1.4} strokeLinecap="round" />
            <path d={`M${x - w} ${cy + 3} q${w} ${-h * 0.9} ${w * 2} 0`} fill="none" stroke="#c8f6ff" strokeWidth={w * 0.6} strokeLinecap="round" />
          </g>
        ))}
      </g>
    );
  }
  const dx = mood === "think" ? 3 : 0, dy = mood === "think" ? -3 : 0;
  const hh = mood === "think" ? h * 0.72 : mood === "listen" ? h * 1.14 : h;
  return (
    <g className="pc-look">
      <g className="pc-blink">
        {xs.map((x) => (
          <g key={x}>
            <rect x={x - w / 2 - 2.4 + dx} y={cy - hh / 2 - 2.4 + dy} width={w + 4.8} height={hh + 4.8} rx={(w + 4.8) / 2} fill="#7ee8ff" opacity="0.26" />
            <rect x={x - w / 2 + dx} y={cy - hh / 2 + dy} width={w} height={hh} rx={w / 2} fill="#c8f6ff" />
          </g>
        ))}
      </g>
    </g>
  );
}

export function MinerBuddy({ mood }: { mood: PipMood }) {
  const u = useId().replace(/[^a-zA-Z0-9]/g, "");
  const id = (s: string) => `${u}${s}`, url = (s: string) => `url(#${u}${s})`;
  return (
    <svg className={`pip pc pc-miner pc-${mood}`} viewBox="0 0 120 150" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={id("glass")} x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#1c2a6e" /><stop offset="1" stopColor="#050a26" /></linearGradient>
        <radialGradient id={id("glow")} cx="50%" cy="55%" r="60%"><stop offset="0" stopColor="#7ee8ff" stopOpacity="0.3" /><stop offset="1" stopColor="#7ee8ff" stopOpacity="0" /></radialGradient>
        <radialGradient id={id("blur")}><stop offset="0" stopColor="#d7dce6" stopOpacity="0.8" /><stop offset="0.55" stopColor="#aab2c2" stopOpacity="0.62" /><stop offset="0.9" stopColor="#7d8698" stopOpacity="0.4" /><stop offset="1" stopColor="#7d8698" stopOpacity="0" /></radialGradient>
        <radialGradient id={id("shadow")}><stop offset="0" stopColor="#000" stopOpacity="0.55" /><stop offset="1" stopColor="#000" stopOpacity="0" /></radialGradient>
        <radialGradient id={id("ground")}><stop offset="0" stopColor="#7ee8ff" stopOpacity="0.28" /><stop offset="1" stopColor="#7ee8ff" stopOpacity="0" /></radialGradient>
      </defs>

      <ellipse className="pc-ground" cx="62" cy="141" rx="56" ry="8" fill={url("ground")} />
      <ellipse className="pc-shadow" cx="62" cy="141" rx="50" ry="5" fill={url("shadow")} />

      <g className="pc-float">
        <image href="/brand/pip-miner.webp" x={X0} y={Y0} width="112" height={(469 * S).toFixed(2)} />

        {/* the two real front fans, running: a soft motion blur with light streaks turning over the photo's blades */}
        {FANS.map((t) => (
          <g key={t} transform={t}>
            <circle className="pc-blur" r="46" fill={url("blur")} />
            <g className="pc-fan">
              <circle r="50" fill="none" />
              {[0, 120, 240].map((a) => <path key={a} transform={`rotate(${a})`} d="M0 -42 A42 42 0 0 1 36.4 -21" fill="none" stroke="#ffffff" strokeOpacity="0.55" strokeWidth="4" strokeLinecap="round" />)}
              {[60, 180, 300].map((a) => <path key={a} transform={`rotate(${a})`} d="M0 -26 A26 26 0 0 1 22.5 -13" fill="none" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="3" strokeLinecap="round" />)}
            </g>
          </g>
        ))}

        {/* glass display built into the side panel, in the panel's perspective */}
        <g transform={PANEL}>
          <rect x="15" y="17" width="70" height="32" rx="14" fill="#0b1020" opacity="0.35" transform="translate(1.5 2)" />
          <rect x="15" y="17" width="70" height="32" rx="14" fill={url("glass")} />
          <rect x="15" y="17" width="70" height="32" rx="14" fill={url("glow")} />
          <rect x="15" y="17" width="70" height="32" rx="14" fill="none" stroke="#e9eef7" strokeWidth="1.4" />
          <path d="M22 22 q 22 -4 50 -1.5" stroke="#ffffff" strokeOpacity="0.28" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <Eyes mood={mood} />
          <rect className="pc-activity" x="38" y="55" width="24" height="3" rx="1.5" fill="#22d3ee" />
          <circle className="pc-led" cx="86" cy="88" r="2.6" fill="#3ccf74" />
          <circle cx="79" cy="88" r="2" fill="#f7be27" opacity="0.85" />
        </g>

        {mood === "think" && (
          <g className="pc-dots">{[0, 1, 2].map((i) => <circle key={i} cx={98 + i * 6} cy={14} r="2.1" fill="#ffffff" />)}</g>
        )}
      </g>
    </svg>
  );
}
