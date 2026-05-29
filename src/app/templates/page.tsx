"use client";

import { useState } from "react";

type Template = { title: string; content: string };
type Category = { id: string; label: string; templates: Template[] };

const categories: Category[] = [
  {
    id: "hooks",
    label: "开头钩子",
    templates: [
      { title: "反常识钩子", content: "你知道XX吗？90%的人都做错了" },
      { title: "经验分享钩子", content: "我花了X个月踩的坑，总结成这篇文章" },
      { title: "成绩分享钩子", content: "一个让我涨粉X万的方法，今天免费分享" },
      { title: "升级提醒钩子", content: "如果你还在用老方法做XX，看这篇就够了" },
      { title: "成长故事钩子", content: "XX个月前我还是0粉丝，现在..." },
      { title: "秘诀揭示钩子", content: "很多人不知道的XX技巧，用了就停不下来" },
    ],
  },
  {
    id: "cta",
    label: "结尾CTA",
    templates: [
      { title: "关注引导", content: "关注我，每天分享一条个人品牌干货" },
      { title: "收藏转发", content: "觉得有用就收藏，转发给需要的朋友" },
      { title: "互动引导", content: "你有什么疑问？评论区告诉我" },
      { title: "自我介绍", content: "我是XXX，专注分享XX领域实用干货" },
      { title: "点赞鼓励", content: "点个赞支持一下，我会持续更新" },
    ],
  },
  {
    id: "titles",
    label: "标题公式",
    templates: [
      { title: "数字干货型", content: "X个XX方法，让你的账号快速涨粉" },
      { title: "成长故事型", content: "从0到X万粉，我只做对了这X件事" },
      { title: "必看合集型", content: "XX必看！关于XX，你需要知道的一切" },
      { title: "问题解析型", content: "为什么你的XX没效果？原因在这里" },
      { title: "手把手教程型", content: "手把手教你XX，新手也能看懂" },
      { title: "反常识型", content: "XX的正确姿势（99%的人都不知道）" },
      { title: "测评推荐型", content: "我测试了X种方法，这个最有效" },
      { title: "攻略汇总型", content: "关于XX，最全面的一篇攻略" },
    ],
  },
  {
    id: "engage",
    label: "互动引导",
    templates: [
      { title: "类型测评引导", content: "你是哪种创作者？评论区告诉我" },
      { title: "共鸣引导", content: "你有没有遇到过这种情况？" },
      { title: "经验征集", content: "这个方法你试过吗？效果怎么样？" },
      { title: "预告关注", content: "关注我，明天分享更多实用技巧" },
    ],
  },
];

export default function TemplatesPage() {
  const [activeCategory, setActiveCategory] = useState("hooks");
  const [copied, setCopied] = useState<string | null>(null);

  function copy(id: string, text: string) {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }

  const current = categories.find((c) => c.id === activeCategory)!;

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-[#f0faf4] border-b border-[#95d5b2] py-14 px-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs text-[#52b788] font-medium tracking-widest uppercase mb-2">内容模板库</p>
          <h1 className="text-4xl font-bold text-[#1b4332] mb-2">拿走就用的内容模板</h1>
          <p className="text-sm text-[#6b7280]">4大分类，23个模板，点击即可复制</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar tabs */}
          <div className="lg:w-48 shrink-0">
            <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`shrink-0 lg:w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    activeCategory === cat.id
                      ? "bg-[#f0faf4] text-[#1b4332] border border-[#52b788]"
                      : "text-[#6b7280] hover:text-[#2d6a4f] hover:bg-[#f0faf4] border border-transparent"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Templates list */}
          <div className="flex-1">
            <h2 className="text-lg font-bold text-[#1b4332] mb-6">{current.label}</h2>
            <div className="space-y-4">
              {current.templates.map((tpl, i) => {
                const id = `${activeCategory}-${i}`;
                return (
                  <div key={id} className="border border-[#95d5b2] rounded-xl p-5 hover:border-[#52b788] transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-xs font-medium text-[#52b788] tracking-widest uppercase mb-2">{tpl.title}</p>
                        <p className="text-sm text-[#1b4332] leading-relaxed">{tpl.content}</p>
                      </div>
                      <button
                        onClick={() => copy(id, tpl.content)}
                        className={`shrink-0 text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                          copied === id
                            ? "bg-[#f0faf4] border-[#52b788] text-[#40916c]"
                            : "border-[#95d5b2] text-[#6b7280] hover:border-[#40916c] hover:text-[#40916c]"
                        }`}
                      >
                        {copied === id ? "✓ 已复制" : "复制"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 bg-[#1b4332] rounded-2xl p-8 text-center">
          <p className="text-sm font-bold text-white mb-2">想要更多独家模板？</p>
          <p className="text-xs text-[#74c69d] mb-5">加入创作者社群，获取完整版 Notion 模板库 + 持续更新的内容素材</p>
          <a
            href="/contact"
            className="inline-block text-sm bg-[#2d6a4f] border border-[#52b788] text-white px-6 py-2.5 rounded-lg hover:bg-[#40916c] transition-colors font-medium"
          >
            加入社群，获取更多模板
          </a>
        </div>
      </div>
    </div>
  );
}
