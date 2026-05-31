import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Setting } from "@/lib/models";
import { hashPassword } from "@/lib/auth";

// 临时重置接口 — 部署后调用一次，立即删除
const RESET_TOKEN = "brandlab-reset-2026";

export async function POST(req: Request) {
  const { token, phone, password } = await req.json();
  if (token !== RESET_TOKEN) {
    return NextResponse.json({ error: "invalid token" }, { status: 403 });
  }
  if (!phone || !password) {
    return NextResponse.json({ error: "phone and password required" }, { status: 400 });
  }

  await connectDB();

  const hash = await hashPassword(password);

  await Setting.findOneAndUpdate(
    { key: "admin_phone" },
    { key: "admin_phone", value: phone },
    { upsert: true }
  );
  await Setting.findOneAndUpdate(
    { key: "admin_password_hash" },
    { key: "admin_password_hash", value: hash },
    { upsert: true }
  );

  return NextResponse.json({ ok: true, message: "credentials reset" });
}
