"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowRight, X } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { PageHero } from "@/components/sections/PageHero";

/* Photography: Roman Saienko (37826464) · Krishna Photography (30481585)
   Janak Patel (13943905) · Mouli Ghosh (17468601) · Syam Vijai (18240707)
   Kosygin Leishangthem (18086346) · Roman Saienko (37903972)
   Ashak Umesh (32604036) · Sharath G. (10899309) — Pexels */

type Article = {
  id: string;
  cat: "history" | "technique" | "theory" | "milestones";
  date: string;
  title: string;
  excerpt: string;
  img: string;
  alt: string;
  body: string[];
};

const ARTICLES: Article[] = [
  {
    id: "tanjore-quartet",
    cat: "history",
    date: "March 15, 2024",
    title: "The Legacy of the Tanjore Quartet",
    excerpt: "Discover the profound impact of the four brothers who formalized the modern Margam, weaving centuries of tradition into the structured repertoire we practice today.",
    img: "https://images.pexels.com/photos/37826464/pexels-photo-37826464.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1600",
    alt: "Brihadeeswarar Temple in Thanjavur glowing at sunset",
    body: [
      "In the early nineteenth century, four brothers — Chinnaswamy, Ponniah, Sivanandam, and Vadivelu — served the Maratha court of Tanjore as musicians and dance masters. Together they took the scattered repertoire of the devadasi tradition and gave it the architecture we still inhabit: the ordered progression of the margam, from the grounding Alarippu to the exhilarating Tillana.",
      "Their genius was editorial as much as artistic. They composed new pieces, codified adavu sequences, and balanced nritta, nritya, and natya so that a recital would unfold like a ritual — beginning in the body, rising through expression, and ending in joy. Every time our students walk the margam on stage, they walk a path the Quartet surveyed two hundred years ago.",
      "At Natyaarambam we teach their legacy not as museum history but as living grammar. Understanding why the margam is ordered as it is changes how a dancer phrases every item — and that understanding is the truest form of gratitude to the four brothers of Tanjore.",
    ],
  },
  {
    id: "adavu-building-blocks",
    cat: "technique",
    date: "Feb 28, 2024",
    title: "Understanding the Adavu: The Building Blocks of Bharatanatyam",
    excerpt: "A deep dive into the foundational steps of Bharatanatyam, exploring how posture, rhythm, and grace interlock in every Adavu.",
    img: "https://images.pexels.com/photos/30481585/pexels-photo-30481585.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=1000",
    alt: "Dancer's feet with ghungroo and alta mid-step",
    body: [
      "The adavu is the atom of Bharatanatyam: a prescribed combination of footwork, posture, and hand gesture executed to a spoken rhythmic syllable. Tattadavu, Nattadavu, Visharadavu — each family trains a different conversation between the striking foot and the answering body.",
      "Precision matters because the adavu is where rhythm becomes visible. A clean araimandi, a level thigh, a wrist that finishes exactly on the beat — these are not aesthetic luxuries but the structural honesty of the form. We drill them slowly, then phrase them into jatis the way letters become sentences.",
    ],
  },
  {
    id: "symbolism-of-mudras",
    cat: "theory",
    date: "Feb 12, 2024",
    title: "The Symbolism of Mudras: Speaking with the Hands",
    excerpt: "Decoding the visual language of Bharatanatyam. How single and double hand gestures convey complex narratives and emotions.",
    img: "https://images.pexels.com/photos/13943905/pexels-photo-13943905.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=1000",
    alt: "A hand held in a mudra, adorned with gold bangles",
    body: [
      "The Natyashastra catalogues twenty-eight single-hand gestures (asamyuta hastas) and twenty-four combined ones (samyuta hastas). Pataka can mean cloud, forest, denial, or the opening of a story; the same hand becomes a different word depending on movement, context, and glance.",
      "Mudras are not decoration but vocabulary. In abhinaya, they carry the literal meaning of a lyric while the eyes carry its feeling — and when the two align, the audience reads the story as clearly as spoken language.",
    ],
  },
  {
    id: "arangetram-journey",
    cat: "milestones",
    date: "Jan 05, 2024",
    title: "Preparing for your Arangetram: A Journey of a Thousand Steps",
    excerpt: "Practical advice and spiritual guidance for students approaching their solo debut. What it means to ascend the stage for the first time.",
    img: "https://images.pexels.com/photos/17468601/pexels-photo-17468601.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=1000",
    alt: "A young dancer adjusting her earring before a mirror",
    body: [
      "Arangetram — literally 'ascending the stage' — is less a performance than a rite of passage. Months before the date, the work shifts from learning items to building stamina: full run-throughs, orchestra rehearsals, and the quiet discipline of rest.",
      "Our advice to debuting students is simple: trust the repetition. On the night, the technique you drilled for years will carry you; your only job is to be present, offer the dance, and let the stage teach you what a classroom never could.",
    ],
  },
  {
    id: "araimandi-geometry",
    cat: "technique",
    date: "Dec 18, 2023",
    title: "Araimandi: The Geometry of the Half-Seat",
    excerpt: "Why the signature stance of Bharatanatyam is a lesson in symmetry, strength, and surrender — and how to find yours.",
    img: "https://images.pexels.com/photos/18240707/pexels-photo-18240707.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=1000",
    alt: "Dancer holding a low stance under red stage light",
    body: [
      "Araimandi divides the body into a perfect diamond: knees apart, spine erect, weight balanced between both feet. It looks static and is anything but — every gesture in Bharatanatyam is launched from this coiled equilibrium.",
      "Building a stable araimandi takes patience and honest conditioning. We teach students to find the stance in the bones before the muscles, so it can hold through a full jatiswaram without tremor.",
    ],
  },
  {
    id: "rasa-theory",
    cat: "theory",
    date: "Dec 02, 2023",
    title: "Rasa Theory: How Emotion Becomes Art",
    excerpt: "From bhava to rasa — tracing the alchemy by which a dancer's personal feeling becomes a shared aesthetic experience.",
    img: "https://images.pexels.com/photos/18086346/pexels-photo-18086346.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=1000",
    alt: "Dancer expressing emotion in a vibrant sari",
    body: [
      "Bharata's rasa sutra says rasa arises from the union of determinants, consequents, and transitory states. In practice: the scene sets the mood, the body responds, and the fleeting feelings pass through like weather — until the audience tastes the stable emotion beneath.",
      "For the dancer, the lesson is counterintuitive. You do not perform emotion; you construct its causes with total specificity, and rasa arrives on its own — in the spectator first, and then, unmistakably, in you.",
    ],
  },
  {
    id: "natyanjali-2024",
    cat: "milestones",
    date: "Nov 20, 2023",
    title: "Natyanjali 2024: A Night of a Thousand Offerings",
    excerpt: "Looking ahead to our temple courtyard festival, where every item is danced as an offering rather than a performance.",
    img: "https://images.pexels.com/photos/37903972/pexels-photo-37903972.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=1000",
    alt: "Ornate stone columns of a Tamil Nadu temple at sunset",
    body: [
      "Natyanjali — dance as worship — returns to the temple courtyard this winter. Students from every batch will offer shlokas and devotional pieces under the gopuram, continuing a practice that predates the proscenium by centuries.",
      "Dancing without a ticketed audience changes everything: the lamp is the spectator, the deity the critic. It is the most honest stage we know, and the one our youngest students remember longest.",
    ],
  },
  {
    id: "tala-rhythm",
    cat: "technique",
    date: "Nov 06, 2023",
    title: "Tala & Rhythm: Counting the Universe",
    excerpt: "How the cyclic talas of Carnatic music structure a dancer's sense of time — and why the nattuvangam is your best teacher.",
    img: "https://images.pexels.com/photos/32604036/pexels-photo-32604036.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=1000",
    alt: "A musician playing hand cymbals",
    body: [
      "Adi, Rupaka, Misra Chapu — each tala is a wheel of beats with its own accent pattern. A dancer who hears the samam (the first beat of the cycle) can land a teermanam like a homecoming, no matter how intricate the korvai.",
      "We train rhythm vocally before physically: students speak the sollukattu, clap the angas, and only then dance them. The feet should never know what the ear has not already understood.",
    ],
  },
  {
    id: "margam-explained",
    cat: "theory",
    date: "Oct 21, 2023",
    title: "The Margam Explained: From Alarippu to Tillana",
    excerpt: "A guided walk through the traditional recital order and the emotional logic behind each item's placement.",
    img: "https://images.pexels.com/photos/10899309/pexels-photo-10899309.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=1000",
    alt: "Brass Nataraja, the cosmic dancer",
    body: [
      "The margam begins with Alarippu — a bloom of pure movement — and gradually admits melody, then meaning: Jatiswaram, Shabdam, Varnam at the center, then Padam, and finally the sparkling Tillana. The arc moves from body to mind to heart and back to celebration.",
      "Programming a recital is therefore dramaturgy. Place the Varnam wrong and the evening loses its spine; end without a Tillana and the audience leaves mid-breath. The Tanjore Quartet understood this, and so must we.",
    ],
  },
];

