import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ArticleForm } from "@/components/admin/ArticleForm";

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await prisma.article.findUnique({ where: { id } });
  if (!article) notFound();

  return (
    <ArticleForm
      initialData={{
        id: article.id,
        title: article.title,
        slug: article.slug,
        tag: article.tag,
        desc: article.desc,
        date: article.date.toISOString(),
        readTime: article.readTime,
        content: article.content,
        published: article.published,
      }}
    />
  );
}
