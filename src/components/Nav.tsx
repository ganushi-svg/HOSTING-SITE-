"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { sections, site } from "@/lib/site";
import { QuoteIcon } from "./QuoteIcon";

/**
 * Sticky header for the single page: brand, the gold quote button, and a tab bar with one tab per section.
 * The tab for the section on screen is underlined in gold and kept scrolled into view on small screens.
 */
export function Nav() {
  const [active, setActive] = useState<string>(sections[0].id);
  const bar = useRef<HTMLElement>(null);

  useEffect(() => {
    const els = sections.map((s) => document.getElementById(s.id)).filter((el): el is HTMLElement => Boolean(el));
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = 150; // just below the sticky header
      let current: string = sections[0].id;
      for (const el of els) if (el.getBoundingClientRect().top <= line) current = el.id;
      // At the very bottom the last section is current even if it is short.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = els[els.length - 1]?.id ?? current;
      setActive(current);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    const tab = bar.current?.querySelector<HTMLElement>(`[data-section="${active}"]`);
    const list = bar.current;
    if (!tab || !list) return;
    if (list.scrollWidth <= list.clientWidth) return;
    const t = tab.getBoundingClientRect();
    const l = list.getBoundingClientRect();
    list.scrollTo({ left: list.scrollLeft + t.left - l.left - l.width / 2 + t.width / 2, behavior: "smooth" });
  }, [active]);

  return (
    <header className="header">
      <div className="container header-bar">
        <a href="#overview" className="brand" aria-label={`${site.name}, back to top`}>
          <Image src="/logo-mark.webp" width={30} height={35} alt="" priority />
          <span className="brand-text">
            {site.name}
            <small>Mining hosting · {site.serviceArea}</small>
          </span>
        </a>
        <a className="button button-small" href="#contact">
          Request a quote <QuoteIcon size={22} />
        </a>
      </div>
      <nav className="section-tabs" aria-label="Page sections" ref={bar}>
        <div className="container section-tabs-inner">
          {sections.map((s) => (
            <a key={s.id} href={`#${s.id}`} data-section={s.id} aria-current={active === s.id ? "true" : undefined}>
              {s.label}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}
