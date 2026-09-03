import type { Metadata } from "next";
import Contact from "@/components/contact/Contact";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Natyaarambam Dance Academy and submit an enrollment request for Bharatanatyam classes.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }]} />
      <Contact />
    </>
  );
}
