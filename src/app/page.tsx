import Link from "next/link";
import { connectDB } from "@/lib/db";
import { Article } from "@/lib/models";
import { SubscribeForm } from "@/components/SubscribeForm";

export const dynamic = "force-dynamic";

const modules = [
  { category: "个人定位", icon: "◎", title: "个人定位", desc: "找准差异化定位，让别人一眼记住你" },
  { category: "视觉表达", icon: "◈", title: "视觉表达", desc: "建立统一视觉系统，让账号颜值出圈" },
  { category: "内容运营", icon: "◇", title: "内容运营", desc: "高效产出，打造让人刷不停的内容体系" },
  { category: "账号增长", icon: "◉", title: "账号增长", desc: "从0到1涨粉，掌握核心增长方法论" },
  { category: "平台策略", icon: "◐", title: "平台策略", desc: "读懂各平台算法，让内容被更多人看到" },
  { category: "IP案例",   icon: "◑", title: "IP案例",   desc: "拆解真实成长路径，找可复制的规律" },
  { category: "工具方法", icon: "◒", title: "工具方法", desc: "效率工具 + 实用模板，让创作更省力" },
  { category: "变现路径", icon: "◓", title: "变现路径", desc: "6种变现模式全拆解，找到最适合你的路" },
  { category: "私域运营", icon: "◔", title: "私域运营", desc: "从公域到私域，建立你的流量护城河" },
];

const resources = [
  { title: "30天内容排期模板", desc: "选题方向 + 痛点钩子 + 互动引导，一次规划不焦虑", icon: "◻" },
  { title: "账号定位Brief模板", desc: "一页纸梳理定位、受众、内容策略，清晰再出发", icon: "◻" },
  { title: "视觉系统设计模板", desc: "封面×4套 + 配色方案 + 字体规范，告别视觉混乱", icon: "◻" },
];

async function getLatestFromDb() {
  try {
    await connectDB();
    const rows = await Article.find({ published: true })
      .sort({ date: -1 })
      .select("slug tag title desc date")
      .limit(6)
      .lean();
    return rows.map((r) => ({
      slug: r.slug,
      tag: r.tag,
      title: r.title,
      desc: r.desc,
      date: new Date(r.date).toISOString().slice(5, 10),
    }));
  } catch {
    return null;
  }
}

async function getTotalCount() {
  try {
    await connectDB();
    return await Article.countDocuments({ published: true });
  } catch {
    return 0;
  }
}

