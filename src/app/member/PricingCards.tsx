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
    featured: false,
    features: ["解锁全部会员专享文章", "AI工具无限使用", "新内容第一时间阅读"],
  },
  {
    id: "yearly" as Plan,
    name: "年度会员",
    price: "199",
    unit: "元/年",
    period: "365天有效",
    badge: "最受欢迎",
    featured: true,
    features: ["解锁全部会员专享文章", "AI工具无限使用", "新内容第一时间阅读", "省 ¥149 / 相当于 ¥16.6/月"],
  },
  {
    id: "lifetime" as Plan,
    name: "终身会员",
    price: "399",
    unit: "元 · 一次性",
    period: "永久有效",
    badge: "最超值",
    featured: false,
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px border border-[#1f1f1f] max-w-4xl mx-auto">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`relative p-6 flex flex-col transition-colors ${
              plan.featured
                ? "bg-white text-black"
                : "bg-[#0a0a0a]"
            } ${selected === plan.id && !plan.featured ? "bg-[#111111]" : ""}`}
          >
            {plan.badge && (
              <span className={`absolute -top-3 left-6 text-[10px] font-bold px-3 py-1 ${
                plan.featured ? "bg-black text-white" : "bg-white text-black"
              }`}>
                {plan.badge}
              </span>
            )}
            <h3 className={`text-sm font-bold mb-1 ${plan.featured ? "text-black" : "text-white"}`}>{plan.name}</h3>
            <div className="flex items-end gap-1 mb-1">
              <span className={`text-3xl font-bold ${plan.featured ? "text-black" : "text-white"}`}>¥{plan.price}</span>
              <span className={`text-xs mb-1 ${plan.featured ? "text-[#555555]" : "text-[#555555]"}`}>{plan.unit}</span>
            </div>
            <p className={`text-[10px] mb-5 ${plan.featured ? "text-[#555555]" : "text-[#555555]"}`}>{plan.period}</p>
            <ul className="space-y-2 flex-1 mb-6">
              {plan.features.map((f) => (
                <li key={f} className={`flex items-start gap-2 text-xs ${plan.featured ? "text-[#333333]" : "text-[#888888]"}`}>
                  <span className={`mt-1 w-1 h-1 shrink-0 ${plan.featured ? "bg-black" : "bg-white"}`} />
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => setSelected(selected === plan.id ? null : plan.id)}
              className={`w-full text-sm py-2.5 font-medium transition-colors ${
                selected === plan.id
                  ? plan.featured
                    ? "bg-black text-white border border-black"
                    : "bg-white text-black border border-white"
                  : plan.featured
                  ? "bg-black text-white hover:bg-[#111111] border border-black"
                  : "border border-[#1f1f1f] text-[#888888] hover:border-white hover:text-white"
              }`}
            >
              {selected === plan.id ? "✓ 已选择" : "选择此套餐"}
            </button>
          </div>
        ))}
      </div>

      {/* 支付说明 */}
      {selected && (
        <div className="mt-8 max-w-xl mx-auto border border-[#1f1f1f] bg-[#0a0a0a] p-6">
          <h3 className="text-sm font-bold text-white mb-5">
            开通 {PLAN_LABELS[selected]}
          </h3>

          <ol className="space-y-5 text-xs text-white">
            <li className="flex gap-3">
              <span className="w-5 h-5 border border-[#333333] text-white text-[10px] flex items-center justify-center shrink-0 font-bold">1</span>
              <div>
                <p className="font-medium mb-1 text-white">扫码付款</p>
                <p className="text-[#888888] mb-3">使用微信或支付宝扫描下方收款码，付款时<span className="text-white font-medium">备注您的邮箱 + 套餐名称</span></p>
                <p className="text-[10px] text-[#555555] italic">示例备注：zhang@qq.com 年度会员</p>

                <div className="mt-3 flex gap-4">
                  <div className="text-center">
                    <div className="w-28 h-28 border border-[#1f1f1f] flex items-center justify-center bg-[#111111]">
                      <span className="text-[10px] text-[#555555] text-center px-2">微信收款码<br/>（待上传）</span>
                    </div>
                    <p className="text-[10px] text-[#555555] mt-1">微信支付</p>
                  </div>
                  <div className="text-center">
                    <div className="w-28 h-28 border border-[#1f1f1f] flex items-center justify-center bg-[#111111]">
                      <span className="text-[10px] text-[#555555] text-center px-2">支付宝收款码<br/>（待上传）</span>
                    </div>
                    <p className="text-[10px] text-[#555555] mt-1">支付宝</p>
                  </div>
                </div>
              </div>
            </li>

            <li className="flex gap-3">
              <span className="w-5 h-5 border border-[#333333] text-white text-[10px] flex items-center justify-center shrink-0 font-bold">2</span>
              <div>
                <p className="font-medium mb-1 text-white">发送截图</p>
                <p className="text-[#888888]">将付款成功截图发送至</p>
                <Link href="/contact" className="text-white hover:text-[#a0a0a0] transition-colors">
                  联系页面 →
                </Link>
                <p className="text-[#888888] mt-1">或发邮件至：<span className="text-white font-medium">hi@brandlab.ink</span></p>
              </div>
            </li>

            <li className="flex gap-3">
              <span className="w-5 h-5 border border-[#333333] text-white text-[10px] flex items-center justify-center shrink-0 font-bold">3</span>
              <div>
                <p className="font-medium mb-1 text-white">等待开通</p>
                <p className="text-[#888888]">我们将在 <span className="text-white font-medium">24小时内</span> 为您开通会员，并发送确认邮件。</p>
                <p className="text-[#888888] mt-1">开通后在<Link href="/account" className="text-white hover:text-[#a0a0a0] transition-colors mx-1">账户页面</Link>可查看状态。</p>
              </div>
            </li>
          </ol>

          <div className="mt-5 pt-4 border-t border-[#1f1f1f]">
            <p className="text-[10px] text-[#555555]">
              还没有账户？
              <Link href="/register" className="text-[#888888] hover:text-white transition-colors ml-1">先免费注册</Link>
              ，再完成付款后告知邮箱即可开通。
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
