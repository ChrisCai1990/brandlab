"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export function BookmarkCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const b = JSON.parse(localStorage.getItem("bookmarks") || "[]");
    setCount(b.length);
  }, []);

  if (count === 0) return null;

  return (
    <Link href="/bookmarks" className="flex items-center gap-1 text-xs text-[#40916c] hover:text-[#2d6a4f]">
      ★ {count}篇收藏
    </Link>
  );
}
