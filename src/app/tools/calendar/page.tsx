"use client";

import { useState } from "react";
import Link from "next/link";

const CONTENT_TYPES = [
  { label: "个人定位", bg: "bg-[#E8F5EE]", text: "text-[#2D6A4F]" },
  { label: "内容运营", bg: "bg-blue-50", text: "text-blue-600" },
  { label: "账号增长", bg: "bg-violet-50", text: "text-violet-600" },
  { label: "视觉表达", bg: "bg-orange-50", text: "text-orange-500" },
  { label: "平台策略", bg: "bg-amber-50", text: "text-amber-600" },
  { label: "IP案例", bg: "bg-rose-50", text: "text-rose-500" },
  { label: "工具方法", bg: "bg-slate-100", text: "text-slate-500" },
];

const HOOK_TYPES = ["痛点型", "数字型", "案例型", "反常识型", "对比型"];

const TOPIC_TEMPLATES = [
  (d: string) => `为什么做${d}还是没人关注你？`,
  (d: string) => `${d}的3个核心方法，99%的人不知道`,
  (d: string) => `拆解一个${d}账号从0到1万粉的路径`,
  (d: string) => `你以为的${d}，这4个认知全是错的`,
  (d: string) => `${d}新手 vs 老手，差距究竟在哪里？`,
  (d: string) => `做${d}1年，我踩过的5个坑`,
  (d: string) => `${d}必备工具清单，直接拿去用`,
  (d: string) => `${d}涨粉最快的内容类型是什么？`,
  (d: string) => `我用这个方法做${d}，2个月涨粉5000`,
  (d: string) => `${d}的底层逻辑，用完就懂`,
  (d: string) => `${d}封面设计的5个黄金原则`,
  (d: string) => `做${d}，选哪个平台最合适？`,
  (d: string) => `${d}变现的3种模式，哪个适合你？`,
  (d: string) => `${d}最容易犯的错误排行榜`,
  (d: string) => `一个${d}博主的真实一天`,
];

const FREQ_OPTIONS = [
  { label: "每天1条", value: 7, desc: "共30条" },
  { label: "每周5条", value: 5, desc: "约21条" },
  { label: "每周3条", value: 3, desc: "约13条" },
];

const WEEK_LABELS = ["一", "二", "三", "四", "五", "六", "日"];

type DayItem = {
  day: number;
  active: boolean;
  type?: (typeof CONTENT_TYPES)[0];
  hook?: string;
  topic?: string;
};

function generateSchedule(direction: string, frequency: number): DayItem[] {
  const days: DayItem[] = [];
  const dir = direction.trim() || "你的账号方向";
  let contentIndex = 0;

  for (let i = 1; i <= 30; i++) {
    const weekDay = (i - 1) % 7;
    const active =
      frequency === 7 ? true :
      frequency === 5 ? weekDay < 5 :
      weekDay === 0 || weekDay === 2 || weekDay === 4;

    if (active) {
      days.push({
        day: i,
        active: true,
        type: CONTENT_TYPES[contentIndex % CONTENT_TYPES.length],
        hook: HOOK_TYPES[contentIndex % HOOK_TYPES.length],
        topic: TOPIC_TEMPLATES[contentIndex % TOPIC_TEMPLATES.length](dir),
      });
      contentIndex++;
    } else {
      days.push({ day: i, active: false });
    }
  }
  return days;
}

