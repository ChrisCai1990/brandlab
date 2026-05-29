import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Article } from "@/lib/models";
import { getSession } from "@/lib/auth";

async function guard() {
  const s = await getSession();
  return s ? null : NextResponse.json({ error: "未授权" }, { status: 401 });
}

export async function GET() {
  const err = await guard(); if (err) return err;
  await connectDB();
  const articles = await Article.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json(articles.map((a) => ({ ...a, id: String(a._id) })));
}

export async function POST(req: Request) {
  const err = await guard(); if (err) return err;
  const { title, slug, tag, desc, date, readTime, content, published, isPremium } = await req.json();
  if (!title?.trim() || !slug?.trim())
    return NextResponse.json({ error: "标题和 Slug 不能为空" }, { status: 400 });

  await connectDB();
  try {
    const article = await Article.create({
      title, slug, tag, desc,
      date: new Date(date),
      readTime: readTime || "5",
      content: content || "",
      published: !!published,
      isPremium: !!isPremium,
    });
    return NextResponse.json({ ...article.toObject(), id: String(article._id) });
  } catch (e: unknown) {
    const code = (e as { code?: number })?.code;
    if (code === 11000) return NextResponse.json({ error: "Slug 已存在，请修改后重试" }, { status: 400 });
    return NextResponse.json({ error: "创建失败" }, { status: 500 });
  }
}
