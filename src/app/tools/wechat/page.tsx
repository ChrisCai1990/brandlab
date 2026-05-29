"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";

// ═══════════════════════════════════════════════════════════════
// STEP 1: CSS → Inline styles  (壹伴核心逻辑)
// 正则解析 <style> 块，把每条 CSS 规则应用到匹配元素的 style 属性
// 完全不需要 iframe 或 getComputedStyle，同步执行，零延迟
// ═══════════════════════════════════════════════════════════════

function applyStyleBlocks(doc: Document): void {
  const styleEls = Array.from(doc.querySelectorAll("style"));
  if (styleEls.length === 0) return;

  const cssText = styleEls.map(s => s.textContent || "").join("\n");

  // Parse CSS rules: find all "selector { declarations }" blocks
  // Handles nested braces by matching only single-depth
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

  // Apply rules in document order (later rules override earlier ones via style concatenation)
  for (const [sel, decls] of rules) {
    try {
      doc.querySelectorAll(sel).forEach(el => {
        const existing = el.getAttribute("style") || "";
        el.setAttribute("style", existing ? `${existing};${decls}` : decls);
      });
    } catch {
      // Unsupported selector (pseudo-classes etc.) — skip
    }
  }

  // Remove <style> tags and class attributes — output is fully inline
  styleEls.forEach(s => s.remove());
  doc.querySelectorAll("[class]").forEach(el => el.removeAttribute("class"));
}

// ═══════════════════════════════════════════════════════════════
// STEP 2: DOM → WeChat <section> HTML
// 把元素转为微信原生 section 格式，直接使用 style 属性里的内联样式
// ═══════════════════════════════════════════════════════════════

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
    const style = `max-width:100%;height:auto;display:block;margin:8px auto${s ? ";" + s : ""}`;
    return `<img src="${src}" alt="${alt}" style="${style}">`;
  }

  if (tag === "a") {
    // WeChat strips external links — keep text, lose href
    const s = el.getAttribute("style") || "";
    return `<span${s ? ` style="${s}"` : ""}>${inner}</span>`;
  }

  const style = el.getAttribute("style") || "";
  const styleAttr = style ? ` style="${style}"` : "";
  const extraAttrs = Array.from(el.attributes)
    .filter(a => KEEP_ATTRS.has(a.name))
    .map(a => `${a.name}="${a.value}"`)
    .join(" ");
  const ea = extraAttrs ? " " + extraAttrs : "";

  // Block elements → <section> (WeChat native format)
  if (BLOCK_TAGS.has(tag)) return `<section${styleAttr}${ea}>${inner}</section>`;

  return `<${tag}${styleAttr}${ea}>${inner}</${tag}>`;
}

// ═══════════════════════════════════════════════════════════════
// Full conversion pipeline
// ═══════════════════════════════════════════════════════════════

function convertHtmlToWechat(html: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  // Inline all CSS from <style> blocks (壹伴 approach)
  applyStyleBlocks(doc);

  // Build WeChat section-based output
  let content = "";
  for (const child of Array.from(doc.body.childNodes)) {
    content += nodeToWechat(child);
  }

  return (
    `<section style="max-width:640px;margin:0 auto;padding:1.5rem 0;` +
    `font-family:-apple-system,'PingFang SC','Helvetica Neue',sans-serif;` +
    `font-size:15px;line-height:1.85;color:rgb(51,51,51);word-break:break-all;">` +
    content +
    `</section>`
  );
}

// ═══════════════════════════════════════════════════════════════
// Copy tab
// ═══════════════════════════════════════════════════════════════

