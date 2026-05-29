"use client";

import { useState } from "react";
import Link from "next/link";

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

const PLAN_LABELS: Record<Plan, string> = {
  monthly: "月度会员 ¥29",
  yearly: "年度会员 ¥199",
  lifetime: "终身会员 ¥399",
};

export function PricingCards() {
  const [selected, setSelected] = useState<Plan | null>(null);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`relative rounded-2xl border p-6 flex flex-col transition-shadow ${
              plan.id === "yearly"
                ? "border-[#2d6a4f] bg-[#f0faf4] shadow-lg"
                : "border-[#95d5b2] bg-white"
            } ${selected === plan.id ? "ring-2 ring-[#2d6a4f]" : ""}`}
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
              onClick={() => setSelected(selected === plan.id ? null : plan.id)}
              className={`w-full text-sm py-2.5 rounded-xl font-medium transition-colors ${
                selected === plan.id
                  ? "bg-[#1b4332] text-white"
                  : plan.id === "yearly"
                  ? "bg-[#1b4332] text-white hover:bg-[#40916c]"
                  : "border border-[#2d6a4f] text-[#2d6a4f] hover:bg-[#f0faf4]"
              }`}
            >
              {selected === plan.id ? "✓ 已选择" : "选择此套餐"}
            </button>
          </div>
        ))}
      </div>

      {/* 支付说明 */}
      {selected && (
        <div className="mt-8 max-w-xl mx-auto bg-[#f0faf4] border border-[#95d5b2] rounded-2xl p-6">
          <h3 className="text-sm font-bold text-[#1b4332] mb-4">
            开通 {PLAN_LABELS[selected]}
          </h3>

          <ol className="space-y-4 text-xs text-[#1b4332]">
            <li className="flex gap-3">
              <span className="w-5 h-5 rounded-full bg-[#2d6a4f] text-white text-[10px] flex items-center justify-center shrink-0 font-bold">1</span>
              <div>
                <p className="font-medium mb-1">扫码付款</p>
                <p className="text-[#6b7280] mb-3">使用微信或支付宝扫描下方收款码，付款时<span className="text-[#1b4332] font-medium">备注您的邮箱 + 套餐名称</span></p>
                <p className="text-[10px] text-[#52b788] italic">示例备注：zhang@qq.com 年度会员</p>

                {/* 收款码区域 — 替换为你的实际收款码图片 */}
                <div className="mt-3 flex gap-4">
                  <div className="text-center">
                    <div className="w-28 h-28 border-2 border-dashed border-[#95d5b2] rounded-xl flex items-center justify-center bg-white">
                      {/* 将 /images/wechat-pay.png 替换为你的微信收款码 */}
                      <span className="text-[10px] text-[#95d5b2] text-center px-2">微信收款码<br/>（待上传）</span>
                    </div>
                    <p className="text-[10px] text-[#6b7280] mt-1">微信支付</p>
                  </div>
                  <div className="text-center">
                    <div className="w-28 h-28 border-2 border-dashed border-[#95d5b2] rounded-xl flex items-center justify-center bg-white">
                      {/* 将 /images/alipay-pay.png 替换为你的支付宝收款码 */}
                      <span className="text-[10px] text-[#95d5b2] text-center px-2">支付宝收款码<br/>（待上传）</span>
                    </div>
                    <p className="text-[10px] text-[#6b7280] mt-1">支付宝</p>
                  </div>
                </div>
              </div>
            </li>

            <li className="flex gap-3">
              <span className="w-5 h-5 rounded-full bg-[#2d6a4f] text-white text-[10px] flex items-center justify-center shrink-0 font-bold">2</span>
              <div>
                <p className="font-medium mb-1">发送截图</p>
                <p className="text-[#6b7280]">将付款成功截图发送至</p>
                <Link href="/contact" className="text-[#2d6a4f] font-medium hover:underline">
                  联系页面 →
                </Link>
                <p className="text-[#6b7280] mt-1">或发邮件至：<span className="text-[#1b4332] font-medium">hi@brandlab.ink</span></p>
              </div>
            </li>

            <li className="flex gap-3">
              <span className="w-5 h-5 rounded-full bg-[#2d6a4f] text-white text-[10px] flex items-center justify-center shrink-0 font-bold">3</span>
              <div>
                <p className="font-medium mb-1">等待开通</p>
                <p className="text-[#6b7280]">我们将在 <span className="text-[#1b4332] font-medium">24小时内</span> 为您开通会员，并发送确认邮件。</p>
                <p className="text-[#6b7280] mt-1">开通后在<Link href="/account" className="text-[#2d6a4f] hover:underline mx-1">账户页面</Link>可查看状态。</p>
              </div>
            </li>
          </ol>

          <div className="mt-5 pt-4 border-t border-[#95d5b2]">
            <p className="text-[10px] text-[#6b7280]">
              还没有账户？
              <Link href="/register" className="text-[#2d6a4f] font-medium ml-1 hover:underline">先免费注册</Link>
              ，再完成付款后告知邮箱即可开通。
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
