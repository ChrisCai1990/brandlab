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

  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [titles, setTitles] = useState<Record<string, string>>({});
  const [mounted, setMounted] = useState(false);

  const [wechatArticles, setWechatArticles] = useState<WechatArticle[]>([]);
  const [wechatLoading, setWechatLoading] = useState(false);
  const [copyId, setCopyId] = useState<string | null>(null);

  const [input, setInput] = useState("");
  const [outputHtml, setOutputHtml] = useState("");
  const [converting, setConverting] = useState(false);
  const [convertError, setConvertError] = useState("");
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<"preview" | "code">("preview");

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

  async function handleConvert() {
    if (!input.trim()) return;
    setConverting(true);
    setConvertError("");
    setOutputHtml("");
    try {
      const res = await fetch("/api/tools/wechat-format", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: input }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "转换失败");
      setOutputHtml(data.html);
    } catch (e: unknown) {
      setConvertError(e instanceof Error ? e.message : "转换失败，请重试");
    } finally {
      setConverting(false);
    }
  }

  async function copyOutput() {
    try {
      await navigator.clipboard.writeText(outputHtml);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }

  async function copySaved(article: WechatArticle) {
    try {
      await navigator.clipboard.writeText(article.wechatHtml);
      setCopyId(article.id);
      setTimeout(() => setCopyId(null), 2000);
    } catch {
      // ignore
    }
  }

  if (!mounted) return null;

  return (
    <div className="bg-black min-h-screen">
      <div className="border-b border-[#1f1f1f] bg-[#0a0a0a]">
        <div className="max-w-3xl mx-auto px-6 py-3 flex items-center gap-2 text-xs text-[#555555]">
          <Link href="/" className="hover:text-white transition-colors">首页</Link>
          <span>/</span>
          <span className="text-white">我的</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* tabs */}
        <div className="flex gap-1 mb-8 border-b border-[#1f1f1f]">
          {([
            { id: "bookmarks", label: "我的收藏" },
            { id: "wechat",    label: "公众号文章" },
          ] as const).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
                activeTab === tab.id
                  ? "border-white text-white"
                  : "border-transparent text-[#888888] hover:text-white"
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
              <p className="text-xs text-[#555555] font-medium tracking-widest uppercase mb-2">收藏夹</p>
              <h1 className="text-3xl font-bold text-white mb-1">我的收藏</h1>
              {bookmarks.length > 0 && (
                <p className="text-sm text-[#888888]">共收藏了 {bookmarks.length} 篇文章</p>
              )}
            </div>

            {bookmarks.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-4xl mb-4 text-[#333333]">☆</div>
                <p className="text-sm text-[#888888] mb-2">还没有收藏的文章</p>
                <p className="text-xs text-[#555555] mb-6">去内容库看看，找到感兴趣的文章收藏起来吧</p>
                <Link
                  href="/library"
                  className="text-sm border border-white text-white px-6 py-2.5 hover:bg-white hover:text-black transition-colors font-medium"
                >
                  去内容库看看 →
                </Link>
              </div>
            ) : (
              <div className="space-y-px border border-[#1f1f1f]">
                {bookmarks.map((slug) => (
                  <div
                    key={slug}
                    className="group flex items-center justify-between gap-4 bg-[#0a0a0a] px-5 py-4 hover:bg-[#111111] transition-all"
                  >
                    <Link href={`/library/${slug}`} className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white group-hover:text-[#e0e0e0] transition-colors leading-snug line-clamp-1">
                        {titles[slug] || slug}
                      </p>
                      <p className="text-xs text-[#333333] mt-0.5">/library/{slug}</p>
                    </Link>
                    <div className="flex items-center gap-2 shrink-0">
                      <Link href={`/library/${slug}`} className="text-xs text-[#888888] hover:text-white transition-colors">
                        阅读 →
                      </Link>
                      <button
                        onClick={() => removeBookmark(slug)}
                        className="text-xs text-[#555555] hover:text-red-400 transition-colors px-2 py-1"
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
          <div className="space-y-8">
            <div>
              <p className="text-xs text-[#555555] font-medium tracking-widest uppercase mb-2">格式转换</p>
              <h2 className="text-xl font-bold text-white mb-1">粘贴内容，一键转换</h2>
              <p className="text-sm text-[#888888] mb-5">支持 Markdown 或纯文字，AI 自动套用 BrandLab 模板</p>

              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`粘贴你的文章内容…`}
                rows={10}
                className="w-full text-sm text-white border border-[#1f1f1f] px-4 py-3 outline-none resize-y placeholder-[#333333] leading-relaxed focus:border-[#333333] font-mono bg-[#0a0a0a] transition-colors"
              />

              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-[#333333]">{input.length} 字</span>
                <button
                  onClick={handleConvert}
                  disabled={converting || !input.trim()}
                  className="text-sm border border-white text-white px-6 py-2.5 hover:bg-white hover:text-black transition-colors font-medium disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {converting ? (
                    <>
                      <span className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      转换中...
                    </>
                  ) : "转换成公众号格式"}
                </button>
              </div>

              {convertError && (
                <p className="mt-3 text-xs text-red-400 border border-red-900 px-4 py-2.5">{convertError}</p>
              )}
            </div>

            {outputHtml && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-white">转换结果</p>
                    <div className="flex gap-1">
                      {(["preview", "code"] as const).map((m) => (
                        <button
                          key={m}
                          onClick={() => setViewMode(m)}
                          className={`text-[11px] px-2.5 py-1 border transition-colors ${
                            viewMode === m
                              ? "bg-white text-black border-white"
                              : "text-[#888888] border-[#1f1f1f] hover:border-[#333333] hover:text-white"
                          }`}
                        >
                          {m === "preview" ? "预览" : "HTML"}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={copyOutput}
                    className={`text-sm px-5 py-2 font-medium transition-all border ${
                      copied
                        ? "border-white text-white"
                        : "border-[#1f1f1f] text-[#888888] hover:border-white hover:text-white"
                    }`}
                  >
                    {copied ? "✓ 已复制" : "复制"}
                  </button>
                </div>

                {viewMode === "preview" ? (
                  <div
                    className="border border-[#1f1f1f] p-4 bg-white overflow-auto"
                    dangerouslySetInnerHTML={{ __html: outputHtml }}
                  />
                ) : (
                  <textarea
                    readOnly
                    value={outputHtml}
                    rows={16}
                    className="w-full text-xs text-[#a0a0a0] font-mono border border-[#1f1f1f] px-4 py-3 outline-none resize-y bg-[#0a0a0a]"
                  />
                )}
              </div>
            )}

            {!wechatLoading && wechatArticles.length > 0 && (
              <div>
                <p className="text-xs text-[#555555] font-medium tracking-widest uppercase mb-3">已保存文章</p>
                <div className="space-y-px border border-[#1f1f1f]">
                  {wechatArticles.map((article) => (
                    <div
                      key={article.id}
                      className="flex items-center justify-between gap-4 bg-[#0a0a0a] px-5 py-4 hover:bg-[#111111] transition-all"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white leading-snug line-clamp-1">{article.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-[#888888] bg-[#111111] px-2 py-0.5">{article.tag}</span>
                          <span className="text-xs text-[#333333]">{new Date(article.date).toLocaleDateString("zh-CN")}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => copySaved(article)}
                        className={`shrink-0 text-xs px-4 py-2 font-medium transition-all border ${
                          copyId === article.id
                            ? "border-white text-white"
                            : "border-[#1f1f1f] text-[#888888] hover:border-white hover:text-white"
                        }`}
                      >
                        {copyId === article.id ? "✓ 已复制" : "复制"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
