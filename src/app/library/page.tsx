import { Suspense } from "react";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { articles as staticArticles, categories } from "@/lib/articles";
import { LibraryFilter } from "@/components/LibraryFilter";

export const dynamic = "force-dynamic";

type DbArticle = { slug: string; title: string; tag: string; desc: string; date: Date; readTime: string };

async function getDbArticles(): Promise<DbArticle[]> {
  try {
    return await prisma.article.findMany({
      where: { published: true },
      orderBy: { date: "desc" },
      select: { slug: true, title: true, tag: true, desc: true, date: true, readTime: true },
    });
  } catch {
    return [];
  }
}

export default async function LibraryPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const dbArticles = await getDbArticles();

  // Merge: DB articles take precedence over static ones with same slug
  const dbSlugs = new Set(dbArticles.map((a) => a.slug));
  const merged = [
    ...dbArticles.map((a) => ({
      slug: a.slug,
      title: a.title,
      tag: a.tag,
      desc: a.desc,
      date: new Date(a.date).toISOString().split("T")[0],
      readTime: a.readTime,
    })),
    ...staticArticles
      .filter((a) => !dbSlugs.has(a.slug))
      .map((a) => ({ slug: a.slug, title: a.title, tag: a.tag, desc: a.desc, date: a.date, readTime: a.readTime })),
  ];

  const filtered = category && category !== "全部"
    ? merged.filter((a) => a.tag === category)
    : merged;

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-[#E8F5EE] border-b border-[#C8DDD2] py-14 px-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs text-[#6BAF8A] font-medium tracking-widest uppercase mb-2">内容库</p>
          <h1 className="text-4xl font-bold text-[#1A2E22] mb-2">每天一条干货</h1>
          <p className="text-sm text-[#6B7A6E]">{merged.length} 篇精选文章 · 7大模块 · 持续更新</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-10">
        <Suspense fallback={<div className="h-10" />}>
          <LibraryFilter active={category ?? "全部"} articles={merged} categories={categories as unknown as string[]} />
        </Suspense>

        {/* Count */}
        <p className="text-xs text-[#6B7A6E] mb-5">
          共 {filtered.length} 篇
          {category && category !== "全部" && (
            <span className="ml-1 text-[#2D6A4F] font-medium">· {category}</span>
          )}
        </p>

        {/* Articles grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((article) => (
            <Link
              key={article.slug}
              href={`/library/${article.slug}`}
              className="group border border-[#C8DDD2] rounded-xl p-6 hover:border-[#6BAF8A] hover:shadow-sm transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#E8F5EE] text-[#2D6A4F]">
                  {article.tag}
                </span>
                <span className="text-[10px] text-[#6B7A6E]">{article.readTime} 分钟</span>
              </div>
              <h3 className="text-sm font-bold text-[#1A2E22] mb-2 group-hover:text-[#1B4332] transition-colors leading-snug">
                {article.title}
              </h3>
              <p className="text-xs text-[#6B7A6E] leading-relaxed line-clamp-2 mb-4">{article.desc}</p>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#C8DDD2]">{article.date}</span>
                <span className="text-xs text-[#6BAF8A] group-hover:text-[#2D6A4F] transition-colors">
                  阅读全文 →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
