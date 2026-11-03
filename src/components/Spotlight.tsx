"use client";

import { useEffect } from "react";

/** Moves the soft blue glow on glass panels to follow the cursor (Midnight Glow theme). Renders nothing. */
export function Spotlight() {
  useEffect(() => {
    if (!matchMedia("(hover: hover)").matches) return;
    let frame = 0;
    let last: PointerEvent | null = null;
    const paint = () => {
      frame = 0;
      const e = last;
      if (!e) return;
      const panel = (e.target as Element | null)?.closest?.<HTMLElement>(".panel, .overview");
      if (!panel) return;
      const r = panel.getBoundingClientRect();
      panel.style.setProperty("--mx", `${e.clientX - r.left}px`);
      panel.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    const move = (e: PointerEvent) => { last = e; if (!frame) frame = requestAnimationFrame(paint); };
    window.addEventListener("pointermove", move, { passive: true });
    return () => { window.removeEventListener("pointermove", move); if (frame) cancelAnimationFrame(frame); };
  }, []);
  return null;
}
