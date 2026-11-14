import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

// Web app manifest (14 Nov 2026): name, colours and icons for "Add to home screen" and browser tabs.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} — Bitcoin mining hosting`,
    short_name: site.name,
    start_url: "/",
    display: "standalone",
    background_color: "#0b0711",
    theme_color: "#0b0711",
    icons: [
      { src: "/icon.png", sizes: "192x192", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
