import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

// The site is one page (Ganushi, 3 Nov 2026).
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: `${site.url}/`, changeFrequency: "weekly", priority: 1 }];
}
