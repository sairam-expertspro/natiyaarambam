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

export const scrollToId = (id: string) =>
  document
    .getElementById(id)
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
