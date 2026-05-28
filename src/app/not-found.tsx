import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#e6f4f3] flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl font-bold text-[#5eada7]">404</span>
        </div>
        <h1 className="text-2xl font-bold text-[#0d2e2c] mb-3">页面不存在</h1>
        <p className="text-sm text-[#5a7e7c] mb-8 leading-relaxed max-w-sm mx-auto">
          这篇干货可能已经搬家了，或者链接有点问题。去内容库看看其他文章吧。
        </p>
        <div className="flex justify-center gap-3">
          <Link href="/" className="text-sm bg-[#0d2e2c] text-white px-5 py-2.5 rounded-lg hover:bg-[#0f766e] transition-colors font-medium">
            回到首页
          </Link>
          <Link href="/library" className="text-sm border border-[#b2d8d5] text-[#5a7e7c] px-5 py-2.5 rounded-lg hover:border-[#5eada7] transition-colors">
            浏览内容库
          </Link>
        </div>
      </div>
    </div>
  );
}
