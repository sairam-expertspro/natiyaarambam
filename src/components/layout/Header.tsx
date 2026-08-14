"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useSite } from "@/lib/site-context";

const NAV_LINKS = [
  { href: "/", label: "Home", exact: true },
  { href: "/about", label: "About" },
  { href: "/training", label: "Training" },
  { href: "/gallery", label: "Gallery" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname() ?? "/";
  const { goHome, showToast } = useSite();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 14);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  const navLinkClass = (href: string, exact = false) => {
    const isActive = exact ? pathname === href : pathname.startsWith(href);
    return `nd-nav-link ${isActive ? "is-active" : ""}`;
  };

  return (
    <header className={`nd-header ${scrolled ? "is-scrolled" : ""}`}>
      <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-4 px-5 py-3.5 md:px-8">
        <Link href="/" aria-label="Natyaarambam Dance Academy home">
          <Image
            src="/images/Logo.svg"
            alt="Natyaarambam Dance Academy"
            width={180}
            height={40}
            className="inline-block w-auto h-[55px]"
          />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {NAV_LINKS.map((link) =>
            link.href === "/blog" ? (
              <button
                key={link.href}
                type="button"
                className={navLinkClass(link.href, link.exact)}
                onClick={() => showToast("Our journal launches soon — follow us on social media")}
              >
                {link.label}
              </button>
            ) : (
              <Link key={link.href} href={link.href} className={navLinkClass(link.href, link.exact)}>
                {link.label}
              </Link>
            ),
          )}
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

      <div className={`nd-mobile-menu ${menuOpen ? "is-open" : ""} lg:hidden`}>
        <nav className="mx-auto max-w-[1180px] space-y-1 px-5 pb-5" aria-label="Mobile">
          {NAV_LINKS.map((link) =>
            link.href === "/blog" ? (
              <button
                key={link.href}
                type="button"
                className="block w-full rounded px-3 py-2.5 text-left text-sm font-medium text-ink-700 hover:bg-cream-200 hover:text-maroon-800"
                onClick={() => {
                  setMenuOpen(false);
                  showToast("Our journal launches soon — follow us on social media");
                }}
              >
                {link.label}
              </button>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-cream-200 hover:text-maroon-800"
              >
                {link.label}
              </Link>
            ),
          )}
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
  );
}
