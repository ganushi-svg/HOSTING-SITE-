import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { capacity, pricing, site } from "@/lib/site";

// Link-preview card for WhatsApp, Telegram, X, LinkedIn and Slack (refreshed 14 Nov 2026): Segments purple palette
// (content/brand.md), the Segments mark, and only published figures from site.ts. 1200 x 630 PNG, well under the
// 300 KB WhatsApp limit.
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${site.name}: Bitcoin mining hosting in the ${site.serviceArea}`;

export default async function Image() {
  const mark = `data:image/png;base64,${(await readFile(join(process.cwd(), "src/app/icon.png"))).toString("base64")}`;
  const stats: [string, string][] = [
    ["45 MW", "power capacity"],
    [`${capacity.machinesHosted.toLocaleString("en-US")}+`, "machines hosted"],
    [`${capacity.uptimePct}%`, "uptime"],
    [pricing.plugFromLabel, "per kWh, hosting from"],
  ];
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "64px 72px", background: "radial-gradient(circle at 85% 15%, #3b1a78 0%, #161022 45%, #0b0711 100%)", color: "#f8fafc", fontFamily: "sans-serif", position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <img src={mark} width={84} height={84} alt="" />
          <div style={{ display: "flex", flexDirection: "column", marginLeft: 22 }}>
            <div style={{ display: "flex", fontSize: 40, fontWeight: 800, letterSpacing: 1 }}>SEGMENTS CLOUD</div>
            <div style={{ display: "flex", fontSize: 22, color: "#c084fc", letterSpacing: 4, marginTop: 2 }}>ABU DHABI · UAE</div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 70, fontWeight: 800, letterSpacing: -2, lineHeight: 1.05 }}>Bitcoin mining hosting</div>
          <div style={{ display: "flex", fontSize: 70, fontWeight: 800, letterSpacing: -2, lineHeight: 1.05, color: "#c084fc" }}>in the {site.serviceArea}.</div>
        </div>
        <div style={{ display: "flex" }}>
          {stats.map(([v, l]) => (
            <div key={l} style={{ display: "flex", flexDirection: "column", marginRight: 28, padding: "14px 22px", borderRadius: 16, background: "rgba(22,16,34,0.85)", border: "1px solid #2d2342" }}>
              <div style={{ display: "flex", fontSize: 36, fontWeight: 800, color: "#c084fc" }}>{v}</div>
              <div style={{ display: "flex", fontSize: 19, color: "#94a3b8", marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", position: "absolute", bottom: 0, left: 0, width: "100%", height: 10, background: "linear-gradient(90deg, #7c3aed, #c084fc)" }} />
      </div>
    ),
    { ...size },
  );
}
