"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Toast } from "@/components/ui/Toast";
import { SiteCtx, scrollToId, scrollToIdWhenReady } from "@/lib/site-context";

export function SiteLayout({ children }: { children: ReactNode }) {
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
          scrollToIdWhenReady("enroll");
        }
        return;
      }
      if (pathname !== "/") {
        router.push("/");
        scrollToIdWhenReady(id);
      } else {
        scrollToId(id);
      }
    },
    [pathname, router],
  );

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setProgress(max > 0 ? (h.scrollTop / max) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <SiteCtx.Provider value={{ goGallery, showToast, goHome }}>
      <a href="#main" className="nd-skip-link">
        Skip to content
      </a>
      <div className="nd-progress" style={{ width: `${progress}%` }} aria-hidden="true" />

      <Header />

      <main id="main">{children}</main>

      <Footer />

      <Toast message={toast} />
    </SiteCtx.Provider>
  );
}
