"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Feather,
  Heart,
  Mail,
  MapPin,
  Menu,
  Phone,
  Sparkles,
  X,
} from "lucide-react";
import Image from "next/image";

/* ============================ Site context ============================ */
type Site = {
  goGallery: () => void;
  showToast: (msg: string) => void;
  goHome: (sectionId: string) => void;
};
const SiteCtx = createContext<Site | null>(null);
export function useSite() {
  const ctx = useContext(SiteCtx);
  if (!ctx) throw new Error("useSite must be used inside Layout");
  return ctx;
}

export const scrollToId = (id: string) =>
  document
    .getElementById(id)
    ?.scrollIntoView({ behavior: "smooth", block: "start" });

/* ============================ Scroll reveal ============================ */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={`nd-reveal ${visible ? "is-visible" : ""} ${className}`}
      style={{ "--nd-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}

/* ============================ Social glyphs ============================ */
const socialStroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};
export const SOCIALS = [
  {
    label: "Facebook",
    link: "https://www.facebook.com/groups/228705529315840/",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" {...socialStroke}>
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    link: "https://www.instagram.com/natyaarambam_dance_academy?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" {...socialStroke}>
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    link: "https://www.youtube.com/@natyaarambam3083",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" {...socialStroke}>
        <path d="M22.5 12s0-3.4-.4-5a2.6 2.6 0 0 0-1.8-1.8C18.6 4.7 12 4.7 12 4.7s-6.6 0-8.3.5A2.6 2.6 0 0 0 1.9 7c-.4 1.6-.4 5-.4 5s0 3.4.4 5a2.6 2.6 0 0 0 1.8 1.8c1.7.5 8.3.5 8.3.5s6.6 0 8.3-.5a2.6 2.6 0 0 0 1.8-1.8c.4-1.6.4-5 .4-5z" />
        <path d="M10 15.2 15.2 12 10 8.8z" fill="currentColor" />
      </svg>
    ),
  },
  // {
  //   label: "WhatsApp",
  //   icon: (
  //     <svg width="16" height="16" viewBox="0 0 24 24" {...socialStroke}>
  //       <path d="M21 11.5a8.5 8.5 0 0 1-12.4 7.5L3 21l2-5.4A8.5 8.5 0 1 1 21 11.5z" />
  //       <path d="M9 9.5c.3 2.4 2.9 5 5.4 5.4l1.1-1.1 2 .9c-.3 1.3-1.5 1.9-2.8 1.6-3.3-.7-6.3-3.7-7-7-.3-1.3.3-2.5 1.6-2.8l.9 2z" />
  //     </svg>
  //   ),
  // },
];

