import type { Metadata } from "next";
import Training from "@/components/training/Training";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";

export const metadata: Metadata = {
  title: "Training",
  description:
    "Explore Bharatanatyam curriculum levels, class schedules, and training paths at Natyaarambam Dance Academy.",
  alternates: { canonical: "/training" },
};

export default function TrainingPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Home", path: "/" }, { name: "Training", path: "/training" }]} />
      <Training />
    </>
  );
}
