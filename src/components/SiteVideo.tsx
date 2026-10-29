"use client";

import { useEffect, useRef } from "react";

/** Short muted loop of real site footage. Plays for every visitor; controls stay visible so it can be paused. */
export function SiteVideo({ src, poster, label, caption }: { src: string; poster: string; label: string; caption: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.play().catch(() => {});
  }, []);

  return (
    <figure className="site-video">
      <video ref={ref} src={src} poster={poster} muted loop playsInline preload="metadata" controls aria-label={label} />
      <figcaption>{caption}</figcaption>
    </figure>
  );
}
