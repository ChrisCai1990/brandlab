"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (newPassword !== confirm) {
      setError("两次输入的新密码不一致");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/admin/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    setLoading(false);

    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "修改失败");
    } else {
      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirm("");
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold text-[#1A2E22]">系统设置</h1>
          <p className="text-xs text-[#6B7A6E] mt-0.5">修改管理员密码</p>
        </div>
        <button
          onClick={() => router.push("/admin/articles")}
          className="text-xs text-[#6B7A6E] border border-[#C8DDD2] px-3 py-2 rounded-lg hover:border-[#6BAF8A] transition-colors"
        >
          ← 返回
        </button>
      </div>

      <div className="bg-white border border-[#C8DDD2] rounded-2xl p-8 max-w-md">
        <h2 className="text-sm font-semibold text-[#1A2E22] mb-6">修改密码</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-[#6B7A6E] mb-1.5">当前密码</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="w-full border border-[#C8DDD2] rounded-lg px-3 py-2 text-sm text-[#1A2E22] focus:outline-none focus:border-[#2D6A4F]"
            />
          </div>
          <div>
            <label className="block text-xs text-[#6B7A6E] mb-1.5">新密码</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
              className="w-full border border-[#C8DDD2] rounded-lg px-3 py-2 text-sm text-[#1A2E22] focus:outline-none focus:border-[#2D6A4F]"
            />
          </div>
          <div>
            <label className="block text-xs text-[#6B7A6E] mb-1.5">确认新密码</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              className="w-full border border-[#C8DDD2] rounded-lg px-3 py-2 text-sm text-[#1A2E22] focus:outline-none focus:border-[#2D6A4F]"
            />
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}
          {success && <p className="text-xs text-green-600">密码修改成功</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1A2E22] text-white text-sm py-2.5 rounded-lg hover:bg-[#2D6A4F] transition-colors font-medium disabled:opacity-50"
          >
            {loading ? "保存中..." : "保存修改"}
          </button>
        </form>
      </div>
    </div>
  );
}
