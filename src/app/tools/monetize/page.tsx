"use client";

import { useState } from "react";
import Link from "next/link";

const AI_PROMPT = `你是一位专注于个人IP变现的商业顾问，请帮我制定一份完整的变现路径规划。

【我的账号情况】
- 账号方向：[请填写，例如：职场晋升干货]
- 当前粉丝量：[请填写，例如：5000]
- 主要平台：[请填写，例如：小红书]
- 内容互动率（大概）：[请填写，例如：5%]
- 我的核心资产/能力：[请填写，例如：10年HR经验、系统面试辅导能力]
- 目标月收入：[请填写，例如：1万]
- 可投入时间：[请填写，例如：每天2小时]

【请按以下结构输出变现规划】

## 一、变现潜力评估
- 当前阶段定位（0-1期/成长期/成熟期）：
- 核心优势盘点：
- 主要制约因素：

## 二、推荐变现矩阵（按优先级排序）
| 变现方式 | 启动门槛 | 预期收入 | 操作难度 | 适合阶段 |

## 三、分阶段变现路线图
**第一阶段（当前-3个月）**：
- 核心任务：
- 变现重点：
- 里程碑目标：

**第二阶段（3-6个月）**：
- 核心任务：
- 变现重点：
- 里程碑目标：

**第三阶段（6-12个月）**：
- 核心任务：
- 变现重点：
- 里程碑目标：

## 四、各变现方式操作指南
（针对最优先推荐的3种变现方式，给出具体操作步骤）

## 五、风险提示与注意事项`;

const FOLLOWER_RANGES = [
  { label: "0-1000", value: "starter", desc: "起步期" },
  { label: "1000-5000", value: "growing", desc: "成长期" },
  { label: "5000-2万", value: "mid", desc: "发展期" },
  { label: "2万-10万", value: "scale", desc: "规模期" },
  { label: "10万+", value: "mature", desc: "成熟期" },
];

const NICHE_OPTIONS = ["职场成长", "副业变现", "亲子育儿", "护肤美妆", "健身减脂", "个人理财", "设计创作", "读书学习", "情感关系", "其他垂类"];
const PLATFORM_OPTIONS = ["小红书", "抖音", "公众号", "视频号", "B站", "多平台"];
const INCOME_GOALS = ["月入3000+", "月入1万+", "月入3万+", "月入10万+"];
const TIME_OPTIONS = ["每天1小时以内", "每天1-2小时", "每天3-4小时", "半职或全职投入"];

type MonetizeForm = {
  follower: string;
  niche: string;
  platform: string;
  incomeGoal: string;
  timeInput: string;
  skill: string;
};

type MonetizePath = {
  name: string;
  desc: string;
  threshold: string;
  income: string;
  difficulty: "低" | "中" | "高";
  priority: "立即启动" | "3个月内" | "6个月后";
  color: string;
};

