import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

async function guard() {
  const s = await getSession();
  return s ? null : NextResponse.json({ error: "未授权" }, { status: 401 });
}

export async function GET() {
  const err = await guard(); if (err) return err;
  const articles = await prisma.article.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(articles);
}

export async function POST(req: Request) {
  const err = await guard(); if (err) return err;
  const { title, slug, tag, desc, date, readTime, content, published } = await req.json();
  if (!title?.trim() || !slug?.trim())
    return NextResponse.json({ error: "标题和 Slug 不能为空" }, { status: 400 });
  try {
    const article = await prisma.article.create({
      data: { title, slug, tag, desc, date: new Date(date), readTime: readTime || "5", content: content || "", published: !!published },
    });
    return NextResponse.json(article);
  } catch (e: unknown) {
    const code = (e as { code?: string })?.code;
    if (code === "P2002") return NextResponse.json({ error: "Slug 已存在，请修改后重试" }, { status: 400 });
    return NextResponse.json({ error: "创建失败" }, { status: 500 });
  }
}
