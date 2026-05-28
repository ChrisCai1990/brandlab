"use client";

import { useState } from "react";
import Link from "next/link";

const AI_PROMPT = `你是一位顶级的社交媒体爆款内容策划师，请帮我生成一批高质量的爆款选题。

【账号信息】
- 账号方向/定位：[请填写，例如：职场晋升干货博主]
- 目标平台：[请填写，例如：小红书]
- 目标受众：[请填写，例如：25-35岁有晋升焦虑的职场人]
- 近期想重点发力的子话题：[请填写，例如：述职技巧、向上管理]

【爆款选题要素】
选题需要同时满足：
1. 精准触达目标受众的核心痛点
2. 标题自带传播性（让人忍不住点进来）
3. 平台调性匹配（小红书更感性，抖音更视觉冲击，公众号更深度）
4. 可落地执行的内容角度

【请按以下5种钩子类型各生成4个选题，共20个】

**痛点型**（直击用户最痛的问题，让人感同身受）
格式：为什么你…… / 明明……却还是…… / 你以为……其实……

**数字型**（用具体数字增加可信度和紧迫感）
格式：X个……让你…… / X年……只需X步 / X%的人不知道……

**案例型**（真实故事引发代入感，让人主动对号入座）
格式：我……之后，发现…… / 同事……，我……

**反常识型**（打破固有认知，制造认知冲击）
格式：别再……了 / 停止……你才能…… / 越……越……

**对比型**（两种情况形成强烈反差，放大差距焦虑）
格式：……vs…… / 同样……，为什么…… / 做了……之后，……的变化

请同时给出每个选题的：
- 核心角度（一句话说明内容方向）
- 预计爆款指数（1-5星）
- 适合哪类受众`;

const HOOK_TYPES = [
  { label: "痛点型", color: "bg-rose-50 text-rose-600", desc: "直击最痛的问题" },
  { label: "数字型", color: "bg-blue-50 text-blue-600", desc: "具体数字增可信度" },
  { label: "案例型", color: "bg-amber-50 text-amber-600", desc: "真实故事引共鸣" },
  { label: "反常识型", color: "bg-violet-50 text-violet-600", desc: "打破固有认知" },
  { label: "对比型", color: "bg-[#e6f4f3] text-[#0f766e]", desc: "制造强烈反差" },
];

const PLATFORM_OPTIONS = ["小红书", "抖音", "公众号", "视频号", "B站"];

const TOPIC_DB: Record<string, string[][]> = {
  "职场成长": [
    ["为什么越努力越没人注意你？", "你做了很多但都不是老板需要的", "痛点型"],
    ["职场混了3年，才明白这5件事", "最容易被忽视的职场隐形规则", "数字型"],
    ["我一个月升职，同事努力3年还原地踏步", "什么决定了升职速度", "案例型"],
    ["停止「表现努力」，开始「展示价值」", "努力≠价值，要让对的人看到你", "反常识型"],
    ["普通员工 vs 高潜人才，同样的事做出了完全不同的结果", "差距在哪里", "对比型"],
    ["开会从不发言的人，凭什么升得最快？", "「沉默者」的隐藏优势", "痛点型"],
    ["让你的工作汇报从60分变90分的3个动作", "汇报是一门技术活", "数字型"],
    ["我用这个方法，让领导主动找我谈晋升", "如何创造向上管理的机会", "案例型"],
    ["别再「等待机会」了，机会是靠设计的", "主动创造可见度的方法", "反常识型"],
    ["同样做PPT，为什么有人做完就被采用，有人改了10遍还不对", "思路的差距", "对比型"],
  ],
  "副业变现": [
    ["为什么你做副业3个月，一分钱没挣到？", "副业失败的根本原因", "痛点型"],
    ["月入1万的副业，通常有这3个共同点", "高变现副业的底层逻辑", "数字型"],
    ["我辞职前用副业替代了主业收入，只用了8个月", "可复制的副业路径", "案例型"],
    ["停止找「好项目」，先解决这个问题", "副业选错方向比没副业更可怕", "反常识型"],
    ["上班族副业 vs 全职博主，谁更容易变现？", "两种路径的真实差距", "对比型"],
    ["没有粉丝也能变现的5种副业模式", "不依赖流量的变现方式", "数字型"],
    ["靠一个技能，我同时运营3个副业", "技能复用的变现矩阵", "案例型"],
    ["越努力做内容，越难变现——为什么？", "变现不是内容质量决定的", "反常识型"],
    ["月收入5000 vs 5万的副业者，时间分配完全不同", "精力管理的关键差异", "对比型"],
    ["你的第一笔副业收入在哪里？这里有个答案", "副业起步最容易的切入点", "痛点型"],
  ],
  "default": [
    ["为什么你做了这么久，还没有突破？", "找到卡住你的真正原因", "痛点型"],
    ["这个领域最容易出结果的3个方向", "少走弯路的核心路径", "数字型"],
    ["我从0到1的真实经历，踩了这些坑", "真实案例带来的启发", "案例型"],
    ["停止做这件事，你会进步更快", "打破低效努力的惯性", "反常识型"],
    ["新手 vs 老手，同样的问题给出了截然不同的答案", "差距究竟在哪里", "对比型"],
    ["你以为在努力，其实在原地踏步？", "识别无效努力的方法", "痛点型"],
    ["5个动作，让你的效率提升200%", "系统化提升核心能力", "数字型"],
    ["一个改变我认知的案例，分享给你", "他人经验的可复制价值", "案例型"],
    ["放弃追求「完美」，你才能真正开始", "完美主义是最大的陷阱", "反常识型"],
    ["同样的时间投入，为什么有人收获10倍结果？", "高效能者的底层思维", "对比型"],
  ],
};

