import { useId } from "react";
/** 3D-style badge for quote buttons: glossy navy sphere with a raised gold-and-white send arrow. Decorative. */
export function QuoteIcon({ size = 28 }: { size?: number }) {
  const uid = useId().replace(/:/g, "");
  return (
    <svg className="quote-icon" width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id={`qi-ball-${uid}`} cx="35%" cy="28%" r="80%">
          <stop offset="0" stopColor="#3a5d9c" />
          <stop offset="0.5" stopColor="#13254a" />
          <stop offset="1" stopColor="#050a17" />
        </radialGradient>
        <linearGradient id={`qi-gloss-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`qi-arrow-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#fbd24e" />
        </linearGradient>
        <filter id={`qi-shadow-${uid}`} x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0.4" dy="1" stdDeviation="0.6" floodColor="#000" floodOpacity="0.6" />
        </filter>
      </defs>
      <circle cx="16" cy="16" r="15.5" fill={`url(#qi-ball-${uid})`} />
      <circle cx="16" cy="16" r="15" fill="none" stroke="#fbd24e" strokeOpacity="0.55" strokeWidth="1" />
      <ellipse cx="13.5" cy="8.3" rx="9" ry="4.8" fill={`url(#qi-gloss-${uid})`} />
      <g filter={`url(#qi-shadow-${uid})`}>
        <path d="M10.2 21.8 20.4 11.6M13.2 11.2h7.6v7.6" fill="none" stroke={`url(#qi-arrow-${uid})`} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}
