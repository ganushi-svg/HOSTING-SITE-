import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // The site became one page on 3 Nov 2026. Old page addresses land on the matching section or tab.
  async redirects() {
    const to = (source: string, hash: string) => ({ source, destination: `/#${hash}`, permanent: false });
    return [
      to("/services", "infrastructure"),
      to("/pricing", "pricing"),
      to("/turnkey", "pricing"),
      to("/models", "calculator"),
      to("/models/:slug*", "calculator"),
      to("/sites", "infrastructure"),
      to("/quality", "infrastructure"),
      to("/monitoring", "infrastructure"),
      to("/how-it-works", "infrastructure"),
      to("/contact", "contact"),
      to("/privacy", "privacy"),
      { source: "/ganushi-kc.vcf", destination: "/marie-segments.vcf", permanent: false },
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
