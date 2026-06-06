"use client";

import { useState } from "react";
import Link from "next/link";

const AI_PROMPT = `你是一位专注于内容创作者视觉品牌设计的专家，请帮我设计一套完整的账号视觉系统。

【我的账号信息】
- 账号方向：[请填写，例如：职场晋升干货]
- 目标受众：[请填写，例如：25-35岁职场人]
- 期望调性：[请填写，例如：专业可信、有温度、简洁高效]
- 目标平台：[请填写，例如：小红书]
- 参考风格（可选）：[请填写，例如：极简主义、ins风、中国风]

【请按以下结构设计视觉系统】

## 一、视觉定位
- 视觉关键词（3个）：
- 色彩情感方向：
- 字体个性定位：

## 二、主色系方案
（提供3套配色方案，每套包含主色+辅色+背景色+文字色）

方案A（主推）：
- 主色：#XXXXXX（含颜色名称和情感联想）
- 辅色：#XXXXXX
- 背景色：#XXXXXX
- 强调色：#XXXXXX

方案B（活力版）：...
方案C（高端版）：...

## 三、字体系统
- 标题字体推荐（中文）：
- 正文字体推荐（中文）：
- 英文辅助字体：
- 字体大小规范（标题/副标题/正文/注释）：

## 四、封面设计规范
- 构图方式（3种布局模板）：
- 文字区域比例：
- 图片/插图使用原则：
- 必须统一的设计元素：

## 五、内容卡片模板规范
- 信息层级设计：
- 品牌元素放置位置：
- 统一标识（水印/logo/签名）：

## 六、平台适配建议
（针对目标平台的具体尺寸、风格建议）`;

const STYLE_OPTIONS = [
  { id: "minimal", label: "极简知性", desc: "大量留白，线条干净，专业感强", colors: ["#1b4332", "#52b788", "#f0faf4", "#f0faf4"] },
  { id: "warm", label: "温暖活力", desc: "暖色调，亲切自然，有生活感", colors: ["#D4651A", "#F5A623", "#FEF9F0", "#FDE8CC"] },
  { id: "cool", label: "冷静专业", desc: "冷蓝灰，现代商务，理性感强", colors: ["#1A2B4A", "#4A7FC1", "#F0F4F9", "#E0EBFF"] },
  { id: "dark", label: "高端暗系", desc: "深色背景，金色点缀，高级奢华", colors: ["#1C1C1C", "#C9A96E", "#2A2A2A", "#F5F0E8"] },
  { id: "playful", label: "趣味插画", desc: "色彩饱和，有个性，年轻活泼", colors: ["#FF5C5C", "#FFB800", "#E8F0FE", "#D4F1C8"] },
  { id: "pastel", label: "马卡龙柔和", desc: "粉嫩低饱和，治愈温柔，女性向", colors: ["#F4A7C3", "#A7C4F4", "#FFF5F8", "#F0F0FF"] },
];

const NICHE_OPTIONS = ["职场成长", "副业变现", "亲子育儿", "护肤美妆", "健身减脂", "个人理财", "读书学习", "生活方式", "旅行探店", "数码科技"];
const PLATFORM_OPTIONS = ["小红书", "抖音", "公众号", "视频号", "B站"];
const TONE_OPTIONS = ["专业权威", "亲切温暖", "简洁高效", "创意活泼", "高端优雅", "接地气真实"];

type VisualForm = {
  style: string;
  niche: string;
  platform: string;
  tone: string;
  nickname: string;
};