export default function CalendarPage() {
  const [direction, setDirection] = useState("");
  const [frequency, setFrequency] = useState(5);
  const [schedule, setSchedule] = useState<DayItem[]>([]);
  const [generated, setGenerated] = useState(false);
  const [copied, setCopied] = useState(false);

  function handleGenerate() {
    setSchedule(generateSchedule(direction, frequency));
    setGenerated(true);
  }

  function handleCopy() {
    const text = schedule
      .filter((d) => d.active)
      .map((d) => `第${d.day}天 | ${d.type?.label} | ${d.hook} | ${d.topic}`)
      .join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const activeCount = schedule.filter((d) => d.active).length;

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-[#C8DDD2] bg-[#F7FBF8]">
        <div className="max-w-5xl mx-auto px-8 py-3 flex items-center gap-2 text-xs text-[#6B7A6E]">
          <Link href="/" className="hover:text-[#2D6A4F] transition-colors">首页</Link>
          <span>/</span>
          <Link href="/tools" className="hover:text-[#2D6A4F] transition-colors">工具资源</Link>
          <span>/</span>
          <span className="text-[#1A2E22] font-medium">30天内容排期生成器</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-12">
        {/* Title */}
        <div className="mb-10">
          <p className="text-xs text-[#6BAF8A] font-medium tracking-widest uppercase mb-2">免费工具</p>
          <h1 className="text-3xl font-bold text-[#1A2E22] mb-3">30天内容排期生成器</h1>
          <p className="text-sm text-[#6B7A6E]">输入你的账号方向和发布频率，自动生成一份30天内容计划</p>
        </div>

        {/* Input */}
        <div className="bg-[#F7FBF8] border border-[#C8DDD2] rounded-2xl p-8 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-xs font-medium text-[#6BAF8A] tracking-widest uppercase mb-3">
                账号方向 / 定位
              </label>
              <input
                type="text"
                value={direction}
                onChange={(e) => setDirection(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && direction.trim() && handleGenerate()}
                placeholder="例如：职场干货、油皮护肤、副业变现"
                className="w-full border border-[#C8DDD2] rounded-lg px-4 py-3 text-sm text-[#1A2E22] placeholder-[#6B7A6E]/50 focus:outline-none focus:border-[#2D6A4F] bg-white"
              />
              <p className="text-[10px] text-[#6B7A6E] mt-2">越具体越好，生成的选题更精准</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#6BAF8A] tracking-widest uppercase mb-3">
                每周发布频率
              </label>
              <div className="grid grid-cols-3 gap-3">
                {FREQ_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setFrequency(opt.value)}
                    className={`border rounded-lg py-3 px-2 text-center transition-all ${
                      frequency === opt.value
                        ? "border-[#2D6A4F] bg-[#E8F5EE] text-[#2D6A4F]"
                        : "border-[#C8DDD2] text-[#6B7A6E] hover:border-[#6BAF8A]"
                    }`}
                  >
                    <div className="text-xs font-bold">{opt.label}</div>
                    <div className="text-[10px] mt-0.5 opacity-70">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={handleGenerate}
              disabled={!direction.trim()}
              className="bg-[#1A2E22] text-white px-8 py-3 rounded-lg text-sm font-medium hover:bg-[#2D6A4F] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              生成排期 →
            </button>
          </div>
        </div>

        {/* Result */}
        {generated && (
          <>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-[#1A2E22]">你的30天内容计划</h2>
                <p className="text-xs text-[#6B7A6E] mt-1">
                  共 {activeCount} 条内容 · 基于「{direction}」方向生成
                </p>
              </div>
              <button
                onClick={handleCopy}
                className="text-xs border border-[#C8DDD2] text-[#6B7A6E] px-4 py-2 rounded-lg hover:border-[#2D6A4F] hover:text-[#2D6A4F] transition-colors"
              >
                {copied ? "✓ 已复制" : "复制全部"}
              </button>
            </div>

            {/* Week labels */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {WEEK_LABELS.map((l) => (
                <div key={l} className="text-center text-[10px] text-[#6B7A6E] font-medium">
                  周{l}
                </div>
              ))}
            </div>

            {/* Calendar */}
            <div className="grid grid-cols-7 gap-2">
              {schedule.map((item) => (
                <div
                  key={item.day}
                  className={`rounded-xl p-3 min-h-[128px] flex flex-col ${
                    item.active
                      ? "border border-[#C8DDD2] hover:border-[#6BAF8A] hover:shadow-sm transition-all bg-white"
                      : "bg-[#F7FBF8] border border-dashed border-[#E0EBE5]"
                  }`}
                >
                  <div className={`text-xs font-bold mb-2 ${item.active ? "text-[#1A2E22]" : "text-[#C8DDD2]"}`}>
                    {item.day}
                  </div>
                  {item.active && item.type ? (
                    <>
                      <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full self-start mb-1.5 ${item.type.bg} ${item.type.text}`}>
                        {item.type.label}
                      </span>
                      <span className="text-[9px] text-[#6B7A6E] border border-[#E0EBE5] px-1.5 py-0.5 rounded self-start mb-1.5">
                        {item.hook}
                      </span>
                      <p className="text-[10px] text-[#6B7A6E] leading-snug line-clamp-3">
                        {item.topic}
                      </p>
                    </>
                  ) : (
                    <span className="text-[9px] text-[#C8DDD2] mt-auto">休息</span>
                  )}
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="mt-5 flex flex-wrap gap-2">
              {CONTENT_TYPES.map((t) => (
                <span key={t.label} className={`text-[10px] px-2.5 py-1 rounded-full font-medium ${t.bg} ${t.text}`}>
                  {t.label}
                </span>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-10 bg-[#1A2E22] rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-white mb-1">需要更多定制化支持？</p>
                <p className="text-xs text-[#A8D5BB]">加入社群，获取 Notion 版本 + 内容框架模板</p>
              </div>
              <Link
                href="/contact"
                className="shrink-0 text-xs bg-[#1B4332] border border-[#6BAF8A] text-white px-5 py-2.5 rounded-lg hover:bg-[#2D6A4F] transition-colors"
              >
                加入社群
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
