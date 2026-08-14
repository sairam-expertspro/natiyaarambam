"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { TESTIMONIALS } from "@/lib/content";

const TRUNCATE_LENGTH = 150;

export function TestimonialCard({
  t,
  truncate = false,
  onExpandChange,
}: {
  t: (typeof TESTIMONIALS)[number];
  truncate?: boolean;
  onExpandChange?: (expanded: boolean) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  const text = t.text.trim();
  const shouldTruncate = truncate && text.length > TRUNCATE_LENGTH;

  /* Let the parent carousel pause its auto-drift while this card is open,
     so the text doesn't scroll out of view mid-read. */
  useEffect(() => {
    onExpandChange?.(expanded);
    return () => {
      if (expanded) onExpandChange?.(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expanded]);

  return (
    <figure className="nd-card flex h-full flex-col p-7">
      <div className="flex items-start justify-between gap-3">
        <span className="nd-quote-mark" aria-hidden="true">
          &ldquo;
        </span>
      </div>

      <blockquote
        className={`mt-3 text-[0.87rem] font-light leading-relaxed text-ink-700 ${
          shouldTruncate ? "" : "flex-1"
        } ${shouldTruncate && !expanded ? "line-clamp-4" : ""}`}
      >
        {text}
      </blockquote>

      {shouldTruncate && (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="nd-link-gold mt-2 inline-flex items-center gap-1 self-start text-xs"
          aria-expanded={expanded}
        >
          {expanded ? "Read Less" : "Read More"}
          <ChevronDown
            size={13}
            aria-hidden="true"
            className={`transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
          />
        </button>
      )}

      <figcaption className={`${shouldTruncate ? "mt-auto" : "mt-6"} border-t border-maroon-800/10 pt-4`}>
        <p className="font-display text-[1.05rem] font-semibold text-maroon-800">
          {t.name}
        </p>

        <p className="text-sm text-ink-500">{t.role}</p>
      </figcaption>
    </figure>
  );
}