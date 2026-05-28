"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SettingsPage() {
  const router = useRouter();
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      setStatus("error"); setMsg("两次密码不一致"); return;
    }
    if (form.newPassword.length < 6) {
      setStatus("error"); setMsg("新密码至少6位"); return;
    }
    setStatus("loading");
    const res = await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "change_password", currentPassword: form.currentPassword, newPassword: form.newPassword }),
    });
    const data = await res.json();
    if (res.ok) {
      setStatus("success"); setMsg("密码修改成功");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } else {
      setStatus("error"); setMsg(data.error || "修改失败");
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <button onClick={() => router.push("/admin/articles")} className="text-xs text-[#5a7e7c] hover:text-[#0f766e] transition-colors mb-1">← 返回列表</button>
          <h1 className="text-xl font-bold text-[#0d2e2c]">设置</h1>
        </div>
        <Link href="/" target="_blank" className="text-xs text-[#5a7e7c] border border-[#b2d8d5] px-3 py-2 rounded-lg hover:border-[#5eada7] transition-colors">查看网站 ↗</Link>
      </div>

      <div className="bg-white border border-[#b2d8d5] rounded-2xl p-6 mb-5">
        <h2 className="text-sm font-bold text-[#0d2e2c] mb-5">修改管理员密码</h2>
        <form onSubmit={handleChangePassword} className="space-y-4">
          {[
            { label: "当前密码", key: "currentPassword", placeholder: "输入当前密码" },
            { label: "新密码", key: "newPassword", placeholder: "至少6位" },
            { label: "确认新密码", key: "confirmPassword", placeholder: "再次输入新密码" },
          ].map(({ label, key, placeholder }) => (
            <div key={key}>
              <label className="block text-[10px] font-medium text-[#5eada7] tracking-widest uppercase mb-1.5">{label}</label>
              <input
                type="password"
                value={form[key as keyof typeof form]}
                onChange={(e) => setForm(f => ({ ...f, [key]: e.target.value }))}
                placeholder={placeholder}
                className="w-full border border-[#b2d8d5] rounded-lg px-4 py-2.5 text-sm text-[#0d2e2c] placeholder-[#5a7e7c]/40 focus:outline-none focus:border-[#0f766e] bg-white"
                required
              />
            </div>
          ))}

          {status !== "idle" && (
            <p className={`text-xs px-3 py-2 rounded-lg ${status === "success" ? "bg-green-50 text-green-600" : status === "error" ? "bg-red-50 text-red-500" : "text-[#5a7e7c]"}`}>
              {status === "loading" ? "保存中..." : msg}
            </p>
          )}

          <button type="submit" disabled={status === "loading"} className="bg-[#0d2e2c] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#0f766e] transition-colors disabled:opacity-40">
            保存修改
          </button>
        </form>
      </div>

      <div className="bg-[#e6f4f3] border border-[#b2d8d5] rounded-2xl p-5">
        <p className="text-[10px] text-[#5a7e7c] font-medium tracking-widest uppercase mb-2">环境变量说明</p>
        <div className="space-y-1.5">
          {[
            { key: "DATABASE_URL", desc: "MongoDB 连接字符串" },
            { key: "NEXTAUTH_SECRET", desc: "JWT 签名密钥（至少32位随机字符串）" },
            { key: "ADMIN_PASSWORD", desc: "初始管理员密码（设置新密码后此项可删除）" },
          ].map(({ key, desc }) => (
            <div key={key} className="flex items-start gap-2">
              <code className="text-[10px] bg-white border border-[#b2d8d5] px-2 py-0.5 rounded text-[#0f766e] shrink-0">{key}</code>
              <span className="text-[10px] text-[#5a7e7c]">{desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
