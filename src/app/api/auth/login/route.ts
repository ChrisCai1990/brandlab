import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models";
import { verifyPassword } from "@/lib/auth";
import { signUserToken, USER_COOKIE } from "@/lib/userAuth";

export async function POST(req: Request) {
  const { phone, password } = await req.json();

  if (!phone || !password)
    return NextResponse.json({ error: "请填写手机号和密码" }, { status: 400 });

  if (!/^1[3-9]\d{9}$/.test(phone))
    return NextResponse.json({ error: "请输入正确的手机号" }, { status: 400 });

  await connectDB();

  const user = await User.findOne({ phone });
  if (!user)
    return NextResponse.json({ error: "手机号或密码错误" }, { status: 401 });

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid)
    return NextResponse.json({ error: "手机号或密码错误" }, { status: 401 });

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