const STYLE_SYSTEMS: Record<string, {
  headline: string;
  palette: { name: string; hex: string; role: string }[];
  fonts: { cn: string; en: string; size: string };
  cover: string[];
  tips: string[];
}> = {
  minimal: {
    headline: "极简知性 · 专业沉稳",
    palette: [
      { name: "深绿", hex: "#1b4332", role: "主色·文字·背景块" },
      { name: "清绿", hex: "#52b788", role: "强调色·标签·图标" },
      { name: "奶白", hex: "#f0faf4", role: "页面背景" },
      { name: "浅绿", hex: "#f0faf4", role: "卡片背景·分割区" },
    ],
    fonts: { cn: "思源黑体 / 阿里巴巴普惠体", en: "Inter / DM Sans", size: "标题36px / 副标题24px / 正文16px / 注释12px" },
    cover: ["左文右图：文字占60%，右侧配图或色块", "全文字版：大字标题+小字副标题+底部品牌标识", "上下分割：顶部色块+底部白色区域，文字居中"],
    tips: ["保持大量留白，不要堆砌元素", "文字颜色只用2-3种，保持统一", "每张封面必须有固定的品牌标识位置"],
  },
  warm: {
    headline: "温暖活力 · 生活有感",
    palette: [
      { name: "暖橙", hex: "#D4651A", role: "主色·强调·标题" },
      { name: "金黄", hex: "#F5A623", role: "辅助色·高亮" },
      { name: "米白", hex: "#FEF9F0", role: "页面背景" },
      { name: "浅橙", hex: "#FDE8CC", role: "卡片背景·色块" },
    ],
    fonts: { cn: "方正悠黑 / 字悦圆体", en: "Poppins / Nunito", size: "标题40px / 副标题22px / 正文15px / 注释11px" },
    cover: ["居中构图：大字标题居中，底部辅助信息", "圆角卡片：圆角色块承载文字，配合贴纸元素", "手写感：混合印刷体与手写体，增加亲切感"],
    tips: ["可以使用有温度的实物摄影（食物/手/生活场景）", "字体可以有大小变化，增加节奏感", "适当加入小图标或装饰性线条"],
  },
  cool: {
    headline: "冷静专业 · 理性商务",
    palette: [
      { name: "深蓝", hex: "#1A2B4A", role: "主色·文字·深色背景" },
      { name: "钴蓝", hex: "#4A7FC1", role: "强调色·链接·按钮" },
      { name: "淡蓝灰", hex: "#F0F4F9", role: "页面背景" },
      { name: "浅蓝", hex: "#E0EBFF", role: "卡片背景·数据区" },
    ],
    fonts: { cn: "思源黑体 Bold / 苹方", en: "IBM Plex Sans / Space Grotesk", size: "标题38px / 副标题22px / 正文16px / 注释12px" },
    cover: ["数据化：突出数字和关键词，图表感", "网格布局：规整的方格分布，信息感强", "双色分割：左深右浅，专业对比"],
    tips: ["数字要大、要粗，是视觉重心", "可以加入图表/折线等商务元素", "英文辅助文字增加国际感"],
  },
  dark: {
    headline: "高端暗系 · 精英质感",
    palette: [
      { name: "炭黑", hex: "#1C1C1C", role: "主背景·深色区" },
      { name: "金色", hex: "#C9A96E", role: "强调色·标题·装饰" },
      { name: "深灰", hex: "#2A2A2A", role: "卡片背景·次要区域" },
      { name: "奶金", hex: "#F5F0E8", role: "浅色文字·高光" },
    ],
    fonts: { cn: "思源宋体 / 方正标雅宋", en: "Cormorant Garamond / Playfair Display", size: "标题42px / 副标题20px / 正文15px / 注释11px" },
    cover: ["暗金对比：深色底+金色标题，奢华感", "居中留白：极简构图，突出一句核心话", "纹理背景：深色纸纹/金属感背景，提升质感"],
    tips: ["文字排版比图片更重要，字间距要加大", "金色元素不要过多，点缀即可", "整体氛围感>信息密度"],
  },
  playful: {
    headline: "趣味活泼 · 年轻有态度",
    palette: [
      { name: "活力红", hex: "#FF5C5C", role: "主色·强调·热点标记" },
      { name: "明黄", hex: "#FFB800", role: "辅色·高亮·互动元素" },
      { name: "浅蓝", hex: "#E8F0FE", role: "背景·对比色区域" },
      { name: "草绿", hex: "#D4F1C8", role: "点缀·标签·图标区" },
    ],
    fonts: { cn: "阿里妈妈刀隶体 / 方正喵喵体", en: "Fredoka One / Baloo 2", size: "标题44px / 副标题20px / 正文15px / 注释11px" },
    cover: ["贴纸风：大量手绘贴纸元素装饰", "打破边界：文字溢出框架，突破常规", "多色彩叠加：3色以上对比，视觉冲击"],
    tips: ["可以打破对称，不规则布局更有个性", "加入手写批注、箭头、圆圈等互动元素", "emoji和表情可以融入设计"],
  },
  pastel: {
    headline: "柔和马卡龙 · 治愈少女",
    palette: [
      { name: "樱花粉", hex: "#F4A7C3", role: "主色·标题·装饰" },
      { name: "天蓝", hex: "#A7C4F4", role: "辅色·背景块·阴影" },
      { name: "奶白粉", hex: "#FFF5F8", role: "页面主背景" },
      { name: "薰衣紫", hex: "#F0F0FF", role: "卡片背景·点缀区" },
    ],
    fonts: { cn: "字悦圆体 / 汉仪旗黑", en: "Quicksand / Comfortaa", size: "标题36px / 副标题20px / 正文14px / 注释11px" },
    cover: ["花边框架：粉色细线边框+圆角装饰", "插画风：配合可爱插画元素", "渐变柔和：粉紫渐变背景，梦幻感"],
    tips: ["可以使用花朵、蝴蝶结等装饰元素", "文字要圆润，不要有棱角感", "照片滤镜统一偏粉调，提高饱和柔和度"],
  },
};

