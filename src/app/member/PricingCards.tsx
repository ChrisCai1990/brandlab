"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Plan = "monthly" | "yearly" | "lifetime";

const PLANS = [
  {
    id: "monthly" as Plan,
    name: "月度会员",
    price: "29",
    unit: "元/月",
    period: "30天有效",
    badge: null,
    features: ["解锁全部会员专享文章", "AI工具无限使用", "新内容第一时间阅读"],
  },
  {
    id: "yearly" as Plan,
    name: "年度会员",
    price: "199",
    unit: "元/年",
    period: "365天有效",
    badge: "最受欢迎",
    features: ["解锁全部会员专享文章", "AI工具无限使用", "新内容第一时间阅读", "省 ¥149 / 相当于 ¥16.6/月"],
  },
  {
    id: "lifetime" as Plan,
    name: "终身会员",
    price: "399",
    unit: "元 · 一次性",
    period: "永久有效",
    badge: "最超值",
    features: ["解锁全部会员专享文章", "AI工具无限使用", "新内容第一时间阅读", "永久享受所有未来新功能", "仅需月价 × 14"],
  },
];

export function PricingCards() {
  const router = useRouter();
  const [loading, setLoading] = useState<Plan | null>(null);
  const [error, setError] = useState("");

  async function handleSubscribe(plan: Plan) {
    setError("");
    setLoading(plan);
    try {
      const res = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (res.status === 401) {
        router.push("/login?redirect=/member");
        return;
      }
      if (!res.ok || !data.payUrl) {
        setError(data.error || "创建订单失败，请重试");
        return;
      }
      window.location.href = data.payUrl;
    } catch {
      setError("网络异常，请重试");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div>
      {error && (
        <p className="text-center text-sm text-red-500 mb-6">{error}</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`relative rounded-2xl border p-6 flex flex-col ${
              plan.id === "yearly"
                ? "border-[#2d6a4f] bg-[#f0faf4] shadow-lg"
                : "border-[#95d5b2] bg-white"
            }`}
          >
            {plan.badge && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold px-3 py-1 rounded-full bg-[#2d6a4f] text-white">
                {plan.badge}
              </span>
            )}
            <h3 className="text-sm font-bold text-[#1b4332] mb-1">{plan.name}</h3>
            <div className="flex items-end gap-1 mb-1">
              <span className="text-3xl font-bold text-[#1b4332]">¥{plan.price}</span>
              <span className="text-xs text-[#6b7280] mb-1">{plan.unit}</span>
            </div>
            <p className="text-[10px] text-[#52b788] mb-5">{plan.period}</p>
            <ul className="space-y-2 flex-1 mb-6">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-xs text-[#6b7280]">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#52b788] shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleSubscribe(plan.id)}
              disabled={loading !== null}
              className={`w-full text-sm py-2.5 rounded-xl font-medium transition-colors disabled:opacity-50 ${
                plan.id === "yearly"
                  ? "bg-[#1b4332] text-white hover:bg-[#40916c]"
                  : "border border-[#2d6a4f] text-[#2d6a4f] hover:bg-[#f0faf4]"
              }`}
            >
              {loading === plan.id ? "跳转中..." : "立即订阅"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
