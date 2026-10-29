import { useId } from "react";
import { contact } from "@/lib/site";

/** 3D-style WhatsApp mark: glossy green sphere with the phone-in-bubble glyph. Decorative; the link carries the label. */
export function WhatsAppIcon({ size = 30 }: { size?: number }) {
  const uid = useId().replace(/:/g, "");
  return (
    <svg className="wa-icon" width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id={`wa-ball-${uid}`} cx="35%" cy="28%" r="78%">
          <stop offset="0" stopColor="#8dfab4" />
          <stop offset="0.45" stopColor="#25d366" />
          <stop offset="1" stopColor="#0b7a3b" />
        </radialGradient>
        <linearGradient id={`wa-gloss-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.75" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <filter id={`wa-glyph-shadow-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0.8" stdDeviation="0.6" floodColor="#04461f" floodOpacity="0.55" />
        </filter>
      </defs>
      <circle cx="16" cy="16" r="15.5" fill={`url(#wa-ball-${uid})`} />
      <circle cx="16" cy="16" r="15" fill="none" stroke="#04461f" strokeOpacity="0.35" strokeWidth="1" />
      <ellipse cx="13.5" cy="8.2" rx="9" ry="5" fill={`url(#wa-gloss-${uid})`} />
      <g filter={`url(#wa-glyph-shadow-${uid})`}>
        <path d="M16 6.2c-5.4 0-9.8 4.3-9.8 9.6 0 1.8.5 3.5 1.4 5L6.1 25.9l5.2-1.4c1.4.8 3 1.2 4.7 1.2 5.4 0 9.8-4.3 9.8-9.6S21.4 6.2 16 6.2z" fill="none" stroke="#fff" strokeWidth="1.9" strokeLinejoin="round" />
        <path d="M12.9 10.8c-.2-.5-.4-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.1 1.1-1.1 2.7s1.2 3.1 1.3 3.3c.2.2 2.3 3.6 5.6 4.9 2.8 1.1 3.3.9 3.9.8.6-.1 1.9-.8 2.2-1.5.3-.7.3-1.3.2-1.5-.1-.1-.3-.2-.6-.4l-2.2-1c-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.3-.5-2.5-1.5-.9-.8-1.6-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.5-.6c.2-.2.2-.3.3-.5.1-.2.1-.4 0-.6l-1.1-2.5z" fill="#fff" />
      </g>
    </svg>
  );
}

/** Floating WhatsApp link (content/contact.md). Plain link, no script. */
export function WhatsAppButton() {
  if (!contact.whatsapp) return null;
  return (
    <a className="whatsapp-float" href={contact.whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label={`Chat with us on WhatsApp, ${contact.whatsapp}`}>
      <span className="wa-ring" aria-hidden="true" />
      <WhatsAppIcon size={34} />
      <span className="wa-label">WhatsApp</span>
    </a>
  );
}
