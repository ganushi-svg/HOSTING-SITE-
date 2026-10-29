"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { nav, site } from "@/lib/site";
import { QuoteIcon } from "./QuoteIcon";

export function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const close = () => setOpen(false);

  return (
    <header className="header-shell">
      <nav className="nav container" aria-label="Main navigation">
        <Link href="/" className="brand" onClick={close} aria-label={`${site.name} home`}>
          <Image src="/logo-mark.webp" width={30} height={35} alt="" priority />
          <span className="brand-text">
            {site.name}
            <small>Mining hosting · {site.serviceArea}</small>
          </span>
        </Link>
        <div className="nav-links">
          {nav.map((link) => (
            <Link key={link.href} href={link.href} aria-current={pathname === link.href ? "page" : undefined}>
              {link.label}
            </Link>
          ))}
        </div>
        <Link className="button button-small nav-cta" href="/contact">
          Request a quote <QuoteIcon size={24} />
        </Link>
        <button
          className="menu-toggle"
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
        </button>
      </nav>
      {open && (
        <div className="mobile-menu" id="mobile-menu">
          {nav.map((link) => (
            <Link key={link.href} href={link.href} onClick={close} aria-current={pathname === link.href ? "page" : undefined}>
              {link.label}
            </Link>
          ))}
          <Link className="button" href="/contact" onClick={close}>
            Request a quote <QuoteIcon size={24} />
          </Link>
        </div>
      )}
    </header>
  );
}
