"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Short muted loop of real site footage, with no controls (Ganushi, 4 Nov 2026). It loads a little before it
 * scrolls into view and plays while visible, pausing when it leaves so several videos never decode at once.
 * If the browser pauses or blocks it (power saving, autoplay rules), it retries on the next touch or scroll.
 */
export function SiteVideo({ src, poster, label, caption }: { src: string; poster: string; label: string; caption: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    v.setAttribute("muted", "");
    v.setAttribute("playsinline", "");
    let visible = false;
    const tryPlay = () => { if (visible && v.paused && v.currentSrc) v.play().catch(() => {}); };
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) { setNear(true); tryPlay(); } else if (!v.paused) v.pause();
    }, { rootMargin: "400px 0px", threshold: 0 });
    io.observe(v);
    v.addEventListener("canplay", tryPlay);
    v.addEventListener("loadeddata", tryPlay);
    // Retry after the visitor interacts, for browsers that block autoplay until then.
    const retry = () => tryPlay();
    window.addEventListener("touchstart", retry, { passive: true });
    window.addEventListener("scroll", retry, { passive: true });
    document.addEventListener("visibilitychange", retry);
    return () => {
      io.disconnect();
      v.removeEventListener("canplay", tryPlay);
      v.removeEventListener("loadeddata", tryPlay);
      window.removeEventListener("touchstart", retry);
      window.removeEventListener("scroll", retry);
      document.removeEventListener("visibilitychange", retry);
    };
  }, []);

  return (
    <figure className="site-video">
      <video ref={ref} src={near ? src : undefined} poster={poster} muted loop playsInline autoPlay disablePictureInPicture preload={near ? "auto" : "none"} aria-label={label} />
      <figcaption>{caption}</figcaption>
    </figure>
  );
}
