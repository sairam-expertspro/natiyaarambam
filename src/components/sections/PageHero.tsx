"use client";

import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/Reveal";

type HeroVariant = "banner" | "contact" | "training" | "gallery" | "blog";

const VARIANT_CLASSES: Record<
  HeroVariant,
  { section: string; media: string; overlay: string }
> = {
  banner: {
    section: "nd-about-banner",
    media: "nd-about-banner-img",
    overlay: "nd-about-banner-scrim",
  },
  contact: {
    section: "nd-contact-hero",
    media: "nd-contact-media",
    overlay: "nd-contact-overlay",
  },
  training: {
    section: "nd-train-hero",
    media: "nd-train-media",
    overlay: "nd-train-overlay",
  },
  gallery: {
    section: "nd-gallery-hero",
    media: "nd-gallery-media",
    overlay: "nd-gallery-overlay",
  },
  blog: {
    section: "nd-blog-hero",
    media: "nd-blog-media",
    overlay: "nd-blog-overlay",
  },
};

/* The 3 floating bell dots — Home & About banners only */
const BELL_POSITIONS: Array<{
  left: string;
  top?: string;
  bottom?: string;
  animationDelay?: string;
}> = [
  { left: "7%", top: "26%" },
  { left: "36%", bottom: "22%", animationDelay: "1.6s" },
  { left: "18%", top: "64%", animationDelay: "2.8s" },
];

type HeroAction = {
  label: string;
  onClick: () => void;
  icon?: ReactNode;
  iconPosition?: "leading" | "trailing";
};

export function PageHero({
  id,
  variant,
  image,
  eyebrow,
  title,
  titleClassName,
  description,
  primary,
  secondary,
  bells = false,
}: {
  id: string;
  variant: HeroVariant;
  image: { src: string; alt: string };
  eyebrow: ReactNode;
  title: ReactNode;
  titleClassName: string;
  description: ReactNode;
  primary?: HeroAction;
  secondary?: HeroAction;
  bells?: boolean;
}) {
  const classes = VARIANT_CLASSES[variant];

  return (
    <section className={classes.section} aria-labelledby={id}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={classes.media} src={image.src} alt={image.alt} />
      <div className={classes.overlay} aria-hidden="true" />
      {bells &&
        BELL_POSITIONS.map((style, i) => (
          <span key={i} className="nd-bell" style={style} aria-hidden="true" />
        ))}

      <div className="relative z-10 mx-auto flex min-h-[540px] max-w-[1180px] flex-col justify-center px-5 py-20 md:min-h-[640px] md:px-8">
        <Reveal>
          <p className="nd-eyebrow nd-eyebrow--light">{eyebrow}</p>
        </Reveal>
        <Reveal delay={90}>
          <h1 id={id} className={titleClassName}>
            {title}
          </h1>
        </Reveal>
        <Reveal delay={180}>
          <p className="mt-6 max-w-lg border-l-2 border-gold-500 pl-5 text-[0.97rem] font-light leading-relaxed text-cream-200/85">
            {description}
          </p>
        </Reveal>
        {(primary || secondary) && (
          <Reveal delay={270}>
            <div className="mt-9 flex flex-wrap gap-4">
              {primary && (
                <button
                  type="button"
                  className="nd-btn nd-btn--maroon"
                  onClick={primary.onClick}
                >
                  {primary.icon && primary.iconPosition !== "trailing" && primary.icon}
                  {primary.label}
                  {primary.icon && primary.iconPosition === "trailing" && primary.icon}
                </button>
              )}
              {secondary && (
                <button
                  type="button"
                  className="nd-btn nd-btn--gold-outline"
                  onClick={secondary.onClick}
                >
                  {secondary.icon && secondary.iconPosition !== "trailing" && secondary.icon}
                  {secondary.label}
                  {secondary.icon && secondary.iconPosition === "trailing" && secondary.icon}
                </button>
              )}
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