function openCopyTab(html: string): void {
  const page = `<!DOCTYPE html>
<html lang="zh">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>公众号内容 — 按 Ctrl+C 复制</title>
<style>
*{box-sizing:border-box}
body{margin:0;padding:0;background:#e8e8e8;font-family:-apple-system,'PingFang SC',sans-serif}
#tip{position:fixed;top:0;left:0;right:0;z-index:9999;background:#1b4332;color:#fff;text-align:center;padding:14px 20px;font-size:14px}
#tip kbd{background:#2d6a4f;border:1px solid #52b788;border-radius:4px;padding:2px 8px;font-family:inherit;font-size:13px}
#wrap{padding:64px 20px 40px}
</style>
</head>
<body>
<div id="tip">✅ 内容已自动全选 — 按 <kbd>Ctrl+C</kbd>（Mac：<kbd>Cmd+C</kbd>）复制，粘贴到公众号编辑器</div>
<div id="wrap">${html}</div>
<script>
window.addEventListener('load',function(){
  var el=document.getElementById('wrap');
  var r=document.createRange();r.selectNodeContents(el);
  var s=window.getSelection();s.removeAllRanges();s.addRange(r);
});
</script>
</body>
</html>`;
  const blob = new Blob([page], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank", "noopener");
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}

// ═══════════════════════════════════════════════════════════════
// Component
// ═══════════════════════════════════════════════════════════════

export default function WechatConverterPage() {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [output, setOutput] = useState("");
  const [rawBlobUrl, setRawBlobUrl] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<"html" | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => { if (rawBlobUrl) URL.revokeObjectURL(rawBlobUrl); };
  }, [rawBlobUrl]);

  const handleFile = useCallback(async (f: File) => {
    if (!f.name.match(/\.(html|htm)$/i)) { setError("请上传 .html 文件"); return; }
    setFile(f);
    setError("");
    setOutput("");
    setProcessing(true);

    try {
      const text = await f.text();

      // Original HTML → display iframe (left panel preview)
      const origBlob = new Blob([text], { type: "text/html;charset=utf-8" });
      setRawBlobUrl(URL.createObjectURL(origBlob));

      // Convert synchronously — no iframe, no CDN, no timing issues
      const result = convertHtmlToWechat(text);
      setOutput(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "处理失败，请重试");
    } finally {
      setProcessing(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    const f = e.dataTransfer.files[0]; if (f) handleFile(f);
  }, [handleFile]);

  const handleOpenCopyTab = () => { if (output) openCopyTab(output); };

  const handleCopyHtml = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied("html");
      setTimeout(() => setCopied(null), 2500);
    } catch {
      setError("复制失败，请手动从下方源码区域复制");
    }
  };

  const reset = () => {
    setOutput(""); setRawBlobUrl(""); setFile(null); setError("");
  };

  const done = !!output;

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-[#95d5b2] bg-[#f0faf4]">
        <div className="max-w-6xl mx-auto px-8 py-3 flex items-center gap-2 text-xs text-[#6b7280]">
          <Link href="/" className="hover:text-[#40916c] transition-colors">首页</Link>
          <span>/</span>
          <Link href="/tools" className="hover:text-[#40916c] transition-colors">工具资源</Link>
          <span>/</span>
          <span className="text-[#1b4332] font-medium">公众号排版转换器</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-12">
        <div className="mb-10">
          <p className="text-xs text-[#52b788] font-medium tracking-widest uppercase mb-2">工具</p>
          <h1 className="text-3xl font-bold text-[#1b4332] mb-3">公众号排版转换器</h1>
          <p className="text-sm text-[#6b7280]">
            上传 HTML 文件（支持 CSS 类写法），自动内联样式转为微信公众号原生格式，直接粘贴到编辑器
          </p>
        </div>

        {/* Upload */}
        {!rawBlobUrl && (
          <>
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all ${
                isDragging ? "border-[#40916c] bg-[#f0faf4] cursor-copy"
                : "border-[#95d5b2] hover:border-[#52b788] hover:bg-[#f0faf4]/50"
              }`}
            >
              <input ref={fileInputRef} type="file" accept=".html,.htm" className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }} />
              <div className="text-4xl mb-4">📄</div>
              <p className="text-sm font-medium text-[#1b4332] mb-2">拖拽 HTML 文件到这里，或点击选择</p>
              <p className="text-xs text-[#6b7280]">支持 CSS class 写法 / 内联样式 / Tailwind 模板</p>
            </div>
            {error && <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg"><p className="text-sm text-red-600">{error}</p></div>}
          </>
        )}

        {/* Results */}
        {rawBlobUrl && (
          <div className="space-y-6">

            {/* Action bar */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-sm font-bold text-[#1b4332]">
                  {processing ? "转换中…" : "转换完成"}
                </p>
                <p className="text-xs text-[#6b7280] mt-0.5">来源：{file?.name}</p>
              </div>
              <div className="flex gap-3 flex-wrap">
                <button onClick={reset}
                  className="text-xs border border-[#95d5b2] text-[#6b7280] px-4 py-2 rounded-lg hover:border-[#40916c] hover:text-[#40916c] transition-colors">
                  重新上传
                </button>
                <button onClick={handleCopyHtml} disabled={!done}
                  className="text-xs border border-[#95d5b2] text-[#6b7280] px-4 py-2 rounded-lg hover:border-[#40916c] hover:text-[#40916c] transition-colors disabled:opacity-40">
                  {copied === "html" ? "✓ 已复制" : "复制 HTML 源码"}
                </button>
                <button onClick={handleOpenCopyTab} disabled={!done}
                  className="text-xs bg-[#1b4332] text-white px-5 py-2 rounded-lg hover:bg-[#40916c] transition-colors font-medium disabled:opacity-40">
                  打开复制页 → 再按 Ctrl+C
                </button>
              </div>
            </div>

            {error && <div className="p-4 bg-red-50 border border-red-200 rounded-lg"><p className="text-sm text-red-600">{error}</p></div>}

            {/* Dual preview */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

              {/* Left: original */}
              <div className="border border-[#95d5b2] rounded-xl overflow-hidden">
                <div className="border-b border-[#95d5b2] bg-[#f0faf4] px-5 py-3 flex items-center justify-between">
                  <p className="text-xs font-medium text-[#52b788] tracking-widest uppercase">原始模板</p>
                  <p className="text-xs text-[#6b7280]">上传文件完整渲染</p>
                </div>
                <div style={{ height: "520px" }} className="bg-white">
                  <iframe src={rawBlobUrl} className="w-full h-full border-none"
                    title="原始模板" sandbox="allow-same-origin allow-scripts" />
                </div>
              </div>

              {/* Right: WeChat format */}
              <div className="border border-[#95d5b2] rounded-xl overflow-hidden">
                <div className="border-b border-[#95d5b2] bg-[#f0faf4] px-5 py-3 flex items-center justify-between">
                  <p className="text-xs font-medium text-[#52b788] tracking-widest uppercase">WeChat 格式</p>
                  <p className="text-xs text-[#6b7280]">section 原生 · 手机宽度预览</p>
                </div>
                <div className="overflow-auto bg-[#f0f0f0]" style={{ height: "520px" }}>
                  {processing ? (
                    <div className="flex items-center justify-center h-full gap-3">
                      <div className="flex gap-1.5">
                        {[0,1,2].map(i => (
                          <span key={i} className="w-2 h-2 rounded-full bg-[#52b788] animate-bounce"
                            style={{ animationDelay: `${i*0.15}s` }} />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div style={{ width: "375px", margin: "0 auto", background: "white", minHeight: "100%" }}>
                      <div className="p-3" dangerouslySetInnerHTML={{ __html: output }} />
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* HTML source */}
            {done && (
              <div className="border border-[#95d5b2] rounded-xl overflow-hidden">
                <div className="border-b border-[#95d5b2] bg-[#f0faf4] px-5 py-3 flex items-center justify-between">
                  <p className="text-xs font-medium text-[#52b788] tracking-widest uppercase">WeChat HTML 源码</p>
                  <p className="text-xs text-[#6b7280]">&lt;section&gt; 原生格式，可直接粘贴</p>
                </div>
                <textarea readOnly value={output} rows={6}
                  className="w-full p-4 text-xs text-[#4b5563] font-mono bg-gray-50 focus:outline-none resize-y border-none" />
              </div>
            )}

            {/* Steps */}
            {done && (
              <div className="bg-[#f0faf4] border border-[#95d5b2] rounded-xl p-5">
                <p className="text-xs font-bold text-[#1b4332] mb-3">粘贴步骤</p>
                <ol className="space-y-1.5">
                  {[
                    "点击「打开复制页」，新标签页打开已渲染的内容",
                    "新页面内容已自动全选（蓝色高亮），直接按 Ctrl+C（Mac：Cmd+C）",
                    "切换到微信公众号编辑器，按 Ctrl+V 粘贴",
                    "检查排版，适当调整后发布",
                  ].map((step, i) => (
                    <li key={i} className="text-xs text-[#6b7280] flex items-start gap-2">
                      <span className="text-[#52b788] font-bold shrink-0 w-4">{i+1}.</span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}
