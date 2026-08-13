import type { Metadata } from "next";
import About from "@/components/about/About";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Natyaarambam Dance Academy, Guru Hema Chandrasekaran, and the academy's Bharatanatyam legacy.",
};

export default function AboutPage() {
  return <About />;
}
