"use client";

import { useState, useEffect } from "react";

export function ReadingStats({ total }: { total: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const read = JSON.parse(localStorage.getItem("readArticles") || "[]");
    setCount(read.length);
  }, []);

  if (count === 0) return null;

  const pct = Math.round((count / total) * 100);

  return (
    <div className="flex items-center gap-2 text-xs text-[#555555]">
      <div className="flex-1 h-px bg-[#1f1f1f] overflow-hidden max-w-[80px] relative">
        <div
          className="h-full bg-white absolute left-0 top-0 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span>已读 {count}/{total} 篇</span>
    </div>
  );
}
