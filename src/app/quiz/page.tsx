"use client";

import { useState } from "react";
import Link from "next/link";

type TypeKey = "A" | "B" | "C" | "D" | "E";

const questions = [
  {
    q: "你最容易产出的内容类型？",
    options: [
      { key: "A" as TypeKey, text: "知识讲解/教程" },
      { key: "B" as TypeKey, text: "实操步骤/方法论" },
      { key: "C" as TypeKey, text: "故事分享/个人经历" },
      { key: "D" as TypeKey, text: "生活记录/美好瞬间" },
      { key: "E" as TypeKey, text: "趋势观察/深度分析" },
    ],
  },
  {
    q: "你的粉丝最常对你说？",
    options: [
      { key: "A" as TypeKey, text: "\"学到了！\"" },
      { key: "B" as TypeKey, text: "\"太实用了！\"" },
      { key: "C" as TypeKey, text: "\"好有共鸣！\"" },
      { key: "D" as TypeKey, text: "\"好精致！\"" },
      { key: "E" as TypeKey, text: "\"没想到！\"" },
    ],
  },
  {
    q: "你做内容的核心驱动力？",
    options: [
      { key: "A" as TypeKey, text: "分享知识" },
      { key: "B" as TypeKey, text: "帮人解决问题" },
      { key: "C" as TypeKey, text: "表达自我" },
      { key: "D" as TypeKey, text: "展示生活" },
      { key: "E" as TypeKey, text: "洞察趋势" },
    ],
  },
  {
    q: "你最擅长的表达方式？",
    options: [
      { key: "A" as TypeKey, text: "系统讲解" },
      { key: "B" as TypeKey, text: "步骤拆解" },
      { key: "C" as TypeKey, text: "故事叙述" },
      { key: "D" as TypeKey, text: "视觉呈现" },
      { key: "E" as TypeKey, text: "观点输出" },
    ],
  },
  {
    q: "遇到热点事件，你第一反应是？",
    options: [
      { key: "A" as TypeKey, text: "找背后知识点" },
      { key: "B" as TypeKey, text: "想实操方案" },
      { key: "C" as TypeKey, text: "联想个人经历" },
      { key: "D" as TypeKey, text: "找美学角度" },
      { key: "E" as TypeKey, text: "分析趋势走向" },
    ],
  },
  {
    q: "你理想中的变现方式？",
    options: [
      { key: "A" as TypeKey, text: "课程/咨询" },
      { key: "B" as TypeKey, text: "工具/模板" },
      { key: "C" as TypeKey, text: "社群/陪伴" },
      { key: "D" as TypeKey, text: "带货/合作" },
      { key: "E" as TypeKey, text: "演讲/顾问" },
    ],
  },
  {
    q: "你更喜欢哪类内容风格？",
    options: [
      { key: "A" as TypeKey, text: "深度长文" },
      { key: "B" as TypeKey, text: "图文教程" },
      { key: "C" as TypeKey, text: "真实vlog" },
      { key: "D" as TypeKey, text: "精美图集" },
      { key: "E" as TypeKey, text: "观点短评" },
    ],
  },
  {
    q: "你希望粉丝如何记住你？",
    options: [
      { key: "A" as TypeKey, text: "某领域专家" },
      { key: "B" as TypeKey, text: "最实用的博主" },
      { key: "C" as TypeKey, text: "最真实的人" },
      { key: "D" as TypeKey, text: "最美的账号" },
      { key: "E" as TypeKey, text: "最有见地的人" },
    ],
  },
  {
    q: "你最大的创作优势是？",
    options: [
      { key: "A" as TypeKey, text: "知识储备深" },
      { key: "B" as TypeKey, text: "执行力强" },
      { key: "C" as TypeKey, text: "故事感强" },
      { key: "D" as TypeKey, text: "审美好" },
      { key: "E" as TypeKey, text: "思维敏锐" },
    ],
  },
  {
    q: "你的长期目标？",
    options: [
      { key: "A" as TypeKey, text: "成为行业KOL" },
      { key: "B" as TypeKey, text: "打造工具/产品" },
      { key: "C" as TypeKey, text: "建立私域社群" },
      { key: "D" as TypeKey, text: "成为生活方式品牌" },
      { key: "E" as TypeKey, text: "成为意见领袖" },
    ],
  },
];

