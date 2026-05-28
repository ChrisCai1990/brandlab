import { PrismaClient } from "@prisma/client";
import { articles } from "../src/lib/articles";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding articles...");

  for (const a of articles) {
    await prisma.article.upsert({
      where: { slug: a.slug },
      update: {},
      create: {
        slug: a.slug,
        title: a.title,
        tag: a.tag,
        desc: a.desc,
        date: new Date(a.date),
        readTime: a.readTime,
        published: true,
        content: [
          `## 痛点切入\n\n${a.sections.pain}`,
          `\n## 核心公式\n\n> ${a.sections.formula}`,
          `\n## 三步拆解\n\n${a.sections.steps.map((s, i) => `### ${i + 1}. ${s.title}\n\n${s.body}`).join("\n\n")}`,
          `\n## 真实案例\n\n${a.sections.caseStudy}`,
          `\n## 常见避坑\n\n${a.sections.pitfalls.map((p) => `- ${p}`).join("\n")}`,
          `\n## 今天就行动\n\n${a.sections.action}`,
        ].join("\n"),
      },
    });
    console.log(`✓ ${a.title}`);
  }

  console.log("Done!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
