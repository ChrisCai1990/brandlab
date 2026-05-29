"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";

// ─── CSS → Inline (壹伴 approach) ────────────────────────────────────────────

function applyStyleBlocks(doc: Document): void {
  const styleEls = Array.from(doc.querySelectorAll("style"));
  if (styleEls.length === 0) return;

  const cssText = styleEls.map(s => s.textContent || "").join("\n");
  const ruleRe = /([^@{}/][^{}]*?)\{([^{}]+)\}/g;
  const rules: Array<[string, string]> = [];
  let m;
  while ((m = ruleRe.exec(cssText)) !== null) {
    const decls = m[2].trim().replace(/\s*:\s*/g, ":").replace(/\s*;\s*/g, ";");
    m[1].split(",").forEach(sel => {
      const s = sel.trim();
      if (s && decls) rules.push([s, decls]);
    });
  }
  for (const [sel, decls] of rules) {
    try {
      doc.querySelectorAll(sel).forEach(el => {
        const existing = el.getAttribute("style") || "";
        el.setAttribute("style", existing ? `${existing};${decls}` : decls);
      });
    } catch { /* unsupported selector */ }
  }
  styleEls.forEach(s => s.remove());
  doc.querySelectorAll("[class]").forEach(el => el.removeAttribute("class"));
}

// ─── DOM → WeChat <section> HTML ─────────────────────────────────────────────

const REMOVE_TAGS = new Set([
  "script", "style", "link", "meta", "title", "noscript",
  "head", "svg", "canvas", "video", "audio", "form",
]);
const BLOCK_TAGS = new Set([
  "div", "section", "article", "main", "header", "footer",
  "aside", "nav", "figure", "figcaption", "blockquote",
  "h1", "h2", "h3", "h4", "h5", "h6", "ul", "ol", "li",
]);
const KEEP_ATTRS = new Set(["src", "alt", "href", "width", "height", "colspan", "rowspan"]);

function nodeToWechat(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) return node.textContent || "";
  if (node.nodeType !== Node.ELEMENT_NODE) return "";

  const el = node as Element;
  const tag = el.tagName.toLowerCase();

  if (REMOVE_TAGS.has(tag)) return "";
  if (tag === "br") return "<br>";
  if (tag === "hr") return `<section style="border-top:0.5px solid rgb(229,229,229);margin:16px 0;"></section>`;

  let inner = "";
  for (const child of Array.from(el.childNodes)) inner += nodeToWechat(child);

  if (tag === "img") {
    const src = el.getAttribute("src") || "";
    const alt = el.getAttribute("alt") || "";
    const s = el.getAttribute("style") || "";
    return `<img src="${src}" alt="${alt}" style="max-width:100%;height:auto;display:block;margin:8px auto${s ? ";" + s : ""}">`;
  }
  if (tag === "a") {
    const s = el.getAttribute("style") || "";
    return `<span${s ? ` style="${s}"` : ""}>${inner}</span>`;
  }

  const style = el.getAttribute("style") || "";
  const sa = style ? ` style="${style}"` : "";
  const ea = Array.from(el.attributes)
    .filter(a => KEEP_ATTRS.has(a.name))
    .map(a => `${a.name}="${a.value}"`).join(" ");
  const extra = ea ? " " + ea : "";

  if (BLOCK_TAGS.has(tag)) return `<section${sa}${extra}>${inner}</section>`;
  return `<${tag}${sa}${extra}>${inner}</${tag}>`;
}

