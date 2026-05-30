import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models";
import { getUserSession, isSubscriptionActive } from "@/lib/userAuth";

export async function GET() {
  const session = await getUserSession();
  if (!session) return NextResponse.json({ error: "未登录" }, { status: 401 });

  await connectDB();
  const user = await User.findById(session.userId).lean();
  if (!user) return NextResponse.json({ error: "用户不存在" }, { status: 404 });

  return NextResponse.json({
    phone: user.phone,
    subscriptionPlan: user.subscriptionPlan,
    subscriptionExpiry: user.subscriptionExpiry,
    isActive: isSubscriptionActive(user.subscriptionPlan, user.subscriptionExpiry ?? null),
  });
}
