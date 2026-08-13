"use client";

import Image from "next/image";
import Link from "next/link";
import { Feather, Heart, Mail, MapPin, Phone, Sparkles } from "lucide-react";
import { SOCIALS } from "@/lib/socials";

const EXPLORE_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/training", label: "Training" },
  { href: "/gallery", label: "Gallery" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  return (
    <footer id="contact" className="nd-footer scroll-mt-24">
      <div className="mx-auto max-w-[1180px] px-5 pb-8 pt-16 md:px-8">
        <div className="grid grid-cols-1 gap-10 md:gap-5 text-left sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <div className="flex flex-col items-start">
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
            <div className="block lg:hidden">
            <div className="mt-5 flex flex-wrap justify-start gap-3">
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

          <nav aria-label="Explore" className="flex flex-col items-start">
            <h3 className="text-[0.78rem] font-semibold uppercase tracking-[0.2em] text-ink-900">
              Explore
            </h3>

            <ul className="mt-5 space-y-3">
              {EXPLORE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="nd-footer-link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col items-start">
            <h3 className="text-[0.78rem] font-semibold uppercase tracking-[0.2em] text-ink-900">
              Contact
            </h3>

            <ul className="mt-5 max-w-[280px] space-y-4 text-sm font-light text-ink-500">
              <li className="flex items-start justify-start gap-3 text-left">
                <MapPin size={17} className="mt-0.5 shrink-0 text-maroon-700" aria-hidden="true" />
                <span>
                  Collinsbrook Farm Community, Frisco 14901, Thunder Rd,
                  Frisco, 75035
                </span>
              </li>

              <li className="flex items-center justify-start gap-3">
                <Phone size={17} className="shrink-0 text-maroon-700" aria-hidden="true" />
                <a href="tel:+19456990311" className="nd-footer-link">
                  +1 (945) 699-0311
                </a>
              </li>

              <li className="flex items-center justify-start gap-3">
                <Mail size={17} className="shrink-0 text-maroon-700" aria-hidden="true" />
                <a href="mailto:natyaarambham@gmail.com" className="nd-footer-link break-all">
                  natyaarambham@gmail.com
                </a>
              </li>
            </ul>
          </div>
          <div className="hidden lg:block">
          <div className="flex flex-col items-start">
            <h3 className="text-[0.78rem] font-semibold uppercase tracking-[0.2em] text-ink-900">
              Social
            </h3>

            <div className="mt-5 flex flex-wrap justify-start gap-3">
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
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-maroon-800/10 pt-6 text-left sm:flex-row sm:items-center">
          <p className="text-xs font-light text-ink-400">
            © 2026 Natyaarambam Dance Academy of Bharatanatyam. All rights
            reserved.
          </p>

          <div className="flex items-center justify-start gap-4 text-gold-600" aria-hidden="true">
            <Heart size={15} strokeWidth={1.6} />
            <Sparkles size={15} strokeWidth={1.6} />
            <Feather size={15} strokeWidth={1.6} />
          </div>
        </div>
      </div>
    </footer>
  );
}