const results: Record<TypeKey, {
  name: string;
  emoji: string;
  desc: string;
  badges: string[];
  directions: string[];
  category: string;
  modules: string[];
}> = {
  A: {
    name: "知识导师型",
    emoji: "🎓",
    desc: "你是创作者中的老师，知识深度是你最大的护城河",
    badges: ["深度内容", "专业背书", "知识变现"],
    directions: [
      "打造系统课程或知识专栏，建立完整知识体系",
      "用「深度科普」格式拆解复杂概念，降低受众学习门槛",
      "通过答疑互动积累信任，逐步转化为付费用户",
    ],
    category: "个人定位",
    modules: ["个人定位", "内容运营"],
  },
  B: {
    name: "实战派型",
    emoji: "⚡",
    desc: "你是创作者中的实干家，解决问题是你的超能力",
    badges: ["高实用性", "执行导向", "工具思维"],
    directions: [
      "输出可复用的模板、清单、SOP，让受众直接拿走就用",
      "记录真实项目过程，用结果说话，建立案例背书",
      "打造付费工具包/模板库，形成稳定被动收入",
    ],
    category: "工具方法",
    modules: ["工具方法", "内容运营"],
  },
  C: {
    name: "故事叙述型",
    emoji: "💬",
    desc: "你是创作者中的连接者，真实感是你最强的磁场",
    badges: ["情感共鸣", "真实叙事", "社群粘性"],
    directions: [
      "用第一人称视角记录真实经历，让读者产生强烈代入感",
      "在故事中嵌入价值观和观点，建立独特的人格魅力",
      "通过社群和私域运营，将粉丝转化为忠实粉丝圈",
    ],
    category: "IP案例",
    modules: ["个人定位", "账号增长"],
  },
  D: {
    name: "生活方式型",
    emoji: "✨",
    desc: "你是创作者中的美学家，视觉和品味是你的个人标签",
    badges: ["视觉美学", "生活品味", "品牌调性"],
    directions: [
      "建立统一的视觉风格体系，让账号颜值成为核心竞争力",
      "深度种草生活方式产品，用真实体验建立购物信任感",
      "通过品牌合作和带货变现，打造生活方式KOL定位",
    ],
    category: "视觉表达",
    modules: ["视觉表达", "IP案例"],
  },
  E: {
    name: "趋势洞察型",
    emoji: "🔭",
    desc: "你是创作者中的观察者，独特视角是你最宝贵的资产",
    badges: ["前瞻视野", "独立观点", "思想影响力"],
    directions: [
      "聚焦行业趋势解读，输出有预见性的深度内容",
      "建立个人观点体系，形成差异化的「品牌视角」",
      "通过演讲、顾问、内容付费等方式将洞察力变现",
    ],
    category: "账号增长",
    modules: ["平台策略", "IP案例"],
  },
};

