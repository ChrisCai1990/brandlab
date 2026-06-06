"use client";

import Image from "next/image";
import { useState } from "react";

const cooperationTypes = [
  { title: "内容合作", desc: "产品测评 / 联名内容 / 话题共创，欢迎有调性的品牌合作", icon: "✍" },
  { title: "课程合作", desc: "与个人品牌相关的课程联合推广或联合出品", icon: "◻" },
  { title: "工具推荐", desc: "专为创作者设计的工具或SaaS产品，可以聊聊", icon: "◼" },
  { title: "社群活动", desc: "线上活动、直播连线、社群共创等形式均可探讨", icon: "◈" },
];

const platforms = [
  { name: "小红书", handle: "@品牌拾研社", desc: "主阵地，每日更新" },
  { name: "微信公众号", handle: "品牌拾研社", desc: "深度长文，周更" },
  { name: "抖音", handle: "@BrandLab", desc: "短视频，知识分享" },
];

type FormStatus = "idle" | "loading" | "success" | "error";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", wechat: "", message: "" });
  const [status, setStatus] = useState<FormStatus>("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setStatus("success");
      setForm({ name: "", wechat: "", message: "" });
    } else {
      setStatus("error");
    }
  }

  return (
    <div className="bg-black min-h-screen">
      <div className="border-b border-[#1f1f1f] py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs text-[#555555] font-medium tracking-widest uppercase mb-6">联系 / 合作</p>
          <h1 className="text-5xl font-bold text-white mb-4">一起做有意思的事</h1>
          <p className="text-base text-[#a0a0a0]">欢迎投稿、商务合作、加入社群，或者只是来打个招呼。</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left */}
          <div className="space-y-8">
            <div>
              <p className="text-xs text-[#555555] font-medium tracking-widest uppercase mb-4">加入社群</p>
              <div className="border border-[#1f1f1f] bg-[#0a0a0a] p-6">
                <div className="flex items-start gap-5">
                  <Image src="/qrcode.png" alt="微信二维码" width={112} height={112} className="shrink-0 opacity-80" />
                  <div>
                    <h3 className="text-sm font-bold text-white mb-2">扫码加微信</h3>
                    <p className="text-xs text-[#888888] leading-relaxed mb-3">加微信备注「社群」，即可加入品牌拾研社创作者社群，免费获取3套模板。</p>
                    {["免费获取3套创作模板", "5000+ 创作者社群交流", "第一时间获取新内容"].map((t) => (
                      <p key={t} className="text-xs text-[#888888] flex items-center gap-1.5 mb-1">
                        <span className="w-1 h-1 bg-white" />{t}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs text-[#555555] font-medium tracking-widest uppercase mb-4">找到我们</p>
              <div className="space-y-px border border-[#1f1f1f]">
                {platforms.map((p) => (
                  <div key={p.name} className="flex items-center justify-between bg-[#0a0a0a] px-5 py-4 hover:bg-[#111111] transition-colors">
                    <div>
                      <div className="text-sm font-medium text-white">{p.name}</div>
                      <div className="text-xs text-[#555555] mt-0.5">{p.desc}</div>
                    </div>
                    <div className="text-xs text-[#888888] font-medium">{p.handle}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="space-y-8">
            <div>
              <p className="text-xs text-[#555555] font-medium tracking-widest uppercase mb-4">商务合作</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-px border border-[#1f1f1f] mb-8">
                {cooperationTypes.map((c) => (
                  <div key={c.title} className="bg-[#0a0a0a] p-5">
                    <div className="text-base text-[#555555] mb-2">{c.icon}</div>
                    <h3 className="text-xs font-bold text-white mb-1">{c.title}</h3>
                    <p className="text-[10px] text-[#555555] leading-relaxed">{c.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div className="border border-[#1f1f1f] bg-[#0a0a0a] p-6">
              <p className="text-xs text-[#555555] font-medium tracking-widest uppercase mb-5">留言给我们</p>
              {status === "success" ? (
                <div className="text-center py-8">
                  <div className="text-2xl mb-3 text-white">✓</div>
                  <p className="text-sm font-medium text-white mb-1">收到了！</p>
                  <p className="text-xs text-[#888888]">我们会在48小时内通过微信回复你。</p>
                  <button onClick={() => setStatus("idle")} className="mt-4 text-xs text-[#888888] hover:text-white transition-colors">再发一条 →</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-medium text-[#555555] uppercase tracking-widest mb-1.5">姓名 *</label>
                      <input type="text" value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} placeholder="你的名字"
                        className="w-full border border-[#1f1f1f] px-3 py-2.5 text-sm text-white placeholder-[#333333] focus:outline-none focus:border-[#333333] bg-black transition-colors" required />
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-[#555555] uppercase tracking-widest mb-1.5">微信号</label>
                      <input type="text" value={form.wechat} onChange={(e) => setForm(f => ({ ...f, wechat: e.target.value }))} placeholder="方便联系你"
                        className="w-full border border-[#1f1f1f] px-3 py-2.5 text-sm text-white placeholder-[#333333] focus:outline-none focus:border-[#333333] bg-black transition-colors" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-[#555555] uppercase tracking-widest mb-1.5">留言 *</label>
                    <textarea value={form.message} onChange={(e) => setForm(f => ({ ...f, message: e.target.value }))} placeholder="想说的事情…"
                      rows={4} className="w-full border border-[#1f1f1f] px-3 py-2.5 text-sm text-white placeholder-[#333333] focus:outline-none focus:border-[#333333] bg-black transition-colors resize-none" required />
                  </div>
                  {status === "error" && <p className="text-xs text-red-400">发送失败，请稍后重试</p>}
                  <button type="submit" disabled={status === "loading"}
                    className="w-full border border-white text-white py-3 text-sm font-medium hover:bg-white hover:text-black transition-colors disabled:opacity-40">
                    {status === "loading" ? "发送中…" : "发送留言"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
