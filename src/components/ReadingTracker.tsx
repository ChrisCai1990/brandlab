"use client";

import { useEffect } from "react";

export function ReadingTracker({ slug }: { slug: string }) {
  useEffect(() => {
    const read: string[] = JSON.parse(localStorage.getItem("readArticles") || "[]");
    if (!read.includes(slug)) {
      localStorage.setItem("readArticles", JSON.stringify([...read, slug]));
    }
  }, [slug]);

  return null;
}
