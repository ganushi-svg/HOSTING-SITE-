"use client";

import { useEffect, useState } from "react";

/**
 * Real-time day/night shadow on the Earth backdrop map (Ganushi, 5 Nov 2026; theme-earth). Computes the sun's position
 * from the visitor's clock (UTC) and shades the night side of the dot-matrix map, redrawn once a minute. Same
 * equirectangular projection as EarthBackdrop: 2400 x 1200, longitude -180..180, latitude 78N..60S. Rendered only
 * after mount, so server and client HTML match.
 */
const W = 2400, H = 1200, LAT0 = 78, LAT1 = -60;
const y = (lat: number) => ((LAT0 - lat) / (LAT0 - LAT1)) * H;
const x = (lon: number) => ((lon + 180) / 360) * W;

/** Subsolar point (declination and longitude, degrees) for a given time; accurate to well under a degree. */
export function sunPosition(d: Date) {
  const start = Date.UTC(d.getUTCFullYear(), 0, 0);
  const day = (d.getTime() - start) / 86400000;
  const g = ((2 * Math.PI) / 365) * (day - 1 + (d.getUTCHours() - 12) / 24);
  const decl = (180 / Math.PI) * (0.006918 - 0.399912 * Math.cos(g) + 0.070257 * Math.sin(g) - 0.006758 * Math.cos(2 * g) + 0.000907 * Math.sin(2 * g) - 0.002697 * Math.cos(3 * g) + 0.00148 * Math.sin(3 * g));
  const eqt = 229.18 * (0.000075 + 0.001868 * Math.cos(g) - 0.032077 * Math.sin(g) - 0.014615 * Math.cos(2 * g) - 0.040849 * Math.sin(2 * g)); // minutes
  const utcMin = d.getUTCHours() * 60 + d.getUTCMinutes() + d.getUTCSeconds() / 60;
  let lon = -((utcMin + eqt) / 4 - 180);
  lon = ((lon + 540) % 360) - 180;
  return { decl, lon };
}

/** Sun elevation in degrees at a place. */
export function sunElevation(d: Date, lat: number, lon: number) {
  const s = sunPosition(d), r = Math.PI / 180;
  return Math.asin(Math.sin(lat * r) * Math.sin(s.decl * r) + Math.cos(lat * r) * Math.cos(s.decl * r) * Math.cos((lon - s.lon) * r)) / r;
}

function nightPath(d: Date) {
  const { decl, lon: sl } = sunPosition(d), r = Math.PI / 180;
  const dec = Math.abs(decl) < 0.1 ? 0.1 : decl;
  const pts: string[] = [];
  for (let lon = -180; lon <= 180; lon += 3) {
    const lat = Math.atan(-Math.cos((lon - sl) * r) / Math.tan(dec * r)) / r;
    pts.push(`${x(lon).toFixed(1)} ${y(lat).toFixed(1)}`);
  }
  // the night cap is on the pole away from the sun: south when the sun is north of the equator
  const edge = dec > 0 ? H + 400 : -400;
  return `M${x(-180)} ${edge} L${pts.join(" L")} L${x(180)} ${edge} Z`;
}

export function DayNight() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const tick = () => setNow(new Date());
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, 60_000);
    return () => { clearTimeout(first); clearInterval(id); };
  }, []);
  if (!now) return null;
  const s = sunPosition(now);
  return (
    <g className="eb-daynight">
      <defs><filter id="eb-soft" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="38" /></filter><radialGradient id="eb-sun"><stop offset="0" stopColor="#ffe9b0" stopOpacity="0.32" /><stop offset="1" stopColor="#ffe9b0" stopOpacity="0" /></radialGradient></defs>
      <path d={nightPath(now)} className="eb-night" filter="url(#eb-soft)" />
      <circle cx={x(s.lon)} cy={y(s.decl)} r="260" fill="url(#eb-sun)" className="eb-sunlight" />
    </g>
  );
}
