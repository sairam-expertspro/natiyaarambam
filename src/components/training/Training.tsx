"use client";

import { useState } from "react";
import { CheckCircle2, Play, Star } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { useSite } from "@/lib/site-context";

type Status = "online" | "offline" | "inperson";
const STATUS_LABEL: Record<Status, string> = {
  online: "Online",
  offline: "Offline",
  inperson: "In Person",
};

const LEVELS = [
  {
    tag: "Beginner (Level 1)",
    name: "Prarambhika",
    items: ["Ages 6 - 9 Years", "1 Sessions / Week", "Adavus & Rhythmic Theory"],
    featured: false,
  },
  {
    tag: "Intermediate",
    name: "Madhyama",
    items: ["Ages 10 - 15 Years", "1 Sessions / Week", "Jatiswaram & Shabdam"],
    featured: true,
  },
  {
    tag: "Mastery",
    name: "Praveena",
    items: ["Ages 16+ / Adults", "1 Sessions / Week", "Varnam & Manodharma"],
    featured: false,
  },
];

const SCHEDULE: {
  small: string;
  name: string;
  days: string;
  slot: string;
  guru: string;
  status: Status;
}[] = [
  { small: "Beginner (Level 1)", name: "Prarambhika", days: "Saturday & Sunday", slot: "–", guru: "Guru Hema", status: "offline" },
  { small: "Intermediate", name: "Madhyama", days: "Saturday & Sunday", slot: "–", guru: "Guru Hema", status: "offline" },
  { small: "Advanced Repertoire", name: "Praveena", days: "Saturday & Sunday", slot: "–", guru: "Guru Hema", status: "offline" },
  { small: "Fusion & Film", name: "Semi-Classical", days: "Saturday & Sunday", slot: "–", guru: "Guru Hema", status: "inperson" },
  { small: "Beginner (Level 1)", name: "Prarambhika — Live Stream", days: "Monday & Wednesday", slot: "–", guru: "Guru Hema", status: "online" },
  { small: "Intermediate", name: "Madhyama — Live Stream", days: "Tuesday & Thursday", slot: "–", guru: "Guru Hema", status: "online" },
];

const FILTERS: { id: "all" | Status; label: string; dot?: string }[] = [
  { id: "all", label: "All" },
  { id: "online", label: "Online", dot: "nd-dot--online" },
  { id: "offline", label: "Offline", dot: "nd-dot--offline" },
  { id: "inperson", label: "In Person", dot: "nd-dot--inperson" },
];

