import type { MetadataRoute } from "next";

const routes = ["", "about", "training", "gallery", "blog", "contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  const buildDate = new Date();
  return routes.map((route) => ({
    url: `https://natyaarambam.com/${route}`,
    lastModified: buildDate,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
