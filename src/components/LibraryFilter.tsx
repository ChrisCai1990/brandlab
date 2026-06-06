"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

type Article = { slug: string; tag: string; title: string };

export function LibraryFilter({
  active,
  articles,
  categories,
  searchQuery,
  activeSort,
}: {
  active: string;
  articles: Article[];
  categories: string[];
  searchQuery: string;
  activeSort?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [q, setQ] = useState(searchQuery);

  useEffect(() => { setQ(searchQuery); }, [searchQuery]);

  function push(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([k, v]) => {
      if (v === null || v === "") params.delete(k);
      else params.set(k, v);
    });
    params.delete("page");
    router.push(`/library?${params.toString()}`);
  }

  function setCategory(cat: string) {
    push({ category: cat === "全部" ? null : cat });
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    push({ q: q.trim() || null });
  }

  return (
    <div className="mb-8 space-y-4">
      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-0">
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="搜索文章标题或描述…"
          className="flex-1 border border-[#1f1f1f] px-4 py-2.5 text-sm text-white placeholder-[#555555] focus:outline-none focus:border-[#333333] bg-[#111111] transition-colors"
        />
        <button type="submit" className="bg-white text-black px-5 py-2.5 text-sm font-medium hover:bg-[#e0e0e0] transition-colors shrink-0">
          搜索
        </button>
        {q && (
          <button type="button" onClick={() => { setQ(""); push({ q: null }); }}
            className="text-xs text-[#888888] border border-[#1f1f1f] px-3 py-2 ml-2 hover:border-[#333333] hover:text-white transition-colors">
            清除
          </button>
        )}
      </form>

      {/* Sort */}
      <div className="flex gap-2 items-center">
        <span className="text-[10px] text-[#555555]">排序：</span>
        {[{ value: "date", label: "最新" }, { value: "views", label: "最热" }].map((opt) => (
          <button
            key={opt.value}
            onClick={() => push({ sort: opt.value === "date" ? null : opt.value })}
            className={`text-xs px-3 py-1.5 border transition-colors ${
              activeSort === opt.value || (opt.value === "date" && !activeSort)
                ? "bg-white text-black border-white"
                : "bg-black text-[#888888] border-[#1f1f1f] hover:border-[#333333] hover:text-white"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {["全部", ...categories].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`text-xs font-medium px-4 py-2 border transition-colors ${
              active === cat
                ? "bg-white text-black border-white"
                : "bg-black text-[#888888] border-[#1f1f1f] hover:border-[#333333] hover:text-white"
            }`}
          >
            {cat}
            {cat !== "全部" && (
              <span className="ml-1.5 opacity-50">
                {articles.filter((a) => a.tag === cat).length}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
