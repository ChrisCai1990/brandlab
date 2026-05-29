import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models";
import { hashPassword } from "@/lib/auth";
import { signUserToken, USER_COOKIE } from "@/lib/userAuth";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (!email || !email.includes("@"))
    return NextResponse.json({ error: "请输入有效邮箱" }, { status: 400 });
  if (!password || password.length < 6)
    return NextResponse.json({ error: "密码至少6位" }, { status: 400 });

  await connectDB();

  const exists = await User.findOne({ email: email.toLowerCase() }).lean();
  if (exists)
    return NextResponse.json({ error: "该邮箱已注册" }, { status: 409 });

  const passwordHash = await hashPassword(password);
  const user = await User.create({ email: email.toLowerCase(), passwordHash });

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
