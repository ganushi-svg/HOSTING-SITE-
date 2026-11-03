"use client";

import { useEffect, useRef } from "react";

/**
 * Counts a number up from zero when it scrolls into view. The server HTML already holds the final value,
 * so the figure is right without JavaScript; reduced-motion visitors get a slower count (CLAUDE.md › Design).
 */
export function CountUp({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fmt = (n: number) => `${Math.round(n).toLocaleString("en-US")}${suffix}`;
    const duration = matchMedia("(prefers-reduced-motion: reduce)").matches ? 2600 : 1400;
    let raf = 0;
    const run = () => {
      const start = performance.now();
      const tick = (t: number) => {
        const p = Math.min(1, (t - start) / duration);
        el.textContent = fmt(value * (1 - Math.pow(1 - p, 3)));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      el.textContent = fmt(0);
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { io.disconnect(); run(); } }, { threshold: 0.6 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [value, suffix]);

  return <span ref={ref} className="count">{`${value.toLocaleString("en-US")}${suffix}`}</span>;
}
