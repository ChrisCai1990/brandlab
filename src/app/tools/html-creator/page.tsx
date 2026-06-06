"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

type Template = {
  id: string;
  icon: string;
  title: string;
  desc: string;
  placeholder: string;
};

const TEMPLATES: Template[] = [
  {
    id: "xiaohongshu",
    icon: "📱",
    title: "小红书笔记卡",
    desc: "图文笔记风格，带封面、正文高亮、互动栏",
    placeholder: `输入笔记标题和正文内容，例如：

标题：5个让粉丝疯狂转发的文案公式

正文：
很多人写文案总感觉差点意思...
（在此输入你的内容）`,
  },
  {
    id: "quote-card",
    icon: "💬",
    title: "金句分享卡",
    desc: "深色高级感卡片，适合朋友圈截图分享",
    placeholder: `输入你的金句或观点，例如：

金句：你不是没时间做内容，是还没找到属于自己的节奏。

作者：李明（可留空）`,
  },
  {
    id: "personal-intro",
    icon: "🎯",
    title: "个人品牌介绍页",
    desc: "一页式个人名片，含简介、成就数据、联系方式",
    placeholder: `输入你的个人信息，例如：

姓名：李明
职业：个人品牌顾问
一句话定位：帮助创作者从0到1打造变现型个人品牌
核心优势：3年服务500+创作者，擅长定位策划与内容体系
代表成绩：帮助客户平均3个月涨粉1万+，变现超百万
联系方式：微信 liming666 | 公众号 品牌实验室`,
  },
  {
    id: "data-card",
    icon: "📊",
    title: "成就数据卡",
    desc: "大数字视觉展示，让你的成绩更有冲击力",
    placeholder: `输入你想展示的数据，例如：

标题：30天增长报告

数据1：12,000 涨粉量
数据2：380万 内容曝光
数据3：23% 粉丝互动率
数据4：¥86,000 月变现

说明：2024年10月数据`,
  },
  {
    id: "article",
    icon: "📰",
    title: "公众号文章排版",
    desc: "精美排版，支持标题层级、引用块、重点高亮",
    placeholder: `输入文章标题和正文，例如：

标题：个人品牌的核心不是"人设"，而是这3个东西

正文：
很多人做个人品牌的第一步就是打造人设...

## 第一点：真实的价值观
...

## 第二点：可复制的方法论
...

> 引言：品牌的本质是信任，而信任来自于一致性。`,
  },
  {
    id: "poster",
    icon: "🎪",
    title: "活动海报",
    desc: "课程、直播、线下活动海报，信息层次清晰",
    placeholder: `输入活动信息，例如：

活动名称：个人品牌7天训练营
副标题：从0开始，打造会赚钱的个人IP
时间：2024年11月20日 20:00
平台：腾讯视频号直播
主讲人：李明·品牌实验室创始人
核心内容：定位策划 / 内容体系 / 变现路径
报名方式：扫码添加助理微信
价格：早鸟价 ¥99（原价¥299）`,
  },
];

