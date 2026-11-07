import { useId } from "react";

/**
 * Pip, drawn as Miner buddy (Ganushi, 7 Nov 2026): a friendly ASIC miner in a three-quarter view. Brushed-aluminium
 * chassis, a glass visor face with light-bar eyes that follow the pointer, the square-framed front fan that spins up
 * while Pip thinks, the coloured control wires every Antminer has, status LEDs and an activity bar that pulses while it
 * talks. Same 120 x 150 viewBox and `pip` class as the old character, so the launcher and chat header size it the same.
 * Moods: idle, wave, think, talk, happy, listen. Motion is transform and opacity only (styles in pip-miner.css).
 */
export type PipMood = "idle" | "wave" | "think" | "talk" | "happy" | "listen";

function Eyes({ mood }: { mood: PipMood }) {
  const cy = 55.5, w = 5, h = 9.5, xs = [47.5, 64.5];
  if (mood === "happy" || mood === "wave") {
    return (
      <g className="pc-look">
        {xs.map((x) => (
          <g key={x}>
            <path d={`M${x - w} ${cy + 2} q${w} ${-h * 0.85} ${w * 2} 0`} fill="none" stroke="#7ee8ff" strokeOpacity="0.35" strokeWidth={w * 1.5} strokeLinecap="round" />
            <path d={`M${x - w} ${cy + 2} q${w} ${-h * 0.85} ${w * 2} 0`} fill="none" stroke="#bff4ff" strokeWidth={w * 0.62} strokeLinecap="round" />
          </g>
        ))}
      </g>
    );
  }
  const dx = mood === "think" ? 2.4 : 0, dy = mood === "think" ? -2.4 : 0;
  const hh = mood === "think" ? h * 0.72 : mood === "listen" ? h * 1.14 : h;
  return (
    <g className="pc-look">
      <g className="pc-blink">
        {xs.map((x) => (
          <g key={x}>
            <rect x={x - w / 2 - 1.6 + dx} y={cy - hh / 2 - 1.6 + dy} width={w + 3.2} height={hh + 3.2} rx={(w + 3.2) / 2} fill="#7ee8ff" opacity="0.28" />
            <rect x={x - w / 2 + dx} y={cy - hh / 2 + dy} width={w} height={hh} rx={w / 2} fill="#bff4ff" />
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
        <linearGradient id={id("front")} x1="0" x2="1"><stop offset="0" stopColor="#d9dfea" /><stop offset="0.16" stopColor="#f7f9fc" /><stop offset="0.52" stopColor="#ccd3e1" /><stop offset="0.8" stopColor="#e8ecf3" /><stop offset="1" stopColor="#b5bfd3" /></linearGradient>
        <linearGradient id={id("shade")} x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#ffffff" stopOpacity="0.35" /><stop offset="0.35" stopColor="#ffffff" stopOpacity="0" /><stop offset="1" stopColor="#0b1530" stopOpacity="0.16" /></linearGradient>
        <pattern id={id("brush")} width="4" height="1.6" patternUnits="userSpaceOnUse"><path d="M0 0.8 H4" stroke="#ffffff" strokeOpacity="0.16" strokeWidth="0.5" /></pattern>
        <linearGradient id={id("side")} x1="0" x2="1"><stop offset="0" stopColor="#b2bcd1" /><stop offset="1" stopColor="#7a86a5" /></linearGradient>
        <linearGradient id={id("top")} x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#ffffff" /><stop offset="1" stopColor="#d8dfec" /></linearGradient>
        <linearGradient id={id("visor")} x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#1f2f78" /><stop offset="1" stopColor="#060b2c" /></linearGradient>
        <radialGradient id={id("vglow")} cx="50%" cy="60%" r="60%"><stop offset="0" stopColor="#7ee8ff" stopOpacity="0.28" /><stop offset="1" stopColor="#7ee8ff" stopOpacity="0" /></radialGradient>
        <radialGradient id={id("fan")}><stop offset="0" stopColor="#2c3242" /><stop offset="1" stopColor="#0c0f17" /></radialGradient>
        <linearGradient id={id("blade")} x1="0" x2="1"><stop offset="0" stopColor="#626b80" /><stop offset="1" stopColor="#3b4254" /></linearGradient>
        <radialGradient id={id("blur")}><stop offset="0" stopColor="#9aa6bd" stopOpacity="0.5" /><stop offset="0.75" stopColor="#9aa6bd" stopOpacity="0.22" /><stop offset="1" stopColor="#9aa6bd" stopOpacity="0" /></radialGradient>
        <radialGradient id={id("ground")}><stop offset="0" stopColor="#7ee8ff" stopOpacity="0.32" /><stop offset="1" stopColor="#7ee8ff" stopOpacity="0" /></radialGradient>
        <radialGradient id={id("shadow")}><stop offset="0" stopColor="#000" stopOpacity="0.5" /><stop offset="1" stopColor="#000" stopOpacity="0" /></radialGradient>
      </defs>

      <ellipse className="pc-ground" cx="60" cy="140" rx="44" ry="8" fill={url("ground")} />
      <ellipse className="pc-shadow" cx="60" cy="140" rx="31" ry="4.6" fill={url("shadow")} />

      <g className="pc-float">
        {/* top and right side faces give the chassis depth */}
        <path d="M24 40 L35 30 L99 30 L88 40 Z" fill={url("top")} />
        <path d="M30 37.5 L37 31.8 L95 31.8" fill="none" stroke="#ffffff" strokeWidth="0.8" opacity="0.9" />
        <path d="M88 40 L99 30 L99 114 L88 124 Z" fill={url("side")} />
        {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M90.6 ${50 + i * 13} l6 -5.4 v6 l-6 5.4 z`} fill="#5d6886" opacity="0.65" />)}
        <path d="M88 40 V124" stroke="#ffffff" strokeOpacity="0.55" strokeWidth="0.8" />

        {/* the coloured control wires every Antminer has */}
        <path d="M85 32.5 C 93 29, 97.5 38, 94.5 50" fill="none" stroke="#ff8a3d" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M82 32.5 C 92 28, 99.5 43, 96 57" fill="none" stroke="#3d8bff" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M79 32.5 C 91 27.5, 101 48, 97 64" fill="none" stroke="#f7d63d" strokeWidth="1.3" strokeLinecap="round" />

        {/* front face: brushed aluminium */}
        <rect x="24" y="40" width="64" height="84" rx="5" fill={url("front")} />
        <rect x="24" y="40" width="64" height="84" rx="5" fill={url("brush")} />
        <rect x="24" y="40" width="64" height="84" rx="5" fill={url("shade")} />
        <rect x="24.5" y="40.5" width="63" height="83" rx="4.5" fill="none" stroke="#ffffff" strokeOpacity="0.75" strokeWidth="0.9" />
        <path d="M27 123.5 H85" stroke="#7a86a5" strokeOpacity="0.6" strokeWidth="1" />

        {/* glass visor face */}
        <rect x="30.5" y="45" width="51" height="21" rx="10.5" fill={url("visor")} />
        <rect x="30.5" y="45" width="51" height="21" rx="10.5" fill={url("vglow")} />
        <rect x="30.5" y="45" width="51" height="21" rx="10.5" fill="none" stroke="#ffffff" strokeOpacity="0.55" strokeWidth="0.8" />
        <path d="M35.5 49 q 13 -3 30 -1.2" stroke="#ffffff" strokeOpacity="0.32" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <Eyes mood={mood} />

        {/* square-framed front fan */}
        <rect x="35" y="70" width="42" height="42" rx="4" fill="#2a303d" />
        <rect x="35.5" y="70.5" width="41" height="41" rx="3.5" fill="none" stroke="#5a6378" strokeWidth="0.8" />
        {[[38.6, 73.6], [73.4, 73.6], [38.6, 108.4], [73.4, 108.4]].map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.5" fill="#9aa4ba" />)}
        <circle cx="56" cy="91" r="18.6" fill={url("fan")} />
        <g transform="translate(56 91)">
          <g className="pc-fan">
            <circle r="18" fill="none" />
            {Array.from({ length: 7 }, (_, i) => <path key={i} transform={`rotate(${(i * 360) / 7})`} d="M0 -2.6 C 4.6 -6, 10 -11.4, 5.6 -16.8 C 2 -12.8, -1.6 -8, 0 -2.6 Z" fill={url("blade")} />)}
          </g>
          <circle className="pc-blur" r="17.4" fill={url("blur")} />
          <circle r="4.2" fill="#555e73" />
          <circle r="1.6" fill="#7ee8ff" opacity="0.85" />
          {[7.5, 12.5, 17.8].map((r) => <circle key={r} r={r} fill="none" stroke="#c2c9d9" strokeWidth="0.8" opacity="0.85" />)}
          <path d="M-17.8 0 H17.8 M0 -17.8 V17.8" stroke="#c2c9d9" strokeWidth="0.8" opacity="0.85" />
        </g>

        {/* badge, activity bar and status LEDs */}
        <image href="/logo-mark.webp" x="27.4" y="113.2" width="7.4" height="8.7" />
        <rect className="pc-activity" x="44" y="116.2" width="24" height="2.4" rx="1.2" fill="#7ee8ff" />
        <circle className="pc-led" cx="83.2" cy="117.4" r="1.9" fill="#3ccf74" />
        <circle cx="78.2" cy="117.4" r="1.4" fill="#f7be27" opacity="0.85" />

        {mood === "think" && (
          <g className="pc-dots">{[0, 1, 2].map((i) => <circle key={i} cx={98 + i * 6} cy={22} r="2.1" fill="#ffffff" />)}</g>
        )}
      </g>
    </svg>
  );
}