function generatePlan(form: MonetizeForm) {
  const followerStage: Record<string, { stage: string; label: string; desc: string }> = {
    starter: { stage: "0-1期", label: "账号起步", desc: "专注内容质量，建立基础信任，为变现蓄力" },
    growing: { stage: "成长期", label: "积累阶段", desc: "稳定更新，探索变现方式，小范围测试" },
    mid: { stage: "发展期", label: "加速阶段", desc: "多元变现并行，打造产品体系，建立私域" },
    scale: { stage: "规模期", label: "系统化", desc: "品牌化运营，高客单价产品，团队化管理" },
    mature: { stage: "成熟期", label: "商业化", desc: "IP授权、联名合作、生态布局" },
  };

  const stage = followerStage[form.follower] || followerStage.growing;

  const allPaths: MonetizePath[] = [
    {
      name: "知识付费/卖课",
      desc: "将核心经验打包成课程，1次创作持续变现",
      threshold: "500粉以上即可启动",
      income: "月入3000-5万，无上限",
      difficulty: "中",
      priority: form.follower === "starter" ? "3个月内" : "立即启动",
      color: "bg-violet-50 text-violet-600 border-violet-200",
    },
    {
      name: "私域社群",
      desc: "建立付费会员群，提供持续价值与链接",
      threshold: "1000粉+，有稳定内容产出",
      income: "月入2000-3万，可规模化",
      difficulty: "中",
      priority: form.follower === "starter" || form.follower === "growing" ? "3个月内" : "立即启动",
      color: "bg-[#E8F5EE] text-[#2D6A4F] border-[#C8DDD2]",
    },
    {
      name: "品牌广告合作",
      desc: "与品牌合作投放，单条报价随粉丝量递增",
      threshold: "1万粉+，垂直度高",
      income: "单条500-5万，取决于粉丝量",
      difficulty: "低",
      priority: form.follower === "scale" || form.follower === "mature" ? "立即启动" : "6个月后",
      color: "bg-blue-50 text-blue-600 border-blue-200",
    },
    {
      name: "咨询/1对1服务",
      desc: "高客单价，利用专业能力直接变现",
      threshold: "500粉+，专业信任感建立",
      income: "单次500-5000，取决于定价",
      difficulty: "低",
      priority: "立即启动",
      color: "bg-amber-50 text-amber-600 border-amber-200",
    },
    {
      name: "带货/好物分享",
      desc: "通过平台佣金或品牌寄样实现变现",
      threshold: "1000粉+，内容与产品高度契合",
      income: "月入1000-10万，取决于转化率",
      difficulty: "中",
      priority: form.niche.includes("美妆") || form.niche.includes("健身") ? "立即启动" : "3个月内",
      color: "bg-rose-50 text-rose-600 border-rose-200",
    },
    {
      name: "线下活动/工作坊",
      desc: "将线上流量转化为线下高价值体验",
      threshold: "私域500人+，本地影响力",
      income: "单次5000-10万，取决于规模",
      difficulty: "高",
      priority: "6个月后",
      color: "bg-slate-100 text-slate-600 border-slate-200",
    },
  ];

  const sortOrder = { "立即启动": 0, "3个月内": 1, "6个月后": 2 };
  const sorted = [...allPaths].sort((a, b) => sortOrder[a.priority] - sortOrder[b.priority]);

  const roadmap = [
    {
      phase: "第一阶段（当前-3个月）",
      focus: "打地基",
      tasks: ["稳定更新频率，建立内容库（至少30篇）", "测试2-3种选题方向，找到爆款规律", "启动低门槛变现：咨询 / 小额知识付费"],
      milestone: "粉丝量翻倍，首笔变现收入",
      color: "bg-[#E8F5EE] border-[#C8DDD2]",
    },
    {
      phase: "第二阶段（3-6个月）",
      focus: "建体系",
      tasks: ["上线第一个付费产品（课程/社群/电子书）", "建立私域流量池（微信群/公众号）", "开始接洽品牌合作，建立媒介资料"],
      milestone: "月收入破万，稳定变现闭环",
      color: "bg-blue-50 border-blue-200",
    },
    {
      phase: "第三阶段（6-12个月）",
      focus: "做规模",
      tasks: ["迭代产品体系，提高客单价", "引入助理/分工，提高生产效率", "多平台矩阵扩张，放大单一内容价值"],
      milestone: "月收入3万+，建立个人IP护城河",
      color: "bg-violet-50 border-violet-200",
    },
  ];

  return { stage, paths: sorted, roadmap };
}

