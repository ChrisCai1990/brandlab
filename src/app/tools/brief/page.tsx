"use client";

import { useState } from "react";
import Link from "next/link";

const AI_PROMPT = `你是一位专业的个人品牌策划顾问，请帮我生成一份完整的账号定位Brief。

【我的基本信息】
- 我的职业/背景：[请填写，例如：5年产品经理、自由插画师、宝妈]
- 账号方向/领域：[请填写，例如：职场晋升、亲子育儿、数字游民]
- 目标平台：[请填写，例如：小红书 / 抖音 / 公众号]
- 目标受众：[请填写，例如：24-32岁职场女性、想副业的上班族]
- 我能提供的核心价值：[请填写，例如：实操经验、资源链接、情绪共鸣]
- 我的差异化优势：[请填写，例如：真实踩坑经历、小而美的垂直领域]
- 变现目标：[请填写，例如：接广告、卖课、知识付费]

【请按以下结构输出Brief】

## 一、账号定位一句话
（用一句话概括：我是谁 + 帮谁 + 解决什么问题）

## 二、目标受众画像
- 核心受众：
- 人群痛点：
- 触发场景：

## 三、内容方向与策略
- 核心主题（3-5个）：
- 内容比例建议：
- 钩子关键词：

## 四、差异化标签
- 人设标签（3个）：
- 内容调性：
- 风格关键词：

## 五、变现路径规划
- 短期变现（0-3个月）：
- 中期变现（3-12个月）：
- 长期品牌价值：

## 六、30天行动计划
（给出具体可执行的前30天重点任务）`;

const NICHE_OPTIONS = [
  "职场成长", "副业变现", "亲子育儿", "护肤美妆",
  "健身减脂", "个人理财", "设计创作", "读书学习",
  "旅行生活", "美食探店", "科技数码", "情感关系",
];

const PLATFORM_OPTIONS = ["小红书", "抖音", "公众号", "视频号", "B站", "多平台"];

const MONETIZE_OPTIONS = ["接广告投放", "知识付费/卖课", "带货佣金", "私域社群", "品牌合作", "咨询服务"];

type Brief = {
  niche: string;
  background: string;
  platform: string;
  audience: string;
  value: string;
  diff: string;
  monetize: string;
};

function generateBrief(form: Brief) {
  const nicheMap: Record<string, { pain: string; trigger: string; keywords: string[] }> = {
    "职场成长": { pain: "职场晋升慢、人际关系复杂、跳槽迷茫", trigger: "年终考核失望、同龄人晋升、工作遇到瓶颈", keywords: ["职场干货", "升职加薪", "职业规划"] },
    "副业变现": { pain: "工资不够花、想要财务自由、不知如何起步", trigger: "看到别人副业成功、主业压力大、想多一份收入", keywords: ["副业", "变现", "被动收入"] },
    "亲子育儿": { pain: "育儿焦虑、孩子教育问题、亲子关系紧张", trigger: "孩子出现行为问题、开学季、假期相处困难", keywords: ["育儿干货", "科学养娃", "家庭教育"] },
    "护肤美妆": { pain: "皮肤问题不知如何解决、踩雷产品太多、不会化妆", trigger: "换季皮肤变差、看到他人好皮肤、想提升颜值", keywords: ["护肤干货", "成分党", "平价好物"] },
  };

  const platformTip: Record<string, string> = {
    "小红书": "图文为主，封面颜值高、标题带痛点钩子，互动率优先",
    "抖音": "短视频为主，前3秒抓眼球，完播率和点赞是核心指标",
    "公众号": "长文深度为主，打开率和分享率是关键，适合知识付费转化",
    "视频号": "微信生态内传播，适合私域联动，中老年用户比例高",
    "B站": "中长视频，用户黏性强，UP主人设重要，适合深度内容",
    "多平台": "内容矩阵打法，核心平台深耕，次要平台同步分发",
  };

  const data = nicheMap[form.niche] || {
    pain: "行业痛点、效率提升需求、专业知识壁垒",
    trigger: "遇到具体问题时、对比看到差距时、想要改变现状时",
    keywords: [form.niche, "干货", "实操经验"],
  };

  return {
    oneliner: `专注${form.niche}领域，帮助${form.audience || "目标受众"}${form.value || "解决核心问题"}，用${form.background || "亲身经历"}带来真实可复制的方法论`,
    audience: {
      core: form.audience || `对${form.niche}感兴趣的人群`,
      pain: data.pain,
      trigger: data.trigger,
    },
    content: {
      themes: data.keywords.concat([`${form.niche}避坑`, `${form.niche}案例拆解`]).slice(0, 5),
      ratio: "干货内容 60% · 个人故事 20% · 互动话题 20%",
      platformTip: platformTip[form.platform] || "根据平台特性调整内容形式",
    },
    tags: {
      persona: [`${form.background || form.niche}实践者`, `${form.niche}领域分享者`, "普通人逆袭"],
      tone: "真实、接地气、有温度",
      style: "干货实操 + 真实故事 + 数据支撑",
    },
    monetize: {
      short: form.monetize === "接广告投放" ? "打造账号基础数据，达到品牌合作门槛（粉丝1000+，互动率>3%）"
        : form.monetize === "知识付费/卖课" ? "积累真实案例，打磨一个小而美的付费产品（9.9-99元低客单价切入）"
        : form.monetize === "带货佣金" ? "搭建选品体系，从小样测评开始积累带货口碑"
        : "建立私域流量池，启动小范围社群验证变现模型",
      mid: "形成稳定内容体系 + 变现漏斗，月均收入破万",
      long: `成为${form.niche}领域有辨识度的个人IP，实现品牌价值复利增长`,
    },
  };
}

