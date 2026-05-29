"use client";

import { useState } from "react";
import Link from "next/link";

const CONTENT_TYPES: Record<string, { bg: string; text: string }> = {
  "个人定位": { bg: "bg-[#f0faf4]", text: "text-[#40916c]" },
  "内容运营": { bg: "bg-blue-50", text: "text-blue-600" },
  "账号增长": { bg: "bg-violet-50", text: "text-violet-600" },
  "视觉表达": { bg: "bg-orange-50", text: "text-orange-500" },
  "平台策略": { bg: "bg-amber-50", text: "text-amber-600" },
  "IP案例":   { bg: "bg-rose-50", text: "text-rose-500" },
  "工具方法": { bg: "bg-slate-100", text: "text-slate-500" },
};

const CONTENT_TYPE_LIST = Object.keys(CONTENT_TYPES);

const FREQ_OPTIONS = [
  { label: "每天1条", value: 7, desc: "共30条" },
  { label: "每周5条", value: 5, desc: "约21条" },
  { label: "每周3条", value: 3, desc: "约13条" },
];

const PLATFORMS = ["小红书", "抖音", "公众号", "视频号", "B站"];
const WEEK_LABELS = ["一", "二", "三", "四", "五", "六", "日"];

type AIItem = {
  day: number;
  type: string;
  hook: string;
  title: string;
  angle: string;
};

type Extra = { title: string; type: string };

type DayCell = {
  day: number;
  active: boolean;
  item?: AIItem;
};

function buildGrid(items: AIItem[], frequency: number): DayCell[] {
  const itemMap = new Map(items.map((it) => [it.day, it]));
  const cells: DayCell[] = [];

  for (let i = 1; i <= 30; i++) {
    const weekDay = (i - 1) % 7;
    const active =
      frequency === 7 ? true :
      frequency === 5 ? weekDay < 5 :
      weekDay === 0 || weekDay === 2 || weekDay === 4;

    cells.push({ day: i, active, item: itemMap.get(i) });
  }
  return cells;
}

