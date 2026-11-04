import { useId } from "react";

/** Badge for quote buttons: navy circle whose arrow slides out and back in on hover. Decorative. */
export function QuoteIcon({ size = 26 }: { size?: number }) {
  const clip = useId();
  const arrow = "M11.5 20.5 20 12M13.8 11.6H20.4V18.2";
  return (
    <svg className="quote-icon" width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <defs><clipPath id={clip}><circle cx="16" cy="16" r="13" /></clipPath></defs>
      <circle cx="16" cy="16" r="15.5" fill="#0b1530" />
      <circle cx="16" cy="16" r="15" fill="none" stroke="#ffffff" strokeOpacity="0.14" />
      <g clipPath={`url(#${clip})`} fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path className="qi-a" d={arrow} />
        <path className="qi-b" d={arrow} />
      </g>
    </svg>
  );
}
