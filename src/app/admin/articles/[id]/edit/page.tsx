import { connectDB } from "@/lib/db";
import { Article } from "@/lib/models";
import { notFound } from "next/navigation";
import { ArticleForm } from "@/components/admin/ArticleForm";

export const dynamic = "force-dynamic";

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await connectDB();
  const article = await Article.findById(id).lean();
  if (!article) notFound();

  return (
    <ArticleForm
      initialData={{
        id: String(article._id),
        title: article.title,
        slug: article.slug,
        tag: article.tag,
        desc: article.desc,
        date: article.date.toISOString(),
        readTime: article.readTime,
        content: article.content,
        wechatHtml: article.wechatHtml ?? "",
        published: article.published,
      }}
    />
  );
}