export default function CalendarPage() {
  const [direction, setDirection] = useState("");
  const [platform, setPlatform] = useState("小红书");
  const [audience, setAudience] = useState("");
  const [frequency, setFrequency] = useState(5);
  const [grid, setGrid] = useState<DayCell[]>([]);
  const [extras, setExtras] = useState<Extra[]>([]);
  const [generated, setGenerated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  async function handleGenerate() {
    if (!direction.trim()) return;
    setLoading(true);
    setError("");
    setGenerated(false);
    try {
      const res = await fetch("/api/tools/calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          niche: direction,
          platform,
          frequency,
          audience,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "生成失败，请重试");
      } else {
        setGrid(buildGrid(data.items || [], frequency));
        setExtras(data.extras || []);
        setGenerated(true);
      }
    } catch {
      setError("网络错误，请稍后重试");
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    const text = grid
      .filter((d) => d.active && d.item)
      .map((d) => `第${d.day}天 | ${d.item!.type} | ${d.item!.hook} | ${d.item!.title}`)
      .join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const activeCount = grid.filter((d) => d.active).length;

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-[#95d5b2] bg-[#f0faf4]">
        <div className="max-w-5xl mx-auto px-8 py-3 flex items-center gap-2 text-xs text-[#6b7280]">
          <Link href="/" className="hover:text-[#40916c] transition-colors">首页</Link>
          <span>/</span>
          <Link href="/tools" className="hover:text-[#40916c] transition-colors">工具资源</Link>
          <span>/</span>
          <span className="text-[#1b4332] font-medium">30天内容排期生成器</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-12">
        {/* Title */}
        <div className="mb-10">
          <p className="text-xs text-[#52b788] font-medium tracking-widest uppercase mb-2">AI 工具</p>
          <h1 className="text-3xl font-bold text-[#1b4332] mb-3">AI 30天内容排期生成器</h1>
          <p className="text-sm text-[#6b7280]">输入账号方向，Claude AI 自动生成一份30天专属内容计划，涵盖选题标题 + 内容角度</p>
        </div>

        {/* Input */}
        <div className="bg-[#f0faf4] border border-[#95d5b2] rounded-2xl p-8 mb-10 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-medium text-[#52b788] tracking-widest uppercase mb-3">
                账号方向 / 定位 <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={direction}
                onChange={(e) => setDirection(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && direction.trim() && !loading && handleGenerate()}
                placeholder="例如：职场干货、油皮护肤、副业变现"
                className="w-full border border-[#95d5b2] rounded-lg px-4 py-3 text-sm text-[#1b4332] placeholder-[#6b7280]/50 focus:outline-none focus:border-[#40916c] bg-white"
              />
              <p className="text-[10px] text-[#6b7280] mt-1.5">越具体越好，生成的选题更精准</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#52b788] tracking-widest uppercase mb-3">
                目标受众（可选）
              </label>
              <input
                type="text"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="例如：25-35岁想涨粉的职场人"
                className="w-full border border-[#95d5b2] rounded-lg px-4 py-3 text-sm text-[#1b4332] placeholder-[#6b7280]/50 focus:outline-none focus:border-[#40916c] bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-medium text-[#52b788] tracking-widest uppercase mb-3">
                目标平台
              </label>
              <div className="flex flex-wrap gap-2">
                {PLATFORMS.map((p) => (
                  <button key={p} onClick={() => setPlatform(p)}
                    className={`text-xs px-4 py-2 rounded-full border transition-all ${platform === p ? "border-[#40916c] bg-white text-[#40916c] font-medium" : "border-[#95d5b2] text-[#6b7280] hover:border-[#52b788]"}`}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#52b788] tracking-widest uppercase mb-3">
                每周发布频率
              </label>
              <div className="grid grid-cols-3 gap-3">
                {FREQ_OPTIONS.map((opt) => (
                  <button key={opt.value} onClick={() => setFrequency(opt.value)}
                    className={`border rounded-lg py-3 px-2 text-center transition-all ${
                      frequency === opt.value
                        ? "border-[#40916c] bg-white text-[#40916c]"
                        : "border-[#95d5b2] text-[#6b7280] hover:border-[#52b788]"
                    }`}>
                    <div className="text-xs font-bold">{opt.label}</div>
                    <div className="text-[10px] mt-0.5 opacity-70">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <div className="flex justify-end">
            <button onClick={handleGenerate} disabled={!direction.trim() || loading}
              className="bg-[#1b4332] text-white px-8 py-3 rounded-lg text-sm font-medium hover:bg-[#40916c] transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
              {loading ? "AI 生成中，约需15秒..." : "AI 生成排期 →"}
            </button>
          </div>
        </div>

        {/* Result */}
        {generated && (
          <>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-[#1b4332]">你的30天内容计划</h2>
                <p className="text-xs text-[#6b7280] mt-1">
                  共 {activeCount} 条内容 · 「{direction}」· {platform}
                </p>
              </div>
              <button onClick={handleCopy}
                className="text-xs border border-[#95d5b2] text-[#6b7280] px-4 py-2 rounded-lg hover:border-[#40916c] hover:text-[#40916c] transition-colors">
                {copied ? "✓ 已复制" : "复制全部"}
              </button>
            </div>

            {/* Week labels */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {WEEK_LABELS.map((l) => (
                <div key={l} className="text-center text-[10px] text-[#6b7280] font-medium">周{l}</div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-2">
              {grid.map((cell) => {
                const typeStyle = cell.item ? (CONTENT_TYPES[cell.item.type] || { bg: "bg-slate-100", text: "text-slate-500" }) : null;
                return (
                  <div key={cell.day}
                    className={`rounded-xl p-3 min-h-[128px] flex flex-col ${
                      cell.active && cell.item
                        ? "border border-[#95d5b2] hover:border-[#52b788] hover:shadow-sm transition-all bg-white"
                        : cell.active
                        ? "border border-[#95d5b2] bg-white"
                        : "bg-[#f0faf4] border border-dashed border-[#E0EBE5]"
                    }`}
                  >
                    <div className={`text-xs font-bold mb-2 ${cell.active ? "text-[#1b4332]" : "text-[#95d5b2]"}`}>
                      {cell.day}
                    </div>
                    {cell.active && cell.item && typeStyle ? (
                      <>
                        <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full self-start mb-1.5 ${typeStyle.bg} ${typeStyle.text}`}>
                          {cell.item.type}
                        </span>
                        <span className="text-[9px] text-[#6b7280] border border-[#E0EBE5] px-1.5 py-0.5 rounded self-start mb-1.5">
                          {cell.item.hook}
                        </span>
                        <p className="text-[10px] text-[#6b7280] leading-snug line-clamp-3">
                          {cell.item.title}
                        </p>
                      </>
                    ) : cell.active ? (
                      <span className="text-[9px] text-[#95d5b2] mt-auto">待填充</span>
                    ) : (
                      <span className="text-[9px] text-[#95d5b2] mt-auto">休息</span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-5 flex flex-wrap gap-2">
              {CONTENT_TYPE_LIST.map((label) => {
                const s = CONTENT_TYPES[label];
                return (
                  <span key={label} className={`text-[10px] px-2.5 py-1 rounded-full font-medium ${s.bg} ${s.text}`}>
                    {label}
                  </span>
                );
              })}
            </div>

            {/* Detail list */}
            <div className="mt-10">
              <h3 className="text-sm font-bold text-[#1b4332] mb-4">选题详情</h3>
              <div className="space-y-2">
                {grid.filter((c) => c.active && c.item).map((cell) => {
                  const typeStyle = CONTENT_TYPES[cell.item!.type] || { bg: "bg-slate-100", text: "text-slate-500" };
                  return (
                    <div key={cell.day} className="border border-[#95d5b2] rounded-xl px-5 py-4 flex items-start gap-4">
                      <div className="shrink-0 text-xs font-bold text-[#52b788] w-10">第{cell.day}天</div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${typeStyle.bg} ${typeStyle.text}`}>
                          {cell.item!.type}
                        </span>
                        <span className="text-[10px] text-[#6b7280] border border-[#E0EBE5] px-2 py-0.5 rounded">
                          {cell.item!.hook}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#1b4332]">{cell.item!.title}</p>
                        {cell.item!.angle && (
                          <p className="text-[11px] text-[#6b7280] mt-1">{cell.item!.angle}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Extras */}
            {extras.length > 0 && (
              <div className="mt-8">
                <h3 className="text-sm font-bold text-[#1b4332] mb-3">3条备用选题</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {extras.map((ex, i) => {
                    const typeStyle = CONTENT_TYPES[ex.type] || { bg: "bg-slate-100", text: "text-slate-500" };
                    return (
                      <div key={i} className="border border-[#95d5b2] rounded-xl p-4">
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${typeStyle.bg} ${typeStyle.text} mb-2 inline-block`}>
                          {ex.type}
                        </span>
                        <p className="text-sm font-medium text-[#1b4332]">{ex.title}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="mt-10 bg-[#1b4332] rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-white mb-1">需要更多定制化支持？</p>
                <p className="text-xs text-[#74c69d]">加入社群，获取 Notion 版本 + 内容框架模板</p>
              </div>
              <Link href="/contact"
                className="shrink-0 text-xs bg-[#2d6a4f] border border-[#52b788] text-white px-5 py-2.5 rounded-lg hover:bg-[#40916c] transition-colors">
                加入社群
              </Link>
            </div>
          </>
        )}

        {!generated && !loading && (
          <div className="mt-8 bg-[#1b4332] rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-white mb-1">需要更多定制化支持？</p>
              <p className="text-xs text-[#74c69d]">加入社群，获取 Notion 版本 + 内容框架模板</p>
            </div>
            <Link href="/contact"
              className="shrink-0 text-xs bg-[#2d6a4f] border border-[#52b788] text-white px-5 py-2.5 rounded-lg hover:bg-[#40916c] transition-colors">
              加入社群
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
