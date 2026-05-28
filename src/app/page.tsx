import Link from "next/link";

const modules = [
  { id: "positioning", icon: "◎", title: "个人定位", desc: "找准差异化定位，让别人一眼记住你" },
  { id: "visual", icon: "◈", title: "视觉表达", desc: "建立统一视觉系统，让账号颜值出圈" },
  { id: "content", icon: "◇", title: "内容运营", desc: "高效产出，打造让人刷不停的内容体系" },
  { id: "growth", icon: "◉", title: "账号增长", desc: "从0到1涨粉，掌握核心增长方法论" },
  { id: "platform", icon: "◐", title: "平台策略", desc: "读懂各平台算法，让内容被更多人看到" },
  { id: "cases", icon: "◑", title: "IP案例", desc: "拆解真实成长路径，找可复制的规律" },
  { id: "tools", icon: "◒", title: "工具方法", desc: "效率工具 + 实用模板，让创作更省力" },
];

const latestPosts = [
  {
    tag: "个人定位",
    title: "为什么你发了100条内容，还是没人关注你？",
    desc: "定位模糊是账号增长最大的隐形杀手。3步找到你的差异化标签。",
    date: "01-15",
  },
  {
    tag: "内容运营",
    title: "一条爆款内容的底层结构拆解",
    desc: "痛点钩子 → 核心公式 → 三步拆解 → 案例 → 避坑 → 行动建议。",
    date: "01-14",
  },
  {
    tag: "账号增长",
    title: "小红书算法最新变化，你必须知道的3件事",
    desc: "平台规则变了，内容策略也要跟着变。这篇帮你把握最新方向。",
    date: "01-13",
  },
  {
    tag: "视觉表达",
    title: "封面设计的5个黄金原则，让点击率翻倍",
    desc: "封面是内容的门面。这5个原则适用于所有平台，掌握了就是竞争壁垒。",
    date: "01-12",
  },
  {
    tag: "平台策略",
    title: "2024年做个人品牌，首选哪个平台？",
    desc: "小红书、抖音、公众号……不同阶段选不同平台，这篇帮你想清楚。",
    date: "01-11",
  },
  {
    tag: "IP案例",
    title: "拆解一个从0到10万粉的账号成长路径",
    desc: "不谈运气，只谈方法论。3个可以直接复制的关键动作。",
    date: "01-10",
  },
];

const resources = [
  { title: "30天内容排期模板", desc: "选题方向 + 痛点钩子 + 互动引导，一次规划不焦虑", icon: "📅" },
  { title: "账号定位Brief模板", desc: "一页纸梳理定位、受众、内容策略，清晰再出发", icon: "📋" },
  { title: "视觉系统设计模板", desc: "封面×4套 + 配色方案 + 字体规范，告别视觉混乱", icon: "🎨" },
];