export default function HtmlCreatorPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<Template>(TEMPLATES[0]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedHtml, setGeneratedHtml] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 切换模板时清空内容和结果
  function selectTemplate(tpl: Template) {
    setSelectedTemplate(tpl);
    setContent("");
    setGeneratedHtml("");
    setError("");
  }

  async function handleGenerate() {
    if (!content.trim()) {
      setError("请先填写内容");
      textareaRef.current?.focus();
      return;
    }
    setLoading(true);
    setError("");
    setGeneratedHtml("");

    try {
      const res = await fetch("/api/tools/html-creator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ template: selectedTemplate.id, content }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "生成失败，请重试");
      } else {
        setGeneratedHtml(data.html);
      }
    } catch {
      setError("网络错误，请稍后重试");
    } finally {
      setLoading(false);
    }
  }

  // Cmd/Ctrl + Enter 触发生成
  function handleKeyDown(e: React.KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleGenerate();
    }
  }

  // iframe 写入 HTML
  useEffect(() => {
    if (iframeRef.current && generatedHtml) {
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(generatedHtml);
        doc.close();
      }
    }
  }, [generatedHtml]);

  function copyHtml() {
    navigator.clipboard.writeText(generatedHtml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="bg-black min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-[#1f1f1f] bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto px-8 py-3 flex items-center gap-2 text-xs text-[#888888]">
          <Link href="/" className="hover:text-[#a0a0a0] transition-colors">首页</Link>
          <span>/</span>
          <Link href="/tools" className="hover:text-[#a0a0a0] transition-colors">工具资源</Link>
          <span>/</span>
          <span className="text-white font-medium">HTML内容生成器</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="mb-10">
          <p className="text-xs text-[#888888] font-medium tracking-widest uppercase mb-2">AI 工具</p>
          <h1 className="text-3xl font-bold text-white mb-3">HTML 内容生成器</h1>
          <p className="text-sm text-[#888888] max-w-xl">
            选择模板，输入内容，AI 自动生成精美 HTML —— 小红书笔记卡、金句卡、个人介绍页、活动海报，一键复制使用。
          </p>
        </div>

        {/* Step 1: 选模板 */}
        <div className="mb-8">
          <p className="text-xs text-[#888888] font-medium tracking-widest uppercase mb-4">① 选择模板</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {TEMPLATES.map((tpl) => (
              <button
                key={tpl.id}
                onClick={() => selectTemplate(tpl)}
                className={`text-left p-4 rounded-none border transition-all ${
                  selectedTemplate.id === tpl.id
                    ? "border-[#333333] bg-[#0a0a0a] shadow-sm"
                    : "border-[#d1fae5] hover:border-[#1f1f1f] hover:bg-[#f9fffe]"
                }`}
              >
                <div className="text-xl mb-2">{tpl.icon}</div>
                <div className="text-sm font-semibold text-white mb-1">{tpl.title}</div>
                <div className="text-xs text-[#888888] leading-relaxed">{tpl.desc}</div>
                {selectedTemplate.id === tpl.id && (
                  <div className="mt-2 flex items-center gap-1 text-xs text-[#a0a0a0] font-medium">
                    <span className="w-1.5 h-1.5 rounded-sm bg-[#111111]" />
                    已选择
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: 填写内容 */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs text-[#888888] font-medium tracking-widest uppercase">
              ② 填写内容（{selectedTemplate.icon} {selectedTemplate.title}）
            </p>
            <span className="text-xs text-[#9ca3af]">
              按 <kbd className="bg-gray-100 border border-gray-200 rounded px-1.5 py-0.5 text-[10px] font-mono">⌘ Enter</kbd> 快速生成
            </span>
          </div>
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={selectedTemplate.placeholder}
            rows={10}
            className="w-full border border-[#1f1f1f] rounded-none px-5 py-4 text-sm text-[#374151] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#52b788] focus:border-transparent resize-none bg-[#fafffe] leading-relaxed"
          />
        </div>

        {/* Generate Button */}
        <div className="flex items-center gap-4 mb-10">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="flex items-center gap-2 bg-[#0a0a0a] text-white px-8 py-3.5 rounded-none font-medium text-sm hover:bg-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                AI 生成中...
              </>
            ) : (
              <>
                <span>✨</span>
                生成 HTML
              </>
            )}
          </button>
          {generatedHtml && !loading && (
            <button
              onClick={handleGenerate}
              className="text-sm text-[#888888] hover:text-white transition-colors"
            >
              重新生成 →
            </button>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 text-sm rounded-none px-5 py-4">
            {error}
          </div>
        )}

        {/* Preview + Result */}
        {generatedHtml && (
          <div className="border border-[#1f1f1f] rounded-none overflow-hidden">
            {/* Preview Header */}
            <div className="bg-[#0a0a0a] border-b border-[#1f1f1f] px-6 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-red-400" />
                <span className="w-3 h-3 rounded-sm bg-yellow-400" />
                <span className="w-3 h-3 rounded-sm bg-green-400" />
                <span className="ml-3 text-xs text-[#888888] font-medium">预览</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={copyHtml}
                  className="flex items-center gap-1.5 text-xs bg-[#0a0a0a] text-white px-4 py-2 rounded-none hover:bg-white transition-colors"
                >
                  {copied ? "✓ 已复制" : "复制 HTML"}
                </button>
              </div>
            </div>

            {/* iframe Preview */}
            <div className="bg-[#f9f9f9] p-6 flex justify-center min-h-[500px]">
              <iframe
                ref={iframeRef}
                sandbox="allow-scripts allow-same-origin"
                className="w-full max-w-4xl bg-black rounded-none shadow-sm"
                style={{ height: "700px", border: "none" }}
                title="HTML预览"
              />
            </div>

            {/* HTML Code */}
            <div className="border-t border-[#1f1f1f]">
              <details className="group">
                <summary className="flex items-center gap-2 px-6 py-3 text-xs text-[#888888] cursor-pointer hover:text-white transition-colors select-none bg-[#0a0a0a]">
                  <svg className="w-3.5 h-3.5 group-open:rotate-90 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  查看 HTML 源代码
                </summary>
                <pre className="px-6 py-5 text-xs text-[#374151] bg-[#1e1e1e] text-green-300 overflow-x-auto leading-relaxed max-h-96 overflow-y-auto">
                  <code>{generatedHtml}</code>
                </pre>
              </details>
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="mt-12 bg-[#0a0a0a] border border-[#1f1f1f] rounded-none p-8">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <span>💡</span> 使用技巧
          </h3>
          <ul className="space-y-2.5">
            {[
              "内容越详细，生成效果越好 —— 提供真实的数字、具体的描述",
              "对效果不满意？点「重新生成」，每次结果都会有所不同",
              "复制 HTML 后可直接粘贴到公众号编辑器、Notion、或保存为 .html 文件",
              "小红书卡片建议截图分享，金句卡直接截图效果最佳",
            ].map((tip, i) => (
              <li key={i} className="text-xs text-[#888888] flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-sm bg-[#52b788] shrink-0 mt-1.5" />
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
