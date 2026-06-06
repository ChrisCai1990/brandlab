"use client";

import { useState } from "react";
import Link from "next/link";

type AIResult = {
  positioning: string;
  tags: string[];
  contentStrategy: string[];
  differentiation: string;
  topics: string[];
};

type CopiedKey = "positioning" | "tags" | "strategy" | "diff" | "topics" | null;

export default function BriefPage() {
  const [direction, setDirection] = useState("");
  const [audience, setAudience] = useState("");
  const [advantage, setAdvantage] = useState("");
  const [goal, setGoal] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIResult | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<CopiedKey>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/tools/brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ direction, audience, advantage, goal }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "生成失败");
      } else {
        setResult(data);
      }
    } catch {
      setError("网络错误，请稍后重试");
    } finally {
      setLoading(false);
    }
  }

  function copy(key: CopiedKey, text: string) {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="bg-black min-h-screen">
      <div className="border-b border-[#1f1f1f] bg-[#0a0a0a]">
        <div className="max-w-5xl mx-auto px-8 py-3 flex items-center gap-2 text-xs text-[#888888]">
          <Link href="/" className="hover:text-[#a0a0a0] transition-colors">首页</Link>
          <span>/</span>
          <Link href="/tools" className="hover:text-[#a0a0a0] transition-colors">工具资源</Link>
          <span>/</span>
          <span className="text-white font-medium">AI账号定位生成器</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-12">
        <div className="mb-10">
          <p className="text-xs text-[#888888] font-medium tracking-widest uppercase mb-2">AI 工具</p>
          <h1 className="text-3xl font-bold text-white mb-3">AI 账号定位生成器</h1>
          <p className="text-sm text-[#888888]">输入你的基本信息，Claude AI 为你生成专属账号定位方案</p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-none p-8 mb-10 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-medium text-[#888888] tracking-widest uppercase mb-2">
                账号方向 <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={direction}
                onChange={(e) => setDirection(e.target.value)}
                placeholder="例如：职场成长、亲子育儿、副业变现"
                required
                className="w-full border border-[#1f1f1f] rounded-none px-4 py-2.5 text-sm text-white placeholder-[#333333] focus:outline-none focus:border-[#333333] bg-black"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#888888] tracking-widest uppercase mb-2">
                目标受众 <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="例如：25-35岁想晋升的职场人"
                required
                className="w-full border border-[#1f1f1f] rounded-none px-4 py-2.5 text-sm text-white placeholder-[#333333] focus:outline-none focus:border-[#333333] bg-black"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#888888] tracking-widest uppercase mb-2">
                核心优势 <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={advantage}
                onChange={(e) => setAdvantage(e.target.value)}
                placeholder="例如：5年产品经理经验、真实踩坑经历"
                required
                className="w-full border border-[#1f1f1f] rounded-none px-4 py-2.5 text-sm text-white placeholder-[#333333] focus:outline-none focus:border-[#333333] bg-black"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#888888] tracking-widest uppercase mb-2">
                变现目标 <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="例如：知识付费、品牌合作、私域社群"
                required
                className="w-full border border-[#1f1f1f] rounded-none px-4 py-2.5 text-sm text-white placeholder-[#333333] focus:outline-none focus:border-[#333333] bg-black"
              />
            </div>
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#0a0a0a] text-white px-8 py-3 rounded-none text-sm font-medium hover:bg-[#111111] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "AI 生成中..." : "AI 生成定位方案 →"}
            </button>
          </div>
        </form>

        {/* Result */}
        {result && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white mb-6">你的账号定位方案</h2>

            {/* 一句话定位 */}
            <div className="bg-[#0a0a0a] rounded-none p-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs text-[#888888] font-medium tracking-widest uppercase mb-2">一句话定位</p>
                <p className="text-base text-white font-bold leading-relaxed">{result.positioning}</p>
              </div>
              <button
                onClick={() => copy("positioning", result.positioning)}
                className="shrink-0 text-xs border border-[#333333] text-[#a0a0a0] px-3 py-1.5 rounded-none hover:bg-white transition-colors"
              >
                {copied === "positioning" ? "✓ 已复制" : "复制"}
              </button>
            </div>

            {/* 标签 */}
            <div className="border border-[#1f1f1f] rounded-none p-5 flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="text-xs text-[#888888] font-medium tracking-widest uppercase mb-3">账号标签</p>
                <div className="flex flex-wrap gap-2">
                  {result.tags.map((tag) => (
                    <span key={tag} className="text-xs bg-[#0a0a0a] text-[#a0a0a0] px-3 py-1 rounded-sm font-medium border border-[#1f1f1f]">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => copy("tags", result.tags.join(" · "))}
                className="shrink-0 text-xs border border-[#1f1f1f] text-[#888888] px-3 py-1.5 rounded-none hover:border-[#333333] hover:text-[#a0a0a0] transition-colors"
              >
                {copied === "tags" ? "✓ 已复制" : "复制"}
              </button>
            </div>

            {/* 内容策略 */}
            <div className="border border-[#1f1f1f] rounded-none p-5 flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="text-xs text-[#888888] font-medium tracking-widest uppercase mb-3">内容策略</p>
                <div className="space-y-2">
                  {result.contentStrategy.map((s, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-xs text-[#888888] font-bold shrink-0 mt-0.5">{i + 1}.</span>
                      <p className="text-sm text-[#4b5563]">{s}</p>
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={() => copy("strategy", result.contentStrategy.map((s, i) => `${i + 1}. ${s}`).join("\n"))}
                className="shrink-0 text-xs border border-[#1f1f1f] text-[#888888] px-3 py-1.5 rounded-none hover:border-[#333333] hover:text-[#a0a0a0] transition-colors"
              >
                {copied === "strategy" ? "✓ 已复制" : "复制"}
              </button>
            </div>

            {/* 差异化 */}
            <div className="border border-[#1f1f1f] rounded-none p-5 flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="text-xs text-[#888888] font-medium tracking-widest uppercase mb-3">差异化亮点</p>
                <p className="text-sm text-[#4b5563] leading-relaxed">{result.differentiation}</p>
              </div>
              <button
                onClick={() => copy("diff", result.differentiation)}
                className="shrink-0 text-xs border border-[#1f1f1f] text-[#888888] px-3 py-1.5 rounded-none hover:border-[#333333] hover:text-[#a0a0a0] transition-colors"
              >
                {copied === "diff" ? "✓ 已复制" : "复制"}
              </button>
            </div>

            {/* 爆款选题 */}
            <div className="border border-[#1f1f1f] rounded-none p-5 flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="text-xs text-[#888888] font-medium tracking-widest uppercase mb-3">第一批爆款选题</p>
                <div className="space-y-2">
                  {result.topics.map((topic, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-xs text-[#888888] font-bold shrink-0 mt-0.5">{i + 1}.</span>
                      <p className="text-sm text-white font-medium">{topic}</p>
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={() => copy("topics", result.topics.map((t, i) => `${i + 1}. ${t}`).join("\n"))}
                className="shrink-0 text-xs border border-[#1f1f1f] text-[#888888] px-3 py-1.5 rounded-none hover:border-[#333333] hover:text-[#a0a0a0] transition-colors"
              >
                {copied === "topics" ? "✓ 已复制" : "复制"}
              </button>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => { setResult(null); setDirection(""); setAudience(""); setAdvantage(""); setGoal(""); }}
                className="text-sm border border-[#1f1f1f] text-[#888888] px-6 py-2.5 rounded-none hover:border-[#333333] hover:text-[#a0a0a0] transition-colors"
              >
                重新生成
              </button>
            </div>
          </div>
        )}

        {!result && (
          <div className="mt-8 bg-[#0a0a0a] rounded-none p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-white mb-1">想要更深度的定位诊断？</p>
              <p className="text-xs text-[#a0a0a0]">加入社群，获取完整版Notion模板 + 1对1定位梳理机会</p>
            </div>
            <Link href="/contact" className="shrink-0 text-xs bg-white border border-[#333333] text-white px-5 py-2.5 rounded-none hover:bg-[#111111] transition-colors">
              加入社群
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
