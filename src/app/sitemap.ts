import { articles } from "@/lib/articles";
import type { MetadataRoute } from "next";

const BASE = "https://brandlab.cn";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { url: BASE, priority: 1 },
    { url: `${BASE}/library`, priority: 0.9 },
    { url: `${BASE}/about`, priority: 0.7 },
    { url: `${BASE}/tools`, priority: 0.8 },
    { url: `${BASE}/contact`, priority: 0.6 },
  ].map((p) => ({
    ...p,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
  }));

  const articlePages = articles.map((a) => ({
    url: `${BASE}/library/${a.slug}`,
    lastModified: new Date(a.date),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...articlePages];
}