export default function HomePage() {
  return (
    <>
      {/* ─── Hero ─── */}
      <section className="bg-white border-b border-[#C8DDD2]">
        <div className="max-w-7xl mx-auto px-8 py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Left: copy */}
            <div>
              <div className="inline-flex items-center gap-2 bg-[#E8F5EE] text-[#2D6A4F] text-xs font-medium px-3 py-1.5 rounded-full mb-6 border border-[#C8DDD2]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#6BAF8A] inline-block" />
                每日更新 · 个人品牌干货社区
              </div>

              <h1 className="text-4xl lg:text-5xl font-bold text-[#1A2E22] leading-tight tracking-tight mb-5">
                每天一条干货，
                <br />
                帮你把账号做成
                <br />
                <span className="text-[#1B4332]">有影响力的个人品牌</span>
              </h1>

              <p className="text-base text-[#6B7A6E] mb-8 leading-relaxed max-w-md">
                拾起每一条干货，研出你的个人品牌。
                <br />专为创作者、超级个体、想靠账号变现的创业者。
              </p>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/library"
                  className="bg-[#1B4332] text-white px-6 py-3 rounded-lg font-medium text-sm hover:bg-[#2D6A4F] transition-colors"
                >
                  开始阅读
                </Link>
                <Link
                  href="/contact"
                  className="border border-[#C8DDD2] text-[#2D6A4F] px-6 py-3 rounded-lg font-medium text-sm hover:border-[#6BAF8A] hover:bg-[#E8F5EE] transition-colors"
                >
                  加入社群
                </Link>
              </div>
            </div>

            {/* Right: stats + featured */}
            <div className="space-y-4">
              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: "200+", label: "条实用干货" },
                  { value: "5000+", label: "位创作者在用" },
                  { value: "每日", label: "持续更新" },
                ].map((s) => (
                  <div key={s.label} className="bg-[#E8F5EE] border border-[#C8DDD2] rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-[#1B4332]">{s.value}</div>
                    <div className="text-xs text-[#6B7A6E] mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Featured article card */}
              <Link href="/library" className="group block bg-[#1A2E22] rounded-xl p-5 hover:bg-[#2D6A4F] transition-colors">
                <div className="text-xs text-[#6BAF8A] mb-2 font-medium">今日干货</div>
                <h3 className="text-sm font-bold text-white mb-2 group-hover:text-[#A8D5BB] transition-colors leading-snug">
                  为什么你发了100条内容，还是没人关注你？
                </h3>
                <p className="text-xs text-[#A8D5BB] leading-relaxed line-clamp-2">
                  定位模糊是账号增长最大的隐形杀手。3步找到你的差异化标签，让每一条内容都有精准落点。
                </p>
                <div className="mt-3 text-xs text-[#6BAF8A] group-hover:text-white transition-colors">阅读全文 →</div>
              </Link>

              {/* Module pills */}
              <div className="flex flex-wrap gap-2">
                {modules.map((m) => (
                  <Link
                    key={m.id}
                    href={`/library?category=${m.id}`}
                    className="text-xs bg-white border border-[#C8DDD2] text-[#6B7A6E] px-3 py-1.5 rounded-full hover:border-[#6BAF8A] hover:text-[#2D6A4F] transition-colors"
                  >
                    {m.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 7 Modules ─── */}
      <section className="bg-white py-16 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs text-[#6BAF8A] font-medium tracking-widest uppercase mb-1.5">内容体系</p>
              <h2 className="text-2xl font-bold text-[#1A2E22]">7大模块，覆盖个人品牌全链路</h2>
            </div>
            <Link href="/library" className="text-sm text-[#2D6A4F] font-medium hover:text-[#1B4332] transition-colors shrink-0 hidden md:block">
              浏览全部 →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
            {modules.map((mod) => (
              <Link
                key={mod.id}
                href={`/library?category=${mod.id}`}
                className="group bg-white border border-[#C8DDD2] rounded-xl p-4 hover:border-[#6BAF8A] hover:bg-[#E8F5EE] transition-all"
              >
                <div className="text-xl text-[#6BAF8A] mb-2.5 group-hover:text-[#2D6A4F] transition-colors">
                  {mod.icon}
                </div>
                <h3 className="text-xs font-bold text-[#1A2E22] mb-1">{mod.title}</h3>
                <p className="text-[10px] text-[#6B7A6E] leading-relaxed hidden xl:block">{mod.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Latest + Resources (side by side) ─── */}
      <section className="bg-[#F7FBF8] border-y border-[#C8DDD2] py-16 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* Left: Latest posts (2/3 width) */}
            <div className="lg:col-span-2">
              <div className="flex items-end justify-between mb-6">
                <div>
                  <p className="text-xs text-[#6BAF8A] font-medium tracking-widest uppercase mb-1.5">最新干货</p>
                  <h2 className="text-2xl font-bold text-[#1A2E22]">每日更新</h2>
                </div>
                <Link href="/library" className="text-sm text-[#2D6A4F] font-medium hover:text-[#1B4332] transition-colors">
                  查看全部 →
                </Link>
              </div>

              <div className="space-y-3">
                {latestPosts.map((post, i) => (
                  <Link
                    key={i}
                    href="/library"
                    className="group flex items-start gap-4 bg-white border border-[#C8DDD2] rounded-xl px-5 py-4 hover:border-[#6BAF8A] transition-all"
                  >
                    <div className="shrink-0 text-right hidden sm:block">
                      <div className="text-[10px] text-[#6B7A6E]">{post.date}</div>
                    </div>
                    <div className="w-px bg-[#C8DDD2] self-stretch shrink-0 hidden sm:block" />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#E8F5EE] text-[#2D6A4F] mr-2">
                        {post.tag}
                      </span>
                      <h3 className="text-sm font-bold text-[#1A2E22] mt-1.5 mb-1 group-hover:text-[#1B4332] transition-colors leading-snug line-clamp-1">
                        {post.title}
                      </h3>
                      <p className="text-xs text-[#6B7A6E] leading-relaxed line-clamp-1">{post.desc}</p>
                    </div>
                    <span className="text-xs text-[#C8DDD2] group-hover:text-[#6BAF8A] transition-colors shrink-0 hidden sm:block">→</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Right: Free Resources (1/3 width) */}
            <div>
              <div className="mb-6">
                <p className="text-xs text-[#6BAF8A] font-medium tracking-widest uppercase mb-1.5">免费资源</p>
                <h2 className="text-2xl font-bold text-[#1A2E22]">拿走就用</h2>
              </div>

              <div className="space-y-3 mb-5">
                {resources.map((r) => (
                  <div key={r.title} className="bg-white border border-[#C8DDD2] rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <span className="text-xl shrink-0">{r.icon}</span>
                      <div>
                        <h3 className="text-xs font-bold text-[#1A2E22] mb-0.5">{r.title}</h3>
                        <p className="text-[10px] text-[#6B7A6E] leading-relaxed">{r.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="/contact"
                className="block w-full bg-[#1B4332] text-white text-sm font-medium px-5 py-3 rounded-xl text-center hover:bg-[#2D6A4F] transition-colors"
              >
                加微信，免费获取模板
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Bottom CTA ─── */}
      <section className="bg-[#1A2E22] py-16 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                从今天开始，认真做你的个人品牌
              </h2>
              <p className="text-sm text-[#A8D5BB]">
                5000+ 创作者正在用这套方法论，每天一条干货，每天进步一点点。
              </p>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <Link
                href="/library"
                className="bg-white text-[#1B4332] px-6 py-3 rounded-lg font-medium text-sm hover:bg-[#E8F5EE] transition-colors"
              >
                开始阅读干货
              </Link>
              <Link
                href="/tools"
                className="border border-[#2D6A4F] text-[#A8D5BB] px-6 py-3 rounded-lg font-medium text-sm hover:border-[#6BAF8A] hover:text-white transition-colors"
              >
                查看工具资源
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
