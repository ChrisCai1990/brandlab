import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Article } from "@/lib/models";
import { getSession } from "@/lib/auth";

async function guard() {
  const s = await getSession();
  return s ? null : NextResponse.json({ error: "未授权" }, { status: 401 });
}

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  const err = await guard(); if (err) return err;
  const { id } = await params;
  await connectDB();
  const article = await Article.findById(id).lean();
  if (!article) return NextResponse.json({ error: "文章不存在" }, { status: 404 });
  return NextResponse.json({ ...article, id: String(article._id) });
}

export async function PUT(req: Request, { params }: Ctx) {
  const err = await guard(); if (err) return err;
  const { id } = await params;
  const { title, slug, tag, desc, date, readTime, content, wechatHtml, published, isPremium } = await req.json();

  await connectDB();
  try {
    const article = await Article.findByIdAndUpdate(
      id,
      { title, slug, tag, desc, date: new Date(date), readTime: readTime || "5", content: content || "", wechatHtml: wechatHtml || "", published: !!published, isPremium: !!isPremium },
      { new: true }
    ).lean();
    if (!article) return NextResponse.json({ error: "文章不存在" }, { status: 404 });
    return NextResponse.json({ ...article, id: String(article._id) });
  } catch (e: unknown) {
    const code = (e as { code?: number })?.code;
    if (code === 11000) return NextResponse.json({ error: "Slug 已存在" }, { status: 400 });
    return NextResponse.json({ error: "更新失败" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const err = await guard(); if (err) return err;
  const { id } = await params;
  await connectDB();
  await Article.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}
