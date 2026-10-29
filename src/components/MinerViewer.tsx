"use client";

import { createElement, useEffect, useRef, useState, type ReactNode } from "react";
import { Box, Pause, Play } from "lucide-react";

type ModelElement = HTMLElement & { pause: () => void; play: () => void };
type Props = { name: string; src: string; poster: string; cooling: "Air" | "Hydro"; children: ReactNode };

/**
 * Interactive 3D model (Miner Studio GLB) behind an "Explore in 3D" button.
 * Shows the poster or video (children) first; the model-viewer runtime and GLB load only on click.
 * Motion runs for every visitor (CLAUDE.md › Design) and pauses off-screen or on a hidden tab.
 */
export function MinerViewer({ name, src, poster, cooling, children }: Props) {
  const [activated, setActivated] = useState(false);
  const [loaded, setLoaded] = useState(false);
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
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    if (host.current) observer.observe(host.current);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", visibility); };
  }, []);

  useEffect(() => {
    if (!activated) return;
    let cancelled = false;
    import("@google/model-viewer")
      .then(() => { if (!cancelled) setLoaded(true); })
      .catch(() => { if (!cancelled) setFailed(true); });
    return () => { cancelled = true; };
  }, [activated]);

  useEffect(() => {
    const el = model.current;
    if (!el || !loaded) return;
    const fail = () => setFailed(true);
    el.addEventListener("error", fail);
    return () => el.removeEventListener("error", fail);
  }, [loaded]);

  useEffect(() => {
    const el = model.current;
    if (!el || !loaded || !fans) return;
    if (animate) el.play(); else el.pause();
  }, [animate, fans, loaded]);

  const live = loaded && !failed;

  return (
    <div ref={host} className="miner-viewer">
      {live ? (
        <figure className="miner-viewer-stage">
          {createElement("model-viewer", {
            ref: model,
            src, poster,
            alt: `Interactive 3D render of the ${name}. Drag to turn it.`,
            "camera-controls": "", "touch-action": "pan-y", "environment-image": "neutral",
            "camera-orbit": "38deg 72deg auto", "shadow-intensity": "0.8", exposure: "1.05",
            "interaction-prompt": "none",
            ...(fans ? { "animation-name": "Fans" } : {}),
            ...(animate ? { "auto-rotate": "", "rotation-per-second": "18deg", ...(fans ? { autoplay: "" } : {}) } : {}),
            style: { width: "100%", height: "100%", background: "transparent" },
          }, createElement("div", { slot: "progress-bar", className: "viewer-progress" }))}
          <figcaption>3D render for illustration, not a product photo · drag to turn</figcaption>
          <button type="button" className="viewer-btn viewer-btn-corner" onClick={() => setMoving((v) => !v)} aria-pressed={!moving}>
            {moving ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
            {moving ? "Pause motion" : "Play motion"}
          </button>
        </figure>
      ) : (
        <>
          {children}
          {failed ? (
            <p role="status" className="viewer-note">3D view unavailable on this device. Render shown instead.</p>
          ) : (
            <button type="button" className="viewer-btn" onClick={() => setActivated(true)} disabled={activated}>
              <Box size={17} aria-hidden="true" /> {activated ? "Loading 3D…" : "Explore in 3D"}
            </button>
          )}
        </>
      )}
    </div>
  );
}
