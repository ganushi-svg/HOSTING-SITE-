"use client";

import { useEffect, useRef } from "react";

/** Short muted loop of real site footage. Plays only when the visitor has not asked for reduced motion. */
export function SiteVideo({ src, poster, label, caption }: { src: string; poster: string; label: string; caption: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    v.play().catch(() => {});
  }, []);

  return (
    <figure className="site-video">
      <video ref={ref} src={src} poster={poster} muted loop playsInline preload="metadata" controls aria-label={label} />
      <figcaption>{caption}</figcaption>
    </figure>
  );
}
