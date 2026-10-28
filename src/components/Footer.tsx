import Image from "next/image";
import Link from "next/link";
import { contact, nav, site } from "@/lib/site";
import { TODO } from "@/components/TODO";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <Link href="/" className="brand">
            <Image src="/logo-mark.webp" width={26} height={30} alt="" />
            <span className="brand-text">{site.name}</span>
          </Link>
          <p>Bitcoin mining hosting in the {site.serviceArea}.</p>
          <address className="footer-small">{contact.office}</address>
        </div>
        <div>
          <strong>Explore</strong>
          {nav.map((l) => (
            <Link key={l.href} href={l.href}>{l.label}</Link>
          ))}
          <Link href="/contact">Request a quote</Link>
        </div>
        <div>
          <strong>Contact</strong>
          <span className="selectable">{contact.email}</span>
          <span className="selectable">{contact.phone}</span>
          <Link href="/privacy">Privacy notice (draft)</Link>
          <TODO source="legal" inline>Terms of use</TODO>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} {site.legalNames.join(" · ")}</span>
        <span>A hosting service. Mining returns are never guaranteed.</span>
      </div>
    </footer>
  );
}
