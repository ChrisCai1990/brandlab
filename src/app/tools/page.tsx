import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "工具资源",
  description: "精选创作者工具与可直接使用的模板，包括30天内容排期模板、账号Brief模板、视觉系统模板，免费获取。",
};

const templates = [
  {
    title: "30天内容排期模板",
    desc: "每天的选题方向、痛点钩子、内容角度、互动引导，一次规划，30天不焦虑。",
    tags: ["在线工具"],
    type: "免费",
    icon: "◻",
    href: "/tools/calendar",
  },
  {
    title: "账号定位Brief生成器",
    desc: "填写账号方向、受众、变现目标，自动生成一句话定位 + 内容策略 + 差异化标签。",
    tags: ["在线工具"],
    type: "免费",
    icon: "◼",
    href: "/tools/brief",
  },
  {
    title: "视觉系统设计模板",
    desc: "选择账号风格，生成配色方案 + 字体规范 + 三种封面构图模板，建立视觉一致性。",
    tags: ["在线工具"],
    type: "免费",
    icon: "◈",
    href: "/tools/visual",
  },
  {
    title: "爆款选题生成器",
    desc: "输入你的账号方向，一键生成覆盖5种钩子类型的10个爆款选题，再也不愁没内容写。",
    tags: ["在线工具"],
    type: "免费",
    icon: "◎",
    href: "/tools/topics",
  },
  {
    title: "粉丝画像分析表",
    desc: "填写受众年龄、性别、痛点、行为偏好，生成结构化画像 + 内容策略 + 变现路径匹配。",
    tags: ["在线工具"],
    type: "免费",
    icon: "◉",
    href: "/tools/audience",
  },
  {
    title: "变现路径规划表",
    desc: "告诉我你的粉丝量和账号方向，生成最适合你的变现方式优先级 + 三阶段行动路线图。",
    tags: ["在线工具"],
    type: "免费",
    icon: "◐",
    href: "/tools/monetize",
  },
  {
    title: "公众号排版转换器",
    desc: "上传 Claude Code 生成的 HTML 模板，自动提取样式转为内联，一键复制粘贴到微信公众号编辑器。",
    tags: ["在线工具"],
    type: "免费",
    icon: "◑",
    href: "/tools/wechat",
  },
  {
    title: "HTML 内容生成器",
    desc: "输入内容，AI 自动生成精美 HTML —— 小红书笔记卡、金句卡片、个人品牌介绍页、活动海报，6 种模板，一键复制。",
    tags: ["在线工具", "AI生成"],
    type: "免费",
    icon: "◒",
    href: "/tools/html-creator",
  },
];

const toolList = [
  { category: "内容创作", tools: ["Notion（笔记+选题管理）", "飞书文档（团队协作）", "ChatGPT（辅助写作）", "讯飞星火（中文优化）"] },
  { category: "视觉设计", tools: ["Canva（封面设计）", "Figma（专业设计）", "稿定设计（快速出图）", "Remove.bg（抠图）"] },
  { category: "数据分析", tools: ["新红（小红书数据）", "飞瓜数据（抖音数据）", "微信指数（公众号）", "千瓜（竞品分析）"] },
  { category: "效率提升", tools: ["Loom（视频录制）", "Grammarly（英文校对）", "Hemingway（文章简化）", "Buffer（多平台发布）"] },
];

export default function ToolsPage() {
  return (
    <div className="bg-black min-h-screen">
      {/* Header */}
      <div className="border-b border-[#1f1f1f] bg-[#0a0a0a] py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs text-[#555555] font-medium tracking-widest uppercase mb-3">工具资源</p>
          <h1 className="text-4xl font-bold text-white mb-3">模板 + 工具，让创作更省力</h1>
          <p className="text-sm text-[#888888]">精选实用工具与可直接使用的模板，拿走就用</p>
        </div>
      </div>

      {/* Templates */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="mb-10">
          <p className="text-xs text-[#555555] font-medium tracking-widest uppercase mb-2">免费模板</p>
          <h2 className="text-2xl font-bold text-white">直接用，不用谢</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px border border-[#1f1f1f] mb-16">
          {templates.map((t, i) => (
            <div key={i} className="bg-[#0a0a0a] p-6 hover:bg-[#111111] transition-all group">
              <div className="flex items-start justify-between mb-3">
                <div className="text-xl text-[#555555]">{t.icon}</div>
                <span className="text-xs font-medium px-2.5 py-1 bg-[#111111] text-[#888888]">
                  {t.type}
                </span>
              </div>
              <h3 className="text-sm font-bold text-white mb-2 group-hover:text-[#e0e0e0] transition-colors">{t.title}</h3>
              <p className="text-xs text-[#555555] leading-relaxed mb-4">{t.desc}</p>
              <div className="flex items-center justify-between">
                <div className="flex gap-1.5">
                  {t.tags.map((tag) => (
                    <span key={tag} className="text-[10px] text-[#555555] border border-[#1f1f1f] px-2 py-0.5">
                      {tag}
                    </span>
                  ))}
                </div>
                {t.type === "免费" && t.href && (
                  <Link href={t.href} className="text-xs text-[#888888] font-medium hover:text-white transition-colors">
                    {t.tags.includes("在线工具") ? "使用 →" : "获取 →"}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Tool List */}
        <div className="border-t border-[#1f1f1f] pt-16">
          <div className="mb-10">
            <p className="text-xs text-[#555555] font-medium tracking-widest uppercase mb-2">工具清单</p>
            <h2 className="text-2xl font-bold text-white">我们在用的工具</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px border border-[#1f1f1f]">
            {toolList.map((section) => (
              <div key={section.category} className="bg-[#0a0a0a] p-6">
                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                  <span className="w-1 h-4 bg-white inline-block" />
                  {section.category}
                </h3>
                <ul className="space-y-2.5">
                  {section.tools.map((tool) => (
                    <li key={tool} className="text-xs text-[#888888] flex items-center gap-2">
                      <span className="w-1 h-1 bg-white shrink-0" />
                      {tool}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 border border-[#1f1f1f] bg-[#0a0a0a] p-12 text-center">
          <p className="text-xs text-[#555555] font-medium tracking-widest uppercase mb-4">保持更新</p>
          <h3 className="text-2xl font-bold text-white mb-3">想第一时间获取新模板？</h3>
          <p className="text-sm text-[#888888] mb-8">加入社群，模板持续更新，第一时间通知</p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 border border-white text-white px-7 py-3.5 font-medium text-sm hover:bg-white hover:text-black transition-colors"
          >
            加入社群
          </a>
        </div>
      </div>
    </div>
  );
}
