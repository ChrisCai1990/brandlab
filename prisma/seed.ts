import { PrismaClient } from "@prisma/client";
import { articles } from "./articles-data";

const prisma = new PrismaClient();

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

async function main() {
  const existing = await prisma.article.count();
  if (existing >= articles.length) {
    console.log(`Seed skipped: ${existing} articles already in DB.`);
    return;
  }

  console.log(`Seeding ${articles.length} articles...`);

  // createMany requires replica set on MongoDB — use individual creates instead
  for (const a of articles) {
    const exists = await prisma.article.findUnique({ where: { slug: a.slug }, select: { id: true } });
    if (exists) continue;
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
  }

  console.log("Done!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
