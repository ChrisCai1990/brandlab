"use client";

import { useState } from "react";
import Link from "next/link";

const AI_PROMPT_TEMPLATE = `你是一位专业的社交媒体内容策划师，请帮我生成一份30天的内容排期计划。

【我的账号信息】
- 账号方向 / 定位：[请填写，例如：职场干货博主、油皮护肤、副业变现]
- 目标平台：[请填写，例如：小红书 / 抖音 / 公众号]
- 每周发布频率：[请填写，例如：每周5条]
- 目标受众：[可选，例如：25-35岁职场女性]

【内容类型分类（7类，请交替使用）】
1. 个人定位 — 建立人设与差异化认知
2. 内容运营 — 创作技巧、选题方法
3. 账号增长 — 涨粉策略、平台规则
4. 视觉表达 — 封面设计、排版技巧
5. 平台策略 — 算法解读、发布时机
6. IP案例 — 拆解成功博主的路径
7. 工具方法 — 实用工具推荐与教程

【钩子类型（5种，请交替使用）】
- 痛点型：直击用户最痛的问题
- 数字型：具体数字增加可信度
- 案例型：真实案例引发代入感
- 反常识型：打破固有认知
- 对比型：两种情况形成反差

【输出要求】
请以表格形式输出，包含以下列：
| 第X天 | 内容类型 | 钩子类型 | 选题标题 | 核心角度（一句话）|

每条选题标题要：
1. 包含我的账号关键词
2. 有明确的用户利益点
3. 长度控制在20字以内
4. 符合目标平台的标题风格

请只生成有发布计划的天数（跳过休息日），并在最后补充3条备用选题。`;


