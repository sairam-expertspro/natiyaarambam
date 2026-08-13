import type { Metadata } from "next";
import Gallery from "@/components/gallery/Gallery";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Browse Bharatanatyam performances, student moments, photos, and films from Natyaarambam Dance Academy.",
};

export default function GalleryPage() {
  return <Gallery />;
}
