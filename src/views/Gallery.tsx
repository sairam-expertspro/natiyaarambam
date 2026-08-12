"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  Image as ImageIcon,
  LayoutGrid,
  Lock,
  Play,
  Shuffle,
  Upload,
  X,
} from "lucide-react";
import { Reveal, scrollToId, useSite } from "../components/chrome";
import { IMG } from "../data";
import Image from "next/image";

/* Photography credits (Pexels, free license):
   Stage solo — Syam Vijai (18240707) · Festival — atelierbyvineeth (34717649)
   Rehearsal — MART Production (7318657) · Guru blessing — Akshi Yogashala (31185784)
   Ghungroo — Krishna Photography (30481585) · Group — Sharath G. (28489406)
   Stage troupe — Mohd.Ashabul Haque Nannu (16039776) · Portrait — Kosygin Leishangthem (18086346)
   Jewelry — Punam Oishy (35059564) · Parampara — Bonaventure Fernandez (14742292)
   Videos — Anastasia Shuraeva (8751567) · Thirdman (8491501) */

type Photo = { src: string; tag: string; name: string; span?: string; mono?: boolean };
type Film = { src: string; poster: string; name: string };

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

/* ——— Films only: screened separately below ——— */
const FILMS: Film[] = [
  {
    src: "https://videos.pexels.com/video-files/8751567/8751567-uhd_4096_2160_24fps.mp4",
    poster: "https://images.pexels.com/videos/8751567/pexels-photo-8751567.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200",
    name: "The Soul of Abhinaya",
  },
  {
    src: "https://videos.pexels.com/video-files/8491501/8491501-uhd_3840_2160_25fps.mp4",
    poster: "https://images.pexels.com/videos/8491501/pexels-photo-8491501.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200",
    name: "Daily Sadhana: Training Session",
  },
];

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

/* Owner-only uploads. Change this passcode as needed.
   Owners press Ctrl/Cmd + Shift + O to unlock. */
const OWNER_PASSCODE = "HEMA2018";

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

const buildGrid = (photos: Photo[]): GridItem[] => [
  ...photos.slice(0, 3).map((photo) => ({ kind: "photo" as const, photo, span: photo.span })),
  { kind: "film", film: FILMS[0] },
  ...photos.slice(3, 6).map((photo) => ({ kind: "photo" as const, photo, span: photo.span })),
  { kind: "film", film: FILMS[1] },
  ...photos.slice(6).map((photo) => ({ kind: "photo" as const, photo, span: photo.span })),
];

function GalleryImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => setLoaded(false), [src]);

  return (
    <>
      <span className={`nd-image-skeleton ${loaded ? "nd-image-skeleton--hidden" : ""}`} aria-hidden="true" />
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={`${className ?? ""} ${loaded ? "nd-image-loaded" : "nd-image-loading"}`.trim()}
        onLoad={() => setLoaded(true)}
      />
    </>
  );
}

function PhotoTile({ photo, onOpen }: { photo: Photo; onOpen: (photo: Photo) => void }) {
  return (
    <button
      type="button"
      className="nd-tile"
      aria-label={`View photo: ${photo.name}`}
      onClick={() => onOpen(photo)}
    >
      <GalleryImage src={photo.src} alt={photo.name} className={photo.mono ? "nd-grayscale" : ""} />
      <span className="nd-tile-caption">
        <span className="nd-tile-tag">{photo.tag}</span>
        <span className="nd-tile-name">{photo.name}</span>
      </span>
    </button>
  );
}

function FilmTile({ film, onPlay }: { film: Film; onPlay: (film: Film) => void }) {
  return (
    <button
      type="button"
      className="nd-tile"
      aria-label={`Play film: ${film.name}`}
      onClick={() => onPlay(film)}
    >
      <GalleryImage src={film.poster} alt={film.name} />
      <span className="nd-play-btn" aria-hidden="true">
        <Play size={20} fill="currentColor" />
      </span>
      <span className="nd-tile-caption">
        <span className="nd-tile-tag">Film</span>
        <span className="nd-tile-name">{film.name}</span>
      </span>
    </button>
  );
}