export default function Training() {
  const { goGallery, goHome } = useSite();
  const [filter, setFilter] = useState<"all" | Status>("all");

  const rows = SCHEDULE.filter((r) => filter === "all" || r.status === filter);

  const enroll = (_level?: string) => goHome("contact");

  return (
    <div id="training-page">
      <PageHero
        id="training-title"
        variant="training"
        image={{
          src: "/images/Training Page 1.webp",
          alt: "A troupe of Bharatanatyam dancers performing on stage in vibrant costumes",
        }}
        eyebrow="Professional Artistry"
        titleClassName="mt-5 max-w-2xl font-display text-[2.6rem] font-bold leading-[1.08] text-cream-50 md:text-[3.6rem]"
        title={
          <>
            Training <span className="italic">&amp;</span>{" "}
            <span className="text-gold-400">Curriculum</span>
          </>
        }
        description="Mastering the divine art of Bharatanatyam through a structured,
              rigorous, and spiritually grounded curriculum."
        primary={{ label: "Enroll Now", onClick: () => enroll("your batch") }}
        secondary={{
          label: "Watch Our Gallery",
          onClick: goGallery,
          icon: <Play size={15} aria-hidden="true" />,
        }}
      />

      {/* ====================== LEARNING PATHS ====================== */}
      <section className="bg-cream-100 py-20 md:py-28" aria-labelledby="paths-title">
        <div className="mx-auto max-w-[1180px] px-5 md:px-8">
          <Reveal>
            <h2 id="paths-title" className="font-display text-[2rem] font-bold text-maroon-800 md:text-[2.5rem]">
              Tailored Learning Paths
            </h2>
          </Reveal>
          <Reveal delay={90}>
            <p className="mt-4 max-w-xl text-[0.95rem] font-light leading-relaxed text-ink-500">
              Our curriculum is structured into rigorous levels, ensuring
              students master the grammar of dance before moving to expressive
              storytelling.
            </p>
          </Reveal>

          <div className="mt-14 grid items-center gap-6 md:grid-cols-3">
            {LEVELS.map((lvl, i) => (
              <Reveal key={lvl.name} delay={i * 110}>
                <article
                  className={`nd-level-card ${lvl.featured ? "nd-level-card--dark" : ""} flex h-full flex-col p-8`}
                >
                  {lvl.featured && (
                    <Star className="nd-level-star" size={92} strokeWidth={1} aria-hidden="true" />
                  )}
                  <p className={`text-[0.66rem] font-semibold uppercase tracking-[0.22em] ${lvl.featured ? "text-cream-200/70" : "text-ink-400"}`}>
                    {lvl.tag}
                  </p>
                  <h3 className={`mt-2.5 font-display text-[1.7rem] font-bold ${lvl.featured ? "text-gold-400" : "text-maroon-800"}`}>
                    {lvl.name}
                  </h3>
                  <ul className="mt-6 space-y-3.5">
                    {lvl.items.map((item) => (
                      <li key={item} className={`flex items-center gap-2.5 text-sm font-light ${lvl.featured ? "text-cream-200/85" : "text-ink-700"}`}>
                        <CheckCircle2 size={16} className={lvl.featured ? "flex-none text-gold-400" : "nd-check"} strokeWidth={1.7} aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    className={`nd-btn mt-8 w-full uppercase tracking-[0.14em] ${lvl.featured ? "nd-btn--gold-solid" : "nd-btn--maroon"}`}
                    style={{ fontSize: "0.78rem" }}
                    onClick={() => enroll(lvl.name)}
                  >
                    Enroll Now
                  </button>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ====================== CLASS SCHEDULE ====================== */}
      <section className="bg-cream-50 py-20 md:py-28" aria-labelledby="schedule-title">
        <div className="mx-auto max-w-[1180px] px-5 md:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <Reveal>
                <p className="nd-eyebrow">Timings</p>
              </Reveal>
              <Reveal delay={80}>
                <h2 id="schedule-title" className="mt-3 font-display text-[2rem] font-bold text-maroon-800 md:text-[2.4rem]">
                  Class Schedule
                </h2>
              </Reveal>
              <Reveal delay={150}>
                <p className="mt-4 max-w-md text-sm font-light leading-relaxed text-ink-500">
                  Structured timings across weekdays and weekends to
                  accommodate both students and working professionals.
                </p>
              </Reveal>
            </div>
            <Reveal delay={200}>
              <div className="flex flex-wrap gap-3" role="group" aria-label="Filter schedule by class mode">
                {FILTERS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    className={`nd-legend-chip ${filter === f.id ? "nd-legend-chip--active" : ""}`}
                    aria-pressed={filter === f.id}
                    onClick={() => setFilter(f.id)}
                  >
                    {f.dot && <span className={`nd-dot ${f.dot}`} aria-hidden="true" />}
                    {f.label}
                  </button>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal delay={120}>
            <div className="nd-scroll mt-12 overflow-x-auto">
              <table className="nd-sched w-full min-w-[680px] border-collapse text-left">
                <thead>
                  <tr>
                    <th scope="col">Level</th>
                    <th scope="col">Days</th>
                    <th scope="col">Time Slot</th>
                    <th scope="col">Guru</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>
                <tbody key={filter}>
                  {rows.map((row, i) => (
                    <tr key={row.name} className="nd-fb-card" style={{ animationDelay: `${i * 60}ms` }}>
                      <td>
                        {row.small && (
                          <span className="block text-[0.66rem] font-light uppercase tracking-[0.08em] text-ink-400">
                            {row.small}
                          </span>
                        )}
                        <span className="font-display text-[1.08rem] font-semibold text-ink-900">
                          {row.name}
                        </span>
                      </td>
                      <td className="text-sm font-light text-ink-700">{row.days}</td>
                      <td className="text-sm font-light text-ink-400">{row.slot}</td>
                      <td className="text-sm font-light text-ink-700">{row.guru}</td>
                      <td>
                        <span className={`nd-status-pill nd-status-pill--${row.status}`}>
                          {STATUS_LABEL[row.status]}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {rows.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-sm font-light italic text-ink-400">
                        No batches in this mode right now — check back after the next recital season.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Reveal>

          <Reveal delay={160}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-light italic text-ink-500">
                Private one-on-one sessions and Arangetram intensive tracks are
                available on request — speak with the front desk to arrange a
                time with Guru Hema.
              </p>
              <p className="shrink-0 text-xs font-medium uppercase tracking-[0.18em] text-gold-600" aria-live="polite">
                Showing {rows.length} of {SCHEDULE.length} batches
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <CtaBand id="training-cta-title" />
    </div>
  );
}
