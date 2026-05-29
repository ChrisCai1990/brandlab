import { NextRequest, NextResponse } from "next/server";
import { getSession, hashPassword, verifyPassword } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Setting } from "@/lib/models";

export async function POST(req: NextRequest) {
  if (!(await getSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { currentPassword, newPassword } = await req.json();
  if (!newPassword || newPassword.length < 6) {
    return NextResponse.json({ error: "新密码至少 6 位" }, { status: 400 });
  }

  await connectDB();
  const setting = await Setting.findOne({ key: "admin_password_hash" }).lean();

  if (setting) {
    const valid = await verifyPassword(currentPassword, setting.value);
    if (!valid) return NextResponse.json({ error: "当前密码错误" }, { status: 401 });
  } else {
    if (currentPassword !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: "当前密码错误" }, { status: 401 });
    }
  }

  const hash = await hashPassword(newPassword);
  await Setting.findOneAndUpdate(
    { key: "admin_password_hash" },
    { value: hash },
    { upsert: true }
  );

  return NextResponse.json({ ok: true });
}