export default function Gallery() {
  const { goHome, showToast } = useSite();
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [film, setFilm] = useState<Film | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [uploads, setUploads] = useState<Photo[]>([]);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
  const [shuffleSeed, setShuffleSeed] = useState(0);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  /* Owner mode — uploads are hidden from everyone else */
  const [isOwner, setIsOwner] = useState(false);
  const [ownerModal, setOwnerModal] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [passError, setPassError] = useState(false);

  useEffect(() => {
    setIsOwner(sessionStorage.getItem("nda-owner") === "1");
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "o") {
        e.preventDefault();
        setOwnerModal(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const unlock = () => {
    if (passcode.trim().toUpperCase() === OWNER_PASSCODE) {
      sessionStorage.setItem("nda-owner", "1");
      setIsOwner(true);
      setOwnerModal(false);
      setPasscode("");
      setPassError(false);
      showToast("Owner mode enabled — uploads unlocked");
    } else {
      setPassError(true);
      window.setTimeout(() => setPassError(false), 700);
    }
  };

  const lock = () => {
    sessionStorage.removeItem("nda-owner");
    setIsOwner(false);
    showToast("Owner mode disabled — uploads hidden");
  };

  /* Every photograph (including visitor uploads), viewable in the lightbox */
  const ALL_PHOTOS = useMemo(
    () => [...PHOTOS, ...uploads],
    [uploads]
  );

  const orderedPhotos = useMemo(
    () => (shuffleSeed ? shuffleItems(PHOTOS, shuffleSeed) : PHOTOS),
    [shuffleSeed]
  );

  const filtered = useMemo(() => {
    const base: GridItem[] = [
      ...buildGrid(orderedPhotos),
      ...uploads.map((u) => ({ kind: "photo" as const, photo: u })),
    ];
    return base.filter((item) =>
      filter === "all" ? true : filter === "image" ? item.kind === "photo" : item.kind === "film"
    );
  }, [filter, orderedPhotos, uploads]);

  const shown = filtered.slice(0, visibleCount);
  const hiddenCount = filtered.length - shown.length;

  useEffect(() => setVisibleCount(INITIAL_VISIBLE_COUNT), [filter, shuffleSeed]);

  const handleFiles = (list: FileList | null) => {
    if (!list) return;
    const images = Array.from(list)
      .filter((f) => f.type.startsWith("image/"))
      .map<Photo>((f, i) => ({
        src: URL.createObjectURL(f),
        tag: "Community",
        name:
          f.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim() ||
          `Shared Moment ${uploads.length + i + 1}`,
      }));
    if (images.length === 0) {
      showToast("Only image files can join the anthology");
      return;
    }
    setUploads((prev) => [...prev, ...images]);
    setVisibleCount((count) => Math.max(count, INITIAL_VISIBLE_COUNT + images.length));
    showToast(
      `${images.length} photo${images.length > 1 ? "s" : ""} added to the anthology — thank you for sharing`
    );
  };

  /* Keyboard support for lightbox + film modal */
  useEffect(() => {
    if (lightbox === null && film === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLightbox(null);
        setFilm(null);
      }
      if (lightbox !== null) {
        if (e.key === "ArrowRight") setLightbox((i) => (i === null ? i : (i + 1) % ALL_PHOTOS.length));
        if (e.key === "ArrowLeft") setLightbox((i) => (i === null ? i : (i - 1 + ALL_PHOTOS.length) % ALL_PHOTOS.length));
      }
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, film]);

  const openPhoto = (photo: Photo) => {
    const idx = ALL_PHOTOS.indexOf(photo);
    if (idx >= 0) setLightbox(idx);
  };

  const shuffleGallery = () => {
    setShuffleSeed((seed) => seed + 1);
    showToast("Gallery shuffled for a fresh view");
  };

  return (
    <div id="gallery-page">
      {/* ====================== GALLERY HERO ====================== */}
      <section className="nd-gallery-hero" aria-labelledby="gallery-title">
        <img className="nd-gallery-media" src={IMG.hall} alt="The Natyaarambam studio bathed in warm light, Nataraja watching over the wooden floor" />
        <div className="nd-gallery-overlay" aria-hidden="true" />
        <div className="relative z-10 mx-auto flex min-h-[540px] max-w-[1180px] flex-col justify-center px-5 py-20 md:min-h-[640px] md:px-8">
          <Reveal>
            <p className="nd-eyebrow nd-eyebrow--light">Gallery</p>
          </Reveal>
          <Reveal delay={90}>
            <h1 id="gallery-title" className="mt-5 font-display text-[2.6rem] font-bold leading-[1.1] text-cream-50 md:text-[3.5rem]">
              Explore Our
              <span className="block text-gold-400">Memorable Moments</span>
            </h1>
          </Reveal>
          <Reveal delay={180}>
            <p className="mt-6 max-w-lg border-l-2 border-gold-500 pl-5 text-[0.97rem] font-light leading-relaxed text-cream-200/85">
              Explore memorable moments from performances, workshops, and
              cultural celebrations. Discover the passion, creativity, and
              tradition that bring our academy to life.
            </p>
          </Reveal>
          <Reveal delay={270}>
            <div className="mt-9 flex flex-wrap gap-4">
              <button type="button" className="nd-btn nd-btn--maroon" onClick={() => goHome("contact")}>Enroll Now</button>
              <button type="button" className="nd-btn nd-btn--gold-outline" onClick={() => scrollToId("moments")}>
                <Play size={15} aria-hidden="true" /> Watch Our Gallery
              </button>
            </div>
          </Reveal>
        </div>
      </section>

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
                {isOwner && (
                  <>
                    <span className="nd-owner-chip">
                      <Lock size={11} aria-hidden="true" /> Owner Mode
                      <button type="button" onClick={lock} aria-label="Exit owner mode">
                        <X size={12} />
                      </button>
                    </span>
                    <button
                      type="button"
                      className="nd-filter-chip nd-filter-chip--upload inline-flex items-center gap-2"
                      onClick={() => fileRef.current?.click()}
                    >
                      <Upload size={14} aria-hidden="true" /> Upload
                    </button>
                  </>
                )}
                <span className="ml-1 text-xs font-light text-ink-400" aria-live="polite">
                  {filtered.length} moment{filtered.length === 1 ? "" : "s"}
                </span>
              </div>
            </Reveal>
          </div>

          {/* Hidden file input for uploads */}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            aria-hidden="true"
            tabIndex={-1}
            onChange={(e) => {
              handleFiles(e.target.files);
              e.target.value = "";
            }}
          />

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
                  <PhotoTile photo={item.photo} onOpen={openPhoto} />
                ) : (
                  <FilmTile film={item.film} onPlay={setFilm} />
                )}
              </Reveal>
            ))}

            {/* Community upload drop-tile — owner only */}
            {isOwner && filter !== "video" && (
              <Reveal delay={(shown.length % 3) * 80}>
                <button
                  type="button"
                  className={`nd-upload-tile ${dragging ? "nd-upload-tile--active" : ""}`}
                  onClick={() => fileRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                  }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragging(false);
                    handleFiles(e.dataTransfer.files);
                  }}
                  aria-label="Upload your own photos to the anthology"
                >
                  <span className="nd-upload-icon" aria-hidden="true">
                    <Upload size={20} strokeWidth={1.6} />
                  </span>
                  <span className="nd-upload-title">Add Your Moment</span>
                  <span className="nd-upload-hint">Click or drop images here</span>
                </button>
              </Reveal>
            )}

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
              <Reveal key={v.name} delay={i * 120}>
                <button
                  type="button"
                  className="nd-tile aspect-video w-full"
                  aria-label={`Play film: ${v.name}`}
                  onClick={() => setFilm(v)}
                >
                  <GalleryImage src={v.poster} alt={v.name} />
                  <span className="nd-play-btn" aria-hidden="true">
                    <Play size={22} fill="currentColor" />
                  </span>
                  <span className="nd-cap-bar">{v.name}</span>
                </button>
              </Reveal>
            ))}
          </div>

          {/* Secondary photograph mosaic */}
          <div className="mt-14 grid auto-rows-[180px] grid-cols-2 gap-6 md:auto-rows-[200px] md:grid-cols-4">
            <Reveal className="col-span-2 row-span-2"><PhotoTile photo={MOSAIC.big} onOpen={openPhoto} /></Reveal>
            <Reveal delay={90}><PhotoTile photo={MOSAIC.jewelry} onOpen={openPhoto} /></Reveal>
            <Reveal delay={160}><PhotoTile photo={MOSAIC.guru} onOpen={openPhoto} /></Reveal>
            <Reveal delay={220} className="col-span-2"><PhotoTile photo={MOSAIC.floor} onOpen={openPhoto} /></Reveal>
          </div>
        </div>
      </section>

      {/* ====================== CTA BAND ====================== */}
      <section className="nd-cta" aria-labelledby="gallery-cta-title">
        {/* <span className="nd-cta-shape nd-cta-shape--diamond" style={{ left: "6%", top: "18%" }} aria-hidden="true" />
        <span className="nd-cta-shape nd-cta-shape--diamond" style={{ right: "10%", bottom: "14%", width: 90, height: 90 }} aria-hidden="true" />
        <span className="nd-cta-shape nd-cta-shape--circle" style={{ right: "-70px", top: "-70px", width: 240, height: 240 }} aria-hidden="true" />
        <span className="nd-cta-shape nd-cta-shape--circle" style={{ left: "14%", bottom: "-110px", width: 200, height: 200 }} aria-hidden="true" /> */}
        <span className="nd-cta-watermark" style={{ right: "4%", top: "50%", transform: "translateY(-50%)" }} aria-hidden="true">
                    <Image src="/images/Decorative Lotus watermark.svg" alt="" width={500} height={500} className="opacity-5 relative top-20 left-50" />
        </span>

        <div className="relative mx-auto max-w-[760px] px-5 py-20 text-center md:py-24">
          <Reveal>
            <h2 id="gallery-cta-title" className="font-display text-[2rem] font-bold text-cream-50 md:text-[2.6rem]">
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
              <button type="button" className="nd-btn nd-btn--gold-solid" onClick={() => goHome("contact")}>Enroll Now</button>
              <button type="button" className="nd-btn nd-btn--outline-cream" onClick={() => scrollToId("films")}>
                <Play size={15} aria-hidden="true" /> Watch Our Gallery
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ====================== PHOTO LIGHTBOX ====================== */}
      {lightbox !== null && ALL_PHOTOS[lightbox] && (
        <div className="nd-lightbox" role="dialog" aria-modal="true" aria-label="Gallery photo viewer" onClick={() => setLightbox(null)}>
          <button type="button" className="nd-lightbox-btn nd-lightbox-close" aria-label="Close viewer" onClick={() => setLightbox(null)}>
            <X size={20} />
          </button>
          <button
            type="button"
            className="nd-lightbox-btn nd-lightbox-nav nd-lightbox-nav--prev"
            aria-label="Previous photo"
            onClick={(e) => {
              e.stopPropagation();
              setLightbox((i) => (i === null ? i : (i - 1 + ALL_PHOTOS.length) % ALL_PHOTOS.length));
            }}
          >
            <ChevronLeft size={22} />
          </button>
          <figure className="nd-lightbox-figure" onClick={(e) => e.stopPropagation()}>
            <img src={ALL_PHOTOS[lightbox].src} alt={ALL_PHOTOS[lightbox].name} />
            <figcaption className="mt-4 font-display text-sm italic text-gold-300">
              {ALL_PHOTOS[lightbox].name}
            </figcaption>
            <p className="mt-1 text-xs tracking-[0.2em] text-cream-200/60">
              {lightbox + 1} / {ALL_PHOTOS.length}
            </p>
          </figure>
          <button
            type="button"
            className="nd-lightbox-btn nd-lightbox-nav nd-lightbox-nav--next"
            aria-label="Next photo"
            onClick={(e) => {
              e.stopPropagation();
              setLightbox((i) => (i === null ? i : (i + 1) % ALL_PHOTOS.length));
            }}
          >
            <ChevronRight size={22} />
          </button>
        </div>
      )}

      {/* ====================== OWNER ACCESS MODAL ====================== */}
      {ownerModal && (
        <div
          className="nd-owner-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Owner access"
          onClick={() => setOwnerModal(false)}
        >
          <form
            className={`nd-owner-card ${passError ? "nd-shake" : ""}`}
            onClick={(e) => e.stopPropagation()}
            onSubmit={(e) => {
              e.preventDefault();
              unlock();
            }}
          >
            <span className="nd-icon-square" aria-hidden="true">
              <Lock size={16} strokeWidth={1.7} />
            </span>
            <h3 className="mt-5 font-display text-[1.6rem] font-bold text-maroon-800">Owner Access</h3>
            <p className="mt-2 text-sm font-light leading-relaxed text-ink-500">
              Uploading to the anthology is reserved for the academy owner.
              Enter your passcode to manage the gallery.
            </p>
            <label htmlFor="owner-pass" className="nd-field mt-6">
              <span className="sr-only">Owner passcode</span>
            </label>
            <input
              id="owner-pass"
              type="password"
              autoFocus
              autoComplete="off"
              placeholder="Passcode"
              className="nd-owner-input"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
            />
            <p className="nd-owner-error" role="alert" aria-live="assertive">
              {passError ? "Incorrect passcode — the tradition stays protected." : ""}
            </p>
            <div className="mt-5 flex gap-3">
              <button type="button" className="nd-btn nd-btn--ghost-maroon flex-1" onClick={() => setOwnerModal(false)}>
                Cancel
              </button>
              <button type="submit" className="nd-btn nd-btn--maroon flex-1">
                <Lock size={14} aria-hidden="true" /> Unlock
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ====================== FILM MODAL ====================== */}
      {film && (
        <div className="nd-video-modal" role="dialog" aria-modal="true" aria-label={`Playing film: ${film.name}`} onClick={() => setFilm(null)}>
          <button type="button" className="nd-lightbox-btn right-5 top-5" aria-label="Close film" onClick={() => setFilm(null)}>
            <X size={20} />
          </button>
          <div onClick={(e) => e.stopPropagation()} className="text-center">
            <video src={film.src} poster={film.poster} controls autoPlay playsInline />
            <p className="mt-4 font-display text-sm italic text-gold-300">{film.name}</p>
          </div>
        </div>
      )}
    </div>
  );
}
