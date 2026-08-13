import type { Metadata } from "next";
import Blog from "@/components/blog/Blog";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Articles on Bharatanatyam history, technique, and theory from Natyaarambam Dance Academy.",
};

export default function BlogPage() {
  return <Blog />;
}
