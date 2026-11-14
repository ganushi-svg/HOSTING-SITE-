import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.segments.ae"),
  title: "Segments Cloud | 45 MW ASIC Mining Hosting in Abu Dhabi, UAE",
  description:
    "Host your ASIC mining machines with a team that runs 45 MW across Abu Dhabi. Air and hydro-cooled halls, 24/7 on-site technicians, Bitmain-trained repair, and $0 billing on offline days.",
  alternates: {
    canonical: "/hosting",
  },
  // Comparison preview (Ganushi, 14 Nov 2026): kept out of search engines like the other theme previews, so it never
  // competes with the main site or points search engines at www.segments.ae/hosting before that page exists.
  robots: { index: false, follow: false },
  openGraph: {
    title: "Segments Cloud · 45 MW Abu Dhabi ASIC Hosting · From $0.039/kWh",
    description:
      "Air & hydro-cooled halls in Abu Dhabi. 24/7 on-site technicians, in-house Bitmain-trained repair, and pool-synced billing where offline days cost $0.",
    url: "https://www.segments.ae/hosting",
    siteName: "Segments Cloud",
    locale: "en_AE",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} dark scroll-smooth`}
    >
      <body className="bg-[#0B0711] text-slate-100 font-sans antialiased selection:bg-[#7C3AED] selection:text-white">
        {children}
      </body>
    </html>
  );
}
