"use client";
import Link from "next/link";
export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="text-center">
        <div className="text-4xl font-bold text-[#1f1f1f] mb-6">⚠</div>
        <h1 className="text-2xl font-bold text-white mb-3">出了点小问题</h1>
        <p className="text-sm text-[#888888] mb-8 leading-relaxed max-w-sm mx-auto">
          页面加载遇到了错误，可以尝试刷新或者回首页看看。
        </p>
        <div className="flex justify-center gap-3">
          <button onClick={reset} className="text-sm border border-white text-white px-5 py-2.5 hover:bg-white hover:text-black transition-colors font-medium">
            重试
          </button>
          <Link href="/" className="text-sm border border-[#1f1f1f] text-[#888888] px-5 py-2.5 hover:border-[#333333] hover:text-white transition-colors">
            回到首页
          </Link>
        </div>
      </div>
    </div>
  );
}
