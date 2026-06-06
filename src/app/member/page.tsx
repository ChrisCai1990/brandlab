import type { Metadata } from "next";
import { PricingCards } from "./PricingCards";

export const metadata: Metadata = {
  title: "会员专享 · BrandLab",
  description: "解锁全部品牌干货，加速你的个人品牌成长",
};

export default function MemberPage() {
  return (
    <div className="min-h-screen bg-black">
      <div className="border-b border-[#1f1f1f] bg-[#0a0a0a] py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs text-[#555555] font-medium tracking-widest uppercase mb-4">会员专享</p>
          <h1 className="text-4xl font-bold text-white mb-4">
            解锁全部品牌干货
          </h1>
          <p className="text-sm text-[#888888] max-w-xl mx-auto leading-relaxed">
            每篇会员文章都是经过打磨的实战方法论，帮你少走弯路，更快建立个人品牌影响力。
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <PricingCards />

        <p className="text-center text-xs text-[#555555] mt-10">
          支持微信 / 支付宝付款 · 付款成功后自动开通 · 如有问题请
          <a href="/contact" className="text-[#888888] hover:text-white transition-colors ml-1">联系我们</a>
        </p>
      </div>
    </div>
  );
}
