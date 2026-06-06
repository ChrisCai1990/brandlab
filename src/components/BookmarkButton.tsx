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
    const titles: Record<string, string> = JSON.parse(localStorage.getItem("bookmarkTitles") || "{}");
    if (!saved) titles[slug] = title;
    else delete titles[slug];
    localStorage.setItem("bookmarkTitles", JSON.stringify(titles));
    setSaved(!saved);
  }

  return (
    <button
      onClick={toggle}
      className={`flex items-center gap-1.5 text-xs px-3 py-1.5 border transition-colors ${
        saved
          ? "border-white text-white"
          : "border-[#1f1f1f] text-[#888888] hover:border-[#333333] hover:text-white"
      }`}
    >
      <span>{saved ? "★" : "☆"}</span>
      {saved ? "已收藏" : "收藏"}
    </button>
  );
}
