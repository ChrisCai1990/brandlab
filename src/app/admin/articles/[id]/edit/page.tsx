import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { ArticleForm } from "@/components/admin/ArticleForm";

export const dynamic = "force-dynamic";

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
