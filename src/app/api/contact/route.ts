import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { name, wechat, message } = await req.json();
  if (!name?.trim() || !message?.trim())
    return NextResponse.json({ error: "姓名和留言不能为空" }, { status: 400 });

  // Log to console (Railway logs) — connect email service here when ready
  console.log("[Contact]", { name, wechat, message, time: new Date().toISOString() });

  return NextResponse.json({ ok: true });
}
