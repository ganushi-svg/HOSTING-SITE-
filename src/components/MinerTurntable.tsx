"use client";

import { useEffect, useRef, useState } from "react";
import { turntableFor, type Model } from "@/lib/models";

type Props = {
  name: string;
  cooling: Model["cooling"];
  /** "hero": model page, with a caption. "card": model grid, the card stays a link. */
  variant?: "hero" | "card";
};

/**
 * Turntable render of a representative hydro or air-cooled miner on the acrylic glowing stage.
 * A transparent animated WebP, so it sits cleanly on the glass panels in every browser.
 * Plays for every visitor (CLAUDE.md › Design); paused or off screen it shows a still frame,
 * and cards only fetch the animation once they come near the screen.
 */
export function MinerTurntable({ name, cooling, variant = "hero" }: Props) {
  const card = variant === "card";
  const { animated, still } = turntableFor(cooling);
  const host = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(!card);
  const [tabVisible, setTabVisible] = useState(true);
  const animate = visible && tabVisible;

  useEffect(() => {
    const visibility = () => setTabVisible(!document.hidden);
    document.addEventListener("visibilitychange", visibility);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: "200px 0px" });
    if (host.current) observer.observe(host.current);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", visibility); };
  }, []);

  const label = cooling === "Hydro" ? "hydro-cooled" : "air-cooled";

  return (
    <div ref={host} className={`miner-viewer miner-viewer-${variant}${animate ? "" : " is-paused"}`} data-cooling={cooling.toLowerCase()}>
      <span className="acrylic-glow" aria-hidden="true" />
      <figure className="miner-viewer-stage">
        {/* eslint-disable-next-line @next/next/no-img-element -- animated WebP with transparency; next/image would not optimise it */}
        <img
          className="turntable"
          src={animate ? animated : still}
          width={720}
          height={540}
          alt={`Rotating render of a representative ${label} Antminer, shown for the ${name}`}
          decoding="async"
        />
        {!card && <figcaption>Representative {label} render, not the exact model and not a product photo</figcaption>}
      </figure>
      {card && <span className="render-tag">Representative render</span>}
    </div>
  );
}
