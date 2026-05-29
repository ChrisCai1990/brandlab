"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) { setError("两次密码不一致"); return; }
    if (form.password.length < 6) { setError("密码至少6位"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "注册失败"); return; }
      router.push("/member");
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
          <h1 className="text-xl font-bold text-[#1b4332]">创建账户</h1>
          <p className="text-xs text-[#6b7280] mt-1">注册后即可订阅会员</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-center">
              {error}
            </div>
          )}
          <div>
            <label className="block text-xs font-medium text-[#52b788] tracking-widest uppercase mb-1.5">邮箱</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="your@email.com"
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
              placeholder="至少6位"
              className="w-full text-sm border border-[#95d5b2] rounded-xl px-4 py-3 outline-none focus:border-[#2d6a4f] text-[#1b4332] placeholder-[#95d5b2]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#52b788] tracking-widest uppercase mb-1.5">确认密码</label>
            <input
              type="password"
              required
              value={form.confirm}
              onChange={(e) => setForm((f) => ({ ...f, confirm: e.target.value }))}
              placeholder="再输一遍"
              className="w-full text-sm border border-[#95d5b2] rounded-xl px-4 py-3 outline-none focus:border-[#2d6a4f] text-[#1b4332] placeholder-[#95d5b2]"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1b4332] text-white text-sm font-medium py-3 rounded-xl hover:bg-[#40916c] transition-colors disabled:opacity-50"
          >
            {loading ? "注册中..." : "注册"}
          </button>
        </form>

        <p className="text-center text-xs text-[#6b7280] mt-6">
          已有账户？
          <Link href="/login" className="text-[#2d6a4f] font-medium ml-1 hover:underline">
            直接登录
          </Link>
        </p>
      </div>
    </div>
  );
}
