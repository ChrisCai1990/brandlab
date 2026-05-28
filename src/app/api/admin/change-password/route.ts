import { NextRequest, NextResponse } from "next/server";
import { getSession, hashPassword, verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  if (!(await getSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { currentPassword, newPassword } = await req.json();

  if (!newPassword || newPassword.length < 6) {
    return NextResponse.json({ error: "新密码至少 6 位" }, { status: 400 });
  }

  const setting = await prisma.setting.findUnique({ where: { key: "admin_password" } });

  if (setting) {
    const valid = await verifyPassword(currentPassword, setting.value);
    if (!valid) {
      return NextResponse.json({ error: "当前密码错误" }, { status: 401 });
    }
  } else {
    if (currentPassword !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: "当前密码错误" }, { status: 401 });
    }
  }

  const hash = await hashPassword(newPassword);
  await prisma.setting.upsert({
    where: { key: "admin_password" },
    update: { value: hash },
    create: { key: "admin_password", value: hash },
  });

  return NextResponse.json({ ok: true });
}
