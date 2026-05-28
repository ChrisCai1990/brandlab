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
    icon: "📅",
    href: "/tools/calendar",
  },
  {
    title: "账号定位Brief模板",
    desc: "一页纸梳理你的账号定位、目标受众、内容策略、差异化标签，清晰再出发。",
    tags: ["PDF", "Notion"],
    type: "免费",
    icon: "📋",
    href: "/contact",
  },
  {
    title: "视觉系统设计模板",
    desc: "封面模板 × 4套 + 配色方案 + 字体规范，建立账号视觉一致性，告别乱糟糟。",
    tags: ["Canva", "Figma"],
    type: "免费",
    icon: "🎨",
    href: "/contact",
  },
  {
    title: "爆款选题生成器",
    desc: "输入你的定位和关键词，自动生成5个爆款选题方向，再也不愁没内容写。",
    tags: ["在线工具"],
    type: "即将上线",
    icon: "⚡",
    href: "",
  },
  {
    title: "粉丝画像分析表",
    desc: "从平台数据提炼真实用户画像，帮你精准定位目标受众，内容更有方向感。",
    tags: ["Excel"],
    type: "免费",
    icon: "👥",
    href: "/contact",
  },
  {
    title: "变现路径规划表",
    desc: "根据粉丝量级和账号方向，匹配最优变现策略，清晰看到你的下一步。",
    tags: ["PDF"],
    type: "免费",
    icon: "💰",
    href: "/contact",
  },
];

const toolList = [
  { category: "内容创作", tools: ["Notion（笔记+选题管理）", "飞书文档（团队协作）", "ChatGPT（辅助写作）", "讯飞星火（中文优化）"] },
  { category: "视觉设计", tools: ["Canva（封面设计）", "Figma（专业设计）", "稿定设计（快速出图）", "Remove.bg（抠图）"] },
  { category: "数据分析", tools: ["新红（小红书数据）", "飞瓜数据（抖音数据）", "微信指数（公众号）", "千瓜（竞品分析）"] },
  { category: "效率提升", tools:["Loom（视频录制）", "Grammarly（英文校对）", "Hemingway（文章简化）", "Buffer（多平台发布）"] },
];

export default function ToolsPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-[#E8F5EE] border-b border-[#C8DDD2] py-14 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs text-[#6BAF8A] font-medium tracking-widest uppercase mb-2">工具资源</p>
          <h1 className="text-4xl font-bold text-[#1A2E22] mb-3">模板 + 工具，让创作更省力</h1>
          <p className="text-sm text-[#6B7A6E]">精选实用工具与可直接使用的模板，拿走就用</p>
        </div>
      </div>

      {/* Templates */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="mb-10">
          <p className="text-xs text-[#6BAF8A] font-medium tracking-widest uppercase mb-2">免费模板</p>
          <h2 className="text-2xl font-bold text-[#1A2E22]">直接用，不用谢</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {templates.map((t, i) => (
            <div key={i} className="border border-[#C8DDD2] rounded-xl p-6 hover:border-[#6BAF8A] hover:shadow-sm transition-all group">
              <div className="flex items-start justify-between mb-3">
                <div className="text-2xl">{t.icon}</div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                  t.type === "免费"
                    ? "bg-[#E8F5EE] text-[#2D6A4F]"
                    : "bg-gray-100 text-gray-500"
                }`}>
                  {t.type}
                </span>
              </div>
              <h3 className="text-sm font-bold text-[#1A2E22] mb-2 group-hover:text-[#1B4332] transition-colors">{t.title}</h3>
              <p className="text-xs text-[#6B7A6E] leading-relaxed mb-4">{t.desc}</p>
              <div className="flex items-center justify-between">
                <div className="flex gap-1.5">
                  {t.tags.map((tag) => (
                    <span key={tag} className="text-[10px] text-[#6B7A6E] bg-gray-50 border border-[#C8DDD2] px-2 py-0.5 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
                {t.type === "免费" && t.href && (
                  <Link href={t.href} className="text-xs text-[#2D6A4F] font-medium hover:text-[#1B4332] transition-colors">
                    获取 →
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Tool List */}
        <div className="border-t border-[#C8DDD2] pt-16">
          <div className="mb-10">
            <p className="text-xs text-[#6BAF8A] font-medium tracking-widest uppercase mb-2">工具清单</p>
            <h2 className="text-2xl font-bold text-[#1A2E22]">我们在用的工具</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {toolList.map((section) => (
              <div key={section.category} className="bg-[#E8F5EE] border border-[#C8DDD2] rounded-xl p-6">
                <h3 className="text-sm font-bold text-[#1A2E22] mb-4 flex items-center gap-2">
                  <span className="w-1 h-4 bg-[#2D6A4F] rounded-full inline-block" />
                  {section.category}
                </h3>
                <ul className="space-y-2.5">
                  {section.tools.map((tool) => (
                    <li key={tool} className="text-xs text-[#6B7A6E] flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-[#6BAF8A] shrink-0" />
                      {tool}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 bg-[#1A2E22] rounded-2xl p-10 text-center">
          <h3 className="text-xl font-bold text-white mb-3">想第一时间获取新模板？</h3>
          <p className="text-sm text-[#A8D5BB] mb-6">加入社群，模板持续更新，第一时间通知</p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 bg-[#1B4332] border border-[#6BAF8A] text-white px-7 py-3.5 rounded-lg font-medium text-sm hover:bg-[#2D6A4F] transition-colors"
          >
            加入社群
          </a>
        </div>
      </div>
    </div>
  );
}