/* ============================ Layout ============================ */
export function Layout({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);
  const pathname = usePathname() ?? "/";
  const router = useRouter();

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2800);
  }, []);

  const goGallery = useCallback(() => router.push("/gallery"), [router]);

  const goHome = useCallback(
    (id: string) => {
      /* Enrollment & contact live on the dedicated Contact page —
         always land the visitor on the Enroll form itself */
      if (id === "contact") {
        if (pathname === "/contact") {
          scrollToId("enroll");
        } else {
          router.push("/contact");
          window.setTimeout(() => scrollToId("enroll"), 180);
        }
        return;
      }
      if (pathname !== "/") {
        router.push("/");
        window.setTimeout(() => scrollToId(id), 140);
      } else {
        scrollToId(id);
      }
    },
    [pathname, router],
  );

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 14);
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setProgress(max > 0 ? (h.scrollTop / max) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  const navLink = (href: string, exact = false) => {
    const isActive = exact ? pathname === href : pathname.startsWith(href);
    return `nd-nav-link ${isActive ? "is-active" : ""}`;
  };

  return (
    <SiteCtx.Provider value={{ goGallery, showToast, goHome }}>
      <a href="#main" className="nd-skip-link">
        Skip to content
      </a>
      <div
        className="nd-progress"
        style={{ width: `${progress}%` }}
        aria-hidden="true"
      />

      {/* ============================ HEADER ============================ */}
      <header className={`nd-header ${scrolled ? "is-scrolled" : ""}`}>
        <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-4 px-5 py-3.5 md:px-8">
          <Link href="/" aria-label="Natyaarambam Dance Academy home">
            {/* <Logo /> */}
            <Image
              src="/images/Logo.svg"
              alt="Natyaarambam Dance Academy"
              width={180}
              height={40}
              className="inline-block h-10 w-auto md:h-[52px]"
            />
          </Link>

          <nav
            className="hidden items-center gap-7 lg:flex"
            aria-label="Primary"
          >
            <Link href="/" className={navLink("/", true)}>
              Home
            </Link>
            <Link href="/about" className={navLink("/about")}>
              About
            </Link>
            <Link href="/training" className={navLink("/training")}>
              Training
            </Link>
            <Link href="/gallery" className={navLink("/gallery")}>
              Gallery
            </Link>
            <button
              type="button"
              className="nd-nav-link"
              onClick={() =>
                showToast(
                  "Our journal launches soon — follow us on social media",
                )
              }
            >
              Blog
            </button>
            <Link href="/contact" className={navLink("/contact")}>
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="nd-btn nd-btn--maroon nd-btn--compact nd-hide-below-lg"
              onClick={() => goHome("contact")}
            >
              Enroll Now
            </button>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded text-maroon-800 lg:hidden"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((o) => !o)}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        <div
          className={`nd-mobile-menu ${menuOpen ? "is-open" : ""} lg:hidden`}
        >
          <nav
            className="mx-auto max-w-[1180px] space-y-1 px-5 pb-5"
            aria-label="Mobile"
          >
            <Link
              href="/"
              className="block rounded px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-cream-200 hover:text-maroon-800"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="block rounded px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-cream-200 hover:text-maroon-800"
            >
              About
            </Link>
            <Link
              href="/training"
              className="block rounded px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-cream-200 hover:text-maroon-800"
            >
              Training
            </Link>
            <Link
              href="/gallery"
              className="block rounded px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-cream-200 hover:text-maroon-800"
            >
              Gallery
            </Link>
            <button
              type="button"
              className="block w-full rounded px-3 py-2.5 text-left text-sm font-medium text-ink-700 hover:bg-cream-200 hover:text-maroon-800"
              onClick={() =>
                showToast(
                  "Our journal launches soon — follow us on social media",
                )
              }
            >
              Blog
            </button>
            <Link
              href="/contact"
              className="block rounded px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-cream-200 hover:text-maroon-800"
            >
              Contact
            </Link>
            <button
              type="button"
              className="nd-btn nd-btn--maroon mt-3 w-full"
              onClick={() => {
                setMenuOpen(false);
                goHome("contact");
              }}
            >
              Enroll Now
            </button>
          </nav>
        </div>
      </header>

      <main id="main">{children}</main>

      <footer id="contact" className="nd-footer scroll-mt-24">
        <div className="mx-auto max-w-[1180px] px-5 pb-8 pt-16 md:px-8">
          <div className="grid grid-cols-1 gap-10 text-center sm:grid-cols-2 lg:grid-cols-4 lg:text-left">
            <div className="flex flex-col items-center lg:items-start">
              <Link href="/" aria-label="Back to home">
                <Image
                  src="/images/Logo.svg"
                  alt="Natyaarambam Dance Academy"
                  width={180}
                  height={40}
                  className="h-10 w-auto md:h-[52px]"
                />
              </Link>

              <p className="mt-5 max-w-sm text-sm font-light leading-relaxed text-ink-500">
                Preserving and promoting the richness of Indian classical dance
                in its purest form. A premier institution for Kalakshetra-style
                Bharatanatyam.
              </p>
            </div>

            <nav
              aria-label="Explore"
              className="flex flex-col items-center lg:items-start"
            >
              <h3 className="text-[0.78rem] font-semibold uppercase tracking-[0.2em] text-ink-900">
                Explore
              </h3>

              <ul className="mt-5 space-y-3">
                <li>
                  <Link href="/" className="nd-footer-link">
                    Home
                  </Link>
                </li>

                <li>
                  <Link href="/about" className="nd-footer-link">
                    About
                  </Link>
                </li>

                <li>
                  <Link href="/training" className="nd-footer-link">
                    Training
                  </Link>
                </li>

                <li>
                  <Link href="/gallery" className="nd-footer-link">
                    Gallery
                  </Link>
                </li>

                <li>
                  <button
                    type="button"
                    className="nd-footer-link"
                    onClick={() =>
                      showToast(
                        "Our journal launches soon — follow us on social media",
                      )
                    }
                  >
                    Blog
                  </button>
                </li>

                <li>
                  <Link href="/contact" className="nd-footer-link">
                    Contact
                  </Link>
                </li>
              </ul>
            </nav>

            <div className="flex flex-col items-center lg:items-start">
              <h3 className="text-[0.78rem] font-semibold uppercase tracking-[0.2em] text-ink-900">
                Contact
              </h3>

              <ul className="mt-5 max-w-[280px] space-y-4 text-sm font-light text-ink-500">
                <li className="flex items-start justify-center gap-3 text-left lg:justify-start">
                  <MapPin
                    size={17}
                    className="mt-0.5 shrink-0 text-maroon-700"
                    aria-hidden="true"
                  />

                  <span>
                    Collinsbrook Farm Community, Frisco 14901, Thunder Rd,
                    Frisco, 75035
                  </span>
                </li>

                <li className="flex items-center justify-center gap-3 lg:justify-start">
                  <Phone
                    size={17}
                    className="shrink-0 text-maroon-700"
                    aria-hidden="true"
                  />

                  <a href="tel:+19456990311" className="nd-footer-link">
                    +1 (945) 699-0311
                  </a>
                </li>

                <li className="flex items-center justify-center gap-3 lg:justify-start">
                  <Mail
                    size={17}
                    className="shrink-0 text-maroon-700"
                    aria-hidden="true"
                  />

                  <a
                    href="mailto:natyaarambham@gmail.com"
                    className="nd-footer-link break-all"
                  >
                    natyaarambham@gmail.com
                  </a>
                </li>
              </ul>
            </div>

            <div className="flex flex-col items-center lg:items-start">
              <h3 className="text-[0.78rem] font-semibold uppercase tracking-[0.2em] text-ink-900">
                Social
              </h3>

              <div className="mt-5 flex flex-wrap justify-center gap-3 lg:justify-start">
                {SOCIALS.map((s) => (
                  <Link
                    key={s.label}
                    href={s.link}
                    className="nd-social-btn"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                  >
                    {s.icon}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-maroon-800/10 pt-6 text-center sm:flex-row sm:text-left">
            <p className="text-xs font-light text-ink-400">
              © 2026 Natyaarambam Dance Academy of Bharatanatyam. All rights
              reserved.
            </p>

            <div
              className="flex items-center justify-center gap-4 text-gold-600"
              aria-hidden="true"
            >
              <Heart size={15} strokeWidth={1.6} />
              <Sparkles size={15} strokeWidth={1.6} />
              <Feather size={15} strokeWidth={1.6} />
            </div>
          </div>
        </div>
      </footer>

      <div
        className={`nd-toast ${toast ? "is-visible" : ""}`}
        role="status"
        aria-live="polite"
      >
        {toast && (
          <>
            <Sparkles
              size={16}
              className="flex-none text-gold-400"
              aria-hidden="true"
            />
            <span>{toast}</span>
          </>
        )}
      </div>
    </SiteCtx.Provider>
  );
}
