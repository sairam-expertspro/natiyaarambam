import type { Metadata, Viewport } from "next";
import { Layout } from "@/components/chrome";
import "./globals.css";

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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;0,800;1,500;1,600&family=Jost:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
