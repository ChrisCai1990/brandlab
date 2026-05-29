"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";

// ─── CSS → Inline (壹伴 approach) ────────────────────────────────────────────

function applyStyleBlocks(doc: Document): void {
  const styleEls = Array.from(doc.querySelectorAll("style"));
  if (styleEls.length === 0) return;

  const cssText = styleEls.map(s => s.textContent || "").join("\n");

  const tmpStyle = document.createElement("style");
  tmpStyle.textContent = cssText;
  document.head.appendChild(tmpStyle);

  try {
    const sheet = tmpStyle.sheet;
    if (!sheet) return;

    // 1. Collect CSS variable definitions from :root / html
    const cssVars: Record<string, string> = {};
    for (const rule of Array.from(sheet.cssRules)) {
      if (!(rule instanceof CSSStyleRule)) continue;
      if (!/^(?::root|html)$/.test(rule.selectorText.trim())) continue;
      const s = rule.style;
      for (let i = 0; i < s.length; i++) {
        const p = s[i];
        if (p.startsWith("--")) cssVars[p] = s.getPropertyValue(p).trim();
      }
    }

    const resolveVars = (val: string): string =>
      val.replace(/var\((--[^,)]+)(?:,\s*([^)]+))?\)/g, (_, name, fb) =>
        cssVars[name.trim()] || (fb ?? ""));

    // 2. Save original inline styles — they have the highest specificity and must win
    const origStyles = new Map<Element, string>();
    doc.querySelectorAll("[style]").forEach(el => {
      origStyles.set(el, el.getAttribute("style") || "");
      el.removeAttribute("style");
    });

    // 3. Apply CSS rules in document order, APPENDING each time so later
    //    (more-specific) rules override earlier ones — matches normal CSS cascade
    for (const rule of Array.from(sheet.cssRules)) {
      if (!(rule instanceof CSSStyleRule)) continue;

      const sel = rule.selectorText;

      // Handle ::before / ::after — inject content as an inline <span>
      if (/::?(?:before|after)/.test(sel)) {
        const isBefore = /::?before/.test(sel);
        const content = rule.style.getPropertyValue("content");
        if (!content || content === "none" || content === "normal") continue;
        const text = content.replace(/^(['"`])(.*)\1$/, "$2");
        if (!text) continue;

        const rs = rule.style;
        const pseudoDecls: string[] = [];
        for (let i = 0; i < rs.length; i++) {
          const p = rs[i];
          if (p === "content") continue;
          let v = rs.getPropertyValue(p);
          if (!v) continue;
          if (v.includes("var(")) { v = resolveVars(v); if (v.includes("var(")) continue; }
          pseudoDecls.push(`${p}:${v}`);
        }

        const baseSel = sel.replace(/::?(?:before|after).*/, "").trim();
        if (!baseSel) continue;
        try {
          doc.querySelectorAll(baseSel).forEach(el => {
            const span = doc.createElement("span");
            if (pseudoDecls.length) span.setAttribute("style", pseudoDecls.join(";"));
            span.textContent = text;
            if (isBefore) el.insertBefore(span, el.firstChild);
            else el.appendChild(span);
          });
        } catch { /* unsupported selector */ }
        continue;
      }

      // Skip other pseudo-classes/elements (:hover, :focus, :nth-child…)
      const selectors = sel.split(",").map(s => s.trim()).filter(s => s && !/:[\w-]/.test(s));
      if (!selectors.length) continue;

      const rs = rule.style;
      const decls: string[] = [];
      for (let i = 0; i < rs.length; i++) {
        const p = rs[i];
        let v = rs.getPropertyValue(p);
        const prio = rs.getPropertyPriority(p);
        if (!v) continue;
        if (v.includes("var(")) { v = resolveVars(v); if (v.includes("var(")) continue; }
        decls.push(prio ? `${p}:${v} !important` : `${p}:${v}`);
      }
      if (!decls.length) continue;
      const declStr = decls.join(";");

      for (const s of selectors) {
        try {
          doc.querySelectorAll(s).forEach(el => {
            const existing = el.getAttribute("style") || "";
            // APPEND: later rules go to the end and win (mirrors CSS cascade order)
            el.setAttribute("style", existing ? `${existing};${declStr}` : declStr);
          });
        } catch { /* unsupported selector */ }
      }
    }

    // 4. Re-apply original inline styles last — they always win
    for (const [el, orig] of origStyles) {
      if (!orig) continue;
      const cls = el.getAttribute("style") || "";
      el.setAttribute("style", cls ? `${cls};${orig}` : orig);
    }

  } finally {
    document.head.removeChild(tmpStyle);
  }

  styleEls.forEach(s => s.remove());
  doc.querySelectorAll("[class]").forEach(el => el.removeAttribute("class"));
}

// ─── Share button ────────────────────────────────────────────────────────────

function ShareButton() {
  const [state, setState] = useState<"idle" | "copied">("idle");
  const copy = () => {
    navigator.clipboard.writeText("https://brandlab.ink/tools/wechat");
    setState("copied");
    setTimeout(() => setState("idle"), 2000);
  };
  return (
    <button
      onClick={copy}
      className="flex items-center gap-1.5 text-xs text-[#9ca3af] hover:text-[#40916c] transition-colors"
    >
      {state === "copied" ? (
        <>
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
            <path d="M2 7l3.5 3.5L12 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          链接已复制
        </>
      ) : (
        <>
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
            <circle cx="3" cy="7" r="1.8" stroke="currentColor" strokeWidth="1.3"/>
            <circle cx="11" cy="2.5" r="1.8" stroke="currentColor" strokeWidth="1.3"/>
            <circle cx="11" cy="11.5" r="1.8" stroke="currentColor" strokeWidth="1.3"/>
            <line x1="4.7" y1="6.1" x2="9.3" y2="3.4" stroke="currentColor" strokeWidth="1.3"/>
            <line x1="4.7" y1="7.9" x2="9.3" y2="10.6" stroke="currentColor" strokeWidth="1.3"/>
          </svg>
          分享工具
        </>
      )}
    </button>
  );
}

// ─── DOM → WeChat <section> HTML ─────────────────────────────────────────────

const REMOVE_TAGS = new Set([
  "script", "style", "link", "meta", "title", "noscript",
  "head", "svg", "canvas", "video", "audio", "form",
  "input", "select", "textarea", "iframe",
]);
const BLOCK_TAGS = new Set([
  "div", "section", "article", "main", "header", "footer",
  "aside", "nav", "figure", "figcaption", "blockquote",
  "h1", "h2", "h3", "h4", "h5", "h6", "ul", "ol", "li", "p",
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
  if (tag === "a" || tag === "button") {
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

  return `<section style="max-width:640px;margin:0 auto;">${content}</section>`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function WechatConverterPage() {
  const [source, setSource] = useState("");
  const [fileName, setFileName] = useState("");
  const [output, setOutput] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [leftTab, setLeftTab] = useState<"code" | "preview">("code");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced auto-conversion on source change
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!source.trim()) {
      setOutput("");
      setPreviewUrl(prev => { if (prev) URL.revokeObjectURL(prev); return ""; });
      setError("");
      return;
    }
    timerRef.current = setTimeout(() => {
      try {
        const blob = new Blob([source], { type: "text/html;charset=utf-8" });
        setPreviewUrl(prev => { if (prev) URL.revokeObjectURL(prev); return URL.createObjectURL(blob); });
        setOutput(convertHtmlToWechat(source));
        setError("");
      } catch (err) {
        setError(err instanceof Error ? err.message : "处理失败");
      }
    }, 400);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [source]);

  const handleFile = useCallback(async (f: File) => {
    if (!f.name.match(/\.(html|htm)$/i)) { setError("请上传 .html 文件"); return; }
    setError("");
    try {
      const text = await f.text();
      setSource(text);
      setFileName(f.name);
    } catch (err) {
      setError(err instanceof Error ? err.message : "处理失败");
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    const f = e.dataTransfer.files[0]; if (f) handleFile(f);
  }, [handleFile]);

  const handleClear = () => {
    setSource("");
    setFileName("");
    setOutput("");
    setPreviewUrl(prev => { if (prev) URL.revokeObjectURL(prev); return ""; });
    setError("");
  };

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
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-white overflow-hidden">

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
          className={`flex items-center gap-2 border rounded-lg px-4 py-2 text-sm font-medium transition-all shrink-0 ${
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

        {fileName ? (
          <span className="text-sm text-[#6b7280] truncate max-w-xs">{fileName}</span>
        ) : (
          <span className="text-sm text-[#9ca3af]">支持 CSS class 写法 · 内联样式 · 拖拽上传</span>
        )}

        {error && <span className="text-sm text-red-500 shrink-0">{error}</span>}

        <div className="ml-auto flex items-center gap-3">
          {source && (
            <button
              onClick={handleClear}
              className="text-xs text-[#6b7280] hover:text-[#40916c] transition-colors"
            >
              清除
            </button>
          )}
          <button
            onClick={handleCopy}
            disabled={!output}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              !output
                ? "bg-gray-100 text-[#ccc] cursor-not-allowed"
                : copied
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
        </div>
      </div>

      {/* Split panels — always visible */}
      <div className="flex-1 flex overflow-hidden">

        {/* ── Left: source input ── */}
        <div className="flex-1 flex flex-col border-r border-gray-200 min-w-0">

          {/* Left panel header: tabs only */}
          <div className="shrink-0 px-3 py-2 bg-gray-50 border-b border-gray-200 flex items-center gap-2">
            <div className="flex rounded overflow-hidden border border-gray-200">
              <button
                onClick={() => setLeftTab("code")}
                className={`px-3 py-1 text-xs font-medium transition-colors ${
                  leftTab === "code"
                    ? "bg-[#1b4332] text-white"
                    : "bg-white text-[#6b7280] hover:bg-gray-100"
                }`}
              >
                源码
              </button>
              <button
                onClick={() => setLeftTab("preview")}
                className={`px-3 py-1 text-xs font-medium transition-colors border-l border-gray-200 ${
                  leftTab === "preview"
                    ? "bg-[#1b4332] text-white"
                    : "bg-white text-[#6b7280] hover:bg-gray-100"
                }`}
              >
                预览
              </button>
            </div>
            <span className="text-xs text-[#9ca3af]">原始 HTML</span>
          </div>

          {/* Left content area */}
          <div className="flex-1 relative overflow-hidden">

            {/* Code editor */}
            <textarea
              value={source}
              onChange={(e) => setSource(e.target.value)}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              placeholder={"粘贴 HTML 源码，或点击「导入文件」上传 .html 文件…\n\n支持内联样式和 CSS class 两种写法，自动实时转换。"}
              spellCheck={false}
              className={`absolute inset-0 w-full h-full resize-none font-mono text-[12px] leading-relaxed p-4 outline-none text-[#333] placeholder:text-[#c0c0c0] transition-colors ${
                isDragging ? "bg-[#f0faf4]" : "bg-[#fafafa]"
              } ${leftTab === "code" ? "block" : "hidden"}`}
            />

            {/* Preview iframe */}
            {leftTab === "preview" && (
              <div className="absolute inset-0 overflow-auto bg-white">
                {previewUrl ? (
                  <iframe
                    src={previewUrl}
                    className="w-full h-full border-none"
                    style={{ minHeight: "100%" }}
                    title="原始预览"
                    sandbox="allow-same-origin allow-scripts"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-sm text-[#9ca3af]">
                    输入源码后在此预览原始渲染效果
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Right: WeChat output ── */}
        <div className="flex-1 flex flex-col min-w-0">

          {/* Right panel header */}
          <div className="shrink-0 px-4 py-2 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <span className="text-xs font-medium text-[#52b788] tracking-widest uppercase">WeChat 格式</span>
            <span className="text-xs text-[#9ca3af]">点击「复制全部」粘贴到公众号</span>
          </div>

          {/* Right content */}
          <div className="flex-1 overflow-auto bg-white">
            {output ? (
              <div
                ref={previewRef}
                className="min-h-full"
                dangerouslySetInnerHTML={{ __html: output }}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center px-10 gap-2">
                <div className="text-3xl opacity-10">✦</div>
                <p className="text-sm text-[#9ca3af]">左侧输入 HTML 源码</p>
                <p className="text-xs text-[#bbb]">转换结果实时显示在这里，点「复制全部」粘贴到公众号</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Footer */}
      <div className="shrink-0 border-t border-gray-100 bg-gray-50 px-6 py-2 flex items-center gap-4">
        <p className="text-xs text-[#9ca3af]">
          复制全部 → 公众号编辑器 → <kbd className="bg-gray-200 rounded px-1 py-0.5 text-[11px] text-[#555]">Ctrl+V</kbd> 粘贴
        </p>
        <div className="ml-auto flex items-center gap-3">
          <ShareButton />
          <span className="text-xs text-[#d0d0d0]">·</span>
          <span className="text-xs text-[#c0c0c0]">section 原生格式 · 背景色 · 圆角 · flex 完整保留</span>
        </div>
      </div>

    </div>
  );
}
