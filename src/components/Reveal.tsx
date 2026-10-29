"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Fades content in as it scrolls into view. Content is fully visible in the server HTML
 * and stays visible without JavaScript and above the fold. Reduced-motion users get a gentler version (globals.css).
 * It checks position on scroll, so a fast jump past a section can never leave it hidden.
 */
export function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const inView = () => el.getBoundingClientRect().top < window.innerHeight * 0.92;
    if (inView()) return; // already on screen: never hide it
    el.classList.add("reveal-pending");
    el.style.transitionDelay = `${delay}s`;
    let frame = 0;
    const check = () => {
      frame = 0;
      if (!inView()) return;
      el.classList.remove("reveal-pending");
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(check); };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [delay]);

  return <div ref={ref} className={`reveal ${className}`}>{children}</div>;
}
