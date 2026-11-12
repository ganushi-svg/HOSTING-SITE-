import { useId } from "react";

/**
 * Pip, drawn as Miner buddy (Ganushi, 7 Nov 2026; made realistic 8 Nov 2026; arms, legs and expressions 12 Nov 2026).
 * The body is Bitmain's own Antminer L7 product photo (shop.bitmain.com, background removed with Adobe;
 * public/brand/pip-miner.webp, used under the Bitmain permission in content/models.md). Drawn on top, in the photo's own
 * perspective: a glass display set into the side panel with light-bar eyes that follow the pointer and a mouth that
 * changes with the mood, a motion blur over the two real front fans, an activity bar and a status LED. Around it:
 * jointed arms with round hands (the right one waves), two short legs with boots (a walk cycle while Pip moves to a tab),
 * and, while Pip thinks, the miner hums and small bitcoins float up out of it.
 * Same 120 x 150 viewBox and `pip` class as before. Motion is transform and opacity only (pip-miner.css).
 */
export type PipMood = "idle" | "wave" | "think" | "talk" | "happy" | "listen";

// The miner sits a little smaller inside the viewBox so the arms and legs fit around it.
const BODY = "translate(10 6) scale(0.84)";
// Photo placement inside BODY: 444 x 469 crop shown 112 wide at (4, 23.7), so 1 photo px = 0.2523 svg units.
const S = 0.2523, X0 = 4, Y0 = 23.7;
// Side panel measured on the photo (TL 150,170 · TR 413,95 · BL 150,460): local 0..100 across and down.
const PANEL = `matrix(${(2.63 * S).toFixed(4)} ${(-0.75 * S).toFixed(4)} 0 ${(2.9 * S).toFixed(4)} ${(X0 + 150 * S).toFixed(3)} ${(Y0 + 170 * S).toFixed(3)})`;
// The two front fans (guard ellipses on the photo: centre x 58, y 238 and 383; radii 44 x 74), as unit-50 circles.
const FANS = [238, 383].map((cy) => `translate(${(X0 + 58 * S).toFixed(2)} ${(Y0 + cy * S).toFixed(2)}) scale(${((44 * S) / 50).toFixed(4)} ${((74 * S) / 50).toFixed(4)})`);

function Face({ mood }: { mood: PipMood }) {
  const cy = 30, w = 7, h = 12, xs = [39, 61];
  const happy = mood === "happy" || mood === "wave";
  const dx = mood === "think" ? 3 : 0, dy = mood === "think" ? -3 : 0;
  const hh = mood === "think" ? h * 0.7 : mood === "listen" ? h * 1.15 : h;
  return (
    <g className="pc-look">
      {happy ? (
        xs.map((x) => (
          <g key={x}>
            <path d={`M${x - w} ${cy + 3} q${w} ${-h * 0.9} ${w * 2} 0`} fill="none" stroke="#7ee8ff" strokeOpacity="0.35" strokeWidth={w * 1.4} strokeLinecap="round" />
            <path d={`M${x - w} ${cy + 3} q${w} ${-h * 0.9} ${w * 2} 0`} fill="none" stroke="#c8f6ff" strokeWidth={w * 0.6} strokeLinecap="round" />
          </g>
        ))
      ) : (
        <g className="pc-blink">
          {xs.map((x) => (
            <g key={x}>
              <rect x={x - w / 2 - 2.4 + dx} y={cy - hh / 2 - 2.4 + dy} width={w + 4.8} height={hh + 4.8} rx={(w + 4.8) / 2} fill="#7ee8ff" opacity="0.26" />
              <rect x={x - w / 2 + dx} y={cy - hh / 2 + dy} width={w} height={hh} rx={w / 2} fill="#c8f6ff" />
            </g>
          ))}
        </g>
      )}
      {/* mouth: a smile when happy, an opening line while talking, a small "o" when listening, flat while thinking */}
      {happy && <path d="M43 41 q7 6 14 0" fill="none" stroke="#c8f6ff" strokeWidth="2.4" strokeLinecap="round" />}
      {mood === "talk" && <rect className="pc-mouth-talk" x="45" y="39.5" width="10" height="4" rx="2" fill="#c8f6ff" />}
      {mood === "listen" && <circle cx="50" cy="42" r="2.4" fill="none" stroke="#c8f6ff" strokeWidth="1.8" />}
      {mood === "think" && <path d="M45 42 h9" stroke="#c8f6ff" strokeWidth="2.2" strokeLinecap="round" />}
      {mood === "idle" && <path d="M45 41 q5 3 10 0" fill="none" stroke="#c8f6ff" strokeOpacity="0.85" strokeWidth="2" strokeLinecap="round" />}
    </g>
  );
}