function getTopics(niche: string) {
  const key = Object.keys(TOPIC_DB).find((k) => niche.includes(k.replace("成长", "").replace("变现", ""))) || "default";
  const db = TOPIC_DB[key] || TOPIC_DB["default"];
  return db.map(([title, angle, hookLabel]) => ({
    title,
    angle,
    hook: HOOK_TYPES.find((h) => h.label === hookLabel) || HOOK_TYPES[0],
    stars: Math.floor(Math.random() * 2) + 4,
  }));
}

export default function TopicsPage() {
  const [niche, setNiche] = useState("");
  const [platform, setPlatform] = useState("小红书");
  const [topics, setTopics] = useState<ReturnType<typeof getTopics>>([]);
  const [generated, setGenerated] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  function handleGenerate() {
    setTopics(getTopics(niche));
    setGenerated(true);
  }

  function copyOne(i: number, title: string) {
    navigator.clipboard.writeText(title);
    setCopiedIdx(i);
    setTimeout(() => setCopiedIdx(null), 1500);
  }

  function copyAll() {
    const text = topics.map((t, i) => `${i + 1}. [${t.hook.label}] ${t.title}\n   核心角度：${t.angle}`).join("\n\n");
    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="border-b border-[#b2d8d5] bg-[#f0f9f8]">
        <div className="max-w-5xl mx-auto px-8 py-3 flex items-center gap-2 text-xs text-[#5a7e7c]">
          <Link href="/" className="hover:text-[#0f766e]">首页</Link>
          <span>/</span>
          <Link href="/tools" className="hover:text-[#0f766e]">工具资源</Link>
          <span>/</span>
          <span className="text-[#0d2e2c] font-medium">爆款选题生成器</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-12">
        <div className="mb-10">
          <p className="text-xs text-[#5eada7] font-medium tracking-widest uppercase mb-2">免费工具</p>
          <h1 className="text-3xl font-bold text-[#0d2e2c] mb-3">爆款选题生成器</h1>
          <p className="text-sm text-[#5a7e7c]">输入你的账号方向，生成覆盖5种钩子类型的爆款选题，再也不愁没内容写</p>
        </div>

        {/* Hook 说明 */}
        <div className="grid grid-cols-5 gap-2 mb-8">
          {HOOK_TYPES.map((h) => (
            <div key={h.label} className={`rounded-xl p-3 text-center ${h.color.split(" ")[0]} border border-[#b2d8d5]`}>
              <p className={`text-xs font-bold ${h.color.split(" ")[1]} mb-0.5`}>{h.label}</p>
              <p className="text-[10px] text-[#5a7e7c]">{h.desc}</p>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="bg-[#f0f9f8] border border-[#b2d8d5] rounded-2xl p-8 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-xs font-medium text-[#5eada7] tracking-widest uppercase mb-2">
                账号方向 / 定位 <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && niche.trim() && handleGenerate()}
                placeholder="例如：职场晋升、副业变现、油皮护肤"
                className="w-full border border-[#b2d8d5] rounded-lg px-4 py-3 text-sm text-[#0d2e2c] placeholder-[#5a7e7c]/40 focus:outline-none focus:border-[#0f766e] bg-white"
              />
              <p className="text-[10px] text-[#5a7e7c] mt-1.5">越具体，选题越精准</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#5eada7] tracking-widest uppercase mb-2">目标平台</label>
              <div className="flex flex-wrap gap-2">
                {PLATFORM_OPTIONS.map((p) => (
                  <button
                    key={p}
                    onClick={() => setPlatform(p)}
                    className={`text-xs px-4 py-2 rounded-full border transition-all ${
                      platform === p
                        ? "border-[#0f766e] bg-[#e6f4f3] text-[#0f766e] font-medium"
                        : "border-[#b2d8d5] text-[#5a7e7c] hover:border-[#5eada7]"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleGenerate}
              disabled={!niche.trim()}
              className="bg-[#0d2e2c] text-white px-8 py-3 rounded-lg text-sm font-medium hover:bg-[#0f766e] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              生成选题 ⚡
            </button>
          </div>
        </div>

        {/* Result */}
        {generated && (
          <>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-[#0d2e2c]">爆款选题列表</h2>
                <p className="text-xs text-[#5a7e7c] mt-1">共 {topics.length} 个选题 · 基于「{niche}」方向 · {platform}平台风格</p>
              </div>
              <button
                onClick={copyAll}
                className="text-xs border border-[#b2d8d5] text-[#5a7e7c] px-4 py-2 rounded-lg hover:border-[#0f766e] hover:text-[#0f766e] transition-colors"
              >
                {copiedAll ? "✓ 已复制" : "复制全部"}
              </button>
            </div>

            <div className="space-y-3">
              {topics.map((t, i) => (
                <div
                  key={i}
                  className="group border border-[#b2d8d5] rounded-xl px-5 py-4 hover:border-[#5eada7] hover:shadow-sm transition-all bg-white flex items-start gap-4"
                >
                  <span className="text-xs font-bold text-[#b2d8d5] w-5 shrink-0 mt-0.5">{String(i + 1).padStart(2, "0")}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${t.hook.color}`}>
                        {t.hook.label}
                      </span>
                      <span className="text-[10px] text-[#b2d8d5]">{"★".repeat(t.stars)}{"☆".repeat(5 - t.stars)}</span>
                    </div>
                    <h3 className="text-sm font-bold text-[#0d2e2c] mb-1 leading-snug">{t.title}</h3>
                    <p className="text-[11px] text-[#5a7e7c]">核心角度：{t.angle}</p>
                  </div>
                  <button
                    onClick={() => copyOne(i, t.title)}
                    className="text-[10px] border border-[#b2d8d5] text-[#5a7e7c] px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:border-[#0f766e] hover:text-[#0f766e] shrink-0"
                  >
                    {copiedIdx === i ? "✓" : "复制"}
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-[#0d2e2c] rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-white mb-1">想要更多定制选题？</p>
                <p className="text-xs text-[#99ceca]">加入社群，获取竞品选题拆解 + 爆款结构模板</p>
              </div>
              <Link href="/contact" className="shrink-0 text-xs bg-[#134e4a] border border-[#5eada7] text-white px-5 py-2.5 rounded-lg hover:bg-[#0f766e] transition-colors">
                加入社群
              </Link>
            </div>
          </>
        )}

        {/* AI Prompt */}
        <div className="mt-16 border-t border-[#b2d8d5] pt-14">
          <div className="mb-6">
            <p className="text-xs text-[#5eada7] font-medium tracking-widest uppercase mb-2">进阶方案</p>
            <h2 className="text-xl font-bold text-[#0d2e2c] mb-2">用 AI 生成更精准的爆款选题</h2>
            <p className="text-sm text-[#5a7e7c]">把下方提示词复制到 ChatGPT 或 Claude，填入你的具体情况，即可获得20个高度定制的爆款选题。</p>
          </div>
          <div className="border border-[#b2d8d5] rounded-2xl overflow-hidden">
            <div className="bg-[#f0f9f8] border-b border-[#b2d8d5] px-5 py-3 flex items-center justify-between">
              <span className="text-xs font-medium text-[#0d2e2c]">AI 提示词模板</span>
              <button
                onClick={() => { navigator.clipboard.writeText(AI_PROMPT); setCopiedPrompt(true); setTimeout(() => setCopiedPrompt(false), 2000); }}
                className="text-xs border border-[#b2d8d5] text-[#5a7e7c] px-4 py-1.5 rounded-lg hover:border-[#0f766e] hover:text-[#0f766e] transition-colors"
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
