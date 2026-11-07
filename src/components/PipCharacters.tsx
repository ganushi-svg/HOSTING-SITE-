"use client";

import { useEffect, useId, useState } from "react";

/**
 * Four candidate characters for the site assistant (Ganushi, 7 Nov 2026; preview branch pip-preview).
 * A Nova (glass AI orb), B Mark (the Segments logo with a visor face), C Atlas (concierge robot bust),
 * D Miner buddy (a friendly ASIC miner: silver chassis, visor face, spinning front fan).
 * Same moods as Pip (idle, wave, think, talk, happy, listen); same 120 x 150 viewBox and the `pip` class, so the
 * launcher and chat header size them exactly like the old character. Motion is transform and opacity only.
 */
export type PipChar = "nova" | "mark" | "atlas" | "miner";
export type PipMood = "idle" | "wave" | "think" | "talk" | "happy" | "listen";
export const PIP_CHARS: { id: PipChar; letter: string; name: string }[] = [
  { id: "nova", letter: "A", name: "Nova" },
  { id: "mark", letter: "B", name: "Mark" },
  { id: "atlas", letter: "C", name: "Atlas" },
  { id: "miner", letter: "D", name: "Miner buddy" },
];
const KEY = "pip-char";
const LETTER: Record<string, PipChar> = { a: "nova", b: "mark", c: "atlas", d: "miner" };
const isChar = (v: string | null): v is PipChar => !!v && PIP_CHARS.some((c) => c.id === v);

/** The chosen character: ?pip=a|b|c|d (or a name) wins, then this browser's last choice, else Nova. */
export function usePipChar(): [PipChar, (c: PipChar) => void] {
  const [char, setChar] = useState<PipChar>("nova");
  useEffect(() => {
    const read = () => {
      let v: string | null = null;
      try {
        const q = new URLSearchParams(window.location.search).get("pip")?.toLowerCase() ?? null;
        v = q ? LETTER[q] ?? q : null;
        if (!isChar(v)) v = localStorage.getItem(KEY);
      } catch { /* storage blocked */ }
      if (isChar(v)) setChar(v);
    };
    const first = setTimeout(read, 0);
    const on = (e: Event) => { const d = (e as CustomEvent<string>).detail; if (isChar(d)) setChar(d); };
    window.addEventListener(KEY, on);
    return () => { clearTimeout(first); window.removeEventListener(KEY, on); };
  }, []);
  const choose = (c: PipChar) => {
    try { localStorage.setItem(KEY, c); } catch { /* storage blocked */ }
    window.dispatchEvent(new CustomEvent(KEY, { detail: c }));
  };
  return [char, choose];
}

function Eyes({ mood, cx, cy, gap, w, h, color }: { mood: PipMood; cx: number; cy: number; gap: number; w: number; h: number; color: string }) {
  const xs = [cx - gap / 2, cx + gap / 2];
  if (mood === "happy" || mood === "wave") {
    return <g className="pc-eyes">{xs.map((x) => <path key={x} d={`M${x - w} ${cy + 2} q${w} ${-h * 0.8} ${w * 2} 0`} fill="none" stroke={color} strokeWidth={w * 0.7} strokeLinecap="round" />)}</g>;
  }
  const dx = mood === "think" ? w * 0.5 : 0, dy = mood === "think" ? -h * 0.25 : 0;
  const hh = mood === "think" ? h * 0.72 : mood === "listen" ? h * 1.12 : h;
  return <g className="pc-eyes pc-blink">{xs.map((x) => <rect key={x} x={x - w / 2 + dx} y={cy - hh / 2 + dy} width={w} height={hh} rx={w / 2} fill={color} />)}</g>;
}
function Dots({ x, y, color }: { x: number; y: number; color: string }) {
  return <g className="pc-dots">{[0, 1, 2].map((i) => <circle key={i} cx={x + i * 6} cy={y} r="2.1" fill={color} />)}</g>;
}

