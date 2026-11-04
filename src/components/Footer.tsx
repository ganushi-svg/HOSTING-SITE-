import Image from "next/image";
import { contact, sections, site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-top">
        <div className="footer-brand">
          <a href="#overview" className="brand">
            <Image src="/logo-mark.webp" width={24} height={28} alt="" />
            <span className="brand-text">{site.name}<small>Mining hosting · {site.serviceArea}</small></span>
          </a>
          <address>{contact.office}</address>
          <p><span className="selectable">{contact.email}</span> · <span className="selectable">{contact.phone}</span></p>
        </div>
        <nav aria-label="Footer" className="footer-links">
          {sections.map((s) => <a key={s.id} href={`#${s.id}`}>{s.label}</a>)}
        </nav>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} {site.legalNames.join(" · ")} · Dubai, UAE</span>
        <span><a href="#privacy">Privacy notice (draft)</a> · Terms of use on request{/* TODO legal: terms of use */}</span>
        <span>A hosting service. Mining returns are never guaranteed.</span>
      </div>
    </footer>
  );
}
