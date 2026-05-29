"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type UserInfo = {
  email: string;
  subscriptionPlan: string;
  subscriptionExpiry: string | null;
  isActive: boolean;
};

const PLAN_LABELS: Record<string, string> = {
  free: "免费用户",
  monthly: "月度会员",
  yearly: "年度会员",
  lifetime: "终身会员",
};

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => {
        if (r.status === 401) { router.push("/login?redirect=/account"); return null; }
        return r.json();
      })
      .then((data) => { if (data) setUser(data); })
      .finally(() => setLoading(false));
  }, [router]);

  async function handleLogout() {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-[#6b7280]">加载中...</p>
      </div>
    );
  }

  if (!user) return null;

  const expiryStr = user.subscriptionExpiry
    ? new Date(user.subscriptionExpiry).toLocaleDateString("zh-CN")
    : null;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-xl mx-auto px-6 py-16">
        <div className="mb-10">
          <Link href="/" className="text-xs text-[#6b7280] hover:text-[#2d6a4f] transition-colors">
            ← 返回首页
          </Link>
          <h1 className="text-2xl font-bold text-[#1b4332] mt-3">我的账户</h1>
        </div>

        <div className="space-y-4">
          {/* Profile card */}
          <div className="border border-[#95d5b2] rounded-2xl p-6">
            <h2 className="text-xs font-medium text-[#52b788] tracking-widest uppercase mb-4">账户信息</h2>
            <p className="text-sm text-[#1b4332] font-medium">{user.email}</p>
          </div>

          {/* Subscription card */}
          <div className="border border-[#95d5b2] rounded-2xl p-6">
            <h2 className="text-xs font-medium text-[#52b788] tracking-widest uppercase mb-4">订阅状态</h2>
            <div className="flex items-center gap-3 mb-3">
              <span
                className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                  user.isActive
                    ? "bg-[#f0faf4] text-[#2d6a4f]"
                    : "bg-[#f3f4f6] text-[#6b7280]"
                }`}
              >
                {PLAN_LABELS[user.subscriptionPlan] ?? user.subscriptionPlan}
              </span>
              {user.isActive && (
                <span className="text-[10px] text-[#52b788]">有效中</span>
              )}
            </div>
            {expiryStr && (
              <p className="text-xs text-[#6b7280]">到期时间：{expiryStr}</p>
            )}
            {user.subscriptionPlan === "lifetime" && (
              <p className="text-xs text-[#52b788]">终身有效，无需续订</p>
            )}
            {!user.isActive && (
              <Link
                href="/member"
                className="inline-block mt-4 text-xs bg-[#1b4332] text-white px-4 py-2 rounded-lg hover:bg-[#40916c] transition-colors"
              >
                升级会员
              </Link>
            )}
            {user.isActive && user.subscriptionPlan !== "lifetime" && (
              <Link
                href="/member"
                className="inline-block mt-4 text-xs border border-[#95d5b2] text-[#6b7280] px-4 py-2 rounded-lg hover:border-[#2d6a4f] hover:text-[#2d6a4f] transition-colors"
              >
                升级套餐
              </Link>
            )}
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full text-sm text-[#6b7280] border border-[#e5e7eb] rounded-xl py-3 hover:border-red-300 hover:text-red-400 transition-colors disabled:opacity-50"
          >
            {loggingOut ? "退出中..." : "退出登录"}
          </button>
        </div>
      </div>
    </div>
  );
}
