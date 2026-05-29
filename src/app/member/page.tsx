import type { Metadata } from "next";
import { PricingCards } from "./PricingCards";

export const metadata: Metadata = {
  title: "会员专享 · BrandLab",
  description: "解锁全部品牌干货，加速你的个人品牌成长",
};

export default function MemberPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <span className="text-xs font-medium px-3 py-1 rounded-full bg-[#f0faf4] text-[#2d6a4f] mb-4 inline-block">
            会员专享
          </span>
          <h1 className="text-3xl font-bold text-[#1b4332] mt-3 mb-4">
            解锁全部品牌干货
          </h1>
          <p className="text-sm text-[#6b7280] max-w-xl mx-auto leading-relaxed">
            每篇会员文章都是经过打磨的实战方法论，帮你少走弯路，更快建立个人品牌影响力。
          </p>
        </div>

        <PricingCards />

        <p className="text-center text-xs text-[#6b7280] mt-10">
          支持微信 / 支付宝付款 · 付款成功后自动开通 · 如有问题请
          <a href="/contact" className="text-[#2d6a4f] hover:underline ml-1">联系我们</a>
        </p>
      </div>
    </div>
  );
}
