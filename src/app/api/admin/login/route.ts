import { NextResponse } from "next/server";
import { signToken, verifyPassword, COOKIE_NAME } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Setting } from "@/lib/models";

export async function POST(req: Request) {
  const { phone, password } = await req.json();
  if (!phone) return NextResponse.json({ error: "请输入手机号" }, { status: 400 });
  if (!password) return NextResponse.json({ error: "请输入密码" }, { status: 400 });

  // 验证手机号
  let phoneValid = false;
  try {
    await connectDB();
    const phoneSetting = await Setting.findOne({ key: "admin_phone" }).lean();
    if (phoneSetting?.value) {
      phoneValid = phoneSetting.value === phone;
    } else {
      const envPhone = process.env.ADMIN_PHONE;
      if (envPhone && phone === envPhone) phoneValid = true;
    }
  } catch {
    const envPhone = process.env.ADMIN_PHONE;
    if (envPhone && phone === envPhone) phoneValid = true;
  }

  if (!phoneValid) return NextResponse.json({ error: "手机号或密码错误" }, { status: 401 });

  // 验证密码
  let valid = false;
  try {
    const setting = await Setting.findOne({ key: "admin_password_hash" }).lean();
    if (setting?.value) valid = await verifyPassword(password, setting.value);
  } catch {}

  if (!valid) {
    const envPwd = process.env.ADMIN_PASSWORD;
    if (envPwd && password === envPwd) valid = true;
  }

  if (!valid) return NextResponse.json({ error: "手机号或密码错误" }, { status: 401 });

  const token = await signToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
  return res;
}
