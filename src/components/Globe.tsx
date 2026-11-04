"use client";

import { useEffect, useRef } from "react";
import { capacity } from "@/lib/site";

/**
 * Hero globe (Ganushi, 4 Nov 2026): a rotating Earth drawn on a canvas with no library. The texture is an
 * equirectangular render of Natural Earth land (public/brand/earth-tex.webp); the sphere is
 * sampled per pixel each frame, lit from the upper left, with a blue atmosphere rim. Light rays curve over the
 * surface from client cities in the USA and Europe (the regions in content/performance.md; the cities are the same
 * set as the earlier static globe) into Segments in Abu Dhabi, with bright pulses travelling along them. The globe
 * sways ±24° so Abu Dhabi stays in view while the USA and Europe sweep across. Runs only while on screen.
 */
type Site = { name: string; lat: number; lon: number; label?: string; lx?: number; ly?: number };
const HUB: Site = { name: "Segments", lat: 24.45, lon: 54.4 };
const SITES: Site[] = [
  { name: "New York", lat: 40.7, lon: -74.0, label: "USA", lx: -6, ly: -8 },
  { name: "Texas", lat: 29.8, lon: -95.4 },
  { name: "London", lat: 51.5, lon: -0.1, label: "UK", lx: -16, ly: -8 },
  { name: "Amsterdam", lat: 52.4, lon: 4.9 },
  { name: "Frankfurt", lat: 50.1, lon: 8.7, label: "Germany", lx: 4, ly: 16 },
  { name: "Paris", lat: 48.9, lon: 2.3 },
  { name: "Zurich", lat: 47.4, lon: 8.5 },
  { name: "Madrid", lat: 40.4, lon: -3.7, label: "Spain", lx: 0, ly: 14 },
  { name: "Stockholm", lat: 59.3, lon: 18.1, label: "Sweden", lx: 0, ly: -8 },
  { name: "Warsaw", lat: 52.2, lon: 21.0, label: "Poland", lx: 26, ly: -6 },
];
const SIZE = 400; // internal canvas size
const TILT = (26 * Math.PI) / 180; // camera tilt (north pole leans towards the viewer)
const BASE_LON = 8, SWAY = 24, PERIOD = 38; // degrees, degrees, seconds

