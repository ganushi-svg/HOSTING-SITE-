import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // The site became one page on 3 Nov 2026. Old page addresses land on the matching section or tab.
  async redirects() {
    const to = (source: string, hash: string) => ({ source, destination: `/#${hash}`, permanent: false });
    return [
      to("/services", "services"),
      to("/pricing", "pricing"),
      to("/turnkey", "turnkey"),
      to("/models", "machines"),
      to("/models/:slug*", "machines"),
      to("/sites", "sites"),
      to("/quality", "quality"),
      to("/monitoring", "reporting"),
      to("/how-it-works", "how-it-works"),
      to("/contact", "contact"),
      to("/privacy", "privacy"),
    ];
  },
  async headers() {
    return [{
      source: "/:path*",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      ],
    }];
  },
};

export default nextConfig;
