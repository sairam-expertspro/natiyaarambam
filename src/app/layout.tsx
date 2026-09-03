import type { Metadata, Viewport } from "next";
import { Playfair_Display, Jost } from "next/font/google";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { organizationJsonLd } from "@/lib/structured-data";
import "./globals.css";

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-jost",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Natyaarambam Dance Academy | Bharatanatyam",
    template: "%s | Natyaarambam Dance Academy",
  },
  description:
    "Structured Bharatanatyam training that nurtures technique, confidence, spirituality, and artistic expression.",
  applicationName: "Natyaarambam Dance Academy",
  metadataBase: new URL("https://natyaarambam.com"),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Natyaarambam Dance Academy",
    description:
      "Grace, discipline, and heritage through structured Bharatanatyam training.",
    siteName: "Natyaarambam Dance Academy",
    type: "website",
    images: [
      {
        url: "/images/Home Banner.webp",
        width: 3168,
        height: 1344,
        alt: "Natyaarambam Dance Academy — Bharatanatyam training",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Natyaarambam Dance Academy",
    description:
      "Grace, discipline, and heritage through structured Bharatanatyam training.",
    images: ["/images/Home Banner.webp"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#7e1414",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfairDisplay.variable} ${jost.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
        />
        <SiteLayout>{children}</SiteLayout>
      </body>
    </html>
  );
}
