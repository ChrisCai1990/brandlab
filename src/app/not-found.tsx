import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="text-center">
        <div className="text-6xl font-bold text-[#1f1f1f] mb-6">404</div>
        <h1 className="text-2xl font-bold text-white mb-3">页面不存在</h1>
        <p className="text-sm text-[#888888] mb-8 leading-relaxed max-w-sm mx-auto">
          这篇干货可能已经搬家了，或者链接有点问题。去内容库看看其他文章吧。
        </p>
        <div className="flex justify-center gap-3">
          <Link href="/" className="text-sm border border-white text-white px-5 py-2.5 hover:bg-white hover:text-black transition-colors font-medium">
            回到首页
          </Link>
          <Link href="/library" className="text-sm border border-[#1f1f1f] text-[#888888] px-5 py-2.5 hover:border-[#333333] hover:text-white transition-colors">
            浏览内容库
          </Link>
        </div>
      </div>
    </div>
  );
}
