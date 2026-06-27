import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { SITE } from "@/lib/site";
import "./globals.css";

const display = Fraunces({ subsets: ["latin"], variable: "--font-display", display: "swap", axes: ["opsz"] });
const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap", weight: ["400", "500", "600"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: "Ember & Oak — Wood-Fired Bistro", template: "%s · Ember & Oak" },
  description:
    "A 32-seat wood-fired bistro. Seasonal menus rewritten weekly from twelve regional farms within sixty miles. Reservations Wed–Sun.",
  applicationName: "Ember & Oak",
  authors: [{ name: "Ember & Oak" }],
  generator: "Next.js",
  keywords: [
    "wood-fired restaurant", "seasonal menu", "farm to table", "fine dining",
    "tasting menu", "Brooklyn restaurant", "neighborhood bistro", "chef Mira Holloway",
  ],
  alternates: { canonical: SITE },
  category: "restaurant",
  openGraph: {
    type: "website",
    siteName: "Ember & Oak",
    locale: "en_US",
    url: SITE,
    title: "Ember & Oak — Wood-Fired Bistro",
    description: "Seasonal, wood-fired cuisine from twelve regional farms. Reservations Wed–Sun.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ember & Oak — Wood-Fired Bistro",
    description: "Seasonal, wood-fired cuisine from twelve regional farms. Reservations Wed–Sun.",
    images: [`${SITE}/opengraph-image`],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  formatDetection: { telephone: true, address: true, email: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F5F1EA" },
    { media: "(prefers-color-scheme: dark)", color: "#0B0A09" },
  ],
  width: "device-width",
  initialScale: 1,
  colorScheme: "light dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
      </head>
      <body>{children}</body>
    </html>
  );
}
