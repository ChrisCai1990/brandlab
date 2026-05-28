"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/admin/articles");
    } else {
      setError("密码错误，请重试");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f0f9f8] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-[#0d2e2c] flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-xl font-bold">拾</span>
          </div>
          <h1 className="text-xl font-bold text-[#0d2e2c]">内容管理后台</h1>
          <p className="text-xs text-[#5a7e7c] mt-1">品牌拾研社 · BrandLab</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-[#b2d8d5] rounded-2xl p-8">
          <div className="mb-5">
            <label className="block text-xs font-medium text-[#5eada7] tracking-widest uppercase mb-2">
              管理员密码
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码"
              className="w-full border border-[#b2d8d5] rounded-lg px-4 py-3 text-sm text-[#0d2e2c] placeholder-[#5a7e7c]/40 focus:outline-none focus:border-[#0f766e] bg-white"
              required
              autoFocus
            />
          </div>

          {error && (
            <p className="text-xs text-red-500 mb-4">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full bg-[#0d2e2c] text-white py-3 rounded-lg text-sm font-medium hover:bg-[#0f766e] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? "登录中..." : "登录"}
          </button>
        </form>
      </div>
    </div>
  );
}
