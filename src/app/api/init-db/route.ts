import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { articles } from "../../../../prisma/articles-data";

function buildContent(a: (typeof articles)[0]) {
  return [
    `## 痛点切入\n\n${a.sections.pain}`,
    `\n## 核心公式\n\n> ${a.sections.formula}`,
    `\n## 三步拆解\n\n${a.sections.steps.map((s, i) => `### ${i + 1}. ${s.title}\n\n${s.body}`).join("\n\n")}`,
    `\n## 真实案例\n\n${a.sections.caseStudy}`,
    `\n## 常见避坑\n\n${a.sections.pitfalls.map((p) => `- ${p}`).join("\n")}`,
    `\n## 今天就行动\n\n${a.sections.action}`,
  ].join("\n");
}

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== "brandlab-init-2026") {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const existingRows = await prisma.article.findMany({ select: { slug: true } });
    const existingSlugs = new Set(existingRows.map((r) => r.slug));
    const toInsert = articles.filter((a) => !existingSlugs.has(a.slug));

    if (toInsert.length === 0) {
      return NextResponse.json({ message: `已跳过，数据库已有 ${existingRows.length} 篇文章` });
    }

    // createMany requires replica set on MongoDB — use individual creates instead
    let count = 0;
    for (const a of toInsert) {
      await prisma.article.create({
        data: {
          slug: a.slug,
          title: a.title,
          tag: a.tag,
          desc: a.desc,
          date: new Date(a.date),
          readTime: a.readTime,
          published: true,
          content: buildContent(a),
        },
      });
      count++;
    }

    return NextResponse.json({ message: `成功写入 ${count} 篇文章`, total: count });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
