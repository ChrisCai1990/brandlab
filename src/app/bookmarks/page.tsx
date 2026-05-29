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

  // ── wechat: saved articles ──
  const [wechatArticles, setWechatArticles] = useState<WechatArticle[]>([]);
  const [wechatLoading, setWechatLoading] = useState(false);
  const [copyId, setCopyId] = useState<string | null>(null);

  // ── wechat: converter ──
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
          <div className="space-y-8">

            {/* 转换工具 */}
            <div>
              <p className="text-xs text-[#52b788] font-medium tracking-widest uppercase mb-2">格式转换</p>
              <h2 className="text-xl font-bold text-[#1b4332] mb-1">粘贴内容，一键转换</h2>
              <p className="text-sm text-[#6b7280] mb-5">支持 Markdown 或纯文字，AI 自动套用 BrandLab 模板</p>

              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`粘贴你的文章内容，例如：\n\n## 为什么大多数人定位模糊\n\n很多人做账号的逻辑是先发着看...\n\n> 定位不是你做什么，是别人为什么关注你\n\n## 三步找到定位\n\n1. 列出你最擅长的3件事\n2. 找市场上真实存在的需求\n3. 找竞品没有占领的交叉点`}
                rows={10}
                className="w-full text-sm text-[#333] border border-[#95d5b2] rounded-xl px-4 py-3 outline-none resize-y placeholder-[#c5e0ce] leading-relaxed focus:border-[#40916c] font-mono"
              />

              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-[#95d5b2]">{input.length} 字</span>
                <button
                  onClick={handleConvert}
                  disabled={converting || !input.trim()}
                  className="text-sm bg-[#1b4332] text-white px-6 py-2.5 rounded-lg hover:bg-[#2d6a4f] transition-colors font-medium disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
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
                <p className="mt-3 text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-4 py-2.5">{convertError}</p>
              )}
            </div>

            {/* 转换结果 */}
            {outputHtml && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-[#1b4332]">转换结果</p>
                    <div className="flex gap-1">
                      {(["preview", "code"] as const).map((m) => (
                        <button
                          key={m}
                          onClick={() => setViewMode(m)}
                          className={`text-[11px] px-2.5 py-1 rounded-md border transition-colors ${
                            viewMode === m
                              ? "bg-[#2d6a4f] text-white border-[#2d6a4f]"
                              : "text-[#6b7280] border-[#95d5b2] hover:border-[#52b788]"
                          }`}
                        >
                          {m === "preview" ? "预览" : "HTML"}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={copyOutput}
                    className={`text-sm px-5 py-2 rounded-lg font-medium transition-all ${
                      copied
                        ? "bg-[#f0faf4] text-[#2d6a4f] border border-[#52b788]"
                        : "bg-[#1b4332] text-white hover:bg-[#2d6a4f]"
                    }`}
                  >
                    {copied ? "✓ 已复制" : "复制"}
                  </button>
                </div>

                {viewMode === "preview" ? (
                  <div
                    className="border border-[#e5e7eb] rounded-xl p-4 bg-[#fafffe] overflow-auto"
                    dangerouslySetInnerHTML={{ __html: outputHtml }}
                  />
                ) : (
                  <textarea
                    readOnly
                    value={outputHtml}
                    rows={16}
                    className="w-full text-xs text-[#4b5563] font-mono border border-[#e5e7eb] rounded-xl px-4 py-3 outline-none resize-y bg-[#fafffe]"
                  />
                )}
              </div>
            )}

            {/* 已保存的文章 */}
            {!wechatLoading && wechatArticles.length > 0 && (
              <div>
                <p className="text-xs text-[#52b788] font-medium tracking-widest uppercase mb-3">已保存文章</p>
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
                        onClick={() => copySaved(article)}
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
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
