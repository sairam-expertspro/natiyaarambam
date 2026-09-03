import type { Metadata } from "next";
import Gallery from "@/components/gallery/Gallery";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Browse Bharatanatyam performances, student moments, photos, and films from Natyaarambam Dance Academy.",
  alternates: { canonical: "/gallery" },
};

export default function GalleryPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Home", path: "/" }, { name: "Gallery", path: "/gallery" }]} />
      <Gallery />
    </>
  );
}