export default function BriefPage() {
  const [form, setForm] = useState<Brief>({
    niche: "", background: "", platform: "", audience: "", value: "", diff: "", monetize: "",
  });
  const [result, setResult] = useState<ReturnType<typeof generateBrief> | null>(null);
  const [copied, setCopied] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  function handleGenerate() {
    setResult(generateBrief(form));
  }

  const canGenerate = form.niche && form.platform;

  function copyBrief() {
    if (!result) return;
    const text = `账号定位Brief

【一句话定位】
${result.oneliner}

【目标受众】
核心受众：${result.audience.core}
人群痛点：${result.audience.pain}
触发场景：${result.audience.trigger}

【内容方向】
核心主题：${result.content.themes.join(" · ")}
内容比例：${result.content.ratio}
平台策略：${result.content.platformTip}

【差异化标签】
人设标签：${result.tags.persona.join(" / ")}
内容调性：${result.tags.tone}
风格定位：${result.tags.style}

【变现路径】
短期（0-3个月）：${result.monetize.short}
中期（3-12个月）：${result.monetize.mid}
长期品牌价值：${result.monetize.long}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="border-b border-[#b2d8d5] bg-[#f0f9f8]">
        <div className="max-w-5xl mx-auto px-8 py-3 flex items-center gap-2 text-xs text-[#5a7e7c]">
          <Link href="/" className="hover:text-[#0f766e] transition-colors">首页</Link>
          <span>/</span>
          <Link href="/tools" className="hover:text-[#0f766e] transition-colors">工具资源</Link>
          <span>/</span>
          <span className="text-[#0d2e2c] font-medium">账号定位Brief生成器</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-12">
        <div className="mb-10">
          <p className="text-xs text-[#5eada7] font-medium tracking-widest uppercase mb-2">免费工具</p>
          <h1 className="text-3xl font-bold text-[#0d2e2c] mb-3">账号定位Brief生成器</h1>
          <p className="text-sm text-[#5a7e7c]">填写基本信息，生成一份完整的账号定位文档，清晰再出发</p>
        </div>

        {/* Input Form */}
        <div className="bg-[#f0f9f8] border border-[#b2d8d5] rounded-2xl p-8 mb-10 space-y-7">
          {/* 账号方向 */}
          <div>
            <label className="block text-xs font-medium text-[#5eada7] tracking-widest uppercase mb-3">
              账号方向 <span className="text-rose-400">*</span>
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {NICHE_OPTIONS.map((n) => (
                <button
                  key={n}
                  onClick={() => setForm(f => ({ ...f, niche: n }))}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                    form.niche === n
                      ? "border-[#0f766e] bg-[#e6f4f3] text-[#0f766e] font-medium"
                      : "border-[#b2d8d5] text-[#5a7e7c] hover:border-[#5eada7]"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={NICHE_OPTIONS.includes(form.niche) ? "" : form.niche}
              onChange={(e) => setForm(f => ({ ...f, niche: e.target.value }))}
              placeholder="或自定义输入，例如：智能硬件测评"
              className="w-full border border-[#b2d8d5] rounded-lg px-4 py-2.5 text-sm text-[#0d2e2c] placeholder-[#5a7e7c]/40 focus:outline-none focus:border-[#0f766e] bg-white"
            />
          </div>

          {/* 目标平台 */}
          <div>
            <label className="block text-xs font-medium text-[#5eada7] tracking-widest uppercase mb-3">
              目标平台 <span className="text-rose-400">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {PLATFORM_OPTIONS.map((p) => (
                <button
                  key={p}
                  onClick={() => setForm(f => ({ ...f, platform: p }))}
                  className={`text-xs px-4 py-2 rounded-full border transition-all ${
                    form.platform === p
                      ? "border-[#0f766e] bg-[#e6f4f3] text-[#0f766e] font-medium"
                      : "border-[#b2d8d5] text-[#5a7e7c] hover:border-[#5eada7]"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* 两列：背景 + 受众 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-medium text-[#5eada7] tracking-widest uppercase mb-2">
                你的职业/背景
              </label>
              <input
                type="text"
                value={form.background}
                onChange={(e) => setForm(f => ({ ...f, background: e.target.value }))}
                placeholder="例如：5年产品经理、自由设计师"
                className="w-full border border-[#b2d8d5] rounded-lg px-4 py-2.5 text-sm text-[#0d2e2c] placeholder-[#5a7e7c]/40 focus:outline-none focus:border-[#0f766e] bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#5eada7] tracking-widest uppercase mb-2">
                目标受众
              </label>
              <input
                type="text"
                value={form.audience}
                onChange={(e) => setForm(f => ({ ...f, audience: e.target.value }))}
                placeholder="例如：25-35岁想晋升的职场人"
                className="w-full border border-[#b2d8d5] rounded-lg px-4 py-2.5 text-sm text-[#0d2e2c] placeholder-[#5a7e7c]/40 focus:outline-none focus:border-[#0f766e] bg-white"
              />
            </div>
          </div>

          {/* 变现目标 */}
          <div>
            <label className="block text-xs font-medium text-[#5eada7] tracking-widest uppercase mb-3">
              变现目标
            </label>
            <div className="flex flex-wrap gap-2">
              {MONETIZE_OPTIONS.map((m) => (
                <button
                  key={m}
                  onClick={() => setForm(f => ({ ...f, monetize: m }))}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                    form.monetize === m
                      ? "border-[#0f766e] bg-[#e6f4f3] text-[#0f766e] font-medium"
                      : "border-[#b2d8d5] text-[#5a7e7c] hover:border-[#5eada7]"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleGenerate}
              disabled={!canGenerate}
              className="bg-[#0d2e2c] text-white px-8 py-3 rounded-lg text-sm font-medium hover:bg-[#0f766e] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              生成Brief →
            </button>
          </div>
        </div>

        {/* Result */}
        {result && (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-[#0d2e2c]">你的账号定位Brief</h2>
                <p className="text-xs text-[#5a7e7c] mt-1">基于「{form.niche}」方向 · {form.platform}平台</p>
              </div>
              <button
                onClick={copyBrief}
                className="text-xs border border-[#b2d8d5] text-[#5a7e7c] px-4 py-2 rounded-lg hover:border-[#0f766e] hover:text-[#0f766e] transition-colors"
              >
                {copied ? "✓ 已复制" : "复制全部"}
              </button>
            </div>

            <div className="space-y-4">
              {/* 一句话定位 */}
              <div className="bg-[#0d2e2c] rounded-xl p-6">
                <p className="text-xs text-[#5eada7] font-medium tracking-widest uppercase mb-2">一句话定位</p>
                <p className="text-sm text-white leading-relaxed font-medium">{result.oneliner}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 目标受众 */}
                <div className="border border-[#b2d8d5] rounded-xl p-5">
                  <p className="text-xs text-[#5eada7] font-medium tracking-widest uppercase mb-4">目标受众画像</p>
                  <div className="space-y-3">
                    {[
                      { label: "核心受众", value: result.audience.core },
                      { label: "人群痛点", value: result.audience.pain },
                      { label: "触发场景", value: result.audience.trigger },
                    ].map((row) => (
                      <div key={row.label}>
                        <p className="text-[10px] text-[#5eada7] font-medium mb-0.5">{row.label}</p>
                        <p className="text-xs text-[#3D5048] leading-relaxed">{row.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 差异化标签 */}
                <div className="border border-[#b2d8d5] rounded-xl p-5">
                  <p className="text-xs text-[#5eada7] font-medium tracking-widest uppercase mb-4">差异化标签</p>
                  <div className="space-y-3">
                    <div>
                      <p className="text-[10px] text-[#5eada7] font-medium mb-1.5">人设标签</p>
                      <div className="flex flex-wrap gap-1.5">
                        {result.tags.persona.map((tag) => (
                          <span key={tag} className="text-[10px] bg-[#e6f4f3] text-[#0f766e] px-2.5 py-1 rounded-full font-medium">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] text-[#5eada7] font-medium mb-0.5">内容调性</p>
                      <p className="text-xs text-[#3D5048]">{result.tags.tone}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-[#5eada7] font-medium mb-0.5">风格定位</p>
                      <p className="text-xs text-[#3D5048]">{result.tags.style}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 内容方向 */}
              <div className="border border-[#b2d8d5] rounded-xl p-5">
                <p className="text-xs text-[#5eada7] font-medium tracking-widest uppercase mb-4">内容方向与策略</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-[10px] text-[#5eada7] font-medium mb-2">核心主题</p>
                    <div className="flex flex-col gap-1.5">
                      {result.content.themes.map((t, i) => (
                        <div key={t} className="flex items-center gap-2">
                          <span className="text-[10px] text-[#5eada7] font-bold w-3">{i + 1}</span>
                          <span className="text-xs text-[#3D5048]">{t}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#5eada7] font-medium mb-2">内容比例建议</p>
                    <p className="text-xs text-[#3D5048] leading-relaxed">{result.content.ratio}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#5eada7] font-medium mb-2">{form.platform}平台策略</p>
                    <p className="text-xs text-[#3D5048] leading-relaxed">{result.content.platformTip}</p>
                  </div>
                </div>
              </div>

              {/* 变现路径 */}
              <div className="border border-[#b2d8d5] rounded-xl p-5">
                <p className="text-xs text-[#5eada7] font-medium tracking-widest uppercase mb-4">变现路径规划</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { phase: "短期 0-3个月", value: result.monetize.short, color: "text-[#0f766e] bg-[#e6f4f3]" },
                    { phase: "中期 3-12个月", value: result.monetize.mid, color: "text-blue-600 bg-blue-50" },
                    { phase: "长期品牌价值", value: result.monetize.long, color: "text-violet-600 bg-violet-50" },
                  ].map((p) => (
                    <div key={p.phase}>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${p.color} inline-block mb-2`}>
                        {p.phase}
                      </span>
                      <p className="text-xs text-[#3D5048] leading-relaxed">{p.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 bg-[#0d2e2c] rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-white mb-1">想要更深度的定位诊断？</p>
                <p className="text-xs text-[#99ceca]">加入社群，获取完整版Notion模板 + 1对1定位梳理机会</p>
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
            <h2 className="text-xl font-bold text-[#0d2e2c] mb-2">用 AI 生成更完整的Brief</h2>
            <p className="text-sm text-[#5a7e7c]">把下方提示词复制到 ChatGPT 或 Claude，填入你的真实情况，获得深度定制的完整账号Brief。</p>
          </div>
          <div className="border border-[#b2d8d5] rounded-2xl overflow-hidden">
            <div className="bg-[#f0f9f8] border-b border-[#b2d8d5] px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-[#0d2e2c]">AI 提示词模板</span>
                <span className="text-[10px] text-[#5eada7] bg-[#e6f4f3] px-2 py-0.5 rounded-full">可直接使用</span>
              </div>
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
