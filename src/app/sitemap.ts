import { MetadataRoute } from "next";
import { connectDB } from "@/lib/db";
import { Article } from "@/lib/models";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://brandlab.ink";
  const staticPages = [
    { url: base, lastModified: new Date(), changeFrequency: "daily" as const, priority: 1 },
    { url: `${base}/library`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${base}/tools`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${base}/tools/topics`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${base}/tools/brief`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${base}/tools/visual`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${base}/tools/audience`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${base}/tools/monetize`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${base}/tools/calendar`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.7 },
  ];

  let articlePages: MetadataRoute.Sitemap = [];
  try {
    await connectDB();
    const articles = await Article.find({ published: true }).select("slug date").lean();
    articlePages = articles.map((a) => ({
      url: `${base}/library/${a.slug}`,
      lastModified: new Date(a.date),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  } catch {
    // DB unavailable — return static pages only
  }

  return [...staticPages, ...articlePages];
}
