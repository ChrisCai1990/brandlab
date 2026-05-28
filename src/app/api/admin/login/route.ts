import { NextResponse } from "next/server";
import { signToken, verifyPassword, COOKIE_NAME } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const { password } = await req.json();
  if (!password) return NextResponse.json({ error: "请输入密码" }, { status: 400 });

  let valid = false;
  try {
    const setting = await prisma.setting.findUnique({ where: { key: "admin_password_hash" } });
    if (setting?.value) valid = await verifyPassword(password, setting.value);
  } catch {}

  if (!valid) {
    const envPwd = process.env.ADMIN_PASSWORD;
    if (envPwd && password === envPwd) valid = true;
  }

  if (!valid) return NextResponse.json({ error: "密码错误" }, { status: 401 });

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