const CONTENT_TYPES = [
  { label: "个人定位", bg: "bg-[#e6f4f3]", text: "text-[#0f766e]" },
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
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  function handleGenerate() {
    setSchedule(generateSchedule(direction, frequency));
    setGenerated(true);
  }

  function handleCopyPrompt() {
    navigator.clipboard.writeText(AI_PROMPT_TEMPLATE);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
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
      <div className="border-b border-[#b2d8d5] bg-[#f0f9f8]">
        <div className="max-w-5xl mx-auto px-8 py-3 flex items-center gap-2 text-xs text-[#5a7e7c]">
          <Link href="/" className="hover:text-[#0f766e] transition-colors">首页</Link>
          <span>/</span>
          <Link href="/tools" className="hover:text-[#0f766e] transition-colors">工具资源</Link>
          <span>/</span>
          <span className="text-[#0d2e2c] font-medium">30天内容排期生成器</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-12">
        {/* Title */}
        <div className="mb-10">
          <p className="text-xs text-[#5eada7] font-medium tracking-widest uppercase mb-2">免费工具</p>
          <h1 className="text-3xl font-bold text-[#0d2e2c] mb-3">30天内容排期生成器</h1>
          <p className="text-sm text-[#5a7e7c]">输入你的账号方向和发布频率，自动生成一份30天内容计划</p>
        </div>

        {/* Input */}
        <div className="bg-[#f0f9f8] border border-[#b2d8d5] rounded-2xl p-8 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-xs font-medium text-[#5eada7] tracking-widest uppercase mb-3">
                账号方向 / 定位
              </label>
              <input
                type="text"
                value={direction}
                onChange={(e) => setDirection(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && direction.trim() && handleGenerate()}
                placeholder="例如：职场干货、油皮护肤、副业变现"
                className="w-full border border-[#b2d8d5] rounded-lg px-4 py-3 text-sm text-[#0d2e2c] placeholder-[#5a7e7c]/50 focus:outline-none focus:border-[#0f766e] bg-white"
              />
              <p className="text-[10px] text-[#5a7e7c] mt-2">越具体越好，生成的选题更精准</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#5eada7] tracking-widest uppercase mb-3">
                每周发布频率
              </label>
              <div className="grid grid-cols-3 gap-3">
                {FREQ_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setFrequency(opt.value)}
                    className={`border rounded-lg py-3 px-2 text-center transition-all ${
                      frequency === opt.value
                        ? "border-[#0f766e] bg-[#e6f4f3] text-[#0f766e]"
                        : "border-[#b2d8d5] text-[#5a7e7c] hover:border-[#5eada7]"
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
              className="bg-[#0d2e2c] text-white px-8 py-3 rounded-lg text-sm font-medium hover:bg-[#0f766e] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
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
                <h2 className="text-lg font-bold text-[#0d2e2c]">你的30天内容计划</h2>
                <p className="text-xs text-[#5a7e7c] mt-1">
                  共 {activeCount} 条内容 · 基于「{direction}」方向生成
                </p>
              </div>
              <button
                onClick={handleCopy}
                className="text-xs border border-[#b2d8d5] text-[#5a7e7c] px-4 py-2 rounded-lg hover:border-[#0f766e] hover:text-[#0f766e] transition-colors"
              >
                {copied ? "✓ 已复制" : "复制全部"}
              </button>
            </div>

            {/* Week labels */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {WEEK_LABELS.map((l) => (
                <div key={l} className="text-center text-[10px] text-[#5a7e7c] font-medium">
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
                      ? "border border-[#b2d8d5] hover:border-[#5eada7] hover:shadow-sm transition-all bg-white"
                      : "bg-[#f0f9f8] border border-dashed border-[#E0EBE5]"
                  }`}
                >
                  <div className={`text-xs font-bold mb-2 ${item.active ? "text-[#0d2e2c]" : "text-[#b2d8d5]"}`}>
                    {item.day}
                  </div>
                  {item.active && item.type ? (
                    <>
                      <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full self-start mb-1.5 ${item.type.bg} ${item.type.text}`}>
                        {item.type.label}
                      </span>
                      <span className="text-[9px] text-[#5a7e7c] border border-[#E0EBE5] px-1.5 py-0.5 rounded self-start mb-1.5">
                        {item.hook}
                      </span>
                      <p className="text-[10px] text-[#5a7e7c] leading-snug line-clamp-3">
                        {item.topic}
                      </p>
                    </>
                  ) : (
                    <span className="text-[9px] text-[#b2d8d5] mt-auto">休息</span>
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
            <div className="mt-10 bg-[#0d2e2c] rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-white mb-1">需要更多定制化支持？</p>
                <p className="text-xs text-[#99ceca]">加入社群，获取 Notion 版本 + 内容框架模板</p>
              </div>
              <Link
                href="/contact"
                className="shrink-0 text-xs bg-[#134e4a] border border-[#5eada7] text-white px-5 py-2.5 rounded-lg hover:bg-[#0f766e] transition-colors"
              >
                加入社群
              </Link>
            </div>
          </>
        )}

        {/* AI Prompt Section */}
        <div className="mt-16 border-t border-[#b2d8d5] pt-14">
          <div className="mb-6">
            <p className="text-xs text-[#5eada7] font-medium tracking-widest uppercase mb-2">进阶方案</p>
            <h2 className="text-xl font-bold text-[#0d2e2c] mb-2">用 AI 生成更个性化的排期</h2>
            <p className="text-sm text-[#5a7e7c]">
              把下方提示词复制到 ChatGPT 或 Claude，填入你的账号信息，即可获得一份更丰富、更有针对性的30天内容计划。
            </p>
          </div>

          <div className="border border-[#b2d8d5] rounded-2xl overflow-hidden">
            <div className="bg-[#f0f9f8] border-b border-[#b2d8d5] px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-[#0d2e2c]">AI 提示词模板</span>
                <span className="text-[10px] text-[#5eada7] bg-[#e6f4f3] px-2 py-0.5 rounded-full">可直接使用</span>
              </div>
              <button
                onClick={handleCopyPrompt}
                className="text-xs border border-[#b2d8d5] text-[#5a7e7c] px-4 py-1.5 rounded-lg hover:border-[#0f766e] hover:text-[#0f766e] transition-colors"
              >
                {copiedPrompt ? "✓ 已复制" : "复制提示词"}
              </button>
            </div>

            <div className="bg-white px-6 py-5">
              <pre className="text-[11px] text-[#3D5048] leading-relaxed whitespace-pre-wrap font-mono">
                {AI_PROMPT_TEMPLATE}
              </pre>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { step: "01", title: "复制提示词", desc: "点击上方「复制提示词」按钮" },
              { step: "02", title: "填入你的信息", desc: "将 [ ] 内的内容替换为你的账号实际情况" },
              { step: "03", title: "粘贴到 AI 工具", desc: "发送给 ChatGPT / Claude，即刻获得定制排期" },
            ].map((item) => (
              <div key={item.step} className="flex gap-3 items-start bg-[#f0f9f8] border border-[#E0EBE5] rounded-xl p-4">
                <span className="text-xs font-bold text-[#5eada7] shrink-0 mt-0.5">{item.step}</span>
                <div>
                  <p className="text-xs font-bold text-[#0d2e2c] mb-0.5">{item.title}</p>
                  <p className="text-[11px] text-[#5a7e7c] leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
