import type { Metadata } from "next";
import Blog from "@/components/blog/Blog";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Articles on Bharatanatyam history, technique, and theory from Natyaarambam Dance Academy.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Home", path: "/" }, { name: "Blog", path: "/blog" }]} />
      <Blog />
    </>
  );
}
