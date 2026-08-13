import type { Metadata } from "next";
import Training from "@/components/training/Training";

export const metadata: Metadata = {
  title: "Training",
  description:
    "Explore Bharatanatyam curriculum levels, class schedules, and training paths at Natyaarambam Dance Academy.",
};

export default function TrainingPage() {
  return <Training />;
}