export default function QuizPage() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<TypeKey[]>([]);
  const [selected, setSelected] = useState<TypeKey | null>(null);
  const [done, setDone] = useState(false);
  const [copied, setCopied] = useState(false);

  function handleSelect(key: TypeKey) {
    setSelected(key);
    setTimeout(() => {
      const next = [...answers, key];
      setAnswers(next);
      setSelected(null);
      if (current + 1 >= questions.length) {
        setDone(true);
      } else {
        setCurrent(current + 1);
      }
    }, 300);
  }

  function getResult(): TypeKey {
    const counts: Record<TypeKey, number> = { A: 0, B: 0, C: 0, D: 0, E: 0 };
    answers.forEach((a) => { counts[a]++; });
    return (Object.keys(counts) as TypeKey[]).reduce((a, b) => counts[a] >= counts[b] ? a : b);
  }

  function reset() {
    setCurrent(0);
    setAnswers([]);
    setSelected(null);
    setDone(false);
    setCopied(false);
  }

  function copyLink() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (done) {
    const key = getResult();
    const res = results[key];
    const shareText = `我测出是【${res.name}】创作者，你呢？\n\n测一测你是哪种创作者类型 → https://brandlab.ink/quiz`;
    function copyShare() {
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
    return (
      <div className="bg-white min-h-screen">
        <div className="border-b border-[#95d5b2] bg-[#f0faf4]">
          <div className="max-w-2xl mx-auto px-6 py-3 flex items-center gap-2 text-xs text-[#6b7280]">
            <Link href="/" className="hover:text-[#40916c]">首页</Link>
            <span>/</span>
            <span className="text-[#1b4332] font-medium">品牌测评</span>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-6 py-12">
          {/* Result hero */}
          <div className="bg-[#1b4332] rounded-2xl p-8 text-center mb-8">
            <div className="text-5xl mb-4">{res.emoji}</div>
            <p className="text-xs text-[#74c69d] font-medium tracking-widest uppercase mb-2">你的创作者类型</p>
            <h1 className="text-3xl font-bold text-white mb-3">{res.name}</h1>
            <p className="text-sm text-[#95d5b2] leading-relaxed max-w-sm mx-auto">{res.desc}</p>
          </div>

          {/* Badges */}
          <div className="mb-6">
            <p className="text-xs font-medium text-[#52b788] tracking-widest uppercase mb-3">核心优势标签</p>
            <div className="flex flex-wrap gap-2">
              {res.badges.map((badge) => (
                <span key={badge} className="text-sm bg-[#f0faf4] text-[#2d6a4f] border border-[#95d5b2] px-4 py-1.5 rounded-full font-medium">
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Content directions */}
          <div className="border border-[#95d5b2] rounded-xl p-6 mb-6">
            <p className="text-xs font-medium text-[#52b788] tracking-widest uppercase mb-4">推荐内容方向</p>
            <div className="space-y-3">
              {res.directions.map((d, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#f0faf4] text-[#40916c] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-sm text-[#6b7280] leading-relaxed">{d}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended reading */}
          <div className="border border-[#95d5b2] rounded-xl p-5 mb-6">
            <p className="text-xs font-medium text-[#52b788] tracking-widest uppercase mb-4">推荐阅读模块</p>
            <div className="flex gap-3">
              {res.modules.map((mod) => (
                <Link
                  key={mod}
                  href={`/library?category=${encodeURIComponent(mod)}`}
                  className="flex-1 border border-[#95d5b2] rounded-xl p-4 text-center hover:border-[#52b788] hover:bg-[#f0faf4] transition-colors group"
                >
                  <p className="text-sm font-bold text-[#1b4332] group-hover:text-[#2d6a4f] transition-colors">{mod}</p>
                  <p className="text-xs text-[#52b788] mt-1">查看内容 →</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={copyShare}
              className="flex-1 bg-[#1b4332] text-white py-3 rounded-xl text-sm font-medium hover:bg-[#2d6a4f] transition-colors"
            >
              {copied ? "✓ 已复制分享文案" : "分享给朋友 · 一键复制"}
            </button>
            <button
              onClick={reset}
              className="flex-1 border border-[#95d5b2] text-[#6b7280] py-3 rounded-xl text-sm font-medium hover:border-[#52b788] hover:text-[#40916c] transition-colors"
            >
              重新测一次
            </button>
          </div>
          <p className="text-center text-xs text-[#6b7280] mt-3">分享文案：我测出是【{res.name}】，你呢？</p>
        </div>
      </div>
    );
  }

  const q = questions[current];
  const progress = ((current) / questions.length) * 100;

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-[#f0faf4] border-b border-[#95d5b2] py-10 px-8">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs text-[#52b788] font-medium tracking-widest uppercase mb-2">品牌测评</p>
          <h1 className="text-2xl font-bold text-[#1b4332]">测测我是哪种创作者</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-8 py-10">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#6b7280]">第 {current + 1} 题</span>
            <span className="text-xs text-[#52b788] font-medium">{current + 1} / {questions.length}</span>
          </div>
          <div className="h-1.5 bg-[#d8f3dc] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#2d6a4f] rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <h2 className="text-lg font-bold text-[#1b4332] mb-6">{q.q}</h2>

        {/* Options */}
        <div className="space-y-3">
          {q.options.map((opt) => (
            <button
              key={opt.key}
              onClick={() => handleSelect(opt.key)}
              className={`w-full text-left border rounded-xl px-5 py-4 text-sm font-medium transition-all ${
                selected === opt.key
                  ? "border-[#2d6a4f] bg-[#f0faf4] text-[#1b4332]"
                  : "border-[#95d5b2] text-[#6b7280] hover:border-[#52b788] hover:bg-[#f0faf4] hover:text-[#1b4332]"
              }`}
            >
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#f0faf4] text-[#40916c] text-xs font-bold mr-3 border border-[#95d5b2]">
                {opt.key}
              </span>
              {opt.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
