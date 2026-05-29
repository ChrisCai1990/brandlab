import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { connectDB } from "@/lib/db";
import { Article } from "@/lib/models";
import { ReadingProgress } from "@/components/ReadingProgress";
import { ShareButtons } from "@/components/ShareButtons";
import { ViewTracker } from "@/components/ViewTracker";
import { BookmarkButton } from "@/components/BookmarkButton";
import { ReadingTracker } from "@/components/ReadingTracker";
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
    <h2 className="flex items-center gap-2 text-sm font-bold text-[#1b4332] mt-10 mb-4" {...props}>
      <span className="w-1 h-4 bg-[#2d6a4f] rounded-full shrink-0" />
      {props.children}
    </h2>
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="text-sm font-bold text-[#1b4332] mt-6 mb-2" {...props} />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="text-sm text-[#6b7280] leading-relaxed mb-4" {...props} />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="space-y-2 mb-4" {...props} />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="flex items-start gap-2.5 text-sm text-[#6b7280]">
      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#52b788] shrink-0" />
      <span>{props.children}</span>
    </li>
  ),
  strong: (props: React.HTMLAttributes<HTMLElement>) => (
    <strong className="font-bold text-[#1b4332]" {...props} />
  ),
  blockquote: (props: React.HTMLAttributes<HTMLElement>) => (
    <div className="my-6 bg-[#f0faf4] border-l-4 border-[#2d6a4f] rounded-r-xl px-6 py-5">
      <p className="text-xs text-[#40916c] font-medium tracking-widest uppercase mb-2">核心公式</p>
      <div className="text-base font-bold text-[#1b4332] leading-snug [&_p]:text-[#1b4332] [&_p]:text-base [&_p]:font-bold [&_p]:leading-snug [&_p]:mb-0">
        {props.children}
      </div>
    </div>
  ),
  hr: () => <hr className="my-8 border-[#95d5b2]" />,
};

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const dbArticle = await getArticle(slug);
  if (!dbArticle) notFound();

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
    <div className="bg-white min-h-screen">
      <ReadingProgress />
      <ViewTracker slug={slug} />
      <ReadingTracker slug={slug} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="border-b border-[#95d5b2] bg-[#f0faf4]">
        <div className="max-w-7xl mx-auto px-8 py-3 flex items-center gap-2 text-xs text-[#6b7280]">
          <Link href="/" className="hover:text-[#2d6a4f] transition-colors">首页</Link>
          <span>/</span>
          <Link href="/library" className="hover:text-[#2d6a4f] transition-colors">内容库</Link>
          <span>/</span>
          <span className="text-[#1b4332] font-medium line-clamp-1">{meta.title}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <article className="lg:col-span-2" id="article-content">
            <div className="flex items-center gap-3 mb-5 flex-wrap">
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#f0faf4] text-[#2d6a4f]">
                {meta.tag}
              </span>
              <span className="text-xs text-[#6b7280]">{meta.date}</span>
              <span className="text-xs text-[#6b7280]">{meta.readTime} 分钟阅读</span>
              <BookmarkButton slug={slug} title={meta.title} />
            </div>

            <h1 className="text-3xl font-bold text-[#1b4332] leading-tight mb-4">{meta.title}</h1>
            <p className="text-base text-[#6b7280] leading-relaxed mb-8 border-l-2 border-[#52b788] pl-4">
              {meta.desc}
            </p>

            <div className="prose-brandlab">
              <MDXRemote source={dbArticle.content} components={mdxComponents} />
            </div>

            <ShareButtons title={meta.title} url={pageUrl} />

            <div className="mt-6">
              <Link href="/library" className="text-sm text-[#6b7280] hover:text-[#40916c] transition-colors">
                ← 返回内容库
              </Link>
            </div>
          </article>

          {/* Mobile CTA - shown below article on small screens */}
          <div className="lg:hidden mt-8 bg-[#1b4332] rounded-xl p-5 text-center">
            <div className="w-12 h-12 rounded-xl bg-[#2d6a4f] flex items-center justify-center mx-auto mb-3">
              <span className="text-white text-lg font-bold">拾</span>
            </div>
            <p className="text-xs font-bold text-white mb-1">加入创作者社群</p>
            <p className="text-[10px] text-[#b7e4c7] mb-4 leading-relaxed">
              5000+ 创作者在这里交流，还有3套免费模板等你领
            </p>
            <Link
              href="/contact"
              className="block text-xs bg-[#1b4332] border border-[#52b788] text-white px-4 py-2.5 rounded-lg hover:bg-[#2d6a4f] transition-colors"
            >
              加微信，进社群
            </Link>
          </div>

          <aside className="hidden lg:block space-y-5">
            {related.length > 0 && (
              <div className="border border-[#95d5b2] rounded-xl p-5">
                <h4 className="text-xs font-medium text-[#52b788] tracking-widest uppercase mb-4">
                  {meta.tag} · 相关文章
                </h4>
                <div className="space-y-4">
                  {related.map((r) => (
                    <Link key={r.slug} href={`/library/${r.slug}`} className="group block">
                      <p className="text-xs font-bold text-[#1b4332] group-hover:text-[#1B4332] transition-colors leading-snug mb-1">
                        {r.title}
                      </p>
                      <p className="text-[10px] text-[#6b7280]">
                        {r.readTime} 分钟 · {r.date}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-[#1b4332] rounded-xl p-5 text-center">
              <div className="w-14 h-14 rounded-xl bg-[#2d6a4f] flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-xl font-bold">拾</span>
              </div>
              <p className="text-xs font-bold text-white mb-1">加入创作者社群</p>
              <p className="text-[10px] text-[#b7e4c7] mb-4 leading-relaxed">
                5000+ 创作者在这里交流，<br />还有3套免费模板等你领
              </p>
              <Link
                href="/contact"
                className="block text-xs bg-[#1B4332] border border-[#52b788] text-white px-4 py-2.5 rounded-lg hover:bg-[#2d6a4f] transition-colors"
              >
                加微信，进社群
              </Link>
            </div>

            <div className="border border-[#95d5b2] rounded-xl p-5">
              <h4 className="text-xs font-medium text-[#52b788] tracking-widest uppercase mb-4">浏览分类</h4>
              <div className="flex flex-wrap gap-2">
                {["个人定位","视觉表达","内容运营","账号增长","平台策略","IP案例","工具方法"].map((cat) => (
                  <Link
                    key={cat}
                    href={`/library?category=${cat}`}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                      cat === meta.tag
                        ? "bg-[#f0faf4] text-[#2d6a4f] border-[#52b788]"
                        : "text-[#6b7280] border-[#95d5b2] hover:border-[#52b788]"
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