const CATS = [
  { id: "all", label: "All" },
  { id: "technique", label: "Technique" },
  { id: "theory", label: "Theory" },
  { id: "milestones", label: "Milestones" },
] as const;

export default function Blog() {
  const [cat, setCat] = useState<(typeof CATS)[number]["id"]>("all");
  const [count, setCount] = useState(3);
  const [reading, setReading] = useState<Article | null>(null);

  const filtered = ARTICLES.filter((a) => cat === "all" || a.cat === cat);
  const visible = filtered.slice(0, count);
  const featured = ARTICLES[0];

  useEffect(() => setCount(3), [cat]);

  useEffect(() => {
    if (!reading) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setReading(null);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [reading]);

  return (
    <div id="blog-page">
      <PageHero
        id="blog-hero-title"
        variant="blog"
        image={{ src: featured.img, alt: featured.alt }}
        eyebrow={`${featured.cat} · ${featured.date}`}
        titleClassName="mt-5 max-w-3xl font-display text-[2.6rem] font-bold leading-[1.1] text-cream-50 md:text-[3.8rem]"
        title={
          <>
            The Legacy of the <span className="text-gold-400">Tanjore Quartet</span>
          </>
        }
        description={featured.excerpt}
        primary={{
          label: "Read Article",
          onClick: () => setReading(featured),
          icon: <ArrowRight size={16} aria-hidden="true" />,
          iconPosition: "trailing",
        }}
      />

      {/* ====================== RECENT THREADS ====================== */}
      <section className="mx-auto max-w-[1180px] px-5 pb-24 md:px-8" aria-labelledby="threads-title">
        <div className="flex flex-wrap items-center justify-between gap-6 border-b border-maroon-800/15 pb-6">
          <Reveal>
            <h2 id="threads-title" className="font-display text-[2.2rem] font-bold text-maroon-800 md:text-[2.6rem]">
              Recent Threads
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter articles by category">
              {CATS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCat(c.id)}
                  aria-pressed={cat === c.id}
                  className={`rounded-full px-5 py-2 text-[0.85rem] font-medium transition-all duration-300 ${
                    cat === c.id
                      ? "bg-cream-200 text-maroon-800 shadow-inner"
                      : "text-ink-500 hover:bg-cream-200/60 hover:text-maroon-800"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </Reveal>
        </div>

        <div key={cat} className="mt-12 grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((a, i) => (
            <Reveal key={a.id} delay={(i % 3) * 100}>
              <article className="group flex h-full cursor-pointer flex-col" onClick={() => setReading(a)}>
                <div className="nd-img-zoom relative h-60 w-full overflow-hidden rounded-sm">
                  <Image
                    src={a.img}
                    alt={a.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="mt-5 flex items-center gap-3 text-[0.72rem]">
                  <span className="font-semibold uppercase tracking-[0.18em] text-maroon-700">{a.cat}</span>
                  <span className="h-1 w-1 rounded-full bg-ink-400" aria-hidden="true" />
                  <span className="font-light text-ink-500">{a.date}</span>
                </div>
                <h3 className="mt-2.5 line-clamp-2 font-display text-[1.45rem] font-bold leading-snug text-maroon-800 transition-colors group-hover:text-maroon-600">
                  {a.title}
                </h3>
                <p className="mt-3 text-[0.9rem] font-light leading-relaxed text-ink-500">{a.excerpt}</p>
              </article>
            </Reveal>
          ))}
        </div>

        {count < filtered.length && (
          <div className="mt-14 text-center">
            <button
              type="button"
              className="nd-btn nd-btn--ghost-maroon"
              onClick={() => setCount((c) => c + 3)}
            >
              Load More Articles
            </button>
          </div>
        )}
      </section>

      {/* ====================== READING MODAL ====================== */}
      {reading && (
        <div className="nd-article-modal" role="dialog" aria-modal="true" aria-label={reading.title} onClick={() => setReading(null)}>
          <article className="nd-article-sheet" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="nd-article-close" aria-label="Close article" onClick={() => setReading(null)}>
              <X size={20} />
            </button>
            <div className="relative h-64 w-full md:h-80">
              <Image
                src={reading.img}
                alt={reading.alt}
                fill
                sizes="(max-width: 768px) 100vw, 720px"
                className="object-cover"
              />
            </div>
            <div className="px-7 py-8 md:px-12 md:py-10">
              <div className="flex flex-wrap items-center gap-3 text-[0.72rem]">
                <span className="rounded-full bg-maroon-800 px-3.5 py-1 font-bold uppercase tracking-[0.18em] text-cream-50">{reading.cat}</span>
                <span className="font-light text-ink-500">{reading.date}</span>
              </div>
              <h2 className="mt-4 font-display text-[1.9rem] font-bold leading-tight text-maroon-800 md:text-[2.4rem]">
                {reading.title}
              </h2>
              <div className="mt-6 space-y-5 text-[0.97rem] font-light leading-relaxed text-ink-700">
                {reading.body.map((p, i) => (
                  <p key={i} className={i === 0 ? "first-letter:float-left first-letter:mr-2 first-letter:font-display first-letter:text-[3rem] first-letter:font-bold first-letter:leading-[0.9] first-letter:text-maroon-800" : ""}>
                    {p}
                  </p>
                ))}
              </div>
              <p className="mt-8 border-t border-maroon-800/10 pt-5 font-display text-sm italic text-ink-500">
                — From the Natyaarambam journal, written by the academy&apos;s senior faculty.
              </p>
            </div>
          </article>
        </div>
      )}
    </div>
  );
}
