import type { Metadata, Viewport } from "next";
import { Playfair_Display, Jost } from "next/font/google";
import { SiteLayout } from "@/components/layout/SiteLayout";
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
  openGraph: {
    title: "Natyaarambam Dance Academy",
    description:
      "Grace, discipline, and heritage through structured Bharatanatyam training.",
    siteName: "Natyaarambam Dance Academy",
    type: "website",
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
        <SiteLayout>{children}</SiteLayout>
      </body>
    </html>
  );
}
