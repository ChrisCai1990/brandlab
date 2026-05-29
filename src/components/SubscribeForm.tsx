"use client";

import { useState } from "react";

export function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMessage("✓ 订阅成功！每周选题灵感将发送到您的邮箱");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "订阅失败，请稍后重试");
      }
    } catch {
      setStatus("error");
      setMessage("网络错误，请稍后重试");
    }
  }

  if (status === "success") {
    return (
      <p className="text-sm text-[#74c69d] font-medium">{message}</p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 w-full max-w-sm">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="输入你的邮箱地址"
        required
        className="flex-1 px-4 py-2.5 rounded-lg text-sm text-[#1b4332] placeholder-[#6b7280]/50 bg-white border border-[#40916c] focus:outline-none focus:border-[#52b788]"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="bg-[#40916c] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#52b788] transition-colors disabled:opacity-50 shrink-0"
      >
        {status === "loading" ? "订阅中..." : "订阅"}
      </button>
      {status === "error" && (
        <p className="text-xs text-red-400 mt-1 w-full">{message}</p>
      )}
    </form>
  );
}
