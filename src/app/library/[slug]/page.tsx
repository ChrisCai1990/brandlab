import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { connectDB } from "@/lib/db";
import { Article, User } from "@/lib/models";
import { ReadingProgress } from "@/components/ReadingProgress";
import { ShareButtons } from "@/components/ShareButtons";
import { ViewTracker } from "@/components/ViewTracker";
import { BookmarkButton } from "@/components/BookmarkButton";
import { ReadingTracker } from "@/components/ReadingTracker";
import { getUserSession, isSubscriptionActive } from "@/lib/userAuth";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

async function getArticle(slug: string) {
  try {
    await connectDB();
    return await Article.findOne({ slug, published: true }).lean();
  } catch {
    return null;
  }
}

async function getRelatedArticles(tag: string, slug: string) {
  try {
    await connectDB();
    const rows = await Article.find({ tag, slug: { $ne: slug }, published: true })
      .sort({ date: -1 })
      .select("slug title readTime date")
      .limit(3)
      .lean();
    return rows.map((r) => ({
      slug: r.slug,
      title: r.title,
      readTime: r.readTime,
      date: new Date(r.date).toISOString().split("T")[0],
    }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return {};
  const ogImage = `https://brandlab.ink/library/${slug}/opengraph-image`;
  return {
    title: article.title,
    description: article.desc,
    openGraph: {
      type: "article",
      title: article.title,
      description: article.desc,
      url: `https://brandlab.ink/library/${slug}`,
      siteName: "品牌拾研社 · BrandLab",
      images: [{ url: ogImage, width: 1200, height: 630, alt: article.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.desc,
      images: [ogImage],
    },
  };
}

const mdxComponents = {
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="flex items-center gap-2 text-sm font-bold text-white mt-10 mb-4" {...props}>
      <span className="w-1 h-4 bg-white shrink-0" />
      {props.children}
    </h2>
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="text-sm font-bold text-white mt-6 mb-2" {...props} />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="text-sm text-[#a0a0a0] leading-relaxed mb-4" {...props} />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="space-y-2 mb-4" {...props} />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="flex items-start gap-2.5 text-sm text-[#a0a0a0]">
      <span className="mt-1.5 w-1.5 h-1.5 bg-white shrink-0" />
      <span>{props.children}</span>
    </li>
  ),
  strong: (props: React.HTMLAttributes<HTMLElement>) => (
    <strong className="font-bold text-white" {...props} />
  ),
  blockquote: (props: React.HTMLAttributes<HTMLElement>) => (
    <div className="my-6 bg-[#0d0d0d] border-l-4 border-white px-6 py-5">
      <p className="text-xs text-[#888888] font-medium tracking-widest uppercase mb-2">核心公式</p>
      <div className="text-base font-bold text-white leading-snug [&_p]:text-white [&_p]:text-base [&_p]:font-bold [&_p]:leading-snug [&_p]:mb-0">
        {props.children}
      </div>
    </div>
  ),
  hr: () => <hr className="my-8 border-[#1f1f1f]" />,
};

async function checkUserSubscribed(): Promise<boolean> {
  try {
    const session = await getUserSession();
    if (!session) return false;
    await connectDB();
    const user = await User.findById(session.userId).lean();
    if (!user) return false;
    return isSubscriptionActive(user.subscriptionPlan, user.subscriptionExpiry ?? null);
  } catch {
    return false;
  }
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const dbArticle = await getArticle(slug);
  if (!dbArticle) notFound();

  const isPremium = dbArticle.isPremium ?? false;
  const isSubscribed = isPremium ? await checkUserSubscribed() : true;
  const isGated = isPremium && !isSubscribed;

  const meta = {
    title: dbArticle.title,
    tag: dbArticle.tag,
    desc: dbArticle.desc,
    date: new Date(dbArticle.date).toISOString().split("T")[0],
    readTime: dbArticle.readTime,
  };

  const related = await getRelatedArticles(meta.tag, slug);

  const pageUrl = `https://brandlab.ink/library/${slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: meta.title,
    description: meta.desc,
    datePublished: meta.date,
    author: { "@type": "Organization", name: "品牌拾研社", url: "https://brandlab.ink" },
    publisher: { "@type": "Organization", name: "品牌拾研社", url: "https://brandlab.ink" },
    mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
    keywords: meta.tag,
  };

  return (
    <div className="bg-black min-h-screen">
      <ReadingProgress />
      <ViewTracker slug={slug} />
      <ReadingTracker slug={slug} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="border-b border-[#1f1f1f] bg-[#0a0a0a]">
        <div className="max-w-5xl mx-auto px-8 py-3 flex items-center gap-2 text-xs text-[#555555]">
          <Link href="/" className="hover:text-white transition-colors">首页</Link>
          <span>/</span>
          <Link href="/library" className="hover:text-white transition-colors">内容库</Link>
          <span>/</span>
          <span className="text-[#a0a0a0] line-clamp-1">{meta.title}</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <article className="lg:col-span-2" id="article-content">
            <div className="flex items-center gap-3 mb-5 flex-wrap">
              <span className="text-xs font-medium px-2.5 py-1 bg-[#111111] text-[#888888]">
                {meta.tag}
              </span>
              <span className="text-xs text-[#555555]">{meta.date}</span>
              <span className="text-xs text-[#555555]">{meta.readTime} 分钟阅读</span>
              <BookmarkButton slug={slug} title={meta.title} />
            </div>

            <h1 className="text-3xl font-bold text-white leading-tight mb-4">{meta.title}</h1>
            <p className="text-base text-[#a0a0a0] leading-relaxed mb-8 border-l-2 border-white pl-4">
              {meta.desc}
            </p>

            {isGated ? (
              <div>
                <div className="prose-brandlab relative max-h-40 overflow-hidden">
                  <MDXRemote
                    source={dbArticle.content.split("\n\n").slice(0, 3).join("\n\n")}
                    components={mdxComponents}
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent" />
                </div>
                <div className="mt-8 border border-[#1f1f1f] p-8 text-center bg-[#0a0a0a]">
                  <div className="w-12 h-12 border border-[#333333] flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-lg">🔒</span>
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">本文为会员专享内容</h3>
                  <p className="text-xs text-[#888888] mb-6 leading-relaxed">
                    订阅会员，解锁全部品牌干货，月付仅需 ¥29
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Link
                      href="/member"
                      className="text-sm border border-white text-white px-6 py-2.5 font-medium hover:bg-white hover:text-black transition-colors"
                    >
                      查看会员方案
                    </Link>
                    <Link
                      href="/login"
                      className="text-sm border border-[#333333] text-[#888888] px-6 py-2.5 hover:border-white hover:text-white transition-colors"
                    >
                      已有账户，登录
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="prose-brandlab">
                <MDXRemote source={dbArticle.content} components={mdxComponents} />
              </div>
            )}

            <ShareButtons title={meta.title} url={pageUrl} />

            <div className="mt-6">
              <Link href="/library" className="text-sm text-[#888888] hover:text-white transition-colors">
                ← 返回内容库
              </Link>
            </div>
          </article>

          {/* Mobile CTA */}
          <div className="lg:hidden mt-8 border border-[#1f1f1f] bg-[#0a0a0a] p-5 text-center">
            <div className="w-12 h-12 border border-[#333333] flex items-center justify-center mx-auto mb-3">
              <span className="text-white text-lg font-bold">拾</span>
            </div>
            <p className="text-xs font-bold text-white mb-1">加入创作者社群</p>
            <p className="text-[10px] text-[#888888] mb-4 leading-relaxed">
              5000+ 创作者在这里交流，还有3套免费模板等你领
            </p>
            <Link
              href="/contact"
              className="block text-xs border border-white text-white px-4 py-2.5 hover:bg-white hover:text-black transition-colors"
            >
              加微信，进社群
            </Link>
          </div>

          <aside className="hidden lg:block space-y-5">
            {related.length > 0 && (
              <div className="border border-[#1f1f1f] p-5">
                <h4 className="text-xs font-medium text-[#555555] tracking-widest uppercase mb-4">
                  {meta.tag} · 相关文章
                </h4>
                <div className="space-y-4">
                  {related.map((r) => (
                    <Link key={r.slug} href={`/library/${r.slug}`} className="group block">
                      <p className="text-xs font-bold text-white group-hover:text-[#e0e0e0] transition-colors leading-snug mb-1">
                        {r.title}
                      </p>
                      <p className="text-[10px] text-[#555555]">
                        {r.readTime} 分钟 · {r.date}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="border border-[#1f1f1f] bg-[#0a0a0a] p-5 text-center">
              <div className="w-14 h-14 border border-[#333333] flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-xl font-bold">拾</span>
              </div>
              <p className="text-xs font-bold text-white mb-1">加入创作者社群</p>
              <p className="text-[10px] text-[#888888] mb-4 leading-relaxed">
                5000+ 创作者在这里交流，<br />还有3套免费模板等你领
              </p>
              <Link
                href="/contact"
                className="block text-xs border border-white text-white px-4 py-2.5 hover:bg-white hover:text-black transition-colors"
              >
                加微信，进社群
              </Link>
            </div>

            <div className="border border-[#1f1f1f] p-5">
              <h4 className="text-xs font-medium text-[#555555] tracking-widest uppercase mb-4">浏览分类</h4>
              <div className="flex flex-wrap gap-2">
                {["个人定位","视觉表达","内容运营","账号增长","平台策略","IP案例","工具方法"].map((cat) => (
                  <Link
                    key={cat}
                    href={`/library?category=${cat}`}
                    className={`text-xs px-3 py-1.5 border transition-colors ${
                      cat === meta.tag
                        ? "bg-white text-black border-white"
                        : "text-[#888888] border-[#1f1f1f] hover:border-[#333333] hover:text-white"
                    }`}
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
