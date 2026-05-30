import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Setting } from "@/lib/models";
import { getSession, hashPassword, verifyPassword } from "@/lib/auth";

async function guard() {
  const s = await getSession();
  return s ? null : NextResponse.json({ error: "未授权" }, { status: 401 });
}

export async function POST(req: Request) {
  const err = await guard(); if (err) return err;
  const { action, currentPassword, newPassword, newPhone } = await req.json();

  if (action === "change_password") {
    if (!newPassword || newPassword.length < 6)
      return NextResponse.json({ error: "新密码至少6位" }, { status: 400 });

    await connectDB();
    let valid = false;
    try {
      const setting = await Setting.findOne({ key: "admin_password_hash" }).lean();
      if (setting?.value) valid = await verifyPassword(currentPassword, setting.value);
    } catch {}
    if (!valid) {
      const envPwd = process.env.ADMIN_PASSWORD;
      if (envPwd && currentPassword === envPwd) valid = true;
    }
    if (!valid) return NextResponse.json({ error: "当前密码错误" }, { status: 400 });

    const hash = await hashPassword(newPassword);
    await Setting.findOneAndUpdate(
      { key: "admin_password_hash" },
      { value: hash },
      { upsert: true }
    );
    return NextResponse.json({ ok: true });
  }

  if (action === "change_phone") {
    if (!newPhone || !/^1[3-9]\d{9}$/.test(newPhone))
      return NextResponse.json({ error: "请输入正确的手机号" }, { status: 400 });

    await connectDB();
    let valid = false;
    try {
      const setting = await Setting.findOne({ key: "admin_password_hash" }).lean();
      if (setting?.value) valid = await verifyPassword(currentPassword, setting.value);
    } catch {}
    if (!valid) {
      const envPwd = process.env.ADMIN_PASSWORD;
      if (envPwd && currentPassword === envPwd) valid = true;
    }
    if (!valid) return NextResponse.json({ error: "密码验证失败" }, { status: 400 });

    await Setting.findOneAndUpdate(
      { key: "admin_phone" },
      { value: newPhone },
      { upsert: true }
    );
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "未知操作" }, { status: 400 });
}
