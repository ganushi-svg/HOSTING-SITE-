/** Badge for quote buttons: solid navy circle with a crisp arrow. Decorative. */
export function QuoteIcon({ size = 26 }: { size?: number }) {
  return (
    <svg className="quote-icon" width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <circle cx="16" cy="16" r="15.5" fill="#0b1530" />
      <circle cx="16" cy="16" r="15" fill="none" stroke="#ffffff" strokeOpacity="0.14" />
      <path d="M11.5 20.5 20 12M13.8 11.6H20.4V18.2" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
