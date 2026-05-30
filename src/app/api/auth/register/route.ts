import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models";
import { hashPassword } from "@/lib/auth";
import { signUserToken, USER_COOKIE } from "@/lib/userAuth";

export async function POST(req: Request) {
  const { phone, password } = await req.json();

  if (!phone || !/^1[3-9]\d{9}$/.test(phone))
    return NextResponse.json({ error: "请输入正确的11位手机号" }, { status: 400 });
  if (!password || password.length < 6)
    return NextResponse.json({ error: "密码至少6位" }, { status: 400 });

  await connectDB();

  const exists = await User.findOne({ phone }).lean();
  if (exists)
    return NextResponse.json({ error: "该手机号已注册" }, { status: 409 });

  const passwordHash = await hashPassword(password);
  const user = await User.create({ phone, passwordHash });

  const token = await signUserToken(String(user._id), user.phone);
  const res = NextResponse.json({ ok: true, phone: user.phone });
  res.cookies.set(USER_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
  return res;
}
