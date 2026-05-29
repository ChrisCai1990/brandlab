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
    <div className="flex items-center gap-2 text-xs text-[#6b7280]">
      <div className="flex-1 h-1 bg-[#f0faf4] rounded-full overflow-hidden max-w-[80px]">
        <div
          className="h-full bg-[#52b788] rounded-full transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span>已读 {count}/{total} 篇</span>
    </div>
  );
}
