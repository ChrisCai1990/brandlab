import { Suspense } from "react";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { categories } from "@/lib/articles";
import { LibraryFilter } from "@/components/LibraryFilter";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 12;

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
  searchParams: Promise<{ category?: string; q?: string; page?: string }>;
}) {
  const { category, q, page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page || "1", 10));

  const dbArticles = await getDbArticles();
  const merged = dbArticles.map((a) => ({
    slug: a.slug, title: a.title, tag: a.tag, desc: a.desc,
    date: new Date(a.date).toISOString().split("T")[0], readTime: a.readTime,
  }));

  let filtered = merged;
  if (category && category !== "全部") filtered = filtered.filter((a) => a.tag === category);
  if (q?.trim()) {
    const lower = q.toLowerCase();
    filtered = filtered.filter((a) => a.title.toLowerCase().includes(lower) || a.desc.toLowerCase().includes(lower));
  }

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-[#e6f4f3] border-b border-[#b2d8d5] py-14 px-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs text-[#5eada7] font-medium tracking-widest uppercase mb-2">内容库</p>
          <h1 className="text-4xl font-bold text-[#0d2e2c] mb-2">每天一条干货</h1>
          <p className="text-sm text-[#5a7e7c]">{merged.length} 篇精选文章 · 7大模块 · 持续更新</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-10">
        <Suspense fallback={<div className="h-20" />}>
          <LibraryFilter
            active={category ?? "全部"}
            articles={merged}
            categories={categories as unknown as string[]}
            searchQuery={q ?? ""}
          />
        </Suspense>

        <p className="text-xs text-[#5a7e7c] mb-5">
          共 {filtered.length} 篇
          {category && category !== "全部" && <span className="ml-1 text-[#0f766e] font-medium">· {category}</span>}
          {q?.trim() && <span className="ml-1 text-[#0f766e] font-medium">· 搜索"{q}"</span>}
        </p>

        {paginated.length === 0 ? (
          <div className="text-center py-20 text-[#5a7e7c]">
            <p className="text-sm mb-2">没有找到相关文章</p>
            <Link href="/library" className="text-xs text-[#0f766e] hover:text-[#134e4a]">清除筛选 →</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginated.map((article) => (
              <Link key={article.slug} href={`/library/${article.slug}`}
                className="group border border-[#b2d8d5] rounded-xl p-6 hover:border-[#5eada7] hover:shadow-sm transition-all">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#e6f4f3] text-[#0f766e]">{article.tag}</span>
                  <span className="text-[10px] text-[#5a7e7c]">{article.readTime} 分钟</span>
                </div>
                <h3 className="text-sm font-bold text-[#0d2e2c] mb-2 group-hover:text-[#134e4a] transition-colors leading-snug">{article.title}</h3>
                <p className="text-xs text-[#5a7e7c] leading-relaxed line-clamp-2 mb-4">{article.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#b2d8d5]">{article.date}</span>
                  <span className="text-xs text-[#5eada7] group-hover:text-[#0f766e] transition-colors">阅读全文 →</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            {currentPage > 1 && (
              <Link href={`/library?${new URLSearchParams({ ...(category ? { category } : {}), ...(q ? { q } : {}), page: String(currentPage - 1) })}`}
                className="text-xs border border-[#b2d8d5] text-[#5a7e7c] px-4 py-2 rounded-lg hover:border-[#5eada7] transition-colors">
                ← 上一页
              </Link>
            )}
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link key={p} href={`/library?${new URLSearchParams({ ...(category ? { category } : {}), ...(q ? { q } : {}), page: String(p) })}`}
                  className={`text-xs w-8 h-8 flex items-center justify-center rounded-lg border transition-colors ${p === currentPage ? "bg-[#134e4a] text-white border-[#134e4a]" : "border-[#b2d8d5] text-[#5a7e7c] hover:border-[#5eada7]"}`}>
                  {p}
                </Link>
              ))}
            </div>
            {currentPage < totalPages && (
              <Link href={`/library?${new URLSearchParams({ ...(category ? { category } : {}), ...(q ? { q } : {}), page: String(currentPage + 1) })}`}
                className="text-xs border border-[#b2d8d5] text-[#5a7e7c] px-4 py-2 rounded-lg hover:border-[#5eada7] transition-colors">
                下一页 →
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