function convertHtmlToWechat(html: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  applyStyleBlocks(doc);

  let content = "";
  for (const child of Array.from(doc.body.childNodes)) content += nodeToWechat(child);

  return (
    `<section style="max-width:640px;margin:0 auto;padding:1.5rem 0;` +
    `font-family:-apple-system,'PingFang SC','Helvetica Neue',sans-serif;` +
    `font-size:15px;line-height:1.85;color:rgb(51,51,51);word-break:break-all;">` +
    content +
    `</section>`
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function WechatConverterPage() {
  const [file, setFile] = useState<File | null>(null);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleFile = useCallback(async (f: File) => {
    if (!f.name.match(/\.(html|htm)$/i)) { setError("请上传 .html 文件"); return; }
    setError("");
    setFile(f);
    try {
      const text = await f.text();
      setOutput(convertHtmlToWechat(text));
    } catch (err) {
      setError(err instanceof Error ? err.message : "处理失败");
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    const f = e.dataTransfer.files[0]; if (f) handleFile(f);
  }, [handleFile]);

  const handleCopy = () => {
    const el = previewRef.current;
    if (!el) return;
    const range = document.createRange();
    range.selectNodeContents(el);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
    document.execCommand("copy");
    sel?.removeAllRanges();
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="bg-white min-h-screen flex flex-col">
      {/* Breadcrumb */}
      <div className="border-b border-[#95d5b2] bg-[#f0faf4] shrink-0">
        <div className="max-w-6xl mx-auto px-6 py-2.5 flex items-center gap-2 text-xs text-[#6b7280]">
          <Link href="/" className="hover:text-[#40916c] transition-colors">首页</Link>
          <span>/</span>
          <Link href="/tools" className="hover:text-[#40916c] transition-colors">工具资源</Link>
          <span>/</span>
          <span className="text-[#1b4332] font-medium">公众号排版转换器</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="border-b border-gray-200 bg-white shrink-0 px-6 py-3 flex items-center gap-4">
        <button
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`flex items-center gap-2 border rounded-lg px-4 py-2 text-sm font-medium transition-all ${
            isDragging
              ? "border-[#40916c] bg-[#f0faf4] text-[#1b4332]"
              : "border-[#95d5b2] text-[#2d6a4f] hover:border-[#40916c] hover:bg-[#f0faf4]"
          }`}
        >
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
            <path d="M7.5 1v9M4 5l3.5-4L11 5M2 11h11v2H2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          导入文件
        </button>
        <input ref={fileInputRef} type="file" accept=".html,.htm" className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }} />

        {file ? (
          <span className="text-sm text-[#6b7280] truncate max-w-xs">{file.name}</span>
        ) : (
          <span className="text-sm text-[#9ca3af]">支持 CSS class 写法 · 内联样式 · 拖拽上传</span>
        )}

        {error && <span className="text-sm text-red-500">{error}</span>}

        <div className="ml-auto flex items-center gap-3">
          {output && (
            <>
              <button
                onClick={() => { setOutput(""); setFile(null); setError(""); }}
                className="text-xs text-[#6b7280] hover:text-[#40916c] transition-colors"
              >
                清除
              </button>
              <button
                onClick={handleCopy}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                  copied
                    ? "bg-[#40916c] text-white"
                    : "bg-[#1b4332] text-white hover:bg-[#2d6a4f]"
                }`}
              >
                {copied ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2 7l3.5 3.5L12 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    已复制，去公众号粘贴
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <rect x="4" y="4" width="8" height="8" rx="1.5" stroke="white" strokeWidth="1.4"/>
                      <path d="M2 10V2h8" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
                    </svg>
                    复制全部
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Preview area */}
      <div className="flex-1 overflow-auto">
        {output ? (
          <div
            ref={previewRef}
            className="min-h-full py-10 px-8"
            dangerouslySetInnerHTML={{ __html: output }}
          />
        ) : (
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`flex flex-col items-center justify-center h-full min-h-[480px] cursor-pointer transition-colors ${
              isDragging ? "bg-[#f0faf4]" : "bg-white hover:bg-[#f0faf4]/40"
            }`}
          >
            <div className="text-5xl mb-5 opacity-30">📄</div>
            <p className="text-sm font-medium text-[#6b7280] mb-2">点击「导入文件」或拖拽 HTML 文件到这里</p>
            <p className="text-xs text-[#9ca3af]">转换后内容显示在这里，点击「复制全部」粘贴到公众号</p>
          </div>
        )}
      </div>

      {/* Footer tip */}
      {output && (
        <div className="shrink-0 border-t border-gray-100 bg-gray-50 px-6 py-2.5 flex items-center gap-6">
          <p className="text-xs text-[#6b7280]">
            点击「复制全部」→ 打开微信公众号编辑器 → <kbd className="bg-gray-200 rounded px-1.5 py-0.5 text-[11px]">Ctrl+V</kbd> 粘贴
          </p>
          <span className="text-xs text-[#9ca3af] ml-auto">section 原生格式 · 背景色、圆角、flex 布局完整保留</span>
        </div>
      )}
    </div>
  );
}