export function Globe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pinRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const pin = pinRef.current;
    if (!canvas || !pin) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const R = SIZE / 2 - 14, C = SIZE / 2;
    const N = SIZE * SIZE;
    const img = new Image();
    img.src = "/brand/earth-tex.webp";
    let tex: ImageData | null = null;
    let TW = 0, TH = 0;

    // Per-pixel geometry that never changes: lat index, base lon, light, rim, inside mask.
    const inside = new Uint8Array(N);
    const vIdx = new Int32Array(N); // texture row offset
    const lon0 = new Float32Array(N); // base longitude in texture columns (float)
    const light = new Float32Array(N);
    const spec = new Float32Array(N);
    const rim = new Float32Array(N);
    const sinT = Math.sin(TILT), cosT = Math.cos(TILT);
    const L = [-0.45, 0.5, 0.74]; const ll = Math.hypot(...L); L[0] /= ll; L[1] /= ll; L[2] /= ll;
    const prep = () => {
      for (let py = 0; py < SIZE; py++) for (let px = 0; px < SIZE; px++) {
        const i = py * SIZE + px;
        const x = (px + 0.5 - C) / R, y = (C - py - 0.5) / R, r2 = x * x + y * y;
        if (r2 > 1) { inside[i] = 0; continue; }
        inside[i] = 1;
        const z = Math.sqrt(1 - r2);
        const lat = Math.asin(Math.max(-1, Math.min(1, z * sinT + y * cosT)));
        const lon = Math.atan2(x, z * cosT - y * sinT);
        vIdx[i] = Math.min(TH - 1, Math.max(0, Math.floor((Math.PI / 2 - lat) / Math.PI * TH))) * TW;
        lon0[i] = (lon + Math.PI) / (2 * Math.PI) * TW;
        const sh = Math.max(0, x * L[0] + y * L[1] + z * L[2]);
        light[i] = 0.08 + Math.pow(sh, 1.15);
        spec[i] = Math.pow(sh, 40) * 150;
        const rr = Math.sqrt(r2);
        rim[i] = Math.pow(Math.max(0, (rr - 0.82) / 0.18), 2);
      }
    };

    const out = ctx.createImageData(SIZE, SIZE);
    const od = out.data;
    const drawEarth = (rotDeg: number) => {
      if (!tex) return;
      const td = tex.data;
      const shift = (rotDeg / 360) * TW;
      for (let i = 0; i < N; i++) {
        const o = i * 4;
        if (!inside[i]) { od[o + 3] = 0; continue; }
        let u = Math.floor(lon0[i] + shift); u %= TW; if (u < 0) u += TW;
        const t = (vIdx[i] + u) * 4;
        // open water is the only strongly blue-dominant colour in the texture, so it alone gets the sun glint
        const water = td[t + 2] > td[t] * 1.6 ? 1 : 0;
        const li = light[i], sp = spec[i] * water, rm = rim[i];
        let r = td[t] * li + sp, g = td[t + 1] * li + sp, b = td[t + 2] * li + sp;
        r = r * (1 - 0.25 * rm) + 90 * 0.45 * rm; g = g * (1 - 0.25 * rm) + 150 * 0.45 * rm; b = b * (1 - 0.25 * rm) + 255 * 0.45 * rm;
        od[o] = r > 255 ? 255 : r; od[o + 1] = g > 255 ? 255 : g; od[o + 2] = b > 255 ? 255 : b; od[o + 3] = 255;
      }
      ctx.putImageData(out, 0, 0);
      // soft anti-aliased edge
      ctx.save(); ctx.globalCompositeOperation = "destination-in"; ctx.beginPath(); ctx.arc(C, C, R, 0, Math.PI * 2); ctx.fillStyle = "#000"; ctx.fill(); ctx.restore();
    };

    // 3D helpers: unit-sphere position for a site at the current rotation, tilted into camera space.
    const pos = (lat: number, lon: number, rotDeg: number) => {
      const la = (lat * Math.PI) / 180, lo = ((lon - rotDeg) * Math.PI) / 180;
      const x = Math.cos(la) * Math.sin(lo), y0 = Math.sin(la), z0 = Math.cos(la) * Math.cos(lo);
      return [x, y0 * cosT - z0 * sinT, y0 * sinT + z0 * cosT] as const;
    };
    const screen = (p: readonly [number, number, number], h = 1) => [C + p[0] * R * h, C - p[1] * R * h] as const;
    const slerp = (a: readonly number[], b: readonly number[], s: number) => {
      const d = Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
      const w = Math.acos(d), sw = Math.sin(w) || 1e-6;
      const ka = Math.sin((1 - s) * w) / sw, kb = Math.sin(s * w) / sw;
      return [a[0] * ka + b[0] * kb, a[1] * ka + b[1] * kb, a[2] * ka + b[2] * kb] as const;
    };

    const STEPS = 48;
    const drawRays = (rotDeg: number, t: number) => {
      const hub = pos(HUB.lat, HUB.lon, rotDeg);
      const hs = screen(hub);
      SITES.forEach((s, idx) => {
        const p = pos(s.lat, s.lon, rotDeg);
        const d = Math.max(-1, Math.min(1, p[0] * hub[0] + p[1] * hub[1] + p[2] * hub[2]));
        const lift = 0.07 + 0.12 * Math.acos(d) / Math.PI * 2;
        const pts: { x: number; y: number; z: number }[] = [];
        for (let k = 0; k <= STEPS; k++) {
          const sgm = k / STEPS;
          const q = slerp(p, hub, sgm);
          const h = 1 + lift * Math.sin(Math.PI * sgm);
          const [sx, sy] = screen(q, h);
          pts.push({ x: sx, y: sy, z: q[2] });
        }
        // base ray: faint wide glow plus a thin bright core, only where the surface faces us
        const grad = ctx.createLinearGradient(pts[0].x, pts[0].y, hs[0], hs[1]);
        grad.addColorStop(0, "rgba(34,211,238,0.35)"); grad.addColorStop(1, "rgba(251,210,78,0.95)");
        for (const [w, style] of [[6, "rgba(90,160,255,0.10)"], [1.6, grad]] as const) {
          ctx.lineWidth = w; ctx.strokeStyle = style; ctx.lineCap = "round";
          ctx.beginPath(); let on = false;
          for (const q of pts) { if (q.z > -0.02) { if (!on) { ctx.moveTo(q.x, q.y); on = true; } else ctx.lineTo(q.x, q.y); } else on = false; }
          ctx.stroke();
        }
        // pulses with a fading tail
        const speed = reduced ? 0.09 : 0.26;
        for (let n = 0; n < 2; n++) {
          const head = ((t * speed + idx * 0.17 + n * 0.5) % 1);
          const hi = head * STEPS;
          for (let k = 8; k >= 0; k--) {
            const j = Math.floor(hi - k); if (j < 0) continue;
            const q = pts[j]; if (q.z < 0) continue;
            const a = (1 - k / 9) * Math.min(1, (q.z + 0.1) * 3);
            ctx.fillStyle = `rgba(255,255,255,${0.9 * a})`;
            ctx.beginPath(); ctx.arc(q.x, q.y, 1.2 + (1 - k / 9) * 1.8, 0, Math.PI * 2); ctx.fill();
          }
          const q = pts[Math.min(STEPS, Math.floor(hi))];
          if (q.z > 0) { ctx.fillStyle = "rgba(255,255,255,0.35)"; ctx.beginPath(); ctx.arc(q.x, q.y, 6, 0, Math.PI * 2); ctx.fill(); }
        }
        // origin marker with a ping ring and country label
        if (p[2] > 0.02) {
          const [sx, sy] = screen(p);
          const vis = Math.min(1, p[2] * 2.2);
          const ping = (t * 0.6 + idx * 0.3) % 1;
          ctx.strokeStyle = `rgba(34,211,238,${(1 - ping) * 0.8 * vis})`; ctx.lineWidth = 1.2;
          ctx.beginPath(); ctx.arc(sx, sy, 3 + ping * 11, 0, Math.PI * 2); ctx.stroke();
          ctx.fillStyle = `rgba(34,211,238,${vis})`; ctx.beginPath(); ctx.arc(sx, sy, 3, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = `rgba(255,255,255,${vis})`; ctx.beginPath(); ctx.arc(sx, sy, 1.3, 0, Math.PI * 2); ctx.fill();
          if (s.label && p[2] > 0.25) {
            ctx.font = "600 11px Space Grotesk, system-ui, sans-serif"; ctx.textAlign = "center";
            ctx.lineWidth = 3; ctx.strokeStyle = `rgba(4,7,15,${0.9 * vis})`; ctx.fillStyle = `rgba(214,228,255,${vis})`;
            const lx = sx + (s.lx ?? 0), ly = sy + (s.ly ?? -9);
            ctx.strokeText(s.label.toUpperCase(), lx, ly); ctx.fillText(s.label.toUpperCase(), lx, ly);
          }
        }
      });
      // hub: expanding gold rings and a core
      for (let n = 0; n < 3; n++) {
        const ph = (t * 0.45 + n / 3) % 1;
        ctx.strokeStyle = `rgba(251,210,78,${(1 - ph) * 0.9})`; ctx.lineWidth = 2 - ph;
        ctx.beginPath(); ctx.arc(hs[0], hs[1], 6 + ph * 26, 0, Math.PI * 2); ctx.stroke();
      }
      ctx.fillStyle = "rgba(251,210,78,0.35)"; ctx.beginPath(); ctx.arc(hs[0], hs[1], 12, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#fbd24e"; ctx.strokeStyle = "#2a1a02"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(hs[0], hs[1], 6.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      pin.style.transform = `translate(calc(${(hs[0] / SIZE) * 100}cqw - 50%), calc(${(hs[1] / SIZE) * 100}cqh + 22px))`;
    };

    let raf = 0, visible = true, running = false;
    const start = performance.now();
    const frame = (now: number) => {
      raf = 0;
      if (!visible || document.hidden || !tex) { running = false; return; }
      const t = (now - start) / 1000;
      const rot = BASE_LON + SWAY * Math.sin((t / (reduced ? PERIOD * 2 : PERIOD)) * Math.PI * 2);
      ctx.clearRect(0, 0, SIZE, SIZE);
      drawEarth(rot);
      drawRays(rot, t);
      raf = requestAnimationFrame(frame);
    };
    const kick = () => { if (!running && tex) { running = true; raf = requestAnimationFrame(frame); } };
    img.onload = () => {
      const off = document.createElement("canvas"); off.width = img.naturalWidth; off.height = img.naturalHeight;
      const oc = off.getContext("2d", { willReadFrequently: true }); if (!oc) return;
      oc.drawImage(img, 0, 0); TW = off.width; TH = off.height;
      tex = oc.getImageData(0, 0, TW, TH);
      prep(); kick();
    };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) kick(); }, { rootMargin: "100px" });
    io.observe(canvas);
    const vis = () => { if (!document.hidden) kick(); };
    document.addEventListener("visibilitychange", vis);
    return () => { io.disconnect(); document.removeEventListener("visibilitychange", vis); if (raf) cancelAnimationFrame(raf); };
  }, []);

  return (
    <figure className="globe" aria-label={`Rotating globe showing hosting clients in ${capacity.clientRegionsLabel} connected by light rays to Segments in Abu Dhabi`}>
      {/* eslint-disable-next-line @next/next/no-img-element -- static poster shown until the canvas draws */}
      <img className="globe-poster" src="/brand/globe-earth.webp" width={1040} height={1040} alt="" aria-hidden="true" />
      <canvas ref={canvasRef} width={SIZE} height={SIZE} aria-hidden="true" />
      <figcaption ref={pinRef} className="globe-pin globe-pin-live"><b>Segments</b><span>Abu Dhabi</span></figcaption>
    </figure>
  );
}
