import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { articles, getArticleBySlug } from "@/lib/articles";
import { getMdxArticle, getAllMdxSlugs } from "@/lib/mdx";
import { prisma } from "@/lib/db";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

async function getDbArticle(slug: string) {
  try {
    return await prisma.article.findUnique({ where: { slug, published: true } });
  } catch {
    return null;
  }
}

async function getAllDbSlugs() {
  try {
    const rows = await prisma.article.findMany({ where: { published: true }, select: { slug: true } });
    return rows.map((r) => r.slug);
  } catch {
    return [];
  }
}

export async function generateStaticParams() {
  const mdxSlugs = getAllMdxSlugs();
  const tsSlugs = articles.map((a) => a.slug);
  const dbSlugs = await getAllDbSlugs();
  const all = Array.from(new Set([...mdxSlugs, ...tsSlugs, ...dbSlugs]));
  return all.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const db = await getDbArticle(slug);
  if (db) return { title: db.title, description: db.desc };
  const article = getArticleBySlug(slug);
  if (!article) return {};
  return { title: article.title, description: article.desc };
}

const mdxComponents = {
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="flex items-center gap-2 text-sm font-bold text-[#1A2E22] mt-10 mb-4" {...props}>
      <span className="w-1 h-4 bg-[#2D6A4F] rounded-full shrink-0" />
      {props.children}
    </h2>
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="text-sm font-bold text-[#1A2E22] mt-6 mb-2" {...props} />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="text-sm text-[#6B7A6E] leading-relaxed mb-4" {...props} />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="space-y-2 mb-4" {...props} />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="flex items-start gap-2.5 text-sm text-[#6B7A6E]">
      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#6BAF8A] shrink-0" />
      <span>{props.children}</span>
    </li>
  ),
  strong: (props: React.HTMLAttributes<HTMLElement>) => (
    <strong className="font-bold text-[#1A2E22]" {...props} />
  ),
  blockquote: (props: React.HTMLAttributes<HTMLElement>) => (
    <div className="my-6 bg-[#1A2E22] rounded-xl px-6 py-5">
      <p className="text-xs text-[#6BAF8A] font-medium tracking-widest uppercase mb-2">核心公式</p>
      <div className="text-base font-bold text-white leading-snug [&_p]:text-white [&_p]:text-base [&_p]:font-bold [&_p]:leading-snug [&_p]:mb-0">
        {props.children}
      </div>
    </div>
  ),
  hr: () => <hr className="my-8 border-[#C8DDD2]" />,
};

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const dbArticle = await getDbArticle(slug);
  const staticArticle = getArticleBySlug(slug);
  const mdx = getMdxArticle(slug);

  if (!dbArticle && !staticArticle) notFound();

  const meta = dbArticle
    ? {
        title: dbArticle.title,
        tag: dbArticle.tag,
        desc: dbArticle.desc,
        date: new Date(dbArticle.date).toISOString().split("T")[0],
        readTime: dbArticle.readTime,
      }
    : {
        title: staticArticle!.title,
        tag: staticArticle!.tag,
        desc: staticArticle!.desc,
        date: staticArticle!.date,
        readTime: staticArticle!.readTime,
      };

  const content = dbArticle?.content ?? mdx?.content ?? null;
  const related = staticArticle
    ? articles.filter((a) => a.tag === meta.tag && a.slug !== slug).slice(0, 3)
    : [];

  return (
    <div className="bg-white min-h-screen">
      <div className="border-b border-[#C8DDD2] bg-[#F7FBF8]">
        <div className="max-w-7xl mx-auto px-8 py-3 flex items-center gap-2 text-xs text-[#6B7A6E]">
          <Link href="/" className="hover:text-[#2D6A4F] transition-colors">首页</Link>
          <span>/</span>
          <Link href="/library" className="hover:text-[#2D6A4F] transition-colors">内容库</Link>
          <span>/</span>
          <span className="text-[#1A2E22] font-medium line-clamp-1">{meta.title}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <article className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#E8F5EE] text-[#2D6A4F]">
                {meta.tag}
              </span>
              <span className="text-xs text-[#6B7A6E]">{meta.date}</span>
              <span className="text-xs text-[#6B7A6E]">{meta.readTime} 分钟阅读</span>
            </div>

            <h1 className="text-3xl font-bold text-[#1A2E22] leading-tight mb-4">{meta.title}</h1>
            <p className="text-base text-[#6B7A6E] leading-relaxed mb-8 border-l-2 border-[#6BAF8A] pl-4">
              {meta.desc}
            </p>

            {content ? (
              <div className="prose-brandlab">
                <MDXRemote source={content} components={mdxComponents} />
              </div>
            ) : staticArticle ? (
              <FallbackContent article={staticArticle} />
            ) : null}

            {staticArticle && !dbArticle && (
              <div className="mt-10 border border-[#2D6A4F] rounded-xl p-6 bg-[#E8F5EE]">
                <p className="text-xs text-[#2D6A4F] font-medium tracking-widest uppercase mb-3">今天就行动</p>
                <p className="text-sm text-[#1A2E22] leading-relaxed">{staticArticle.sections.action}</p>
              </div>
            )}

            <div className="mt-10 pt-8 border-t border-[#C8DDD2]">
              <Link href="/library" className="text-sm text-[#2D6A4F] hover:text-[#1B4332] transition-colors">
                ← 返回内容库
              </Link>
            </div>
          </article>

          <aside className="space-y-5">
            {related.length > 0 && (
              <div className="border border-[#C8DDD2] rounded-xl p-5">
                <h4 className="text-xs font-medium text-[#6BAF8A] tracking-widest uppercase mb-4">
                  {meta.tag} · 相关文章
                </h4>
                <div className="space-y-4">
                  {related.map((r) => (
                    <Link key={r.slug} href={`/library/${r.slug}`} className="group block">
                      <p className="text-xs font-bold text-[#1A2E22] group-hover:text-[#1B4332] transition-colors leading-snug mb-1">
                        {r.title}
                      </p>
                      <p className="text-[10px] text-[#6B7A6E]">{r.readTime} 分钟 · {r.date}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-[#1A2E22] rounded-xl p-5 text-center">
              <div className="w-14 h-14 rounded-xl bg-[#2D6A4F] flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-xl font-bold">拾</span>
              </div>
              <p className="text-xs font-bold text-white mb-1">加入创作者社群</p>
              <p className="text-[10px] text-[#A8D5BB] mb-4 leading-relaxed">
                5000+ 创作者在这里交流，<br />还有3套免费模板等你领
              </p>
              <Link
                href="/contact"
                className="block text-xs bg-[#1B4332] border border-[#6BAF8A] text-white px-4 py-2.5 rounded-lg hover:bg-[#2D6A4F] transition-colors"
              >
                加微信，进社群
              </Link>
            </div>

            <div className="border border-[#C8DDD2] rounded-xl p-5">
              <h4 className="text-xs font-medium text-[#6BAF8A] tracking-widest uppercase mb-4">浏览分类</h4>
              <div className="flex flex-wrap gap-2">
                {["个人定位","视觉表达","内容运营","账号增长","平台策略","IP案例","工具方法"].map((cat) => (
                  <Link
                    key={cat}
                    href={`/library?category=${cat}`}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                      cat === meta.tag
                        ? "bg-[#E8F5EE] text-[#2D6A4F] border-[#6BAF8A]"
                        : "text-[#6B7A6E] border-[#C8DDD2] hover:border-[#6BAF8A]"
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

function FallbackContent({ article }: { article: ReturnType<typeof getArticleBySlug> }) {
  if (!article) return null;
  const { sections } = article;
  return (
    <div className="space-y-2">
      <Section label="痛点切入" bg>
        <p className="text-sm text-[#1A2E22] leading-relaxed">{sections.pain}</p>
      </Section>
      <div className="my-6 bg-[#1A2E22] rounded-xl px-6 py-5">
        <p className="text-xs text-[#6BAF8A] font-medium tracking-widest uppercase mb-2">核心公式</p>
        <p className="text-base font-bold text-white leading-snug">{sections.formula}</p>
      </div>
      <Section label="三步拆解">
        <div className="space-y-5">
          {sections.steps.map((step, i) => (
            <div key={i} className="flex gap-4">
              <div className="shrink-0 w-7 h-7 rounded-full bg-[#E8F5EE] border border-[#C8DDD2] flex items-center justify-center text-xs font-bold text-[#2D6A4F]">
                {i + 1}
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#1A2E22] mb-1.5">{step.title}</h3>
                <p className="text-sm text-[#6B7A6E] leading-relaxed">{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>
      <Section label="真实案例">
        <div className="bg-[#F7FBF8] border border-[#C8DDD2] rounded-lg p-4">
          <p className="text-sm text-[#1A2E22] leading-relaxed">{sections.caseStudy}</p>
        </div>
      </Section>
      <Section label="常见避坑">
        <ul className="space-y-2">
          {sections.pitfalls.map((p, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-[#6B7A6E]">
              <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#6BAF8A] shrink-0" />
              {p}
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}

function Section({ label, bg, children }: { label: string; bg?: boolean; children: React.ReactNode }) {
  return (
    <div className="mt-8">
      <div className="flex items-center gap-2 mb-4">
        <span className="w-1 h-4 bg-[#2D6A4F] rounded-full" />
        <h2 className="text-sm font-bold text-[#1A2E22]">{label}</h2>
      </div>
      {bg ? <div className="bg-[#E8F5EE] rounded-xl p-4">{children}</div> : children}
    </div>
  );
}
