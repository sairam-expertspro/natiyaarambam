import type { MetadataRoute } from "next";

const routes = ["", "about", "training", "gallery", "contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `https://natyaarambam.com/${route}`,
    lastModified: new Date("2026-08-07"),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
