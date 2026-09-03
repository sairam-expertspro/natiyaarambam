"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  Image as ImageIcon,
  LayoutGrid,
  Play,
  Shuffle,
  X,
} from "lucide-react";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Counter from "yet-another-react-lightbox/plugins/counter";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/counter.css";
import "yet-another-react-lightbox/plugins/captions.css";
import { Reveal } from "@/components/ui/Reveal";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { PhotoTile } from "@/components/gallery/PhotoTile";
import { FilmTile } from "@/components/gallery/FilmTile";
import type { Photo, Film } from "@/components/gallery/types";
import { useSite, scrollToId } from "@/lib/site-context";
import { IMG } from "@/lib/content";

/* Photography credits (Pexels, free license):
   Stage solo — Syam Vijai (18240707) · Festival — atelierbyvineeth (34717649)
   Rehearsal — MART Production (7318657) · Guru blessing — Akshi Yogashala (31185784)
   Ghungroo — Krishna Photography (30481585) · Group — Sharath G. (28489406)
   Stage troupe — Mohd.Ashabul Haque Nannu (16039776) · Portrait — Kosygin Leishangthem (18086346)
   Jewelry — Punam Oishy (35059564) · Parampara — Bonaventure Fernandez (14742292) */

/* ——— Photographs only: the printed anthology ——— */
const GALLERY_IMAGE_COUNT = 65;
const PHOTO_TAGS = ["Performance", "Training", "Celebration", "Students", "Recital"];

/* Photographs from public/images/Images. */
const PHOTOS: Photo[] = Array.from({ length: GALLERY_IMAGE_COUNT }, (_, index) => {
  const imageNumber = index + 1;
  return {
    src: `/images/Images/${imageNumber}.webp`,
    tag: PHOTO_TAGS[index % PHOTO_TAGS.length],
    name: `Gallery Moment ${imageNumber}`,
    span:
      index % 17 === 1
        ? "md:col-span-2"
        : index % 23 === 4
          ? "md:row-span-2"
          : undefined,
  };
});

/* Films from public/images/Videos — no poster stills yet, so tiles fall
   back to the video's own first frame (see FilmTile). */
const VIDEO_COUNT = 4;
const FILMS: Film[] = Array.from({ length: VIDEO_COUNT }, (_, index) => {
  const videoNumber = index + 1;
  return {
    src: `/images/Videos/Video ${videoNumber}.mp4`,
    name: `Video ${videoNumber}`,
  };
});

const MOSAIC: { big: Photo; jewelry: Photo; guru: Photo; floor: Photo } = {
  big: PHOTOS[60],
  jewelry: PHOTOS[61],
  guru: PHOTOS[62],
  floor: PHOTOS[63],
};

/* The anthology grid: photographs and films interleaved (shown under "All") */
type GridItem =
  | { kind: "photo"; photo: Photo; span?: string }
  | { kind: "film"; film: Film };

type Filter = "all" | "image" | "video";

const INITIAL_VISIBLE_COUNT = 12;
const LOAD_BATCH_COUNT = 12;

const shuffleItems = <T,>(items: T[], seed: number) => {
  const shuffled = [...items];
  let value = seed || 1;

  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    value = (value * 1664525 + 1013904223) % 4294967296;
    const j = value % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
};

/* Every film gets woven into the anthology (not just the first two) so
   "Moments of Mastery" and "Featured Videos" both show the full set. */
const PHOTOS_PER_FILM = 3;

const buildGrid = (photos: Photo[]): GridItem[] => {
  const grid: GridItem[] = [];
  let filmCursor = 0;

  for (let i = 0; i < photos.length; i += PHOTOS_PER_FILM) {
    for (const photo of photos.slice(i, i + PHOTOS_PER_FILM)) {
      grid.push({ kind: "photo", photo, span: photo.span });
    }
    if (filmCursor < FILMS.length) {
      grid.push({ kind: "film", film: FILMS[filmCursor] });
      filmCursor += 1;
    }
  }

  while (filmCursor < FILMS.length) {
    grid.push({ kind: "film", film: FILMS[filmCursor] });
    filmCursor += 1;
  }

  return grid;
};

