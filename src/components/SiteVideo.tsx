"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Short muted loop of real site footage. Plays for every visitor, but only while it is on screen:
 * it starts loading just before it scrolls into view and pauses when it leaves, so several videos on the
 * page never decode at once (smooth playback). No controls (Ganushi, 4 Nov 2026): it plays as a silent loop.
 */
export function SiteVideo({ src, poster, label, caption }: { src: string; poster: string; label: string; caption: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    let userPaused = false;
    const onPause = () => { if (!document.hidden && v.dataset.auto !== "1") userPaused = true; };
    const onPlay = () => { userPaused = false; };
    v.addEventListener("pause", onPause);
    v.addEventListener("play", onPlay);
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setNear(true);
        if (!userPaused) v.play().catch(() => {});
      } else if (!v.paused) {
        v.dataset.auto = "1"; v.pause(); delete v.dataset.auto;
      }
    }, { rootMargin: "200px 0px", threshold: 0.15 });
    io.observe(v);
    return () => { io.disconnect(); v.removeEventListener("pause", onPause); v.removeEventListener("play", onPlay); };
  }, []);

  // Once the source is attached, start playing.
  useEffect(() => {
    if (near) ref.current?.play().catch(() => {});
  }, [near]);

  return (
    <figure className="site-video">
      <video ref={ref} src={near ? src : undefined} poster={poster} muted loop playsInline disablePictureInPicture preload={near ? "auto" : "none"} aria-label={label} />
      <figcaption>{caption}</figcaption>
    </figure>
  );
}
