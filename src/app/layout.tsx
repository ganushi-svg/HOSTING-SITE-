import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { contact, site } from "@/lib/site";
import { Nav } from "@/components/Nav";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Footer } from "@/components/Footer";
import "./globals.css";

const display = Space_Grotesk({ subsets: ["latin"], weight: ["500", "700"], variable: "--font-display", display: "swap" });
const body = Inter({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "600"], variable: "--font-mono", display: "swap" });

export const viewport: Viewport = { themeColor: "#050a17", width: "device-width", initialScale: 1, colorScheme: "dark" };

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `Bitcoin Mining Hosting in the ${site.serviceArea} | ${site.name}`, template: `%s | ${site.name}` },
  description: site.description,
  applicationName: site.name,
  keywords: ["Bitcoin mining hosting", "ASIC miner hosting", "crypto mining colocation", "mining hosting UAE", "hydro miner hosting"],
  robots: site.allowIndexing ? { index: true, follow: true } : { index: false, follow: false },
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: "en_US", siteName: site.name, title: `${site.name} | Bitcoin mining hosting in the ${site.serviceArea}`, description: site.description, url: "/" },
  twitter: { card: "summary_large_image", title: `${site.name} | Mining hosting in the ${site.serviceArea}`, description: site.description },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const org = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    legalName: site.legalNames[0],
    alternateName: site.legalNames[1],
    url: site.url,
    logo: `${site.url}/logo-mark.webp`,
    description: site.description,
    email: contact.email,
    telephone: contact.phone,
    address: { "@type": "PostalAddress", streetAddress: "Office 2712, Concord Tower, Media City", addressLocality: "Dubai", addressCountry: "AE" },
  };
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(org).replace(/</g, "\\u003c") }} />
        <Nav />
        {children}
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
