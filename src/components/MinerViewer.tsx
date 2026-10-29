"use client";

import { createElement, useEffect, useRef, useState, type ReactNode } from "react";
import { Pause, Play } from "lucide-react";

type ModelElement = HTMLElement & { pause: () => void; play: () => void };
type Props = {
  name: string;
  src: string;
  poster: string;
  cooling: "Air" | "Hydro";
  /** "hero": model page, drag to turn, pause button. "card": model grid, turns on its own, the card stays a link. */
  variant?: "hero" | "card";
  children: ReactNode;
};

/**
 * Interactive 3D model (Miner Studio GLB) on an acrylic glowing stage, fans spinning on air-cooled models.
 * Opens straight away on model pages and as each grid card scrolls into view (Ganushi, 29 Oct 2026).
 * The poster or video (children) shows while it loads and stays if 3D fails.
 * Motion runs for every visitor (CLAUDE.md › Design) and pauses off-screen or on a hidden tab.
 */
export function MinerViewer({ name, src, poster, cooling, variant = "hero", children }: Props) {
  const card = variant === "card";
  const [near, setNear] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [moving, setMoving] = useState(true);
  const [visible, setVisible] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);
  const host = useRef<HTMLDivElement>(null);
  const model = useRef<ModelElement | null>(null);
  const animate = moving && visible && tabVisible;
  const fans = cooling === "Air";

  useEffect(() => {
    const visibility = () => setTabVisible(!document.hidden);
    document.addEventListener("visibilitychange", visibility);
    // Load a little before the viewer reaches the screen; pause while it is off screen.
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting);
      if (entry.isIntersecting) setNear(true);
    }, { rootMargin: "250px 0px" });
    if (host.current) observer.observe(host.current);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", visibility); };
  }, []);

  useEffect(() => {
    if (!near) return;
    let cancelled = false;
    import("@google/model-viewer")
      .then(() => { if (!cancelled) setLoaded(true); })
      .catch(() => { if (!cancelled) setFailed(true); });
    return () => { cancelled = true; };
  }, [near]);

  useEffect(() => {
    const el = model.current;
    if (!el || !loaded) return;
    const fail = () => setFailed(true);
    const load = () => setReady(true);
    el.addEventListener("error", fail);
    el.addEventListener("load", load);
    return () => { el.removeEventListener("error", fail); el.removeEventListener("load", load); };
  }, [loaded]);

  // The fan animation can only start once the GLB has loaded.
  useEffect(() => {
    const el = model.current;
    if (!el || !ready || !fans) return;
    if (animate) el.play(); else el.pause();
  }, [animate, fans, ready]);

  const live = loaded && !failed;
  const stage = `miner-viewer miner-viewer-${variant}${ready ? " is-ready" : ""}${animate ? "" : " is-paused"}`;

  return (
    <div ref={host} className={stage} data-cooling={cooling.toLowerCase()}>
      <span className="acrylic-glow" aria-hidden="true" />
      {live ? (
        <figure className="miner-viewer-stage">
          {createElement("model-viewer", {
            ref: model,
            src, poster,
            alt: card ? `3D render of the ${name}` : `Interactive 3D render of the ${name}. Drag to turn it.`,
            ...(card ? { "disable-zoom": "", "disable-pan": "", "disable-tap": "" } : { "camera-controls": "", "touch-action": "pan-y" }),
            "environment-image": "neutral",
            "camera-orbit": "38deg 72deg auto", "shadow-intensity": "0.8", exposure: "1.05",
            "interaction-prompt": "none",
            ...(fans ? { "animation-name": "Fans" } : {}),
            ...(animate ? { "auto-rotate": "", "auto-rotate-delay": "0", "rotation-per-second": card ? "24deg" : "18deg" } : {}),
            style: { width: "100%", background: "transparent" },
          }, createElement("div", { slot: "progress-bar", className: "viewer-progress" }))}
          {!card && <figcaption>3D render for illustration, not a product photo · drag to turn</figcaption>}
          {!card && (
            <button type="button" className="viewer-btn viewer-btn-corner" onClick={() => setMoving((v) => !v)} aria-pressed={!moving}>
              {moving ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
              {moving ? "Pause motion" : "Play motion"}
            </button>
          )}
        </figure>
      ) : (
        <>
          {children}
          {!card && <p role="status" className="viewer-note">{failed ? "3D view unavailable on this device. Render shown instead." : "Loading 3D view…"}</p>}
        </>
      )}
      {card && <span className="render-tag">3D render</span>}
    </div>
  );
}
