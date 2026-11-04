"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

type Item = { src: string; alt: string; caption: string };

/**
 * Full-screen viewer for the site photos (Ganushi, 4 Nov 2026). Mounted once in the layout; it listens for clicks on
 * any `.site-photo .photo-open` button, gathers every site photo currently visible on the page, and lets the visitor
 * move through them with the arrows, swipe, or the keyboard. Motion is transform and opacity only.
 */
export function PhotoLightbox() {
  const [items, setItems] = useState<Item[]>([]);
  const [index, setIndex] = useState(-1);
  const open = index >= 0;

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const btn = (e.target as HTMLElement).closest<HTMLButtonElement>(".site-photo .photo-open");
      if (!btn) return;
      e.preventDefault();
      const figures = [...document.querySelectorAll<HTMLElement>(".site-photo")].filter((f) => f.offsetParent !== null);
      const list = figures.map((f) => ({ src: f.dataset.full || f.querySelector("img")?.currentSrc || "", alt: f.querySelector("img")?.alt || "", caption: f.querySelector("figcaption")?.textContent || "" }));
      setItems(list);
      setIndex(Math.max(0, figures.indexOf(btn.closest<HTMLElement>(".site-photo")!)));
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const close = useCallback(() => setIndex(-1), []);
  const step = useCallback((d: number) => setIndex((i) => (items.length ? (i + d + items.length) % items.length : -1)), [items.length]);

  useEffect(() => {
    if (!open) return;
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", key);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", key); document.body.style.overflow = prev; };
  }, [open, close, step]);

  // Swipe on touch screens.
  const [touchX, setTouchX] = useState<number | null>(null);

  const item = open ? items[index] : null;
  return (
    <div className={`lightbox${open ? " is-open" : ""}`} role="dialog" aria-modal="true" aria-label="Photo viewer" aria-hidden={!open} onClick={(e) => { if (e.target === e.currentTarget) close(); }}
      onTouchStart={(e) => setTouchX(e.touches[0].clientX)} onTouchEnd={(e) => { if (touchX === null) return; const dx = e.changedTouches[0].clientX - touchX; if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1); setTouchX(null); }}>
      {item && (
        <figure className="lightbox-figure" key={item.src}>
          {/* eslint-disable-next-line @next/next/no-img-element -- the full-size site photo, already optimised at export */}
          <img src={item.src} alt={item.alt} />
          <figcaption>
            <span className="num">{String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}</span>
            <span>{item.caption}</span>
          </figcaption>
        </figure>
      )}
      <button type="button" className="lightbox-btn lightbox-close" onClick={close} aria-label="Close"><X size={22} /></button>
      {items.length > 1 && (
        <>
          <button type="button" className="lightbox-btn lightbox-prev" onClick={() => step(-1)} aria-label="Previous photo"><ChevronLeft size={26} /></button>
          <button type="button" className="lightbox-btn lightbox-next" onClick={() => step(1)} aria-label="Next photo"><ChevronRight size={26} /></button>
        </>
      )}
    </div>
  );
}
