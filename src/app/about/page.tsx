import type { Metadata } from "next";
import About from "@/components/about/About";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Natyaarambam Dance Academy, Guru Hema Chandrasekaran, and the academy's Bharatanatyam legacy.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Home", path: "/" }, { name: "About", path: "/about" }]} />
      <About />
    </>
  );
}
