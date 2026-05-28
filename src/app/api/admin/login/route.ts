import { NextRequest, NextResponse } from "next/server";
import { signToken, verifyPassword, COOKIE_NAME } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  let valid = false;
  try {
    const setting = await prisma.setting.findUnique({ where: { key: "admin_password" } });
    if (setting) {
      valid = await verifyPassword(password, setting.value);
    } else {
      valid = password === process.env.ADMIN_PASSWORD;
    }
  } catch {
    // Setting 表尚未创建时回退到环境变量
    valid = password === process.env.ADMIN_PASSWORD;
  }

  if (!valid) {
    return NextResponse.json({ error: "密码错误" }, { status: 401 });
  }

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
