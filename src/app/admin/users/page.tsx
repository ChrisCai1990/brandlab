"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export const dynamic = "force-dynamic";

type User = {
  id: string;
  email: string;
  plan: string;
  expiry: string | null;
  isActive: boolean;
  createdAt: string;
};

const PLAN_LABELS: Record<string, string> = {
  free: "免费",
  monthly: "月度",
  yearly: "年度",
  lifetime: "终身",
};

const PLAN_COLORS: Record<string, string> = {
  free: "bg-gray-100 text-gray-500",
  monthly: "bg-blue-50 text-blue-600",
  yearly: "bg-[#f0faf4] text-[#2d6a4f]",
  lifetime: "bg-amber-50 text-amber-600",
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activating, setActivating] = useState<string | null>(null);
  const [modal, setModal] = useState<{ user: User } | null>(null);
  const [form, setForm] = useState({ plan: "monthly", days: "" });
  const [msg, setMsg] = useState("");

  async function loadUsers() {
    setLoading(true);
    const res = await fetch("/api/admin/users");
    const data = await res.json();
    setUsers(data.users ?? []);
    setLoading(false);
  }

  useEffect(() => { loadUsers(); }, []);

  function openModal(user: User) {
    setModal({ user });
    setForm({ plan: "monthly", days: "" });
    setMsg("");
  }

  async function handleActivate(e: React.FormEvent) {
    e.preventDefault();
    if (!modal) return;
    setActivating(modal.user.id);
    setMsg("");
    try {
      const body: Record<string, unknown> = { userId: modal.user.id, plan: form.plan };
      if (form.days) body.days = Number(form.days);

      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) { setMsg(data.error || "操作失败"); return; }
      setMsg("✓ 已成功更新");
      await loadUsers();
      setTimeout(() => setModal(null), 800);
    } catch {
      setMsg("网络异常，请重试");
    } finally {
      setActivating(null);
    }
  }

  const filtered = users.filter((u) =>
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = users.filter((u) => u.isActive).length;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold text-[#1b4332]">用户管理</h1>
          <p className="text-xs text-[#6b7280] mt-0.5">
            共 {users.length} 位用户 · {activeCount} 位有效会员
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/articles"
            className="text-xs text-[#6b7280] border border-[#95d5b2] px-3 py-2 rounded-lg hover:border-[#52b788] transition-colors"
          >
            ← 文章管理
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="搜索邮箱..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-xs text-sm border border-[#95d5b2] rounded-xl px-4 py-2 outline-none focus:border-[#2d6a4f] text-[#1b4332] placeholder-[#95d5b2]"
        />
      </div>

      {/* Table */}
      <div className="bg-white border border-[#95d5b2] rounded-2xl overflow-hidden">
        {loading ? (
          <div className="text-center py-12 text-sm text-[#6b7280]">加载中...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-sm text-[#6b7280]">暂无用户</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#e5f5ec] bg-[#f9fefb]">
                <th className="text-left px-5 py-3 text-xs font-medium text-[#52b788]">邮箱</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[#52b788]">套餐</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[#52b788]">到期时间</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[#52b788]">注册时间</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[#52b788]">操作</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user, i) => (
                <tr
                  key={user.id}
                  className={`border-b border-[#e5f5ec] last:border-0 ${i % 2 === 0 ? "" : "bg-[#fafffe]"}`}
                >
                  <td className="px-5 py-3 text-[#1b4332] font-medium text-xs">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${PLAN_COLORS[user.plan] ?? "bg-gray-100 text-gray-500"}`}>
                      {PLAN_LABELS[user.plan] ?? user.plan}
                    </span>
                    {user.isActive && (
                      <span className="ml-1.5 text-[10px] text-[#52b788]">有效</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-[#6b7280]">
                    {user.plan === "lifetime"
                      ? "永久"
                      : user.expiry
                      ? new Date(user.expiry).toLocaleDateString("zh-CN")
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-xs text-[#6b7280]">
                    {new Date(user.createdAt).toLocaleDateString("zh-CN")}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => openModal(user)}
                      className="text-xs text-[#2d6a4f] border border-[#95d5b2] px-3 py-1 rounded-lg hover:bg-[#f0faf4] transition-colors"
                    >
                      开通/修改
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl border border-[#95d5b2] p-6 w-full max-w-sm">
            <h2 className="text-sm font-bold text-[#1b4332] mb-1">开通 / 修改会员</h2>
            <p className="text-xs text-[#6b7280] mb-5">{modal.user.email}</p>

            <form onSubmit={handleActivate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#52b788] mb-1.5">套餐</label>
                <select
                  value={form.plan}
                  onChange={(e) => setForm((f) => ({ ...f, plan: e.target.value }))}
                  className="w-full text-sm border border-[#95d5b2] rounded-xl px-4 py-2.5 outline-none focus:border-[#2d6a4f] text-[#1b4332]"
                >
                  <option value="monthly">月度会员（默认30天）</option>
                  <option value="yearly">年度会员（默认365天）</option>
                  <option value="lifetime">终身会员</option>
                  <option value="free">取消会员（还原免费）</option>
                </select>
              </div>

              {(form.plan === "monthly" || form.plan === "yearly") && (
                <div>
                  <label className="block text-xs font-medium text-[#52b788] mb-1.5">
                    天数（留空使用默认值）
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="3650"
                    placeholder={form.plan === "monthly" ? "默认 30 天" : "默认 365 天"}
                    value={form.days}
                    onChange={(e) => setForm((f) => ({ ...f, days: e.target.value }))}
                    className="w-full text-sm border border-[#95d5b2] rounded-xl px-4 py-2.5 outline-none focus:border-[#2d6a4f] text-[#1b4332] placeholder-[#95d5b2]"
                  />
                  <p className="text-[10px] text-[#6b7280] mt-1">
                    若用户当前会员未过期，将从到期日顺延
                  </p>
                </div>
              )}

              {msg && (
                <p className={`text-xs text-center ${msg.startsWith("✓") ? "text-[#2d6a4f]" : "text-red-500"}`}>
                  {msg}
                </p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModal(null)}
                  className="flex-1 text-sm border border-[#95d5b2] text-[#6b7280] py-2.5 rounded-xl hover:border-[#52b788] transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={activating !== null}
                  className="flex-1 text-sm bg-[#1b4332] text-white py-2.5 rounded-xl hover:bg-[#40916c] transition-colors disabled:opacity-50"
                >
                  {activating ? "保存中..." : "确认开通"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
