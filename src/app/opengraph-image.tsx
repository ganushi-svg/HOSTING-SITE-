import { ImageResponse } from "next/og";
import { pricing, site } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${site.name}: Bitcoin mining hosting in the ${site.serviceArea}`;

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 80, background: "linear-gradient(125deg, #0b1020 0%, #14213f 55%, #1b3a8f 100%)", color: "#e8eefc", fontFamily: "sans-serif", position: "relative" }}>
        <div style={{ display: "flex", color: "#fbd24e", fontSize: 28, fontWeight: 700, letterSpacing: 6 }}>SEGMENTS CLOUD</div>
        <div style={{ display: "flex", fontSize: 76, fontWeight: 800, letterSpacing: -3, lineHeight: 1.06, marginTop: 34 }}>Bitcoin mining hosting</div>
        <div style={{ display: "flex", fontSize: 76, fontWeight: 800, letterSpacing: -3, lineHeight: 1.06, color: "#6aa8ff" }}>in the {site.serviceArea}.</div>
        <div style={{ display: "flex", fontSize: 30, color: "#b4c3e3", marginTop: 34 }}>{pricing.rateLabel} per kWh · Air and hydro cooling · In-house repair</div>
        <div style={{ display: "flex", position: "absolute", bottom: 0, left: 0, width: "100%", height: 12, background: "#f7be27" }} />
      </div>
    ),
    { ...size },
  );
}
