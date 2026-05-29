"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [titles, setTitles] = useState<Record<string, string>>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const b: string[] = JSON.parse(localStorage.getItem("bookmarks") || "[]");
    const t: Record<string, string> = JSON.parse(localStorage.getItem("bookmarkTitles") || "{}");
    setBookmarks(b);
    setTitles(t);
  }, []);

  function removeBookmark(slug: string) {
    const next = bookmarks.filter((s) => s !== slug);
    localStorage.setItem("bookmarks", JSON.stringify(next));
    const nextTitles = { ...titles };
    delete nextTitles[slug];
    localStorage.setItem("bookmarkTitles", JSON.stringify(nextTitles));
    setBookmarks(next);
    setTitles(nextTitles);
  }

  if (!mounted) return null;

  return (
    <div className="bg-white min-h-screen">
      <div className="border-b border-[#95d5b2] bg-[#f0faf4]">
        <div className="max-w-3xl mx-auto px-6 py-3 flex items-center gap-2 text-xs text-[#6b7280]">
          <Link href="/" className="hover:text-[#40916c]">首页</Link>
          <span>/</span>
          <span className="text-[#1b4332] font-medium">我的收藏</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-8">
          <p className="text-xs text-[#52b788] font-medium tracking-widest uppercase mb-2">收藏夹</p>
          <h1 className="text-3xl font-bold text-[#1b4332] mb-1">我的收藏</h1>
          {bookmarks.length > 0 && (
            <p className="text-sm text-[#6b7280]">共收藏了 {bookmarks.length} 篇文章</p>
          )}
        </div>

        {bookmarks.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-4">☆</div>
            <p className="text-sm text-[#6b7280] mb-2">还没有收藏的文章</p>
            <p className="text-xs text-[#95d5b2] mb-6">去内容库看看，找到感兴趣的文章收藏起来吧</p>
            <Link
              href="/library"
              className="text-sm bg-[#2d6a4f] text-white px-6 py-2.5 rounded-lg hover:bg-[#40916c] transition-colors font-medium"
            >
              去内容库看看 →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {bookmarks.map((slug) => (
              <div
                key={slug}
                className="group flex items-center justify-between gap-4 border border-[#95d5b2] rounded-xl px-5 py-4 hover:border-[#52b788] transition-all"
              >
                <Link
                  href={`/library/${slug}`}
                  className="flex-1 min-w-0"
                >
                  <p className="text-sm font-medium text-[#1b4332] group-hover:text-[#2d6a4f] transition-colors leading-snug line-clamp-1">
                    {titles[slug] || slug}
                  </p>
                  <p className="text-xs text-[#95d5b2] mt-0.5">/library/{slug}</p>
                </Link>
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/library/${slug}`}
                    className="text-xs text-[#52b788] hover:text-[#40916c] transition-colors"
                  >
                    阅读 →
                  </Link>
                  <button
                    onClick={() => removeBookmark(slug)}
                    className="text-xs text-[#6b7280] hover:text-red-400 transition-colors px-2 py-1"
                    title="取消收藏"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