export function PipCharacter({ char, mood }: { char: PipChar; mood: PipMood }) {
  const u = useId().replace(/[^a-zA-Z0-9]/g, "");
  const cls = `pip pc pc-${char} pc-${mood}`;
  const shadow = (
    <>
      <defs><radialGradient id={`${u}s`}><stop offset="0" stopColor="#000" stopOpacity="0.45" /><stop offset="1" stopColor="#000" stopOpacity="0" /></radialGradient></defs>
      <ellipse className="pc-shadow" cx="60" cy="142" rx="30" ry="5" fill={`url(#${u}s)`} />
    </>
  );

  if (char === "nova") {
    return (
      <svg className={cls} viewBox="0 0 120 150" aria-hidden="true" focusable="false">
        <defs>
          <radialGradient id={`${u}b`} cx="38%" cy="32%" r="75%"><stop offset="0" stopColor="#eaf3ff" /><stop offset="0.35" stopColor="#7fb2ff" /><stop offset="0.75" stopColor="#4a3fd0" /><stop offset="1" stopColor="#26166e" /></radialGradient>
          <radialGradient id={`${u}c`}><stop offset="0" stopColor="#9fe7ff" stopOpacity="0.9" /><stop offset="1" stopColor="#9fe7ff" stopOpacity="0" /></radialGradient>
          <linearGradient id={`${u}r`} x1="0" x2="1"><stop offset="0" stopColor="#5B8CFF" /><stop offset="0.6" stopColor="#C7B5FF" /><stop offset="1" stopColor="#F7BE27" /></linearGradient>
        </defs>
        {shadow}
        <g className="pc-float">
          <g transform="rotate(-16 60 80)"><ellipse cx="60" cy="80" rx="52" ry="14" fill="none" stroke={`url(#${u}r)`} strokeWidth="2" opacity="0.45" /></g>
          <circle cx="60" cy="78" r="34" fill={`url(#${u}b)`} />
          <circle className="pc-core" cx="60" cy="82" r="24" fill={`url(#${u}c)`} />
          <ellipse cx="48" cy="60" rx="14" ry="7.5" fill="#fff" opacity="0.45" transform="rotate(-24 48 60)" />
          <Eyes mood={mood} cx={60} cy={80} gap={17} w={5.2} h={12} color="#ffffff" />
          <g transform="rotate(-16 60 80)">
            <path d="M8 80 A52 14 0 0 0 112 80" fill="none" stroke={`url(#${u}r)`} strokeWidth="2.4" strokeLinecap="round" />
            <circle r="3.2" fill="#F7BE27"><animateMotion dur={mood === "think" ? "1.3s" : "5s"} repeatCount="indefinite" path="M8 80 A52 14 0 1 0 112 80 A52 14 0 1 0 8 80" /></circle>
          </g>
          {mood === "think" && <Dots x={76} y={120} color="#ffffff" />}
        </g>
      </svg>
    );
  }

  if (char === "mark") {
    return (
      <svg className={cls} viewBox="0 0 120 150" aria-hidden="true" focusable="false">
        <defs>
          <radialGradient id={`${u}h`}><stop offset="0" stopColor="#8fd3ff" stopOpacity="0.55" /><stop offset="1" stopColor="#8fd3ff" stopOpacity="0" /></radialGradient>
          <linearGradient id={`${u}v`} x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#1d2c72" /><stop offset="1" stopColor="#070d33" /></linearGradient>
        </defs>
        {shadow}
        <g className="pc-float">
          <circle className="pc-halo" cx="60" cy="78" r="48" fill={`url(#${u}h)`} />
          <image href="/logo-mark.webp" x="24" y="35" width="72" height="85" />
          <rect x="39" y="70" width="42" height="19" rx="9.5" fill={`url(#${u}v)`} stroke="rgba(255,255,255,0.45)" strokeWidth="1" />
          <Eyes mood={mood} cx={60} cy={79.5} gap={15} w={4.4} h={9.5} color="#ffffff" />
          {mood === "think" && <Dots x={78} y={130} color="#ffffff" />}
        </g>
      </svg>
    );
  }

  if (char === "atlas") {
    return (
      <svg className={cls} viewBox="0 0 120 150" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id={`${u}w`} x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#ffffff" /><stop offset="1" stopColor="#c9d3ea" /></linearGradient>
          <linearGradient id={`${u}v`} x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#1d2c72" /><stop offset="1" stopColor="#070d33" /></linearGradient>
          <linearGradient id={`${u}sh`} x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#f4f7ff" /><stop offset="1" stopColor="#a9b6d8" /></linearGradient>
        </defs>
        <g className="pc-float">
          <g transform="translate(0 30) scale(0.6)">
            <path d="M30 200 C 30 160, 58 148, 100 148 C 142 148, 170 160, 170 200 Z" fill={`url(#${u}sh)`} />
            <path d="M40 200 C 44 170, 66 160, 100 160 C 134 160, 156 170, 160 200" fill="none" stroke="#2f5fe0" strokeWidth="5" opacity="0.9" />
            <path d="M48 200 C 52 176, 70 168, 100 168 C 130 168, 148 176, 152 200" fill="none" stroke="#F7BE27" strokeWidth="2.5" />
            <image href="/logo-mark.webp" x="91" y="175" width="18" height="21" />
            <rect x="88" y="132" width="24" height="20" rx="6" fill="#55607f" />
            <g className="pc-head">
              <circle cx="52" cy="92" r="12" fill="#dfe6f7" stroke="#2f5fe0" strokeWidth="3" />
              <circle cx="148" cy="92" r="12" fill="#dfe6f7" stroke="#2f5fe0" strokeWidth="3" />
              <rect x="56" y="44" width="88" height="96" rx="40" fill={`url(#${u}w)`} />
              <ellipse cx="82" cy="60" rx="18" ry="8" fill="#fff" opacity="0.8" />
              <rect x="64" y="74" width="72" height="40" rx="18" fill={`url(#${u}v)`} />
              <path d="M70 80 q 20 -6 44 -2" stroke="#fff" strokeOpacity="0.35" strokeWidth="3" fill="none" strokeLinecap="round" />
              <Eyes mood={mood} cx={100} cy={95} gap={26} w={8} h={15} color="#7ee8ff" />
              {mood === "think" && <Dots x={122} y={126} color="#2f5fe0" />}
            </g>
          </g>
        </g>
      </svg>
    );
  }

  // D. Miner buddy: a friendly ASIC miner in a three-quarter view
  return (
    <svg className={cls} viewBox="0 0 120 150" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${u}f`} x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#f4f6fb" /><stop offset="0.55" stopColor="#cfd6e6" /><stop offset="1" stopColor="#a3aec8" /></linearGradient>
        <linearGradient id={`${u}sd`} x1="0" x2="1"><stop offset="0" stopColor="#aab5cd" /><stop offset="1" stopColor="#7d89a8" /></linearGradient>
        <linearGradient id={`${u}t`} x1="0" x2="1"><stop offset="0" stopColor="#ffffff" /><stop offset="1" stopColor="#d9dfec" /></linearGradient>
        <linearGradient id={`${u}v`} x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#1d2c72" /><stop offset="1" stopColor="#070d33" /></linearGradient>
        <radialGradient id={`${u}fan`}><stop offset="0" stopColor="#2a2f3c" /><stop offset="1" stopColor="#0d1018" /></radialGradient>
      </defs>
      {shadow}
      <g className="pc-float">
        {/* top and right side faces give the chassis depth */}
        <path d="M24 40 L34 31 L98 31 L88 40 Z" fill={`url(#${u}t)`} />
        <path d="M88 40 L98 31 L98 115 L88 124 Z" fill={`url(#${u}sd)`} />
        {[0, 1, 2, 3].map((i) => <path key={i} d={`M90.5 ${52 + i * 16} l5 -4.5 v8 l-5 4.5 z`} fill="#6f7a96" opacity="0.6" />)}
        {/* the coloured control wires every Antminer has */}
        <path d="M84 33 C 92 30, 96 40, 93 52" fill="none" stroke="#ff8a3d" strokeWidth="1.4" />
        <path d="M81 33 C 91 29, 99 44, 95 58" fill="none" stroke="#3d8bff" strokeWidth="1.4" />
        <path d="M78 33 C 90 28, 101 48, 96 64" fill="none" stroke="#f7d63d" strokeWidth="1.4" />
        {/* front face */}
        <rect x="24" y="40" width="64" height="84" rx="5" fill={`url(#${u}f)`} />
        <rect x="24.5" y="40.5" width="63" height="83" rx="4.5" fill="none" stroke="#ffffff" strokeOpacity="0.6" />
        {[[28, 44], [84, 44], [28, 120], [84, 120]].map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.6" fill="#8a95b1" />)}
        {/* visor face */}
        <rect x="31" y="47" width="50" height="21" rx="10.5" fill={`url(#${u}v)`} />
        <path d="M36 51 q 12 -3 28 -1" stroke="#fff" strokeOpacity="0.3" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <Eyes mood={mood} cx={56} cy={57.5} gap={17} w={5} h={10} color="#7ee8ff" />
        {/* front fan */}
        <circle cx="56" cy="96" r="23" fill="#3a4152" />
        <circle cx="56" cy="96" r="21" fill={`url(#${u}fan)`} />
        <g transform="translate(56 96)">
          <g className="pc-fan">
            <circle r="20" fill="none" />
            {Array.from({ length: 7 }, (_, i) => <path key={i} transform={`rotate(${(i * 360) / 7})`} d="M0 -3 C 5 -7, 11 -13, 6 -19 C 2 -15, -2 -9, 0 -3 Z" fill="#4b5366" />)}
          </g>
          <circle r="4" fill="#5a6378" />
          {[8, 13.5, 19].map((r) => <circle key={r} r={r} fill="none" stroke="#b9c1d4" strokeWidth="0.9" opacity="0.85" />)}
          <path d="M-19 0 H19 M0 -19 V19" stroke="#b9c1d4" strokeWidth="0.9" opacity="0.85" />
        </g>
        <image href="/logo-mark.webp" x="27.5" y="111" width="8" height="9.4" />
        <circle className="pc-led" cx="83" cy="117" r="2" fill="#3ccf74" />
        {mood === "think" && <Dots x={96} y={134} color="#ffffff" />}
      </g>
    </svg>
  );
}

/** Preview-only tray: shows all four characters and swaps the live assistant when one is picked. */
export function PipPicker() {
  const [char, choose] = usePipChar();
  const [open, setOpen] = useState(true);
  return (
    <aside className={`pip-picker${open ? "" : " is-closed"}`} aria-label="Preview: choose the assistant character">
      <button type="button" className="pp-toggle" onClick={() => setOpen((v) => !v)} aria-expanded={open}>{open ? "Hide" : "Choose assistant"}</button>
      {open && (
        <>
          <p className="pp-title">Preview · choose the assistant</p>
          <div className="pp-row">
            {PIP_CHARS.map((c) => (
              <button key={c.id} type="button" className={`pp-opt${char === c.id ? " is-on" : ""}`} aria-pressed={char === c.id} onClick={() => choose(c.id)}>
                <span className="pp-art"><PipCharacter char={c.id} mood={char === c.id ? "happy" : "idle"} /></span>
                <span className="pp-name"><b>{c.letter}</b> {c.name}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </aside>
  );
}
