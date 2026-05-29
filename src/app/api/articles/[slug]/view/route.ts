import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Article } from "@/lib/models";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    await connectDB();
    await Article.findOneAndUpdate({ slug }, { $inc: { views: 1 } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
