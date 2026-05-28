"use client";

import { useRouter, useSearchParams } from "next/navigation";

type Article = { slug: string; tag: string };

export function LibraryFilter({
  active,
  articles,
  categories,
}: {
  active: string;
  articles: Article[];
  categories: string[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function setCategory(cat: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (cat === "全部") {
      params.delete("category");
    } else {
      params.set("category", cat);
    }
    router.push(`/library?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {["全部", ...categories].map((cat) => (
        <button
          key={cat}
          onClick={() => setCategory(cat)}
          className={`text-xs font-medium px-4 py-2 rounded-full border transition-colors ${
            active === cat
              ? "bg-[#1B4332] text-white border-[#1B4332]"
              : "bg-white text-[#6B7A6E] border-[#C8DDD2] hover:border-[#6BAF8A] hover:text-[#2D6A4F]"
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
  );
}
