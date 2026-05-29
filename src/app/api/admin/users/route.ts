import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models";

const ADMIN_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET ?? "dev-secret-change-in-production"
);

async function checkAdmin(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_session")?.value;
    if (!token) return false;
    await jwtVerify(token, ADMIN_SECRET);
    return true;
  } catch {
    return false;
  }
}

function addDays(base: Date, days: number): Date {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
}

// GET /api/admin/users — 列出所有用户
export async function GET() {
  if (!(await checkAdmin()))
    return NextResponse.json({ error: "未授权" }, { status: 401 });

  await connectDB();

  const users = await User.find()
    .sort({ createdAt: -1 })
    .select("email subscriptionPlan subscriptionExpiry createdAt")
    .lean();

  const now = new Date();
  const result = users.map((u) => ({
    id: String(u._id),
    email: u.email,
    plan: u.subscriptionPlan,
    expiry: u.subscriptionExpiry ? u.subscriptionExpiry.toISOString() : null,
    isActive:
      u.subscriptionPlan === "lifetime" ||
      (u.subscriptionPlan !== "free" && u.subscriptionExpiry != null && u.subscriptionExpiry > now),
    createdAt: u.createdAt.toISOString(),
  }));

  return NextResponse.json({ users: result });
}

// PATCH /api/admin/users — 激活/修改会员
// body: { userId, plan, days? }
// plan: "monthly" | "yearly" | "lifetime" | "free"
// days: 仅 monthly/yearly 有效，默认 monthly=30, yearly=365
export async function PATCH(req: Request) {
  if (!(await checkAdmin()))
    return NextResponse.json({ error: "未授权" }, { status: 401 });

  const { userId, plan, days } = await req.json() as {
    userId: string;
    plan: "free" | "monthly" | "yearly" | "lifetime";
    days?: number;
  };

  if (!userId || !plan)
    return NextResponse.json({ error: "缺少参数" }, { status: 400 });

  await connectDB();

  const user = await User.findById(userId);
  if (!user)
    return NextResponse.json({ error: "用户不存在" }, { status: 404 });

  const now = new Date();

  if (plan === "free") {
    user.subscriptionPlan = "free";
    user.subscriptionExpiry = null;
  } else if (plan === "lifetime") {
    user.subscriptionPlan = "lifetime";
    user.subscriptionExpiry = null;
  } else {
    const defaultDays = plan === "monthly" ? 30 : 365;
    const d = days ?? defaultDays;
    // 若当前会员未过期，从到期日顺延；否则从今天起算
    const base =
      user.subscriptionExpiry && user.subscriptionExpiry > now
        ? user.subscriptionExpiry
        : now;
    user.subscriptionPlan = plan;
    user.subscriptionExpiry = addDays(base, d);
  }

  await user.save();

  return NextResponse.json({
    success: true,
    user: {
      id: String(user._id),
      email: user.email,
      plan: user.subscriptionPlan,
      expiry: user.subscriptionExpiry?.toISOString() ?? null,
    },
  });
}
