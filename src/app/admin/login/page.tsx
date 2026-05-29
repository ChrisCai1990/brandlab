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
    <div className="min-h-screen bg-[#f0faf4] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-[#1b4332] flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-xl font-bold">拾</span>
          </div>
          <h1 className="text-xl font-bold text-[#1b4332]">内容管理后台</h1>
          <p className="text-xs text-[#6b7280] mt-1">品牌拾研社 · BrandLab</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-[#95d5b2] rounded-2xl p-8">
          <div className="mb-5">
            <label className="block text-xs font-medium text-[#52b788] tracking-widest uppercase mb-2">
              管理员密码
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码"
              className="w-full border border-[#95d5b2] rounded-lg px-4 py-3 text-sm text-[#1b4332] placeholder-[#6b7280]/40 focus:outline-none focus:border-[#40916c] bg-white"
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
            className="w-full bg-[#1b4332] text-white py-3 rounded-lg text-sm font-medium hover:bg-[#40916c] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? "登录中..." : "登录"}
          </button>
        </form>
      </div>
    </div>
  );
}
