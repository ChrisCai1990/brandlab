import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession, hashPassword, verifyPassword } from "@/lib/auth";

async function guard() {
  const s = await getSession();
  return s ? null : NextResponse.json({ error: "未授权" }, { status: 401 });
}

export async function POST(req: Request) {
  const err = await guard(); if (err) return err;
  const { action, currentPassword, newPassword } = await req.json();

  if (action === "change_password") {
    if (!newPassword || newPassword.length < 6)
      return NextResponse.json({ error: "新密码至少6位" }, { status: 400 });

    // Verify current password
    let valid = false;
    try {
      const setting = await prisma.setting.findUnique({ where: { key: "admin_password_hash" } });
      if (setting?.value) valid = await verifyPassword(currentPassword, setting.value);
    } catch {}
    if (!valid) {
      const envPwd = process.env.ADMIN_PASSWORD;
      if (envPwd && currentPassword === envPwd) valid = true;
    }
    if (!valid) return NextResponse.json({ error: "当前密码错误" }, { status: 400 });

    const hash = await hashPassword(newPassword);
    await prisma.setting.upsert({
      where: { key: "admin_password_hash" },
      update: { value: hash },
      create: { key: "admin_password_hash", value: hash },
    });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "未知操作" }, { status: 400 });
}
