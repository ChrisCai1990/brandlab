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
    <div className="min-h-screen bg-[#F7FBF8] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-[#1A2E22] flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-xl font-bold">拾</span>
          </div>
          <h1 className="text-xl font-bold text-[#1A2E22]">内容管理后台</h1>
          <p className="text-xs text-[#6B7A6E] mt-1">品牌拾研社 · BrandLab</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-[#C8DDD2] rounded-2xl p-8">
          <div className="mb-5">
            <label className="block text-xs font-medium text-[#6BAF8A] tracking-widest uppercase mb-2">
              管理员密码
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码"
              className="w-full border border-[#C8DDD2] rounded-lg px-4 py-3 text-sm text-[#1A2E22] placeholder-[#6B7A6E]/40 focus:outline-none focus:border-[#2D6A4F] bg-white"
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
            className="w-full bg-[#1A2E22] text-white py-3 rounded-lg text-sm font-medium hover:bg-[#2D6A4F] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? "登录中..." : "登录"}
          </button>
        </form>
      </div>
    </div>
  );
}
