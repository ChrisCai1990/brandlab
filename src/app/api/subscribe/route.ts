import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Subscriber } from "@/lib/models";

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "请输入有效邮箱" }, { status: 400 });
  }
  try {
    await connectDB();
    await Subscriber.create({ email });
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    if ((e as { code?: number }).code === 11000) {
      return NextResponse.json({ error: "该邮箱已订阅" }, { status: 409 });
    }
    return NextResponse.json({ error: "订阅失败" }, { status: 500 });
  }
}
