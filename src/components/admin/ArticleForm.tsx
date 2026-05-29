"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

function SimplePreview({ content }: { content: string }) {
  const lines = content.split("\n");
  return (
    <div className="prose-brandlab text-sm leading-relaxed space-y-3">
      {lines.map((line, i) => {
        if (line.startsWith("## ")) return <h2 key={i} className="text-sm font-bold text-[#1b4332] mt-6 mb-2 flex items-center gap-2"><span className="w-1 h-4 bg-[#2d6a4f] rounded-full shrink-0" />{line.slice(3)}</h2>;
        if (line.startsWith("### ")) return <h3 key={i} className="text-sm font-bold text-[#1b4332] mt-4 mb-1">{line.slice(4)}</h3>;
        if (line.startsWith("> ")) return <div key={i} className="bg-[#f0faf4] border-l-4 border-[#2d6a4f] rounded-r-xl px-4 py-3 text-sm font-bold text-[#1b4332]">{line.slice(2)}</div>;
        if (line.startsWith("- ")) return <div key={i} className="flex items-start gap-2 text-sm text-[#6b7280]"><span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#52b788] shrink-0" />{line.slice(2)}</div>;
        if (line.startsWith("---")) return <hr key={i} className="border-[#95d5b2] my-4" />;
        if (line.trim() === "") return <div key={i} className="h-2" />;
        return <p key={i} className="text-sm text-[#6b7280] leading-relaxed">{line}</p>;
      })}
    </div>
  );
}

const TAGS = ["个人定位", "视觉表达", "内容运营", "账号增长", "平台策略", "IP案例", "工具方法"];

type ArticleFormProps = {
  initialData?: {
    id?: string;
    title?: string;
    slug?: string;
    tag?: string;
    desc?: string;
    date?: string;
    readTime?: string;
    content?: string;
    wechatHtml?: string;
    published?: boolean;
  };
};

function toSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[\s一-龥]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function ArticleForm({ initialData }: ArticleFormProps) {
  const isEdit = !!initialData?.id;
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [contentTab, setContentTab] = useState<"edit" | "preview">("edit");

  const [form, setForm] = useState({
    title: initialData?.title ?? "",
    slug: initialData?.slug ?? "",
    tag: initialData?.tag ?? TAGS[0],
    desc: initialData?.desc ?? "",
    date: initialData?.date
      ? new Date(initialData.date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    readTime: initialData?.readTime ?? "5",
    content: initialData?.content ?? "",
    wechatHtml: initialData?.wechatHtml ?? "",
    published: initialData?.published ?? false,
  });

  function handleTitleChange(title: string) {
    setForm((f) => ({
      ...f,
      title,
      slug: isEdit ? f.slug : toSlug(title),
    }));
  }

  async function handleSave(published: boolean) {
    if (!form.title.trim() || !form.slug.trim()) {
      setError("标题和 Slug 不能为空");
      return;
    }
    setSaving(true);
    setError("");

    const url = isEdit
      ? `/api/admin/articles/${initialData!.id}`
      : "/api/admin/articles";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, published, wechatHtml: form.wechatHtml }),
    });

    if (res.ok) {
      router.push("/admin/articles");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error || "保存失败，请重试");
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("确定删除这篇文章吗？此操作不可撤销。")) return;
    const res = await fetch(`/api/admin/articles/${initialData!.id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/admin/articles");
      router.refresh();
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <button
            onClick={() => router.push("/admin/articles")}
            className="text-xs text-[#6b7280] hover:text-[#40916c] transition-colors mb-1"
          >
            ← 返回列表
          </button>
          <h1 className="text-xl font-bold text-[#1b4332]">
            {isEdit ? "编辑文章" : "新建文章"}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {isEdit && (
            <button
              onClick={handleDelete}
              className="text-xs text-red-400 border border-red-200 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
            >
              删除
            </button>
          )}
          <button
            onClick={() => handleSave(false)}
            disabled={saving}
            className="text-xs border border-[#95d5b2] text-[#6b7280] px-4 py-2 rounded-lg hover:border-[#52b788] transition-colors disabled:opacity-40"
          >
            保存草稿
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="text-xs bg-[#1b4332] text-white px-4 py-2 rounded-lg hover:bg-[#40916c] transition-colors disabled:opacity-40 font-medium"
          >
            {saving ? "保存中..." : "发布"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-5 text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      <div className="space-y-5">
        {/* Title */}
        <div className="bg-white border border-[#95d5b2] rounded-2xl p-6">
          <label className="block text-xs font-medium text-[#52b788] tracking-widest uppercase mb-2">标题</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="文章标题"
            className="w-full text-lg font-bold text-[#1b4332] border-none outline-none placeholder-[#95d5b2]"
          />
        </div>

        {/* Meta row */}
        <div className="bg-white border border-[#95d5b2] rounded-2xl p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-[10px] font-medium text-[#52b788] tracking-widest uppercase mb-1.5">Slug (URL)</label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              className="w-full text-xs text-[#1b4332] border border-[#95d5b2] rounded-lg px-3 py-2 focus:outline-none focus:border-[#40916c]"
            />
          </div>
          <div>
            <label className="block text-[10px] font-medium text-[#52b788] tracking-widest uppercase mb-1.5">分类</label>
            <select
              value={form.tag}
              onChange={(e) => setForm((f) => ({ ...f, tag: e.target.value }))}
              className="w-full text-xs text-[#1b4332] border border-[#95d5b2] rounded-lg px-3 py-2 focus:outline-none focus:border-[#40916c] bg-white"
            >
              {TAGS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-medium text-[#52b788] tracking-widest uppercase mb-1.5">发布日期</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              className="w-full text-xs text-[#1b4332] border border-[#95d5b2] rounded-lg px-3 py-2 focus:outline-none focus:border-[#40916c]"
            />
          </div>
          <div>
            <label className="block text-[10px] font-medium text-[#52b788] tracking-widest uppercase mb-1.5">
              阅读时长（分钟）<span className="ml-1 text-[#95d5b2] normal-case font-normal">自动计算</span>
            </label>
            <input
              type="text"
              value={form.readTime}
              readOnly
              className="w-full text-xs text-[#6b7280] border border-[#95d5b2] rounded-lg px-3 py-2 bg-[#f0faf4] cursor-default"
            />
          </div>
        </div>

        {/* Desc */}
        <div className="bg-white border border-[#95d5b2] rounded-2xl p-6">
          <label className="block text-[10px] font-medium text-[#52b788] tracking-widest uppercase mb-2">摘要</label>
          <textarea
            value={form.desc}
            onChange={(e) => setForm((f) => ({ ...f, desc: e.target.value }))}
            placeholder="一两句话描述文章核心价值"
            rows={2}
            className="w-full text-sm text-[#6b7280] border-none outline-none resize-none placeholder-[#95d5b2] leading-relaxed"
          />
        </div>

        {/* WeChat HTML */}
        <div className="bg-white border border-[#95d5b2] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-3">
            <label className="block text-[10px] font-medium text-[#52b788] tracking-widest uppercase">公众号 HTML（内联样式）</label>
            <span className="text-[10px] text-[#6b7280]">{form.wechatHtml.length > 0 ? "✓ 已填写" : "未填写"}</span>
          </div>
          <textarea
            value={form.wechatHtml}
            onChange={(e) => setForm((f) => ({ ...f, wechatHtml: e.target.value }))}
            placeholder="粘贴内联样式版 HTML（可直接复制进公众号编辑器）"
            rows={6}
            className="w-full text-xs text-[#4b5563] font-mono border border-[#e5e7eb] rounded-lg px-3 py-2.5 outline-none resize-y placeholder-[#95d5b2] leading-relaxed focus:border-[#40916c]"
          />
        </div>

        {/* Content */}
        <div className="bg-white border border-[#95d5b2] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <label className="block text-[10px] font-medium text-[#52b788] tracking-widest uppercase">正文（Markdown）</label>
              <div className="flex gap-1">
                {(["edit", "preview"] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setContentTab(tab)}
                    className={`text-[10px] px-2.5 py-1 rounded-md border transition-colors ${
                      contentTab === tab
                        ? "bg-[#2d6a4f] text-white border-[#2d6a4f]"
                        : "text-[#6b7280] border-[#95d5b2] hover:border-[#52b788]"
                    }`}
                  >
                    {tab === "edit" ? "编辑" : "预览"}
                  </button>
                ))}
              </div>
            </div>
            <span className="text-[10px] text-[#6b7280]">{form.content.length} 字</span>
          </div>
          {contentTab === "edit" ? (
            <textarea
              value={form.content}
              onChange={(e) => {
                const content = e.target.value;
                const words = content.replace(/[^一-龥a-zA-Z0-9]/g, "").length;
                const minutes = Math.max(1, Math.round(words / 300));
                setForm((f) => ({ ...f, content, readTime: String(minutes) }));
              }}
              placeholder={`## 痛点切入\n\n你的开头...\n\n## 核心方法\n\n内容...`}
              rows={24}
              className="w-full text-sm text-[#4b5563] font-mono border-none outline-none resize-y placeholder-[#95d5b2] leading-relaxed"
            />
          ) : (
            <div className="min-h-[400px] border border-[#f0faf4] rounded-xl p-4 bg-[#fafffe]">
              <SimplePreview content={form.content} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
