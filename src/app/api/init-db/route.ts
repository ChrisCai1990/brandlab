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
    const existing = await prisma.article.count();
    if (existing >= articles.length) {
      return NextResponse.json({ message: `已跳过，数据库已有 ${existing} 篇文章` });
    }

    const result = await prisma.article.createMany({
      data: articles.map((a) => ({
        slug: a.slug,
        title: a.title,
        tag: a.tag,
        desc: a.desc,
        date: new Date(a.date),
        readTime: a.readTime,
        published: true,
        content: buildContent(a),
      })),
      skipDuplicates: true,
    });

    return NextResponse.json({ message: `成功写入 ${result.count} 篇文章`, total: result.count });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
