import { Suspense } from "react";
import Link from "next/link";
import { connectDB } from "@/lib/db";
import { Article } from "@/lib/models";
import { categories } from "@/lib/articles";
import { LibraryFilter } from "@/components/LibraryFilter";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 12;

type ArticleRow = { id: string; slug: string; title: string; tag: string; desc: string; date: string; readTime: string };

async function getAllArticles(): Promise<ArticleRow[]> {
  try {
    await connectDB();
    const rows = await Article.find({ published: true })
      .sort({ date: -1 })
      .select("slug title tag desc date readTime")
      .lean();
    return rows.map((a) => ({
      id: String(a._id),
      slug: a.slug,
      title: a.title ?? "",
      tag: a.tag ?? "",
      desc: a.desc ?? "",
      date: new Date(a.date).toISOString().split("T")[0],
      readTime: a.readTime ?? "5",
    }));
  } catch {
    return [];
  }
}

async function searchArticles(q: string, category?: string): Promise<ArticleRow[]> {
  try {
    await connectDB();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: Record<string, any> = { published: true };
    if (category && category !== "全部") query.tag = category;
    if (q.trim()) {
      const regex = new RegExp(q.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      query.$or = [{ title: regex }, { desc: regex }, { content: regex }];
    }
    const rows = await Article.find(query)
      .sort({ date: -1 })
      .select("slug title tag desc date readTime")
      .lean();
    return rows.map((a) => ({
      id: String(a._id),
      slug: a.slug,
      title: a.title ?? "",
      tag: a.tag ?? "",
      desc: a.desc ?? "",
      date: new Date(a.date).toISOString().split("T")[0],
      readTime: a.readTime ?? "5",
    }));
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

  // Always fetch all articles for category counts in the filter bar
  const merged = await getAllArticles();
  // If there's a search query or category filter, query DB directly; otherwise reuse merged
  const filtered =
    q?.trim() || (category && category !== "全部")
      ? await searchArticles(q ?? "", category)
      : merged;

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-[#f0faf4] border-b border-[#95d5b2] py-14 px-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs text-[#52b788] font-medium tracking-widest uppercase mb-2">内容库</p>
          <h1 className="text-4xl font-bold text-[#1b4332] mb-2">每天一条干货</h1>
          <p className="text-sm text-[#6b7280]">{merged.length} 篇精选文章 · 7大模块 · 持续更新</p>
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

        <p className="text-xs text-[#6b7280] mb-5">
          共 {filtered.length} 篇
          {category && category !== "全部" && <span className="ml-1 text-[#40916c] font-medium">· {category}</span>}
          {q?.trim() && <span className="ml-1 text-[#40916c] font-medium">· 搜索"{q}"</span>}
        </p>

        {paginated.length === 0 ? (
          <div className="text-center py-20 text-[#6b7280]">
            <p className="text-sm mb-2">没有找到相关文章</p>
            <Link href="/library" className="text-xs text-[#40916c] hover:text-[#2d6a4f]">清除筛选 →</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginated.map((article) => (
              <Link key={article.slug} href={`/library/${article.slug}`}
                className="group border border-[#95d5b2] rounded-xl p-6 hover:border-[#52b788] hover:shadow-sm transition-all">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#f0faf4] text-[#40916c]">{article.tag}</span>
                  <span className="text-[10px] text-[#6b7280]">{article.readTime} 分钟</span>
                </div>
                <h3 className="text-sm font-bold text-[#1b4332] mb-2 group-hover:text-[#2d6a4f] transition-colors leading-snug">{article.title}</h3>
                <p className="text-xs text-[#6b7280] leading-relaxed line-clamp-2 mb-4">{article.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#95d5b2]">{article.date}</span>
                  <span className="text-xs text-[#52b788] group-hover:text-[#40916c] transition-colors">阅读全文 →</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            {currentPage > 1 && (
              <Link href={`/library?${new URLSearchParams({ ...(category ? { category } : {}), ...(q ? { q } : {}), page: String(currentPage - 1) })}`}
                className="text-xs border border-[#95d5b2] text-[#6b7280] px-4 py-2 rounded-lg hover:border-[#52b788] transition-colors">
                ← 上一页
              </Link>
            )}
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link key={p} href={`/library?${new URLSearchParams({ ...(category ? { category } : {}), ...(q ? { q } : {}), page: String(p) })}`}
                  className={`text-xs w-8 h-8 flex items-center justify-center rounded-lg border transition-colors ${p === currentPage ? "bg-[#2d6a4f] text-white border-[#2d6a4f]" : "border-[#95d5b2] text-[#6b7280] hover:border-[#52b788]"}`}>
                  {p}
                </Link>
              ))}
            </div>
            {currentPage < totalPages && (
              <Link href={`/library?${new URLSearchParams({ ...(category ? { category } : {}), ...(q ? { q } : {}), page: String(currentPage + 1) })}`}
                className="text-xs border border-[#95d5b2] text-[#6b7280] px-4 py-2 rounded-lg hover:border-[#52b788] transition-colors">
                下一页 →
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
