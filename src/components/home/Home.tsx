"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Compass,
  Play,
  Sparkles,
} from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { TestimonialCard } from "@/components/home/TestimonialCard";
import { useSite } from "@/lib/site-context";
import { TESTIMONIALS } from "@/lib/content";

export default function Home() {
  const { goGallery, goHome } = useSite();
  const [showAllFeedback, setShowAllFeedback] = useState(false);
  const testiRef = useRef<HTMLElement | null>(null);

  const toggleFeedbacks = () => {
    setShowAllFeedback((v) => {
      const next = !v;
      if (!next) {
        window.setTimeout(
          () =>
            testiRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            }),
          80,
        );
      }
      return next;
    });
  };

  /* Auto-drifting testimonial marquee (right-to-left), pausable, arrow-navigable */
  const marqueeRef = useRef<HTMLDivElement | null>(null);
  const pausedRef = useRef(false); // hover / focus pause
  const manualRef = useRef(false); // arrow tween in progress
  const draggingRef = useRef(false); // finger / mouse sweep in progress
  const expandedCountRef = useRef(0); // "Read More" cards open
  const dragState = useRef({ startX: 0, startScroll: 0 });
  const touchRestUntilRef = useRef(0); // keeps drift paused briefly after a touch swipe ends

  const onTestimonialExpandChange = (isExpanded: boolean) => {
    expandedCountRef.current = Math.max(
      0,
      expandedCountRef.current + (isExpanded ? 1 : -1),
    );
  };

  useEffect(() => {
    if (showAllFeedback) return;
    const el = marqueeRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const step = () => {
      if (
        !pausedRef.current &&
        !manualRef.current &&
        !draggingRef.current &&
        expandedCountRef.current === 0 &&
        Date.now() >= touchRestUntilRef.current
      ) {
        el.scrollLeft += 0.7;
        const half = el.scrollWidth / 2;
        if (half > 0 && el.scrollLeft >= half) el.scrollLeft -= half;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [showAllFeedback]);

  /* Finger / mouse sweep — drag the strip directly, seamlessly wrapping */
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("button")) return;
    const el = marqueeRef.current;
    if (!el) return;
    draggingRef.current = true;
    dragState.current = { startX: e.clientX, startScroll: el.scrollLeft };
    el.setPointerCapture?.(e.pointerId);
    el.style.cursor = "grabbing";
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    const el = marqueeRef.current;
    if (!el) return;
    el.scrollLeft =
      dragState.current.startScroll - (e.clientX - dragState.current.startX);
  };
  const endDrag = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    const el = marqueeRef.current;
    if (!el) return;
    el.style.cursor = "grab";
    const half = el.scrollWidth / 2;
    if (el.scrollLeft >= half) el.scrollLeft -= half;
    if (el.scrollLeft < 0) el.scrollLeft += half;
    /* On touch devices there's no hover to keep pausedRef true, so the
       auto-drift would otherwise resume mid-frame and fight the swipe. */
    touchRestUntilRef.current = Date.now() + 2500;
  };

  const nudge = (dir: 1 | -1) => {
    const el = marqueeRef.current;
    if (!el) return;
    const half = el.scrollWidth / 2;
    const w =
      el.querySelector<HTMLElement>(".nd-marquee-item")?.offsetWidth ?? 380;

    /* When nudging left near the start, hop into the duplicated half first
       so the strip never slams into a wall — the loop stays seamless. */
    let from = el.scrollLeft;
    if (dir === -1 && from < w) {
      from += half;
      el.scrollLeft = from;
    }
    const target = from + dir * w;

    manualRef.current = true;
    const t0 = performance.now();
    const duration = 520;
    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.scrollLeft = from + (target - from) * eased;
      if (p < 1) {
        requestAnimationFrame(tick);
      } else {
        /* normalize back into the first copy */
        if (el.scrollLeft >= half) el.scrollLeft -= half;
        if (el.scrollLeft < 0) el.scrollLeft += half;
        manualRef.current = false;
      }
    };
    requestAnimationFrame(tick);
  };

  return (
    <div id="home">
      <PageHero
        id="hero-title"
        variant="banner"
        bells
        image={{
          src: "/images/Home Banner.webp",
          alt: "Bharatanatyam dancer in an emerald green and gold sari seated in araimandi before a deep maroon circle",
        }}
        eyebrow="Grace. Discipline. Heritage."
        titleClassName="mt-5 max-w-xl font-display text-[2.2rem] font-bold leading-[1.1] text-cream-50 sm:text-[2.6rem] md:text-[3.2rem] lg:text-[3.5rem]"
        title={
          <>
            Discover the Divine{" "}
            <span className="sm:whitespace-nowrap">
              Language of <span className="text-gold-400">Bharatanatyam</span>
            </span>
          </>
        }
        description="Step into a world where rhythm, expression, and tradition come
              together. At Natyaarambam Dance Academy, we offer structured
              Bharatanatyam training that nurtures technique, confidence,
              spirituality, and artistic expression for every aspiring dancer."
        primary={{ label: "Enroll Now", onClick: () => goHome("contact") }}
        secondary={{
          label: "Watch Our Gallery",
          onClick: goGallery,
          icon: <Play size={15} aria-hidden="true" />,
        }}
      />

      <section
        id="about-home"
        className="mx-auto max-w-[1180px] scroll-mt-24 px-5 py-20 md:px-8 md:py-28"
      >
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <Reveal>
              <h2 className="font-display text-[2rem] font-bold leading-tight text-maroon-800 md:text-[2.5rem]">
                The Neo-Classical Philosophy
              </h2>
            </Reveal>
            <Reveal delay={90}>
              <p className="mt-5 max-w-md text-[0.95rem] font-light leading-relaxed text-ink-500">
                Natyaarambam Dance Academy is dedicated to preserving the rich
                heritage of Bharatanatyam through authentic training, creative
                expression, and mentorship.
              </p>
            </Reveal>

            <div className="mt-9 space-y-7">
              <Reveal delay={160}>
                <div className="flex gap-4">
                  <span className="nd-icon-chip">
                    <BookOpen size={16} strokeWidth={1.7} aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-[0.82rem] font-semibold uppercase tracking-[0.18em] text-maroon-800">
                      Intellectual Grounding
                    </h3>
                    <p className="mt-1.5 text-sm font-light text-ink-500">
                      Understanding the Shastras as much as the steps.
                    </p>
                  </div>
                </div>
              </Reveal>
              <Reveal delay={240}>
                <div className="flex gap-4">
                  <span className="nd-icon-chip">
                    <Compass size={16} strokeWidth={1.7} aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-[0.82rem] font-semibold uppercase tracking-[0.18em] text-maroon-800">
                      Structural Precision
                    </h3>
                    <p className="mt-1.5 text-sm font-light text-ink-500">
                      Honoring the geometric purity of the Bharatanatyam form.
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>

          <Reveal delay={140} className="relative">
            <div className="nd-img-zoom relative h-[420px] w-full rounded-[26px] md:h-[500px]">
              <Image
                src="/images/Images/2.webp"
                alt="Brass Nataraja — the cosmic dancer — glowing in warm temple light"
                fill
                sizes="(max-width: 1024px) 100vw, 560px"
                className="object-cover"
              />
            </div>
            <blockquote className="nd-quote-card absolute -bottom-8 -left-2 max-w-[230px] p-6 text-[1.05rem] leading-snug md:-left-10">
              &ldquo;Dance is the hidden language of the soul.&rdquo;
            </blockquote>
          </Reveal>
        </div>
      </section>

      {/* ====================== PILLARS / MISSION ====================== */}
      <section
        id="training"
        className="scroll-mt-24 bg-cream-50 py-20 md:py-28"
      >
        <div className="mx-auto max-w-[1180px] px-5 md:px-8">
          <Reveal>
            <h2 className="font-display text-[2rem] font-bold text-maroon-800 md:text-[2.4rem]">
              The Pillars of Natyaarambam
            </h2>
            <div className="nd-rule mt-4" />
          </Reveal>

          <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-14">
            <Reveal>
              <div className="nd-card relative h-full p-8 md:p-10">
                <Sparkles
                  className="absolute right-7 top-7 text-gold-500"
                  size={20}
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                <p className="nd-eyebrow">Our Mission</p>
                <h3 className="mt-3 font-display text-[1.55rem] font-semibold text-ink-900">
                  Cultivating Technical Mastery
                </h3>
                <p className="mt-4 text-sm font-light leading-relaxed text-ink-500">
                  To provide a rigorous, performance-driven education that
                  honors the intricate grammar of Bharatanatyam. We aim to
                  empower the next generation of dancers with clinical
                  precision, emotional depth, and a deep-seated respect for the
                  traditions.
                </p>
                <ul className="mt-7 space-y-4">
                  {[
                    "To provide exceptional Bharatanatyam education through expert instruction",
                    "Personalized guidance nurturing environment where students grow artistically, culturally, and personally — both online and in person",
                    "Holistic integration of Natyashastra theory",
                    "Sustainable physical conditioning for longevity",
                  ].map((t) => (
                    <li
                      key={t}
                      className="flex gap-3 text-sm font-light leading-relaxed text-ink-700"
                    >
                      <CheckCircle2
                        size={17}
                        className="nd-check"
                        strokeWidth={1.7}
                        aria-hidden="true"
                      />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={140} className="relative">
              <div className="nd-img-zoom relative h-[440px] w-full rounded-[26px] md:h-[520px]">
                <Image
                  src="/images/Images/65.webp"
                  alt="A dancer's hand held in gyan mudra, adorned with bangles"
                  fill
                  sizes="(max-width: 1024px) 100vw, 560px"
                  className="rounded-[26px] object-cover"
                />
              </div>
              <p className="nd-dark-chip absolute -bottom-6 left-6 max-w-[250px] rounded-md px-6 py-5 text-[0.92rem] leading-snug">
                &ldquo;Precision is the bridge between the human and the
                divine.&rdquo;
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ====================== TESTIMONIALS ====================== */}
      <section
        ref={testiRef}
        id="testimonials"
        className="mx-auto max-w-[1180px] scroll-mt-24 px-5 py-20 md:px-8 md:py-28"
      >
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Reveal>
              <p className="nd-link-gold inline-block">Testimonial</p>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-3 font-display text-[2rem] font-bold text-maroon-800 md:text-[2.4rem]">
                What Our Clients Say
              </h2>
            </Reveal>
            <Reveal delay={150}>
              <p className="mt-4 max-w-md text-sm font-light leading-relaxed text-ink-500">
                Grace begins with discipline, and excellence follows dedication.
                Natyaarambam makes every dance journey truly unforgettable.
              </p>
            </Reveal>
          </div>
          <Reveal delay={200}>
            <button
              type="button"
              className="nd-link-gold inline-flex items-center gap-1.5"
              onClick={toggleFeedbacks}
              aria-expanded={showAllFeedback}
              aria-controls="testimonial-grid"
            >
              {showAllFeedback ? "View Less" : "View All Feedbacks"}
              <ChevronDown
                size={15}
                aria-hidden="true"
                className={`transition-transform duration-300 ${showAllFeedback ? "rotate-180" : ""}`}
              />
            </button>
          </Reveal>
        </div>

        {showAllFeedback ? (
          <div
            id="testimonial-grid"
            className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={(i % 3) * 90}>
                <TestimonialCard t={t} />
              </Reveal>
            ))}
          </div>
        ) : (
          <Reveal delay={120}>
            <div className="relative mt-12">
              <div
                ref={marqueeRef}
                className="nd-marquee"
                aria-label="Client testimonials, auto-scrolling — drag, swipe, or use the arrows"
                onMouseEnter={() => (pausedRef.current = true)}
                onMouseLeave={() => (pausedRef.current = false)}
                onFocusCapture={() => (pausedRef.current = true)}
                onBlurCapture={() => (pausedRef.current = false)}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
                onPointerLeave={endDrag}
                style={{ touchAction: "pan-y", cursor: "grab" }}
              >
                <div className="nd-marquee-track">
                  {TESTIMONIALS.map((t) => (
                    <div key={t.name} className="nd-marquee-item">
                      <TestimonialCard
                        t={t}
                        truncate
                        onExpandChange={onTestimonialExpandChange}
                      />
                    </div>
                  ))}
                  {TESTIMONIALS.map((t) => (
                    <div
                      key={`echo-${t.name}`}
                      className="nd-marquee-item"
                      aria-hidden="true"
                    >
                      <TestimonialCard
                        t={t}
                        truncate
                        onExpandChange={onTestimonialExpandChange}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <button
                type="button"
                className="nd-marquee-btn nd-marquee-btn--left"
                aria-label="Move testimonials to the left"
                onClick={() => nudge(1)}
              >
                <ChevronLeft size={20} aria-hidden="true" />
              </button>
              <button
                type="button"
                className="nd-marquee-btn nd-marquee-btn--right"
                aria-label="Move testimonials to the right"
                onClick={() => nudge(-1)}
              >
                <ChevronRight size={20} aria-hidden="true" />
              </button>
            </div>
          </Reveal>
        )}

        {showAllFeedback && (
          <p className="nd-fb-card mt-10 text-center text-sm font-light italic text-ink-500">
            Showing all {TESTIMONIALS.length} family stories — thank you for
            dancing with us.
          </p>
        )}
      </section>

      {/* ====================== WHY CHOOSE ====================== */}
      <section id="why" className="scroll-mt-24 bg-cream-50 py-20 md:py-28">
        <div className="mx-auto grid max-w-[1180px] items-center gap-14 px-5 md:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <Reveal delay={140} className="relative w-full">
            <div className="nd-img-zoom mx-auto w-full max-w-[650px] overflow-hidden rounded-[26px]">
              <Image
                src="/images/Images/61.webp"
                alt="A dancer's hand held in gyan mudra, adorned with bangles"
                width={1366}
                height={2048}
                sizes="(max-width: 1024px) 100vw, 650px"
                className="nd-grayscale block h-auto w-full rounded-[26px]"
              />
            </div>
          </Reveal>

          <div>
            <Reveal>
              <h2 className="font-display text-[2rem] font-bold text-maroon-800 md:text-[2.4rem]">
                Why Choose Natyaarambam?
              </h2>
            </Reveal>
            <Reveal delay={90}>
              <p className="mt-5 text-sm font-light leading-relaxed text-ink-500">
                At{" "}
                <strong className="font-medium text-ink-900">
                  Natyaarambam Dance Academy
                </strong>
                , we are dedicated to preserving the timeless heritage of
                Bharatanatyam while inspiring every student to discover their
                artistic potential. Our holistic approach combines traditional
                values, expert mentorship, and disciplined training, helping
                students build confidence, creativity, and cultural awareness.
                Whether you are a beginner or an advanced learner, we provide a
                nurturing environment where passion meets excellence and every
                step becomes a journey of self-discovery.
              </p>
            </Reveal>

            <div className="mt-8">
              {[
                {
                  n: "01",
                  t: "Trained in the Traditional Thanjavur Bani",
                  d: "Authentic Bharatanatyam training rooted in the timeless Thanjavur Bani and Guru-Shishya tradition.",
                },
                {
                  n: "02",
                  t: "Building Discipline & Character",
                  d: "Develop discipline, confidence, expressive storytelling, and artistic excellence through structured learning.",
                },
                {
                  n: "03",
                  t: "Performance Opportunities & Cultural Excellence",
                  d: "Empowering students worldwide to preserve Indian classical culture through meaningful performances and lifelong learning.",
                },
              ].map((item, i) => (
                <Reveal key={item.n} delay={140 + i * 90}>
                  <div className={`py-5 ${i > 0 ? "nd-num-row" : ""}`}>
                    <h3 className="text-[0.95rem] font-semibold text-maroon-800">
                      <span className="nd-num mr-2">{item.n}</span>
                      {item.t}
                    </h3>
                    <p className="mt-2 text-sm font-light leading-relaxed text-ink-500">
                      {item.d}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CtaBand id="cta-title" />
    </div>
  );
}
