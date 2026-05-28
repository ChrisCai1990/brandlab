import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

async function requireAuth() {
  if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return null;
}

export async function GET(_: NextRequest, { params }: Params) {
  const { id } = await params;
  const article = await prisma.article.findUnique({ where: { id } });
  if (!article) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(article);
}

export async function PUT(req: NextRequest, { params }: Params) {
  const authError = await requireAuth();
  if (authError) return authError;

  const { id } = await params;
  const data = await req.json();
  const article = await prisma.article.update({
    where: { id },
    data: { ...data, date: new Date(data.date) },
  });
  return NextResponse.json(article);
}

export async function DELETE(_: NextRequest, { params }: Params) {
  const authError = await requireAuth();
  if (authError) return authError;

  const { id } = await params;
  await prisma.article.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
