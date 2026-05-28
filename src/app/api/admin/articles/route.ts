import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const articles = await prisma.article.findMany({
    orderBy: { date: "desc" },
    select: { id: true, slug: true, title: true, tag: true, published: true, date: true, readTime: true, desc: true },
  });
  return NextResponse.json(articles);
}

export async function POST(req: NextRequest) {
  if (!(await getSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await req.json();
  const article = await prisma.article.create({
    data: { ...data, date: new Date(data.date) },
  });

  return NextResponse.json(article);
}
