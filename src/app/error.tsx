"use client";
import Link from "next/link";
export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#f0faf4] flex items-center justify-center mx-auto mb-6">
          <span className="text-2xl">⚠️</span>
        </div>
        <h1 className="text-2xl font-bold text-[#1b4332] mb-3">出了点小问题</h1>
        <p className="text-sm text-[#6b7280] mb-8 leading-relaxed max-w-sm mx-auto">
          页面加载遇到了错误，可以尝试刷新或者回首页看看。
        </p>
        <div className="flex justify-center gap-3">
          <button onClick={reset} className="text-sm bg-[#1b4332] text-white px-5 py-2.5 rounded-lg hover:bg-[#40916c] transition-colors font-medium">
            重试
          </button>
          <Link href="/" className="text-sm border border-[#95d5b2] text-[#6b7280] px-5 py-2.5 rounded-lg hover:border-[#52b788] transition-colors">
            回到首页
          </Link>
        </div>
      </div>
    </div>
  );
}
