"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

type Article = { slug: string; tag: string; title: string };

export function LibraryFilter({
  active,
  articles,
  categories,
  searchQuery,
}: {
  active: string;
  articles: Article[];
  categories: string[];
  searchQuery: string;
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
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="搜索文章标题或描述…"
          className="flex-1 border border-[#95d5b2] rounded-lg px-4 py-2.5 text-sm text-[#1b4332] placeholder-[#6b7280]/50 focus:outline-none focus:border-[#40916c] bg-white"
        />
        <button type="submit" className="bg-[#2d6a4f] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#40916c] transition-colors">
          搜索
        </button>
        {q && (
          <button type="button" onClick={() => { setQ(""); push({ q: null }); }}
            className="text-xs text-[#6b7280] border border-[#95d5b2] px-3 py-2 rounded-lg hover:border-[#52b788] transition-colors">
            清除
          </button>
        )}
      </form>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {["全部", ...categories].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`text-xs font-medium px-4 py-2 rounded-full border transition-colors ${
              active === cat
                ? "bg-[#2d6a4f] text-white border-[#2d6a4f]"
                : "bg-white text-[#6b7280] border-[#95d5b2] hover:border-[#52b788] hover:text-[#40916c]"
            }`}
          >
            {cat}
            {cat !== "全部" && (
              <span className="ml-1.5 opacity-60">
                {articles.filter((a) => a.tag === cat).length}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
