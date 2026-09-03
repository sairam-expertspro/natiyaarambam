"use client";

import { createContext, useContext } from "react";

type Site = {
  goGallery: () => void;
  showToast: (msg: string) => void;
  goHome: (sectionId: string) => void;
};

export const SiteCtx = createContext<Site | null>(null);

export function useSite() {
  const ctx = useContext(SiteCtx);
  if (!ctx) throw new Error("useSite must be used inside SiteLayout");
  return ctx;
}

export const scrollToId = (id: string) => {
  const el = document.getElementById(id);
  el?.scrollIntoView({ behavior: "smooth", block: "start" });
  return !!el;
};

// Cross-page navigations render the target section asynchronously, so poll
// for it instead of guessing a fixed delay (which flakes on slower compiles).
export const scrollToIdWhenReady = (id: string, timeoutMs = 4000) => {
  const start = Date.now();
  const attempt = () => {
    if (scrollToId(id)) return;
    if (Date.now() - start < timeoutMs) requestAnimationFrame(attempt);
  };
  requestAnimationFrame(attempt);
};
