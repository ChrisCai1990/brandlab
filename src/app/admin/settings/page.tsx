"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SettingsPage() {
  const router = useRouter();

  const [pwdForm, setPwdForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [pwdStatus, setPwdStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [pwdMsg, setPwdMsg] = useState("");

  const [phoneForm, setPhoneForm] = useState({ newPhone: "", currentPassword: "" });
  const [phoneStatus, setPhoneStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [phoneMsg, setPhoneMsg] = useState("");

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (pwdForm.newPassword !== pwdForm.confirmPassword) {
      setPwdStatus("error"); setPwdMsg("两次密码不一致"); return;
    }
    if (pwdForm.newPassword.length < 6) {
      setPwdStatus("error"); setPwdMsg("新密码至少6位"); return;
    }
    setPwdStatus("loading");
    const res = await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "change_password", currentPassword: pwdForm.currentPassword, newPassword: pwdForm.newPassword }),
    });
    const data = await res.json();
    if (res.ok) {
      setPwdStatus("success"); setPwdMsg("密码修改成功");
      setPwdForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } else {
      setPwdStatus("error"); setPwdMsg(data.error || "修改失败");
    }
  }

  async function handleChangePhone(e: React.FormEvent) {
    e.preventDefault();
    if (!/^1[3-9]\d{9}$/.test(phoneForm.newPhone)) {
      setPhoneStatus("error"); setPhoneMsg("请输入正确的11位手机号"); return;
    }
    setPhoneStatus("loading");
    const res = await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "change_phone", newPhone: phoneForm.newPhone, currentPassword: phoneForm.currentPassword }),
    });
    const data = await res.json();
    if (res.ok) {
      setPhoneStatus("success"); setPhoneMsg("手机号修改成功");
      setPhoneForm({ newPhone: "", currentPassword: "" });
    } else {
      setPhoneStatus("error"); setPhoneMsg(data.error || "修改失败");
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <button onClick={() => router.push("/admin/articles")} className="text-xs text-[#6b7280] hover:text-[#40916c] transition-colors mb-1">← 返回列表</button>
          <h1 className="text-xl font-bold text-[#1b4332]">设置</h1>
        </div>
        <Link href="/" target="_blank" className="text-xs text-[#6b7280] border border-[#95d5b2] px-3 py-2 rounded-lg hover:border-[#52b788] transition-colors">查看网站 ↗</Link>
      </div>

      {/* 修改手机号 */}
      <div className="bg-white border border-[#95d5b2] rounded-2xl p-6 mb-5">
        <h2 className="text-sm font-bold text-[#1b4332] mb-5">修改登录手机号</h2>
        <form onSubmit={handleChangePhone} className="space-y-4">
          <div>
            <label className="block text-[10px] font-medium text-[#52b788] tracking-widest uppercase mb-1.5">新手机号</label>
            <input
              type="tel"
              value={phoneForm.newPhone}
              onChange={(e) => setPhoneForm(f => ({ ...f, newPhone: e.target.value }))}
              placeholder="输入新的11位手机号"
              className="w-full border border-[#95d5b2] rounded-lg px-4 py-2.5 text-sm text-[#1b4332] placeholder-[#6b7280]/40 focus:outline-none focus:border-[#40916c] bg-white"
              required
            />
          </div>
          <div>
            <label className="block text-[10px] font-medium text-[#52b788] tracking-widest uppercase mb-1.5">当前密码（验证身份）</label>
            <input
              type="password"
              value={phoneForm.currentPassword}
              onChange={(e) => setPhoneForm(f => ({ ...f, currentPassword: e.target.value }))}
              placeholder="输入当前密码"
              className="w-full border border-[#95d5b2] rounded-lg px-4 py-2.5 text-sm text-[#1b4332] placeholder-[#6b7280]/40 focus:outline-none focus:border-[#40916c] bg-white"
              required
            />
          </div>
          {phoneStatus !== "idle" && (
            <p className={`text-xs px-3 py-2 rounded-lg ${phoneStatus === "success" ? "bg-green-50 text-green-600" : phoneStatus === "error" ? "bg-red-50 text-red-500" : "text-[#6b7280]"}`}>
              {phoneStatus === "loading" ? "保存中..." : phoneMsg}
            </p>
          )}
          <button type="submit" disabled={phoneStatus === "loading"} className="bg-[#1b4332] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#40916c] transition-colors disabled:opacity-40">
            保存手机号
          </button>
        </form>
      </div>

      {/* 修改密码 */}
      <div className="bg-white border border-[#95d5b2] rounded-2xl p-6 mb-5">
        <h2 className="text-sm font-bold text-[#1b4332] mb-5">修改登录密码</h2>
        <form onSubmit={handleChangePassword} className="space-y-4">
          {[
            { label: "当前密码", key: "currentPassword", placeholder: "输入当前密码" },
            { label: "新密码", key: "newPassword", placeholder: "至少6位" },
            { label: "确认新密码", key: "confirmPassword", placeholder: "再次输入新密码" },
          ].map(({ label, key, placeholder }) => (
            <div key={key}>
              <label className="block text-[10px] font-medium text-[#52b788] tracking-widest uppercase mb-1.5">{label}</label>
              <input
                type="password"
                value={pwdForm[key as keyof typeof pwdForm]}
                onChange={(e) => setPwdForm(f => ({ ...f, [key]: e.target.value }))}
                placeholder={placeholder}
                className="w-full border border-[#95d5b2] rounded-lg px-4 py-2.5 text-sm text-[#1b4332] placeholder-[#6b7280]/40 focus:outline-none focus:border-[#40916c] bg-white"
                required
              />
            </div>
          ))}
          {pwdStatus !== "idle" && (
            <p className={`text-xs px-3 py-2 rounded-lg ${pwdStatus === "success" ? "bg-green-50 text-green-600" : pwdStatus === "error" ? "bg-red-50 text-red-500" : "text-[#6b7280]"}`}>
              {pwdStatus === "loading" ? "保存中..." : pwdMsg}
            </p>
          )}
          <button type="submit" disabled={pwdStatus === "loading"} className="bg-[#1b4332] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#40916c] transition-colors disabled:opacity-40">
            保存修改
          </button>
        </form>
      </div>

      {/* 环境变量说明 */}
      <div className="bg-[#f0faf4] border border-[#95d5b2] rounded-2xl p-5">
        <p className="text-[10px] text-[#6b7280] font-medium tracking-widest uppercase mb-2">环境变量说明</p>
        <div className="space-y-1.5">
          {[
            { key: "DATABASE_URL", desc: "MongoDB 连接字符串" },
            { key: "NEXTAUTH_SECRET", desc: "JWT 签名密钥（至少32位随机字符串）" },
            { key: "ADMIN_PHONE", desc: "初始登录手机号（后台修改后此项可删除）" },
            { key: "ADMIN_PASSWORD", desc: "初始管理员密码（后台修改后此项可删除）" },
          ].map(({ key, desc }) => (
            <div key={key} className="flex items-start gap-2">
              <code className="text-[10px] bg-white border border-[#95d5b2] px-2 py-0.5 rounded text-[#40916c] shrink-0">{key}</code>
              <span className="text-[10px] text-[#6b7280]">{desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