export default function MonetizePage() {
  const [form, setForm] = useState<MonetizeForm>({
    follower: "", niche: "", platform: "", incomeGoal: "", timeInput: "", skill: "",
  });
  const [result, setResult] = useState<ReturnType<typeof generatePlan> | null>(null);
  const [copied, setCopied] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const canGenerate = form.follower && form.niche;

  function handleGenerate() {
    setResult(generatePlan(form));
  }

  function copyResult() {
    if (!result) return;
    const text = `变现路径规划表

【阶段定位】
${result.stage.stage} — ${result.stage.label}：${result.stage.desc}

【推荐变现路径（优先级排序）】
${result.paths.map((p, i) => `${i + 1}. ${p.name}（${p.priority}）
   ${p.desc}
   门槛：${p.threshold}
   收入：${p.income}`).join("\n\n")}

【分阶段路线图】
${result.roadmap.map((r) => `${r.phase}
重点：${r.focus}
任务：${r.tasks.join("；")}
里程碑：${r.milestone}`).join("\n\n")}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="border-b border-[#C8DDD2] bg-[#F7FBF8]">
        <div className="max-w-5xl mx-auto px-8 py-3 flex items-center gap-2 text-xs text-[#6B7A6E]">
          <Link href="/" className="hover:text-[#2D6A4F]">首页</Link>
          <span>/</span>
          <Link href="/tools" className="hover:text-[#2D6A4F]">工具资源</Link>
          <span>/</span>
          <span className="text-[#1A2E22] font-medium">变现路径规划表</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-12">
        <div className="mb-10">
          <p className="text-xs text-[#6BAF8A] font-medium tracking-widest uppercase mb-2">免费工具</p>
          <h1 className="text-3xl font-bold text-[#1A2E22] mb-3">变现路径规划表</h1>
          <p className="text-sm text-[#6B7A6E]">告诉我你的账号现状，生成最适合你的变现方式组合和行动路线图</p>
        </div>

        {/* Form */}
        <div className="bg-[#F7FBF8] border border-[#C8DDD2] rounded-2xl p-8 mb-10 space-y-7">
          {/* 粉丝量 */}
          <div>
            <label className="block text-xs font-medium text-[#6BAF8A] tracking-widest uppercase mb-3">
              当前粉丝量 <span className="text-rose-400">*</span>
            </label>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
              {FOLLOWER_RANGES.map((r) => (
                <button key={r.value} onClick={() => setForm(f => ({ ...f, follower: r.value }))}
                  className={`border rounded-xl py-3 px-2 text-center transition-all ${form.follower === r.value ? "border-[#2D6A4F] bg-[#E8F5EE]" : "border-[#C8DDD2] hover:border-[#6BAF8A]"}`}>
                  <div className={`text-xs font-bold ${form.follower === r.value ? "text-[#2D6A4F]" : "text-[#1A2E22]"}`}>{r.label}</div>
                  <div className="text-[10px] text-[#6B7A6E] mt-0.5">{r.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 账号方向 + 平台 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-medium text-[#6BAF8A] tracking-widest uppercase mb-3">
                账号方向 <span className="text-rose-400">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {NICHE_OPTIONS.map((n) => (
                  <button key={n} onClick={() => setForm(f => ({ ...f, niche: n }))}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all ${form.niche === n ? "border-[#2D6A4F] bg-[#E8F5EE] text-[#2D6A4F] font-medium" : "border-[#C8DDD2] text-[#6B7A6E] hover:border-[#6BAF8A]"}`}>
                    {n}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#6BAF8A] tracking-widest uppercase mb-3">主要平台</label>
              <div className="flex flex-wrap gap-2">
                {PLATFORM_OPTIONS.map((p) => (
                  <button key={p} onClick={() => setForm(f => ({ ...f, platform: p }))}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all ${form.platform === p ? "border-[#2D6A4F] bg-[#E8F5EE] text-[#2D6A4F] font-medium" : "border-[#C8DDD2] text-[#6B7A6E] hover:border-[#6BAF8A]"}`}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 收入目标 + 可投入时间 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-medium text-[#6BAF8A] tracking-widest uppercase mb-3">收入目标</label>
              <div className="grid grid-cols-2 gap-2">
                {INCOME_GOALS.map((g) => (
                  <button key={g} onClick={() => setForm(f => ({ ...f, incomeGoal: g }))}
                    className={`text-xs py-2 px-3 rounded-lg border transition-all text-center ${form.incomeGoal === g ? "border-[#2D6A4F] bg-[#E8F5EE] text-[#2D6A4F] font-medium" : "border-[#C8DDD2] text-[#6B7A6E] hover:border-[#6BAF8A]"}`}>
                    {g}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#6BAF8A] tracking-widest uppercase mb-3">每日可投入时间</label>
              <div className="flex flex-col gap-2">
                {TIME_OPTIONS.map((t) => (
                  <button key={t} onClick={() => setForm(f => ({ ...f, timeInput: t }))}
                    className={`text-xs py-2 px-3 rounded-lg border transition-all text-left ${form.timeInput === t ? "border-[#2D6A4F] bg-[#E8F5EE] text-[#2D6A4F] font-medium" : "border-[#C8DDD2] text-[#6B7A6E] hover:border-[#6BAF8A]"}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 核心技能 */}
          <div>
            <label className="block text-xs font-medium text-[#6BAF8A] tracking-widest uppercase mb-2">你的核心技能/资源（可选）</label>
            <input
              type="text"
              value={form.skill}
              onChange={(e) => setForm(f => ({ ...f, skill: e.target.value }))}
              placeholder="例如：10年HR经验、擅长Excel、有设计资源"
              className="w-full border border-[#C8DDD2] rounded-lg px-4 py-2.5 text-sm text-[#1A2E22] placeholder-[#6B7A6E]/40 focus:outline-none focus:border-[#2D6A4F] bg-white"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleGenerate}
              disabled={!canGenerate}
              className="bg-[#1A2E22] text-white px-8 py-3 rounded-lg text-sm font-medium hover:bg-[#2D6A4F] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              生成变现规划 →
            </button>
          </div>
        </div>

        {/* Result */}
        {result && (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-[#1A2E22]">你的变现路径规划</h2>
                <p className="text-xs text-[#6B7A6E] mt-1">{result.stage.stage} — {result.stage.label}</p>
              </div>
              <button onClick={copyResult}
                className="text-xs border border-[#C8DDD2] text-[#6B7A6E] px-4 py-2 rounded-lg hover:border-[#2D6A4F] hover:text-[#2D6A4F] transition-colors">
                {copied ? "✓ 已复制" : "复制全部"}
              </button>
            </div>

            {/* 阶段定位 */}
            <div className="bg-[#1A2E22] rounded-xl p-6 mb-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-bold text-[#6BAF8A] bg-[#2D6A4F]/30 px-2.5 py-1 rounded-full">{result.stage.stage}</span>
                <span className="text-sm font-bold text-white">{result.stage.label}</span>
              </div>
              <p className="text-xs text-[#A8D5BB] leading-relaxed">{result.stage.desc}</p>
            </div>

            {/* 变现方式矩阵 */}
            <div className="mb-4">
              <h3 className="text-sm font-bold text-[#1A2E22] mb-3">推荐变现方式（按优先级）</h3>
              <div className="space-y-2.5">
                {result.paths.map((p, i) => (
                  <div key={p.name} className={`border rounded-xl p-4 flex items-start gap-4 ${p.color}`}>
                    <span className="text-xs font-bold w-4 shrink-0 mt-0.5 opacity-50">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold">{p.name}</span>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                          p.priority === "立即启动" ? "bg-[#1A2E22] text-white" : "bg-white/60 text-current"
                        }`}>{p.priority}</span>
                        <span className="text-[10px] opacity-60">难度：{p.difficulty}</span>
                      </div>
                      <p className="text-[11px] opacity-75 mb-1">{p.desc}</p>
                      <div className="flex gap-4 text-[10px]">
                        <span><span className="opacity-60">门槛：</span>{p.threshold}</span>
                        <span><span className="opacity-60">收入：</span>{p.income}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 路线图 */}
            <div>
              <h3 className="text-sm font-bold text-[#1A2E22] mb-3">分阶段行动路线图</h3>
              <div className="space-y-3">
                {result.roadmap.map((r) => (
                  <div key={r.phase} className={`border rounded-xl p-5 ${r.color}`}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[10px] font-bold text-current opacity-70">{r.phase}</span>
                      <span className="text-xs font-bold text-current">重点：{r.focus}</span>
                    </div>
                    <ul className="space-y-1.5 mb-3">
                      {r.tasks.map((task, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-current">
                          <span className="w-1 h-1 rounded-full bg-current shrink-0 mt-1.5 opacity-60" />
                          {task}
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] opacity-60">里程碑：</span>
                      <span className="text-[10px] font-bold">{r.milestone}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 bg-[#1A2E22] rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-white mb-1">想要更深度的变现策略？</p>
                <p className="text-xs text-[#A8D5BB]">加入社群，获取各变现方式的SOP手册 + 定价模型模板</p>
              </div>
              <Link href="/contact" className="shrink-0 text-xs bg-[#1B4332] border border-[#6BAF8A] text-white px-5 py-2.5 rounded-lg hover:bg-[#2D6A4F] transition-colors">
                加入社群
              </Link>
            </div>
          </>
        )}

        {/* AI Prompt */}
        <div className="mt-16 border-t border-[#C8DDD2] pt-14">
          <div className="mb-6">
            <p className="text-xs text-[#6BAF8A] font-medium tracking-widest uppercase mb-2">进阶方案</p>
            <h2 className="text-xl font-bold text-[#1A2E22] mb-2">用 AI 制定更精细的变现规划</h2>
            <p className="text-sm text-[#6B7A6E]">把下方提示词复制到 ChatGPT 或 Claude，填入你的真实情况，获得量身定制的完整变现路径规划。</p>
          </div>
          <div className="border border-[#C8DDD2] rounded-2xl overflow-hidden">
            <div className="bg-[#F7FBF8] border-b border-[#C8DDD2] px-5 py-3 flex items-center justify-between">
              <span className="text-xs font-medium text-[#1A2E22]">AI 提示词模板</span>
              <button
                onClick={() => { navigator.clipboard.writeText(AI_PROMPT); setCopiedPrompt(true); setTimeout(() => setCopiedPrompt(false), 2000); }}
                className="text-xs border border-[#C8DDD2] text-[#6B7A6E] px-4 py-1.5 rounded-lg hover:border-[#2D6A4F] hover:text-[#2D6A4F] transition-colors"
              >
                {copiedPrompt ? "✓ 已复制" : "复制提示词"}
              </button>
            </div>
            <div className="bg-white px-6 py-5">
              <pre className="text-[11px] text-[#3D5048] leading-relaxed whitespace-pre-wrap font-mono">{AI_PROMPT}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