export default function VisualPage() {
  const [form, setForm] = useState<VisualForm>({ style: "", niche: "", platform: "", tone: "", nickname: "" });
  const [result, setResult] = useState<(typeof STYLE_SYSTEMS)[string] & { style: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const canGenerate = form.style && form.niche;

  function handleGenerate() {
    const sys = STYLE_SYSTEMS[form.style];
    if (sys) setResult({ ...sys, style: form.style });
  }

  function copyResult() {
    if (!result) return;
    const text = `视觉系统设计规范

【风格定位】${result.headline}

【主色系】
${result.palette.map((p) => `${p.name} ${p.hex} — ${p.role}`).join("\n")}

【字体系统】
中文：${result.fonts.cn}
英文：${result.fonts.en}
字号规范：${result.fonts.size}

【封面设计方案】
${result.cover.map((c, i) => `方案${i + 1}：${c}`).join("\n")}

【设计原则】
${result.tips.map((t, i) => `${i + 1}. ${t}`).join("\n")}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="bg-black min-h-screen">
      <div className="border-b border-[#1f1f1f] bg-[#0a0a0a]">
        <div className="max-w-5xl mx-auto px-8 py-3 flex items-center gap-2 text-xs text-[#888888]">
          <Link href="/" className="hover:text-[#a0a0a0]">首页</Link>
          <span>/</span>
          <Link href="/tools" className="hover:text-[#a0a0a0]">工具资源</Link>
          <span>/</span>
          <span className="text-white font-medium">视觉系统设计模板</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-12">
        <div className="mb-10">
          <p className="text-xs text-[#888888] font-medium tracking-widest uppercase mb-2">免费工具</p>
          <h1 className="text-3xl font-bold text-white mb-3">视觉系统设计模板</h1>
          <p className="text-sm text-[#888888]">选择你的账号风格，生成配色方案 + 字体规范 + 封面设计指南，建立统一的视觉识别系统</p>
        </div>

        {/* Form */}
        <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-none p-8 mb-10 space-y-7">
          {/* 风格选择 */}
          <div>
            <label className="block text-xs font-medium text-[#888888] tracking-widest uppercase mb-3">
              账号视觉风格 <span className="text-rose-400">*</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {STYLE_OPTIONS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setForm(f => ({ ...f, style: s.id }))}
                  className={`border rounded-none p-4 text-left transition-all ${form.style === s.id ? "border-[#333333] bg-black shadow-sm" : "border-[#1f1f1f] hover:border-[#333333] bg-black"}`}
                >
                  <div className="flex gap-1.5 mb-2">
                    {s.colors.map((c) => (
                      <div key={c} className="w-5 h-5 rounded-sm border border-white/50 shadow-sm" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                  <p className={`text-xs font-bold mb-0.5 ${form.style === s.id ? "text-[#a0a0a0]" : "text-white"}`}>{s.label}</p>
                  <p className="text-[10px] text-[#888888] leading-snug">{s.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* 账号方向 + 平台 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-medium text-[#888888] tracking-widest uppercase mb-3">
                账号方向 <span className="text-rose-400">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {NICHE_OPTIONS.map((n) => (
                  <button key={n} onClick={() => setForm(f => ({ ...f, niche: n }))}
                    className={`text-xs px-3 py-1.5 rounded-sm border transition-all ${form.niche === n ? "border-[#333333] bg-[#0a0a0a] text-[#a0a0a0] font-medium" : "border-[#1f1f1f] text-[#888888] hover:border-[#333333]"}`}>
                    {n}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#888888] tracking-widest uppercase mb-3">目标平台</label>
              <div className="flex flex-wrap gap-2">
                {PLATFORM_OPTIONS.map((p) => (
                  <button key={p} onClick={() => setForm(f => ({ ...f, platform: p }))}
                    className={`text-xs px-4 py-2 rounded-sm border transition-all ${form.platform === p ? "border-[#333333] bg-[#0a0a0a] text-[#a0a0a0] font-medium" : "border-[#1f1f1f] text-[#888888] hover:border-[#333333]"}`}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 内容调性 + 账号名 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-medium text-[#888888] tracking-widest uppercase mb-3">内容调性</label>
              <div className="flex flex-wrap gap-2">
                {TONE_OPTIONS.map((t) => (
                  <button key={t} onClick={() => setForm(f => ({ ...f, tone: t }))}
                    className={`text-xs px-3 py-1.5 rounded-sm border transition-all ${form.tone === t ? "border-[#333333] bg-[#0a0a0a] text-[#a0a0a0] font-medium" : "border-[#1f1f1f] text-[#888888] hover:border-[#333333]"}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#888888] tracking-widest uppercase mb-2">账号名/品牌名（可选）</label>
              <input
                type="text"
                value={form.nickname}
                onChange={(e) => setForm(f => ({ ...f, nickname: e.target.value }))}
                placeholder="例如：阿黑的职场笔记"
                className="w-full border border-[#1f1f1f] rounded-none px-4 py-2.5 text-sm text-white placeholder-[#333333] focus:outline-none focus:border-[#333333] bg-black"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleGenerate}
              disabled={!canGenerate}
              className="bg-[#0a0a0a] text-white px-8 py-3 rounded-none text-sm font-medium hover:bg-[#111111] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              生成视觉系统 →
            </button>
          </div>
        </div>

        {/* Result */}
        {result && (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-white">你的视觉系统规范</h2>
                <p className="text-xs text-[#888888] mt-1">{result.headline}</p>
              </div>
              <button onClick={copyResult}
                className="text-xs border border-[#1f1f1f] text-[#888888] px-4 py-2 rounded-none hover:border-[#333333] hover:text-[#a0a0a0] transition-colors">
                {copied ? "✓ 已复制" : "复制规范"}
              </button>
            </div>

            <div className="space-y-4">
              {/* 配色方案 */}
              <div className="border border-[#1f1f1f] rounded-none p-5">
                <p className="text-xs text-[#888888] font-medium tracking-widest uppercase mb-4">主色系方案</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {result.palette.map((p) => (
                    <div key={p.hex}>
                      <div
                        className="h-14 rounded-none mb-2 border border-black/5"
                        style={{ backgroundColor: p.hex }}
                      />
                      <p className="text-xs font-bold text-white">{p.name}</p>
                      <p className="text-[10px] text-[#888888] font-mono">{p.hex}</p>
                      <p className="text-[10px] text-[#888888] leading-snug mt-0.5">{p.role}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 模拟封面预览 */}
              <div className="border border-[#1f1f1f] rounded-none p-5">
                <p className="text-xs text-[#888888] font-medium tracking-widest uppercase mb-4">封面效果预览</p>
                <div className="grid grid-cols-3 gap-3">
                  {result.cover.map((template, i) => {
                    const mainColor = result.palette[0].hex;
                    const accentColor = result.palette[1].hex;
                    const bgColor = result.palette[2].hex;
                    return (
                      <div key={i} className="aspect-[3/4] rounded-none overflow-hidden border border-[#1f1f1f] relative flex flex-col" style={{ backgroundColor: bgColor }}>
                        {i === 0 && (
                          <>
                            <div className="flex-1 flex">
                              <div className="w-3/5 p-3 flex flex-col justify-center">
                                <div className="h-2 rounded mb-1.5" style={{ backgroundColor: mainColor, width: "80%" }} />
                                <div className="h-1.5 rounded mb-1" style={{ backgroundColor: mainColor, width: "90%", opacity: 0.7 }} />
                                <div className="h-1.5 rounded" style={{ backgroundColor: mainColor, width: "60%", opacity: 0.5 }} />
                              </div>
                              <div className="w-2/5" style={{ backgroundColor: accentColor, opacity: 0.3 }} />
                            </div>
                            <div className="h-6 flex items-center px-3" style={{ backgroundColor: mainColor }}>
                              <div className="h-1 rounded" style={{ backgroundColor: bgColor, width: "40%" }} />
                            </div>
                          </>
                        )}
                        {i === 1 && (
                          <div className="flex-1 flex flex-col items-center justify-center p-4">
                            <div className="h-2 rounded mb-2 w-3/4" style={{ backgroundColor: mainColor }} />
                            <div className="h-1.5 rounded mb-1 w-full" style={{ backgroundColor: mainColor, opacity: 0.6 }} />
                            <div className="h-1.5 rounded w-4/5" style={{ backgroundColor: mainColor, opacity: 0.4 }} />
                            <div className="mt-4 px-4 py-1.5 rounded-sm" style={{ backgroundColor: accentColor }}>
                              <div className="h-1 w-8 rounded" style={{ backgroundColor: bgColor }} />
                            </div>
                          </div>
                        )}
                        {i === 2 && (
                          <>
                            <div className="h-2/5 flex items-center justify-center" style={{ backgroundColor: mainColor }}>
                              <div className="h-2 rounded w-3/5" style={{ backgroundColor: bgColor }} />
                            </div>
                            <div className="flex-1 flex flex-col justify-center p-3">
                              <div className="h-1.5 rounded mb-1.5 w-full" style={{ backgroundColor: mainColor, opacity: 0.5 }} />
                              <div className="h-1.5 rounded mb-1.5 w-4/5" style={{ backgroundColor: mainColor, opacity: 0.4 }} />
                              <div className="h-1.5 rounded w-3/5" style={{ backgroundColor: mainColor, opacity: 0.3 }} />
                            </div>
                          </>
                        )}
                        <div className="absolute bottom-1 right-2 text-[8px] opacity-40" style={{ color: mainColor }}>方案{i + 1}</div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-3 space-y-1.5">
                  {result.cover.map((c, i) => (
                    <p key={i} className="text-[11px] text-[#888888]">
                      <span className="font-medium text-white">方案{i + 1}：</span>{c}
                    </p>
                  ))}
                </div>
              </div>

              {/* 字体系统 */}
              <div className="border border-[#1f1f1f] rounded-none p-5">
                <p className="text-xs text-[#888888] font-medium tracking-widest uppercase mb-4">字体系统</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-[10px] text-[#888888] font-medium mb-1">中文字体</p>
                    <p className="text-xs text-white font-medium">{result.fonts.cn}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#888888] font-medium mb-1">英文辅助字体</p>
                    <p className="text-xs text-white font-medium">{result.fonts.en}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#888888] font-medium mb-1">字号规范</p>
                    <p className="text-xs text-[#4b5563] leading-relaxed">{result.fonts.size}</p>
                  </div>
                </div>
              </div>

              {/* 设计原则 */}
              <div className="border border-[#1f1f1f] rounded-none p-5">
                <p className="text-xs text-[#888888] font-medium tracking-widest uppercase mb-4">视觉设计原则</p>
                <div className="space-y-2.5">
                  {result.tips.map((tip, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="text-xs font-bold text-[#888888] shrink-0 w-5">{String(i + 1).padStart(2, "0")}</span>
                      <p className="text-xs text-[#4b5563] leading-relaxed">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 bg-[#0a0a0a] rounded-none p-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-white mb-1">想要Canva封面模板？</p>
                <p className="text-xs text-[#a0a0a0]">加入社群，获取4套可直接编辑的封面模板 + 视觉规范完整文档</p>
              </div>
              <Link href="/contact" className="shrink-0 text-xs bg-white border border-[#333333] text-white px-5 py-2.5 rounded-none hover:bg-[#111111] transition-colors">
                获取模板
              </Link>
            </div>
          </>
        )}

        {/* AI Prompt */}
        <div className="mt-16 border-t border-[#1f1f1f] pt-14">
          <div className="mb-6">
            <p className="text-xs text-[#888888] font-medium tracking-widest uppercase mb-2">进阶方案</p>
            <h2 className="text-xl font-bold text-white mb-2">用 AI 设计更专业的视觉系统</h2>
            <p className="text-sm text-[#888888]">把下方提示词复制到 ChatGPT 或 Claude，详细描述你的账号定位，获得完整定制的视觉系统设计方案。</p>
          </div>
          <div className="border border-[#1f1f1f] rounded-none overflow-hidden">
            <div className="bg-[#0a0a0a] border-b border-[#1f1f1f] px-5 py-3 flex items-center justify-between">
              <span className="text-xs font-medium text-white">AI 提示词模板</span>
              <button
                onClick={() => { navigator.clipboard.writeText(AI_PROMPT); setCopiedPrompt(true); setTimeout(() => setCopiedPrompt(false), 2000); }}
                className="text-xs border border-[#1f1f1f] text-[#888888] px-4 py-1.5 rounded-none hover:border-[#333333] hover:text-[#a0a0a0] transition-colors"
              >
                {copiedPrompt ? "✓ 已复制" : "复制提示词"}
              </button>
            </div>
            <div className="bg-black px-6 py-5">
              <pre className="text-[11px] text-[#4b5563] leading-relaxed whitespace-pre-wrap font-mono">{AI_PROMPT}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