export default async function HomePage() {
  const [dbPosts, totalCount] = await Promise.all([getLatestFromDb(), getTotalCount()]);

  const latestPosts = dbPosts ?? [];
  const featured = latestPosts[0];

  return (
    <>
      {/* ─── Hero ─── */}
      <section className="bg-white border-b border-[#d8f3dc]">
        <div className="max-w-5xl mx-auto px-8 py-28 lg:py-36 text-center">
          <p className="text-xs text-[#40916c] font-medium tracking-widest uppercase mb-8">
            每日更新 · 个人品牌干货社区
          </p>

          <h1 className="text-5xl lg:text-7xl font-bold text-[#1a1a1a] leading-tight tracking-tight mb-8">
            每天一条干货，
            <br />
            把账号做成
            <br />
            有影响力的个人品牌
          </h1>

          <p className="text-base text-[#52796f] mb-10 leading-relaxed max-w-xl mx-auto">
            专为创作者、超级个体、想靠账号变现的创业者。
            拾起每一条干货，研出你的个人品牌。
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/library"
              className="border border-[#40916c] bg-[#40916c] text-white px-8 py-3.5 font-medium text-sm hover:bg-[#2d6a4f] hover:border-[#2d6a4f] transition-colors"
            >
              开始阅读
            </Link>
            <Link
              href="/contact"
              className="border border-[#95d5b2] text-[#52796f] px-8 py-3.5 font-medium text-sm hover:border-[#40916c] hover:text-[#2d6a4f] transition-colors"
            >
              加入社群
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-px mt-20 border border-[#d8f3dc] bg-[#d8f3dc]">
            {[
              { value: `${totalCount}+`, label: "条实用干货" },
              { value: "5000+", label: "位创作者在用" },
              { value: "每日", label: "持续更新" },
            ].map((s) => (
              <div key={s.label} className="bg-[#f0faf4] py-6 text-center">
                <div className="text-2xl font-bold text-[#1a1a1a] mb-1">{s.value}</div>
                <div className="text-xs text-[#74907f]">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Featured ─── */}
      {featured && (
        <section className="bg-white border-b border-[#d8f3dc]">
          <div className="max-w-5xl mx-auto px-8 py-12">
            <p className="text-xs text-[#40916c] font-medium tracking-widest uppercase mb-6">今日干货</p>
            <Link
              href={`/library/${featured.slug}`}
              className="group block border border-[#d8f3dc] bg-[#f0faf4] p-8 hover:border-[#95d5b2] transition-all"
            >
              <div className="text-xs text-[#74907f] mb-3 font-medium">{featured.tag}</div>
              <h2 className="text-2xl lg:text-3xl font-bold text-[#1a1a1a] mb-3 group-hover:text-[#2d6a4f] transition-colors leading-snug">
                {featured.title}
              </h2>
              <p className="text-sm text-[#52796f] leading-relaxed max-w-2xl mb-6">
                {featured.desc}
              </p>
              <span className="text-xs text-[#40916c] group-hover:text-[#2d6a4f] transition-colors">
                阅读全文 →
              </span>
            </Link>
          </div>
        </section>
      )}

      {/* ─── 9 Modules ─── */}
      <section className="bg-white border-b border-[#d8f3dc] py-20 px-8">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs text-[#40916c] font-medium tracking-widest uppercase mb-3">内容体系</p>
          <div className="flex items-end justify-between mb-10">
            <h2 className="text-3xl font-bold text-[#1a1a1a]">9大模块，覆盖个人品牌全链路</h2>
            <Link href="/library" className="text-sm text-[#52796f] font-medium hover:text-[#2d6a4f] transition-colors shrink-0 hidden md:block">
              浏览全部 →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-px border border-[#d8f3dc] bg-[#d8f3dc]">
            {modules.map((mod) => (
              <Link
                key={mod.category}
                href={`/library?category=${encodeURIComponent(mod.category)}`}
                className="group bg-[#f0faf4] p-4 hover:bg-[#d8f3dc] transition-all flex flex-col items-start"
              >
                <div className="text-lg text-[#74907f] mb-3 group-hover:text-[#2d6a4f] transition-colors">
                  {mod.icon}
                </div>
                <h3 className="text-xs font-bold text-[#1a1a1a] mb-1">{mod.title}</h3>
                <p className="text-[10px] text-[#74907f] leading-relaxed hidden lg:block">{mod.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Latest + Resources ─── */}
      <section className="bg-white border-b border-[#d8f3dc] py-20 px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* Left: Latest posts */}
            <div className="lg:col-span-2">
              <p className="text-xs text-[#40916c] font-medium tracking-widest uppercase mb-3">最新干货</p>
              <div className="flex items-end justify-between mb-8">
                <h2 className="text-3xl font-bold text-[#1a1a1a]">每日更新</h2>
                <Link href="/library" className="text-sm text-[#52796f] font-medium hover:text-[#2d6a4f] transition-colors">
                  查看全部 →
                </Link>
              </div>

              <div className="space-y-px border border-[#d8f3dc] bg-[#d8f3dc]">
                {latestPosts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/library/${post.slug}`}
                    className="group flex items-start gap-5 bg-[#f0faf4] px-5 py-4 hover:bg-[#d8f3dc] transition-all"
                  >
                    <div className="shrink-0 text-right hidden sm:block min-w-[36px]">
                      <div className="text-[10px] text-[#74907f]">{post.date}</div>
                    </div>
                    <div className="w-px bg-[#d8f3dc] self-stretch shrink-0 hidden sm:block" />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-medium px-2 py-0.5 bg-white text-[#52796f] mr-2">
                        {post.tag}
                      </span>
                      <h3 className="text-sm font-bold text-[#1a1a1a] mt-1.5 mb-1 group-hover:text-[#2d6a4f] transition-colors leading-snug line-clamp-1">
                        {post.title}
                      </h3>
                      <p className="text-xs text-[#74907f] leading-relaxed line-clamp-1">{post.desc}</p>
                    </div>
                    <span className="text-xs text-[#95d5b2] group-hover:text-[#2d6a4f] transition-colors shrink-0 hidden sm:block">→</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Right: Free Resources */}
            <div>
              <p className="text-xs text-[#40916c] font-medium tracking-widest uppercase mb-3">免费资源</p>
              <h2 className="text-3xl font-bold text-[#1a1a1a] mb-8">拿走就用</h2>

              <div className="space-y-px border border-[#d8f3dc] bg-[#d8f3dc] mb-6">
                {resources.map((r) => (
                  <div key={r.title} className="bg-[#f0faf4] p-5">
                    <div className="flex items-start gap-3">
                      <span className="text-sm text-[#74907f] shrink-0 mt-0.5">{r.icon}</span>
                      <div>
                        <h3 className="text-xs font-bold text-[#1a1a1a] mb-1">{r.title}</h3>
                        <p className="text-[10px] text-[#74907f] leading-relaxed">{r.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="/contact"
                className="block w-full border border-[#40916c] bg-[#40916c] text-white text-sm font-medium px-5 py-3 text-center hover:bg-[#2d6a4f] hover:border-[#2d6a4f] transition-colors"
              >
                加微信，免费获取模板
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Module Pills ─── */}
      <section className="bg-white border-b border-[#d8f3dc] py-8 px-8">
        <div className="max-w-5xl mx-auto flex flex-wrap gap-2">
          {modules.map((m) => (
            <Link
              key={m.category}
              href={`/library?category=${encodeURIComponent(m.category)}`}
              className="text-xs border border-[#d8f3dc] text-[#52796f] px-4 py-2 hover:border-[#95d5b2] hover:text-[#2d6a4f] transition-colors"
            >
              {m.title}
            </Link>
          ))}
        </div>
      </section>

      {/* ─── Bottom CTA ─── */}
      <section className="bg-[#f0faf4] py-24 px-8">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-xs text-[#40916c] font-medium tracking-widest uppercase mb-6">开始行动</p>
          <h2 className="text-4xl lg:text-5xl font-bold text-[#1a1a1a] mb-4">
            从今天开始，
            <br />
            认真做你的个人品牌
          </h2>
          <p className="text-sm text-[#52796f] mb-10 max-w-md mx-auto leading-relaxed">
            5000+ 创作者正在用这套方法论，每天一条干货，每天进步一点点。
          </p>
          <div className="flex flex-wrap gap-4 justify-center mb-10">
            <Link
              href="/library"
              className="border border-[#40916c] bg-[#40916c] text-white px-8 py-3.5 font-medium text-sm hover:bg-[#2d6a4f] hover:border-[#2d6a4f] transition-colors"
            >
              开始阅读干货
            </Link>
            <Link
              href="/tools"
              className="border border-[#95d5b2] text-[#52796f] px-8 py-3.5 font-medium text-sm hover:border-[#40916c] hover:text-[#2d6a4f] transition-colors"
            >
              查看工具资源
            </Link>
          </div>
          <div>
            <p className="text-xs text-[#74907f] mb-3">订阅周报，获取每周选题灵感</p>
            <div className="flex justify-center">
              <SubscribeForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
