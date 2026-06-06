"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type UserInfo = {
  phone: string;
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
      <div className="min-h-screen flex items-center justify-center bg-black">
        <p className="text-sm text-[#888888]">加载中...</p>
      </div>
    );
  }

  if (!user) return null;

  const expiryStr = user.subscriptionExpiry
    ? new Date(user.subscriptionExpiry).toLocaleDateString("zh-CN")
    : null;

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-xl mx-auto px-6 py-16">
        <div className="mb-10">
          <Link href="/" className="text-xs text-[#888888] hover:text-white transition-colors">
            ← 返回首页
          </Link>
          <h1 className="text-2xl font-bold text-white mt-3">我的账户</h1>
        </div>

        <div className="space-y-px border border-[#1f1f1f]">
          {/* Profile card */}
          <div className="bg-[#0a0a0a] p-6">
            <h2 className="text-xs font-medium text-[#555555] tracking-widest uppercase mb-4">账户信息</h2>
            <p className="text-sm text-white font-medium">{user.phone}</p>
          </div>

          {/* Subscription card */}
          <div className="bg-[#0a0a0a] p-6">
            <h2 className="text-xs font-medium text-[#555555] tracking-widest uppercase mb-4">订阅状态</h2>
            <div className="flex items-center gap-3 mb-3">
              <span
                className={`text-xs font-medium px-2.5 py-1 border ${
                  user.isActive
                    ? "border-white text-white"
                    : "border-[#1f1f1f] text-[#555555]"
                }`}
              >
                {PLAN_LABELS[user.subscriptionPlan] ?? user.subscriptionPlan}
              </span>
              {user.isActive && (
                <span className="text-[10px] text-[#888888]">有效中</span>
              )}
            </div>
            {expiryStr && (
              <p className="text-xs text-[#555555]">到期时间：{expiryStr}</p>
            )}
            {user.subscriptionPlan === "lifetime" && (
              <p className="text-xs text-[#888888]">终身有效，无需续订</p>
            )}
            {!user.isActive && (
              <Link
                href="/member"
                className="inline-block mt-4 text-xs border border-white text-white px-4 py-2 hover:bg-white hover:text-black transition-colors"
              >
                升级会员
              </Link>
            )}
            {user.isActive && user.subscriptionPlan !== "lifetime" && (
              <Link
                href="/member"
                className="inline-block mt-4 text-xs border border-[#1f1f1f] text-[#888888] px-4 py-2 hover:border-white hover:text-white transition-colors"
              >
                升级套餐
              </Link>
            )}
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full mt-4 text-sm text-[#555555] border border-[#1f1f1f] py-3 hover:border-red-800 hover:text-red-400 transition-colors disabled:opacity-50"
        >
          {loggingOut ? "退出中..." : "退出登录"}
        </button>
      </div>
    </div>
  );
}
