import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

async function guard() {
  const s = await getSession();
  return s ? null : NextResponse.json({ error: "未授权" }, { status: 401 });
}

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  const err = await guard(); if (err) return err;
  const { id } = await params;
  const article = await prisma.article.findUnique({ where: { id } });
  if (!article) return NextResponse.json({ error: "文章不存在" }, { status: 404 });
  return NextResponse.json(article);
}

export async function PUT(req: Request, { params }: Ctx) {
  const err = await guard(); if (err) return err;
  const { id } = await params;
  const { title, slug, tag, desc, date, readTime, content, published } = await req.json();
  try {
    const article = await prisma.article.update({
      where: { id },
      data: { title, slug, tag, desc, date: new Date(date), readTime: readTime || "5", content: content || "", published: !!published },
    });
    return NextResponse.json(article);
  } catch (e: unknown) {
    const code = (e as { code?: string })?.code;
    if (code === "P2002") return NextResponse.json({ error: "Slug 已存在" }, { status: 400 });
    return NextResponse.json({ error: "更新失败" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const err = await guard(); if (err) return err;
  const { id } = await params;
  await prisma.article.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
