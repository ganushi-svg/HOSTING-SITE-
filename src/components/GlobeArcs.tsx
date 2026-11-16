"use client";

import { useEffect, useRef, useState } from "react";
import "./globe-arcs.css";

/**
 * Hero globe with 3D arcs (Ganushi, 16 Nov 2026, "globe-arcs"; globe.gl approved by Ganushi the same day). A WebGL Earth
 * from our own NASA Blue Marble texture (public/brand/earth-tex-hd.webp) turns slowly while arcs fly from the published
 * client cities in the USA and Europe (the same set as the canvas Globe, content/performance.md › regions) into
 * Segments, Abu Dhabi, marked by the Segments logo badge and a pulsing ring. Sites stay at city level (CLAUDE.md).
 *
 * globe.gl (with three.js, about 600 KB) is loaded only when the globe first scrolls into view; until then, and if WebGL
 * is unavailable, the static globe picture shows. Rendering pauses while the globe is off screen or the tab is hidden.
 * It sways between Western Europe and the Gulf so Abu Dhabi stays in view. Touch screens cannot drag the globe, so the page
 * always scrolls; zoom is off so the mouse wheel scrolls the page; reduced-motion visitors get a slower sway.
 */
type City = { name: string; lat: number; lng: number; label?: string };
const HUB = { lat: 24.45, lng: 54.4 };
const CITIES: City[] = [
  { name: "New York", lat: 40.7, lng: -74.0, label: "USA" },
  { name: "Texas", lat: 29.8, lng: -95.4 },
  { name: "London", lat: 51.5, lng: -0.1, label: "UK" },
  { name: "Amsterdam", lat: 52.4, lng: 4.9 },
  { name: "Frankfurt", lat: 50.1, lng: 8.7, label: "Germany" },
  { name: "Paris", lat: 48.9, lng: 2.3 },
  { name: "Zurich", lat: 47.4, lng: 8.5 },
  { name: "Madrid", lat: 40.4, lng: -3.7, label: "Spain" },
  { name: "Stockholm", lat: 59.3, lng: 18.1, label: "Sweden" },
  { name: "Warsaw", lat: 52.2, lng: 21.0, label: "Poland" },
];

export function GlobeArcs({ className = "", logoSrc = "/logo-mark.webp", posterSrc = "/brand/globe-earth.webp" }: { className?: string; logoSrc?: string; posterSrc?: string }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    let globe: import("globe.gl").GlobeInstance | null = null;
    let disposed = false, started = false, onScreen = false;
    let swayTimer = 0;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;

    const sync = () => {
      if (!globe) return;
      if (onScreen && !document.hidden) globe.resumeAnimation(); else globe.pauseAnimation();
    };

    const start = async () => {
      started = true;
      try {
        const probe = document.createElement("canvas");
        if (!(probe.getContext("webgl2") || probe.getContext("webgl"))) return; // keep the static picture
        const { default: Globe } = await import("globe.gl");
        if (disposed) return;
        const size = () => Math.round(box.getBoundingClientRect().width) || 420;
        const badge = () => {
          const el = document.createElement("div");
          el.className = "ga-hub";
          el.innerHTML = `<span class="ga-hub-mark"><img src="${logoSrc}" alt="" width="34" height="40" /></span><span class="ga-hub-label"><b>Segments</b> Abu Dhabi</span>`;
          return el;
        };
        const g = new Globe(box, { animateIn: !reduced, rendererConfig: { antialias: true, alpha: true, powerPreference: "low-power" } })
          .width(size())
          .height(size())
          .backgroundColor("rgba(0,0,0,0)")
          .globeImageUrl("/brand/earth-tex-hd.webp")
          .showAtmosphere(true)
          .atmosphereColor("#a78bfa")
          .atmosphereAltitude(0.17)
          // Arcs: client city -> Abu Dhabi, cyan at the client end, orchid at Segments, dashes travelling inwards.
          .arcsData(CITIES.map((c, i) => ({ startLat: c.lat, startLng: c.lng, endLat: HUB.lat, endLng: HUB.lng, i })))
          .arcColor(() => ["rgba(34, 211, 238, 0.85)", "rgba(192, 132, 252, 0.95)"])
          .arcStroke(0.95)
          .arcAltitudeAutoScale(0.42)
          .arcDashLength(0.45)
          .arcDashGap(0.55)
          .arcDashInitialGap((d) => ((d as { i: number }).i % 5) / 5)
          .arcDashAnimateTime(reduced ? 6000 : 2800)
          // Client city dots and country labels.
          .pointsData(CITIES)
          .pointLat("lat").pointLng("lng")
          .pointColor(() => "#22d3ee")
          .pointAltitude(0.012)
          .pointRadius(0.45)
          .labelsData(CITIES.filter((c) => c.label))
          .labelLat("lat").labelLng("lng")
          .labelText("label")
          .labelSize(2.3)
          .labelDotRadius(0)
          .labelAltitude(0.014)
          .labelColor(() => "rgba(248, 250, 252, 0.9)")
          .labelResolution(3)
          // Segments, Abu Dhabi: pulsing ring and the logo badge.
          .ringsData([HUB])
          .ringLat("lat").ringLng("lng")
          .ringColor(() => (t: number) => `rgba(192, 132, 252, ${Math.max(0, 1 - t)})`)
          .ringMaxRadius(5)
          .ringPropagationSpeed(reduced ? 1.2 : 2.4)
          .ringRepeatPeriod(reduced ? 2600 : 1500)
          .htmlElementsData([HUB])
          .htmlLat("lat").htmlLng("lng").htmlAltitude(0.02)
          .htmlElement(badge);

        // Sway between Western Europe and the Gulf instead of spinning, so Abu Dhabi never turns to the far side
        // (the same idea as the canvas globe's sway).
        g.pointOfView({ lat: 33, lng: 24, altitude: 2.05 }, 0);
        const SWAY_MS = reduced ? 16000 : 9000;
        let east = true;
        const swing = () => { if (!globe || !onScreen || document.hidden) return; globe.pointOfView({ lat: east ? 30 : 36, lng: east ? 40 : 6, altitude: 2.05 }, SWAY_MS); east = !east; };
        swayTimer = window.setInterval(swing, SWAY_MS + 400);
        const controls = g.controls();
        controls.autoRotate = false;
        controls.enableZoom = false;
        controls.enablePan = false;
        controls.enableRotate = !coarse;
        g.renderer().setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        globe = g;
        ro.observe(box);
        sync();
        swing();
        setReady(true);
      } catch {
        // keep the static picture
      }
    };

    const ro = new ResizeObserver(() => { if (globe) { const s = Math.round(box.getBoundingClientRect().width); globe.width(s).height(s); } });
    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (onScreen && !started) void start();
      sync();
    }, { rootMargin: "200px" });
    io.observe(box);
    document.addEventListener("visibilitychange", sync);

    return () => {
      disposed = true;
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", sync);
      window.clearInterval(swayTimer);
      globe?._destructor();
      globe = null;
    };
  }, [logoSrc]);

  return (
    <figure className={`globe-arcs${ready ? " is-ready" : ""} ${className}`} aria-label="Rotating globe with arcs from hosting clients in the USA and Europe to Segments in Abu Dhabi">
      {/* eslint-disable-next-line @next/next/no-img-element -- static picture shown until the 3D globe is ready */}
      <img className="ga-poster" src={posterSrc} width={1040} height={1040} alt="" aria-hidden="true" />
      <div ref={boxRef} className="ga-stage" aria-hidden="true" />
    </figure>
  );
}