export default function Gallery() {
  const { goHome, showToast } = useSite();
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [filmIndex, setFilmIndex] = useState<number | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
  const [shuffleSeed, setShuffleSeed] = useState(0);

  const lightboxSlides = useMemo(
    () => PHOTOS.map((photo) => ({ src: photo.src, alt: photo.name, title: photo.name })),
    []
  );

  const orderedPhotos = useMemo(
    () => (shuffleSeed ? shuffleItems(PHOTOS, shuffleSeed) : PHOTOS),
    [shuffleSeed]
  );

  const filtered = useMemo(() => {
    const base: GridItem[] = buildGrid(orderedPhotos);
    return base.filter((item) =>
      filter === "all" ? true : filter === "image" ? item.kind === "photo" : item.kind === "film"
    );
  }, [filter, orderedPhotos]);

  const shown = filtered.slice(0, visibleCount);
  const hiddenCount = filtered.length - shown.length;

  useEffect(() => setVisibleCount(INITIAL_VISIBLE_COUNT), [filter, shuffleSeed]);

  const film = filmIndex !== null ? FILMS[filmIndex] : null;

  const showNextFilm = () => setFilmIndex((i) => (i === null ? i : (i + 1) % FILMS.length));
  const showPrevFilm = () => setFilmIndex((i) => (i === null ? i : (i - 1 + FILMS.length) % FILMS.length));

  /* Keyboard + scroll-lock support for the film modal (the photo lightbox handles its own) */
  useEffect(() => {
    if (filmIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFilmIndex(null);
      else if (e.key === "ArrowRight") showNextFilm();
      else if (e.key === "ArrowLeft") showPrevFilm();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [filmIndex]);

  const openPhoto = (photo: Photo) => {
    const idx = PHOTOS.indexOf(photo);
    if (idx >= 0) setLightbox(idx);
  };

  const openFilm = (f: Film) => {
    const idx = FILMS.indexOf(f);
    if (idx >= 0) setFilmIndex(idx);
  };

  const shuffleGallery = () => {
    setShuffleSeed((seed) => seed + 1);
    showToast("Gallery shuffled for a fresh view");
  };

  return (
    <div id="gallery-page">
      <PageHero
        id="gallery-title"
        variant="gallery"
        image={{
          src: IMG.hall,
          alt: "The Natyaarambam studio bathed in warm light, Nataraja watching over the wooden floor",
        }}
        eyebrow="Gallery"
        titleClassName="mt-5 font-display text-[2.6rem] font-bold leading-[1.1] text-cream-50 md:text-[3.5rem]"
        title={
          <>
            Explore Our
            <span className="block text-gold-400">Memorable Moments</span>
          </>
        }
        description="Explore memorable moments from performances, workshops, and
              cultural celebrations. Discover the passion, creativity, and
              tradition that bring our academy to life."
        primary={{ label: "Enroll Now", onClick: () => goHome("contact") }}
        secondary={{
          label: "Watch Our Gallery",
          onClick: () => scrollToId("moments"),
          icon: <Play size={15} aria-hidden="true" />,
        }}
      />

      {/* ====================== MOMENTS OF MASTERY — photographs ====================== */}
      <section id="moments" className="scroll-mt-24 bg-cream-100 py-20 md:py-28" aria-labelledby="moments-title">
        <div className="mx-auto max-w-[1180px] px-5 md:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <Reveal>
                <p className="nd-eyebrow">The Anthology</p>
              </Reveal>
              <Reveal delay={80}>
                <h2 id="moments-title" className="mt-3 font-display text-[2rem] font-bold text-maroon-800 md:text-[2.5rem]">
                  Moments of Mastery
                </h2>
              </Reveal>
              <Reveal delay={150}>
                <p className="mt-4 max-w-md text-sm font-light leading-relaxed text-ink-500">
                  A curated collection of performances, student growth, and the
                  vibrant life within Natyaarambam Dance Academy.
                </p>
              </Reveal>
            </div>
            <Reveal delay={200}>
              <div className="flex flex-wrap items-center gap-3" role="group" aria-label="Filter anthology by media type">
                {(
                  [
                    { id: "all", label: "All", icon: LayoutGrid },
                    { id: "image", label: "Images", icon: ImageIcon },
                    { id: "video", label: "Videos", icon: Clapperboard },
                  ] as const
                ).map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    className={`nd-filter-chip inline-flex items-center gap-2 ${filter === f.id ? "nd-filter-chip--active" : ""}`}
                    aria-pressed={filter === f.id}
                    onClick={() => setFilter(f.id)}
                  >
                    <f.icon size={14} aria-hidden="true" />
                    {f.label}
                  </button>
                ))}
                <button
                  type="button"
                  className="nd-filter-chip nd-filter-chip--shuffle inline-flex items-center gap-2"
                  onClick={shuffleGallery}
                >
                  <Shuffle size={14} aria-hidden="true" />
                  Shuffle
                </button>
                <span className="ml-1 text-xs font-light text-ink-400" aria-live="polite">
                  {filtered.length} moment{filtered.length === 1 ? "" : "s"}
                </span>
              </div>
            </Reveal>
          </div>

          {/* Anthology masonry — filtered by All / Images / Videos */}
          <div key={`${filter}-${shuffleSeed}`} className="nd-gallery-grid mt-12">
            {shown.map((item, i) => (
              <Reveal
                key={`${item.kind}-${item.kind === "photo" ? item.photo.src : item.film.src}`}
                delay={(i % 3) * 80}
                className={
                  item.kind === "photo"
                    ? item.span
                    : filter === "video"
                      ? "md:col-span-2"
                      : undefined
                }
              >
                {item.kind === "photo" ? (
                  <PhotoTile photo={item.photo} onOpen={openPhoto} priority={i < 3} />
                ) : (
                  <FilmTile film={item.film} onPlay={openFilm} />
                )}
              </Reveal>
            ))}

            {filtered.length === 0 && (
              <p className="col-span-full py-12 text-center text-sm font-light italic text-ink-400">
                Nothing in this collection yet — be the first to upload a moment.
              </p>
            )}
          </div>

          {/* View more / less */}
          {(hiddenCount > 0 || visibleCount > INITIAL_VISIBLE_COUNT) && (
            <div className="mt-10 text-center">
              <button
                type="button"
                className="nd-btn nd-btn--ghost-maroon"
                onClick={() => {
                  if (hiddenCount > 0) {
                    setVisibleCount((count) => count + LOAD_BATCH_COUNT);
                  } else {
                    setVisibleCount(INITIAL_VISIBLE_COUNT);
                  }
                }}
                aria-expanded={hiddenCount === 0}
              >
                {hiddenCount > 0 ? `Load ${Math.min(hiddenCount, LOAD_BATCH_COUNT)} More Moments` : "View Less"}
                <ChevronDown
                  size={16}
                  aria-hidden="true"
                  className={`transition-transform duration-300 ${hiddenCount === 0 ? "rotate-180" : ""}`}
                />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ====================== FEATURED VIDEOS — films only ====================== */}
      <section id="films" className="scroll-mt-24 bg-cream-50 py-20 md:py-28" aria-labelledby="videos-title">
        <div className="mx-auto max-w-[1180px] px-5 md:px-8">
          <Reveal>
            <div className="flex items-center gap-6">
              <h2 id="videos-title" className="shrink-0 font-display text-[1.8rem] font-bold text-ink-900 md:text-[2.1rem]">
                Featured Videos
              </h2>
              <span className="h-px flex-1 bg-maroon-800/15" aria-hidden="true" />
            </div>
          </Reveal>
          <Reveal delay={80}>
            <p className="mt-3 max-w-md text-sm font-light leading-relaxed text-ink-500">
              Short films from our stage and studio — press play to watch the
              academy in motion.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {FILMS.map((v, i) => (
              <Reveal key={v.name} delay={i * 120} className="aspect-video">
                <FilmTile film={v} onPlay={openFilm} />
              </Reveal>
            ))}
          </div>

          {/* Secondary photograph mosaic */}
          <div className="mt-14 grid auto-rows-[180px] grid-cols-2 gap-6 md:auto-rows-[200px] md:grid-cols-4">
            <Reveal className="col-span-2 row-span-2"><PhotoTile photo={MOSAIC.big} onOpen={openPhoto} sizes="(max-width: 640px) 100vw, 50vw" /></Reveal>
            <Reveal delay={90}><PhotoTile photo={MOSAIC.jewelry} onOpen={openPhoto} /></Reveal>
            <Reveal delay={160}><PhotoTile photo={MOSAIC.guru} onOpen={openPhoto} /></Reveal>
            <Reveal delay={220} className="col-span-2"><PhotoTile photo={MOSAIC.floor} onOpen={openPhoto} /></Reveal>
          </div>
        </div>
      </section>

      <CtaBand id="gallery-cta-title" onWatch={() => scrollToId("films")} />

      {/* ====================== PHOTO LIGHTBOX ====================== */}
      <Lightbox
        open={lightbox !== null}
        close={() => setLightbox(null)}
        index={lightbox ?? 0}
        slides={lightboxSlides}
        plugins={[Zoom, Counter, Captions]}
        on={{ view: ({ index }) => setLightbox(index) }}
        zoom={{ maxZoomPixelRatio: 3, scrollToZoom: true }}
        counter={{ container: { style: { top: "unset", left: "unset", bottom: 0, right: 0 } } }}
        styles={{ container: { backgroundColor: "rgba(23, 5, 5, 0.94)" } }}
      />

      {/* ====================== FILM MODAL ====================== */}
      {film && (
        <div className="nd-video-modal" role="dialog" aria-modal="true" aria-label={`Playing film: ${film.name}`} onClick={() => setFilmIndex(null)}>
          <button type="button" className="nd-lightbox-btn nd-lightbox-close" aria-label="Close film" onClick={() => setFilmIndex(null)}>
            <X size={20} />
          </button>
          {FILMS.length > 1 && (
            <>
              <button
                type="button"
                className="nd-lightbox-btn nd-lightbox-nav nd-lightbox-nav--prev"
                aria-label="Previous film"
                onClick={(e) => {
                  e.stopPropagation();
                  showPrevFilm();
                }}
              >
                <ChevronLeft size={22} />
              </button>
              <button
                type="button"
                className="nd-lightbox-btn nd-lightbox-nav nd-lightbox-nav--next"
                aria-label="Next film"
                onClick={(e) => {
                  e.stopPropagation();
                  showNextFilm();
                }}
              >
                <ChevronRight size={22} />
              </button>
            </>
          )}
          <div onClick={(e) => e.stopPropagation()} className="text-center">
            <video key={film.src} src={film.src} poster={film.poster} controls autoPlay playsInline preload="none" />
            <p className="mt-4 font-display text-sm italic text-gold-300">
              {film.name}
              {FILMS.length > 1 && (
                <span className="ml-2 text-gold-300/60">
                  ({(filmIndex ?? 0) + 1} / {FILMS.length})
                </span>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