/** A jointed robot limb: upper and lower segment with a joint, ending in a round hand or a boot. */
function Arm({ side }: { side: "l" | "r" }) {
  // Shoulders sit on the chassis edges: the front face's outer edge and the side panel's back edge.
  const s = side === "l" ? { x: 16, y: 89 } : { x: 99, y: 74 };
  const dir = side === "l" ? -1 : 1;
  const elbow = { x: s.x + dir * 7, y: s.y + 11 };
  const hand = { x: elbow.x + dir * 1, y: elbow.y + 11 };
  return (
    <g className={`pc-arm pc-arm-${side}`}>
      <path d={`M${s.x} ${s.y} L${elbow.x} ${elbow.y} L${hand.x} ${hand.y}`} fill="none" stroke="#252b36" strokeWidth="8.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d={`M${s.x} ${s.y} L${elbow.x} ${elbow.y} L${hand.x} ${hand.y}`} fill="none" stroke="#b7c0cc" strokeWidth="5.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={s.x} cy={s.y} r="4.6" fill="#3b4352" stroke="#252b36" strokeWidth="1.2" />
      <circle cx={elbow.x} cy={elbow.y} r="3" fill="#22d3ee" stroke="#252b36" strokeWidth="1" />
      <g className="pc-hand">
        <circle cx={hand.x} cy={hand.y + 3} r="6.8" fill="#252b36" />
        <circle cx={hand.x - dir * 0.6} cy={hand.y + 2.2} r="5.2" fill="#e6ebf1" />
        <rect x={hand.x - 1.8 + dir * 4.2} y={hand.y - 1.6} width="3.6" height="6.4" rx="1.8" fill="#e6ebf1" stroke="#252b36" strokeWidth="1" />
      </g>
    </g>
  );
}

function Leg({ side }: { side: "l" | "r" }) {
  // Hips tucked under the chassis: the front leg below the fan face, the back leg below the side panel (higher, for depth).
  const hip = side === "l" ? { x: 30, y: 116 } : { x: 77, y: 106 };
  const foot = side === "l" ? 143 : 137;
  const len = foot - hip.y - 6;
  return (
    <g className={`pc-leg pc-leg-${side}`}>
      <rect x={hip.x - 4.6} y={hip.y} width="9.2" height={len} rx="4.2" fill="#252b36" />
      <rect x={hip.x - 3} y={hip.y} width="6" height={len - 1} rx="3" fill="#b7c0cc" />
      <circle cx={hip.x} cy={hip.y + len * 0.55} r="2.8" fill="#22d3ee" stroke="#252b36" strokeWidth="1" />
      <path d={`M${hip.x - 7.5} ${foot} q0 -8.5 7.5 -8.5 h2.5 q8.5 0 9.5 8.5 z`} fill="#20252f" />
      <path d={`M${hip.x - 6} ${foot - 1.5} q1.2 -5.6 6.2 -5.6`} fill="none" stroke="#5a6475" strokeWidth="1.4" strokeLinecap="round" />
    </g>
  );
}

