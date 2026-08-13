import type { TESTIMONIALS } from "@/lib/content";

export function TestimonialCard({ t }: { t: (typeof TESTIMONIALS)[number] }) {
  return (
    <figure className="nd-card flex h-full flex-col p-7">
      <div className="flex items-start justify-between gap-3">
        <span className="nd-quote-mark" aria-hidden="true">
          &ldquo;
        </span>
      </div>
      <blockquote className="mt-3 flex-1 text-[0.87rem] font-light leading-relaxed text-ink-700">
        {t.text}
      </blockquote>
      <figcaption className="mt-6 border-t border-maroon-800/10 pt-4">
        <p className="font-display text-[1.05rem] font-semibold text-maroon-800">
          {t.name}
        </p>
      </figcaption>
    </figure>
  );
}
