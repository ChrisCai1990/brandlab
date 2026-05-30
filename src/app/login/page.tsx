"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/account";

  const [form, setForm] = useState({ phone: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "登录失败"); return; }
      router.push(redirect);
      router.refresh();
    } catch {
      setError("网络异常，请重试");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-[#2d6a4f] flex items-center justify-center">
              <span className="text-white text-sm font-bold">拾</span>
            </div>
            <span className="text-sm font-bold text-[#1b4332]">品牌拾研社</span>
          </Link>
          <h1 className="text-xl font-bold text-[#1b4332]">登录账户</h1>
          <p className="text-xs text-[#6b7280] mt-1">欢迎回来</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-center">
              {error}
            </div>
          )}
          <div>
            <label className="block text-xs font-medium text-[#52b788] tracking-widest uppercase mb-1.5">手机号</label>
            <input
              type="tel"
              required
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              placeholder="请输入手机号"
              className="w-full text-sm border border-[#95d5b2] rounded-xl px-4 py-3 outline-none focus:border-[#2d6a4f] text-[#1b4332] placeholder-[#95d5b2]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#52b788] tracking-widest uppercase mb-1.5">密码</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              placeholder="••••••"
              className="w-full text-sm border border-[#95d5b2] rounded-xl px-4 py-3 outline-none focus:border-[#2d6a4f] text-[#1b4332] placeholder-[#95d5b2]"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1b4332] text-white text-sm font-medium py-3 rounded-xl hover:bg-[#40916c] transition-colors disabled:opacity-50"
          >
            {loading ? "登录中..." : "登录"}
          </button>
        </form>

        <p className="text-center text-xs text-[#6b7280] mt-6">
          还没有账户？
          <Link href="/register" className="text-[#2d6a4f] font-medium ml-1 hover:underline">
            免费注册
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