export function MinerBuddy({ mood, walking = false }: { mood: PipMood; walking?: boolean }) {
  const u = useId().replace(/[^a-zA-Z0-9]/g, "");
  const id = (s: string) => `${u}${s}`, url = (s: string) => `url(#${u}${s})`;
  return (
    <svg className={`pip pc pc-miner pc-${mood}${walking ? " pc-walking" : ""}`} viewBox="0 0 120 150" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={id("glass")} x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#1c2a6e" /><stop offset="1" stopColor="#050a26" /></linearGradient>
        <radialGradient id={id("glow")} cx="50%" cy="55%" r="60%"><stop offset="0" stopColor="#7ee8ff" stopOpacity="0.3" /><stop offset="1" stopColor="#7ee8ff" stopOpacity="0" /></radialGradient>
        <radialGradient id={id("blur")}><stop offset="0" stopColor="#d7dce6" stopOpacity="0.8" /><stop offset="0.55" stopColor="#aab2c2" stopOpacity="0.62" /><stop offset="0.9" stopColor="#7d8698" stopOpacity="0.4" /><stop offset="1" stopColor="#7d8698" stopOpacity="0" /></radialGradient>
        <radialGradient id={id("shadow")}><stop offset="0" stopColor="#000" stopOpacity="0.55" /><stop offset="1" stopColor="#000" stopOpacity="0" /></radialGradient>
        <radialGradient id={id("ground")}><stop offset="0" stopColor="#7ee8ff" stopOpacity="0.28" /><stop offset="1" stopColor="#7ee8ff" stopOpacity="0" /></radialGradient>
        <radialGradient id={id("coin")} cx="40%" cy="35%"><stop offset="0" stopColor="#ffd27a" /><stop offset="0.7" stopColor="#f7931a" /><stop offset="1" stopColor="#c46f06" /></radialGradient>
      </defs>

      <ellipse className="pc-ground" cx="56" cy="142" rx="50" ry="7" fill={url("ground")} />
      <ellipse className="pc-shadow" cx="56" cy="141" rx="42" ry="4.5" fill={url("shadow")} />

      <g className="pc-float">
        <Leg side="r" />
        <Arm side="r" />
        <g className="pc-body">
          <g transform={BODY}>
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
              <rect x="15" y="15" width="70" height="36" rx="14" fill="#0b1020" opacity="0.35" transform="translate(1.5 2)" />
              <rect x="15" y="15" width="70" height="36" rx="14" fill={url("glass")} />
              <rect x="15" y="15" width="70" height="36" rx="14" fill={url("glow")} />
              <rect x="15" y="15" width="70" height="36" rx="14" fill="none" stroke="#e9eef7" strokeWidth="1.4" />
              <path d="M22 20 q 22 -4 50 -1.5" stroke="#ffffff" strokeOpacity="0.28" strokeWidth="2.2" fill="none" strokeLinecap="round" />
              <Face mood={mood} />
              <rect className="pc-activity" x="38" y="57" width="24" height="3" rx="1.5" fill="#22d3ee" />
              <circle className="pc-led" cx="86" cy="88" r="2.6" fill="#3ccf74" />
              <circle cx="79" cy="88" r="2" fill="#f7be27" opacity="0.85" />
            </g>
          </g>
        </g>
        <Leg side="l" />
        <Arm side="l" />

        {/* while thinking the miner works: bitcoins float up out of it */}
        {mood === "think" && (
          <g className="pc-coins">
            {[{ x: 34, d: 0 }, { x: 62, d: 0.5 }, { x: 48, d: 1 }, { x: 78, d: 1.5 }].map((c) => (
              <g key={c.x} transform={`translate(${c.x} 24)`}>
                <g className="pc-coin" style={{ animationDelay: `${c.d}s` }}>
                  <circle r="9" fill={url("coin")} stroke="#a85d05" strokeWidth="1.1" />
                  <circle r="6.6" fill="none" stroke="#ffe1a6" strokeOpacity="0.55" strokeWidth="0.8" />
                  <text x="0.3" y="4.1" textAnchor="middle" fontSize="11.5" fontWeight="800" fontFamily="Arial, Helvetica, sans-serif" fill="#ffffff">B</text>
                  <path d="M-1.4 -6.4 v2.1 M1.8 -6.4 v2.1 M-1.4 4.3 v2.1 M1.8 4.3 v2.1" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" />
                </g>
              </g>
            ))}
          </g>
        )}
      </g>
    </svg>
  );
}
