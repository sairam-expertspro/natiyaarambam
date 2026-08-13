"use client";

import { Play } from "lucide-react";
import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { useSite } from "@/lib/site-context";

export function CtaBand({
  id,
  onEnroll,
  onWatch,
}: {
  id: string;
  onEnroll?: () => void;
  onWatch?: () => void;
}) {
  const { goHome, goGallery } = useSite();
  const enroll = onEnroll ?? (() => goHome("contact"));
  const watch = onWatch ?? goGallery;

  return (
    <section className="nd-cta" aria-labelledby={id}>
      <span
        className="nd-cta-watermark"
        style={{ right: "4%", top: "50%", transform: "translateY(-50%)" }}
        aria-hidden="true"
      >
        <Image
          src="/images/Decorative Lotus watermark.svg"
          alt=""
          width={500}
          height={500}
          className="opacity-5 relative top-20 left-50"
        />
      </span>

      <div className="relative mx-auto max-w-[760px] px-5 py-20 text-center md:py-24">
        <Reveal>
          <h2 id={id} className="font-display text-[2rem] font-bold text-cream-50 md:text-[2.6rem]">
            Begin Your Journey Within
          </h2>
        </Reveal>
        <Reveal delay={100}>
          <p className="mx-auto mt-4 max-w-md text-sm font-light leading-relaxed text-cream-200/85">
            Whether you are a seasoned practitioner or a curious beginner,
            our space is designed to support your evolution.
          </p>
        </Reveal>
        <Reveal delay={190}>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <button type="button" className="nd-btn nd-btn--gold-solid" onClick={enroll}>
              Enroll Now
            </button>
            <button type="button" className="nd-btn nd-btn--outline-cream" onClick={watch}>
              <Play size={15} aria-hidden="true" /> Watch Our Gallery
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
