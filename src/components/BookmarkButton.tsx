"use client";

import { useState, useEffect } from "react";

export function BookmarkButton({ slug, title }: { slug: string; title: string }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const bookmarks: string[] = JSON.parse(localStorage.getItem("bookmarks") || "[]");
    setSaved(bookmarks.includes(slug));
  }, [slug]);

  function toggle() {
    const bookmarks: string[] = JSON.parse(localStorage.getItem("bookmarks") || "[]");
    const next = saved
      ? bookmarks.filter((s) => s !== slug)
      : [...bookmarks, slug];
    localStorage.setItem("bookmarks", JSON.stringify(next));
    // Also store title for display
    const titles: Record<string, string> = JSON.parse(localStorage.getItem("bookmarkTitles") || "{}");
    if (!saved) titles[slug] = title;
    else delete titles[slug];
    localStorage.setItem("bookmarkTitles", JSON.stringify(titles));
    setSaved(!saved);
  }

  return (
    <button
      onClick={toggle}
      className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors ${
        saved
          ? "bg-[#f0faf4] border-[#52b788] text-[#40916c]"
          : "border-[#95d5b2] text-[#6b7280] hover:border-[#52b788] hover:text-[#40916c]"
      }`}
    >
      <span>{saved ? "★" : "☆"}</span>
      {saved ? "已收藏" : "收藏"}
    </button>
  );
}
