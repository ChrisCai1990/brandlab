import Link from "next/link";
import Image from "next/image";

const platforms = [
  { name: "小红书", handle: "@品牌拾研社" },
  { name: "微信公众号", handle: "品牌拾研社" },
  { name: "抖音", handle: "@BrandLab" },
];

export default function Footer() {
  return (
    <footer className="bg-black border-t border-[#1f1f1f]">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 border border-[#333333] flex items-center justify-center">
                <span className="text-white text-xs font-bold">拾</span>
              </div>
              <div className="leading-tight">
                <div className="text-sm font-bold text-white tracking-wide">品牌拾研社</div>
                <div className="text-[10px] text-[#555555] tracking-widest">BrandLab</div>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-[#a0a0a0]">
              拾起每一条干货，研出你的个人品牌。
            </p>
            <p className="text-xs text-[#555555] leading-relaxed">
              每天一条干货，帮创作者、超级个体<br />把账号做成有影响力的个人品牌。
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h4 className="text-xs font-medium text-[#555555] tracking-widest uppercase">页面导航</h4>
            <div className="flex flex-col gap-2.5">
              {[
                { href: "/library", label: "内容库" },
                { href: "/tools", label: "工具资源" },
                { href: "/about", label: "关于我们" },
                { href: "/contact", label: "联系合作" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-[#888888] hover:text-white transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Platforms & WeChat */}
          <div className="space-y-4">
            <h4 className="text-xs font-medium text-[#555555] tracking-widest uppercase">找到我们</h4>
            <div className="flex flex-col gap-2.5">
              {platforms.map((p) => (
                <div key={p.name} className="flex items-center gap-2">
                  <span className="text-xs text-[#555555]">{p.name}</span>
                  <span className="text-xs text-[#a0a0a0]">{p.handle}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 inline-flex flex-col items-center gap-2">
              <Image
                src="/qrcode.png"
                alt="微信二维码"
                width={80}
                height={80}
                className="rounded-sm opacity-80"
              />
              <span className="text-[10px] text-[#555555]">扫码加入社群</span>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[#1f1f1f] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#555555]">© 2026 品牌拾研社 · BrandLab. All rights reserved.</p>
          <p className="text-xs text-[#555555]">认真 · 实用 · 有审美，不说废话</p>
        </div>
      </div>
    </footer>
  );
}
