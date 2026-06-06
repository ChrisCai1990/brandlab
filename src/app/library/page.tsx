import { Suspense } from "react";
import Link from "next/link";
import { connectDB } from "@/lib/db";
import { Article } from "@/lib/models";
import { categories } from "@/lib/articles";
import { LibraryFilter } from "@/components/LibraryFilter";
import { Highlight } from "@/components/Highlight";
import { ReadingStatsWrapper } from "@/components/ReadingStatsWrapper";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 12;

type ArticleRow = { id: string; slug: string; title: string; tag: string; desc: string; date: string; readTime: string; views: number };

async function getAllArticles(sort?: string): Promise<ArticleRow[]> {
  try {
    await connectDB();
    const sortOrder: Record<string, 1 | -1> = sort === "views" ? { views: -1 } : { date: -1 };
    const rows = await Article.find({ published: true })
      .sort(sortOrder)
      .select("slug title tag desc date readTime views")
      .lean();
    return rows.map((a) => ({
      id: String(a._id),
      slug: a.slug,
      title: a.title ?? "",
      tag: a.tag ?? "",
      desc: a.desc ?? "",
      date: new Date(a.date).toISOString().split("T")[0],
      readTime: a.readTime ?? "5",
      views: a.views ?? 0,
    }));
  } catch {
    return [];
  }
}

async function searchArticles(q: string, category?: string, sort?: string): Promise<ArticleRow[]> {
  try {
    await connectDB();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: Record<string, any> = { published: true };
    if (category && category !== "全部") query.tag = category;
    if (q.trim()) {
      const regex = new RegExp(q.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      query.$or = [{ title: regex }, { desc: regex }, { content: regex }];
    }
    const sortOrder: Record<string, 1 | -1> = sort === "views" ? { views: -1 } : { date: -1 };
    const rows = await Article.find(query)
      .sort(sortOrder)
      .select("slug title tag desc date readTime views")
      .lean();
    return rows.map((a) => ({
      id: String(a._id),
      slug: a.slug,
      title: a.title ?? "",
      tag: a.tag ?? "",
      desc: a.desc ?? "",
      date: new Date(a.date).toISOString().split("T")[0],
      readTime: a.readTime ?? "5",
      views: a.views ?? 0,
    }));
  } catch {
    return [];
  }
}

export default async function LibraryPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string; page?: string; sort?: string }>;
}) {
  const { category, q, page, sort } = await searchParams;
  const currentPage = Math.max(1, parseInt(page || "1", 10));

  const merged = await getAllArticles(sort);
  const filtered =
    q?.trim() || (category && category !== "全部")
      ? await searchArticles(q ?? "", category, sort)
      : merged;

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="bg-black min-h-screen">
      <div className="border-b border-[#1f1f1f] bg-[#0a0a0a] py-16 px-8">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs text-[#555555] font-medium tracking-widest uppercase mb-3">内容库</p>
          <h1 className="text-4xl font-bold text-white mb-3">每天一条干货</h1>
          <div className="flex items-center gap-4 flex-wrap">
            <p className="text-sm text-[#888888]">{merged.length} 篇精选文章 · 9大模块 · 持续更新</p>
            <ReadingStatsWrapper total={merged.length} />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-10">
        <Suspense fallback={<div className="h-20" />}>
          <LibraryFilter
            active={category ?? "全部"}
            articles={merged}
            categories={categories as unknown as string[]}
            searchQuery={q ?? ""}
            activeSort={sort}
          />
        </Suspense>

        <p className="text-xs text-[#555555] mb-5">
          共 {filtered.length} 篇
          {category && category !== "全部" && <span className="ml-1 text-[#a0a0a0] font-medium">· {category}</span>}
          {q?.trim() && <span className="ml-1 text-[#a0a0a0] font-medium">· 搜索"{q}"</span>}
        </p>

        {paginated.length === 0 ? (
          <div className="text-center py-20 text-[#555555]">
            <p className="text-sm mb-2">没有找到相关文章</p>
            <Link href="/library" className="text-xs text-[#888888] hover:text-white transition-colors">清除筛选 →</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px border border-[#1f1f1f]">
            {paginated.map((article) => (
              <Link key={article.slug} href={`/library/${article.slug}`}
                className="group bg-[#0a0a0a] p-6 hover:bg-[#111111] transition-all">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-medium px-2.5 py-1 bg-[#111111] text-[#888888]">{article.tag}</span>
                  <span className="text-[10px] text-[#555555]">{article.readTime} 分钟</span>
                </div>
                <h3 className="text-sm font-bold text-white mb-2 group-hover:text-[#e0e0e0] transition-colors leading-snug"><Highlight text={article.title} query={q ?? ""} /></h3>
                <p className="text-xs text-[#555555] leading-relaxed line-clamp-2 mb-4"><Highlight text={article.desc} query={q ?? ""} /></p>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#333333]">{article.date}</span>
                  <span className="text-xs text-[#555555] group-hover:text-white transition-colors">阅读全文 →</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            {currentPage > 1 && (
              <Link href={`/library?${new URLSearchParams({ ...(category ? { category } : {}), ...(q ? { q } : {}), page: String(currentPage - 1) })}`}
                className="text-xs border border-[#1f1f1f] text-[#888888] px-4 py-2 hover:border-[#333333] hover:text-white transition-colors">
                ← 上一页
              </Link>
            )}
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link key={p} href={`/library?${new URLSearchParams({ ...(category ? { category } : {}), ...(q ? { q } : {}), page: String(p) })}`}
                  className={`text-xs w-8 h-8 flex items-center justify-center border transition-colors ${p === currentPage ? "bg-white text-black border-white" : "border-[#1f1f1f] text-[#888888] hover:border-[#333333] hover:text-white"}`}>
                  {p}
                </Link>
              ))}
            </div>
            {currentPage < totalPages && (
              <Link href={`/library?${new URLSearchParams({ ...(category ? { category } : {}), ...(q ? { q } : {}), page: String(currentPage + 1) })}`}
                className="text-xs border border-[#1f1f1f] text-[#888888] px-4 py-2 hover:border-[#333333] hover:text-white transition-colors">
                下一页 →
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
