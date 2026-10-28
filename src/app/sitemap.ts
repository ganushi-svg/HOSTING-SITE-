import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

const routes: { path: string; priority: number }[] = [
  { path: "", priority: 1 },
  { path: "/services", priority: 0.8 },
  { path: "/pricing", priority: 0.9 },
  { path: "/sites", priority: 0.8 },
  { path: "/monitoring", priority: 0.7 },
  { path: "/how-it-works", priority: 0.7 },
  { path: "/contact", priority: 0.9 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map(({ path, priority }) => ({
    url: `${site.url}${path}`,
    changeFrequency: path === "" ? ("weekly" as const) : ("monthly" as const),
    priority,
  }));
}
