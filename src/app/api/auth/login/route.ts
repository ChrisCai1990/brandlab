import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models";
import { verifyPassword } from "@/lib/auth";
import { signUserToken, USER_COOKIE } from "@/lib/userAuth";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (!email || !password)
    return NextResponse.json({ error: "请填写邮箱和密码" }, { status: 400 });

  await connectDB();

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user)
    return NextResponse.json({ error: "邮箱或密码错误" }, { status: 401 });

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid)
    return NextResponse.json({ error: "邮箱或密码错误" }, { status: 401 });

  const token = await signUserToken(String(user._id), user.email);
  const res = NextResponse.json({ ok: true, email: user.email });
  res.cookies.set(USER_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
  return res;
}
