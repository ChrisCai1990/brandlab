"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

type WechatArticle = {
  id: string;
  title: string;
  tag: string;
  date: string;
  wechatHtml: string;
};

export default function BookmarksPage() {
  const [activeTab, setActiveTab] = useState<"bookmarks" | "wechat">("bookmarks");

  // ── bookmarks ──
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [titles, setTitles] = useState<Record<string, string>>({});
  const [mounted, setMounted] = useState(false);

  // ── wechat articles ──
  const [wechatArticles, setWechatArticles] = useState<WechatArticle[]>([]);
  const [wechatLoading, setWechatLoading] = useState(false);
  const [copyId, setCopyId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    const b: string[] = JSON.parse(localStorage.getItem("bookmarks") || "[]");
    const t: Record<string, string> = JSON.parse(localStorage.getItem("bookmarkTitles") || "{}");
    setBookmarks(b);
    setTitles(t);
  }, []);

  const fetchWechatArticles = useCallback(async () => {
    setWechatLoading(true);
    try {
      const res = await fetch("/api/admin/articles");
      if (!res.ok) return;
      const data: WechatArticle[] = await res.json();
      setWechatArticles(data.filter((a) => a.wechatHtml?.trim()));
    } finally {
      setWechatLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "wechat") fetchWechatArticles();
  }, [activeTab, fetchWechatArticles]);

  function removeBookmark(slug: string) {
    const next = bookmarks.filter((s) => s !== slug);
    localStorage.setItem("bookmarks", JSON.stringify(next));
    const nextTitles = { ...titles };
    delete nextTitles[slug];
    localStorage.setItem("bookmarkTitles", JSON.stringify(nextTitles));
    setBookmarks(next);
    setTitles(nextTitles);
  }

  async function copyWechat(article: WechatArticle) {
    try {
      await navigator.clipboard.writeText(article.wechatHtml);
      setCopyId(article.id);
      setTimeout(() => setCopyId(null), 2000);
    } catch {
      // fallback: select from textarea
    }
  }

  if (!mounted) return null;

  return (
    <div className="bg-white min-h-screen">
      <div className="border-b border-[#95d5b2] bg-[#f0faf4]">
        <div className="max-w-3xl mx-auto px-6 py-3 flex items-center gap-2 text-xs text-[#6b7280]">
          <Link href="/" className="hover:text-[#40916c]">首页</Link>
          <span>/</span>
          <span className="text-[#1b4332] font-medium">我的</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* tabs */}
        <div className="flex gap-1 mb-8 border-b border-[#e5e7eb]">
          {([
            { id: "bookmarks", label: "我的收藏" },
            { id: "wechat",    label: "公众号文章" },
          ] as const).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
                activeTab === tab.id
                  ? "border-[#2d6a4f] text-[#1b4332]"
                  : "border-transparent text-[#6b7280] hover:text-[#2d6a4f]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── 我的收藏 ── */}
        {activeTab === "bookmarks" && (
          <>
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
                    <Link href={`/library/${slug}`} className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#1b4332] group-hover:text-[#2d6a4f] transition-colors leading-snug line-clamp-1">
                        {titles[slug] || slug}
                      </p>
                      <p className="text-xs text-[#95d5b2] mt-0.5">/library/{slug}</p>
                    </Link>
                    <div className="flex items-center gap-2 shrink-0">
                      <Link href={`/library/${slug}`} className="text-xs text-[#52b788] hover:text-[#40916c] transition-colors">
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
          </>
        )}

        {/* ── 公众号文章 ── */}
        {activeTab === "wechat" && (
          <>
            <div className="mb-8">
              <p className="text-xs text-[#52b788] font-medium tracking-widest uppercase mb-2">公众号</p>
              <h1 className="text-3xl font-bold text-[#1b4332] mb-1">公众号文章</h1>
              <p className="text-sm text-[#6b7280]">点击「复制」直接粘贴到公众号编辑器，样式完整保留</p>
            </div>

            {wechatLoading ? (
              <div className="text-center py-20 text-sm text-[#95d5b2]">加载中...</div>
            ) : wechatArticles.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-4xl mb-4">📝</div>
                <p className="text-sm text-[#6b7280] mb-2">还没有公众号文章</p>
                <p className="text-xs text-[#95d5b2]">在后台编辑文章时，填入「公众号 HTML」即可在这里显示</p>
              </div>
            ) : (
              <div className="space-y-3">
                {wechatArticles.map((article) => (
                  <div
                    key={article.id}
                    className="flex items-center justify-between gap-4 border border-[#95d5b2] rounded-xl px-5 py-4 hover:border-[#52b788] transition-all"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#1b4332] leading-snug line-clamp-1">{article.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-[#52b788] bg-[#f0faf4] px-2 py-0.5 rounded-full">{article.tag}</span>
                        <span className="text-xs text-[#95d5b2]">{new Date(article.date).toLocaleDateString("zh-CN")}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => copyWechat(article)}
                      className={`shrink-0 text-xs px-4 py-2 rounded-lg font-medium transition-all ${
                        copyId === article.id
                          ? "bg-[#f0faf4] text-[#2d6a4f] border border-[#52b788]"
                          : "bg-[#1b4332] text-white hover:bg-[#2d6a4f]"
                      }`}
                    >
                      {copyId === article.id ? "✓ 已复制" : "复制"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
