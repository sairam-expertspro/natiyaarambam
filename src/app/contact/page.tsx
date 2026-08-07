import type { Metadata } from "next";
import Contact from "@/views/Contact";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Natyaarambam Dance Academy and submit an enrollment request for Bharatanatyam classes.",
};

export default function ContactPage() {
  return <Contact />;
}
