"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";

// ─── CSS pre-inliner (壹伴 approach) ─────────────────────────────────────────
// Parse <style> blocks and apply matching rules as inline styles.
// This runs synchronously in the browser — no iframe or CDN timing needed.

function preInlineCss(html: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const styleEls = Array.from(doc.querySelectorAll("style"));
  if (styleEls.length === 0) return html;

  // Inject a temporary <style> into the main document so the browser can
  // parse the CSS rules via CSSOM (handles selectors, shorthand, etc.)
  const tempStyle = document.createElement("style");
  tempStyle.textContent = styleEls.map(s => s.textContent || "").join("\n");
  document.head.appendChild(tempStyle);

  try {
    const sheet = tempStyle.sheet;
    if (!sheet) return html;

    const rules = Array.from(sheet.cssRules).filter(
      r => r instanceof CSSStyleRule,
    ) as CSSStyleRule[];

    // Apply each rule to matching elements in the parsed document
    for (const rule of rules) {
      try {
        doc.querySelectorAll(rule.selectorText).forEach(el => {
          const decls = Array.from(rule.style)
            .map(p => `${p}:${rule.style.getPropertyValue(p)}`)
            .join(";");
          const existing = el.getAttribute("style") || "";
          el.setAttribute("style", existing ? `${existing};${decls}` : decls);
        });
      } catch {
        // Invalid selector — skip
      }
    }
  } finally {
    document.head.removeChild(tempStyle);
  }

  // Remove style tags and class attributes — output is fully inline
  styleEls.forEach(s => s.remove());
  doc.querySelectorAll("[class]").forEach(el => el.removeAttribute("class"));

  return `<!DOCTYPE html><html><head>${doc.head.innerHTML}</head><body>${doc.body.innerHTML}</body></html>`;
}

// ─── Style extraction ────────────────────────────────────────────────────────

const STYLE_PROPS = [
  "color", "font-size", "font-weight", "font-family", "font-style",
  "text-decoration", "text-align", "line-height", "letter-spacing", "text-transform",
  "margin-top", "margin-bottom", "margin-left", "margin-right",
  "padding-top", "padding-bottom", "padding-left", "padding-right",
  "border-top", "border-bottom", "border-left", "border-right", "border-radius",
  "background-color",
  "display", "flex-direction", "flex-wrap", "justify-content",
  "align-items", "align-self", "flex", "gap", "flex-shrink",
  "width", "max-width", "min-width", "height",
  "text-indent", "white-space", "word-break", "vertical-align", "opacity",
];

function shouldSkip(prop: string, val: string): boolean {
  if (!val || val === "initial" || val === "inherit" || val === "unset") return true;
  if (prop === "background-color" && (val === "rgba(0, 0, 0, 0)" || val === "transparent")) return true;
  if (["margin-top","margin-bottom","margin-left","margin-right",
       "padding-top","padding-bottom","padding-left","padding-right"].includes(prop) && val === "0px") return true;
  if (prop.startsWith("border") && (val.includes("none") || val === "0px")) return true;
  if (prop === "opacity" && val === "1") return true;
  if (prop === "text-indent" && val === "0px") return true;
  if (prop === "letter-spacing" && val === "normal") return true;
  if (prop === "vertical-align" && val === "baseline") return true;
  if (prop === "text-transform" && val === "none") return true;
  if (prop === "text-decoration" && val.startsWith("none")) return true;
  if (prop === "display" && val === "inline") return true;
  if (prop === "gap" && (val === "normal" || val === "0px")) return true;
  if (prop === "flex-direction" && val === "row") return true;
  if (prop === "flex-wrap" && val === "nowrap") return true;
  if ((prop === "align-items" || prop === "justify-content") && val === "normal") return true;
  if (prop === "flex" && val === "0 1 auto") return true;
  if (prop === "flex-shrink" && val === "1") return true;
  if (prop === "white-space" && val === "normal") return true;
  return false;
}

function getInlineStyle(el: Element, win: Window): string {
  const cs = win.getComputedStyle(el as HTMLElement);
  const parts: string[] = [];
  for (const prop of STYLE_PROPS) {
    const val = cs.getPropertyValue(prop);
    if (shouldSkip(prop, val)) continue;
    if (prop === "font-size") {
      const px = parseFloat(val);
      if (!isNaN(px) && px > 22) { parts.push("font-size:22px"); continue; }
    }
    parts.push(`${prop}:${val}`);
  }
  return parts.join(";");
}

// ─── DOM → WeChat <section> HTML ─────────────────────────────────────────────

const REMOVE_TAGS = new Set([
  "script", "style", "link", "meta", "title", "noscript",
  "head", "svg", "canvas", "video", "audio", "iframe", "form",
]);
const BLOCK_TAGS = new Set([
  "div", "section", "article", "main", "header", "footer",
  "aside", "nav", "figure", "figcaption", "blockquote",
  "h1", "h2", "h3", "h4", "h5", "h6", "ul", "ol", "li",
]);
const KEEP_ATTRS = new Set(["src", "alt", "href", "width", "height", "colspan", "rowspan"]);

function processNode(node: Node, win: Window): string {
  if (node.nodeType === Node.TEXT_NODE) return node.textContent || "";
  if (node.nodeType !== Node.ELEMENT_NODE) return "";

  const el = node as Element;
  const tag = el.tagName.toLowerCase();

  if (REMOVE_TAGS.has(tag)) return "";
  if (tag === "br") return "<br>";
  if (tag === "hr") return `<section style="border-top:0.5px solid rgb(229,229,229);margin:16px 0;"></section>`;

  let inner = "";
  for (const child of Array.from(el.childNodes)) inner += processNode(child, win);

  if (tag === "img") {
    const src = el.getAttribute("src") || "";
    const alt = el.getAttribute("alt") || "";
    const extra = getInlineStyle(el, win);
    return `<img src="${src}" alt="${alt}" style="max-width:100%;height:auto;display:block;margin:8px auto${extra ? ";" + extra : ""}">`;
  }

  if (tag === "a") {
    const s = getInlineStyle(el, win);
    return `<span${s ? ` style="${s}"` : ""}>${inner}</span>`;
  }

  const style = getInlineStyle(el, win);
  const styleAttr = style ? ` style="${style}"` : "";
  const extraAttrs = Array.from(el.attributes)
    .filter(a => KEEP_ATTRS.has(a.name))
    .map(a => `${a.name}="${a.value}"`).join(" ");
  const attrs = extraAttrs ? " " + extraAttrs : "";

  // All block elements → <section> (WeChat native format)
  if (BLOCK_TAGS.has(tag)) return `<section${styleAttr}${attrs}>${inner}</section>`;

  return `<${tag}${styleAttr}${attrs}>${inner}</${tag}>`;
}

function buildWechatHtml(iframeDoc: Document, iframeWin: Window): string {
  const body = iframeDoc.body;
  let content = "";
  for (const child of Array.from(body.childNodes)) content += processNode(child, iframeWin);
  return (
    `<section style="max-width:640px;margin:0 auto;padding:1.5rem 0;` +
    `font-family:-apple-system,'PingFang SC','Helvetica Neue',sans-serif;` +
    `font-size:15px;line-height:1.85;color:rgb(51,51,51);word-break:break-all;">` +
    content +
    `</section>`
  );
}

// ─── Copy tab ─────────────────────────────────────────────────────────────────

function openCopyTab(html: string): void {
  const page = `<!DOCTYPE html>
<html lang="zh">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>公众号内容 — 按 Ctrl+C 复制</title>
<style>
*{box-sizing:border-box}
body{margin:0;padding:0;background:#e8e8e8;font-family:-apple-system,'PingFang SC','Helvetica Neue',sans-serif}
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

// ─── Component ────────────────────────────────────────────────────────────────

export default function WechatConverterPage() {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [output, setOutput] = useState("");
  const [rawBlobUrl, setRawBlobUrl] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<"html" | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const rawIframeRef = useRef<HTMLIFrameElement>(null);
  const shouldProcessRef = useRef(false);
  // Delay before extracting: short for CSS-only templates, long for Tailwind CDN
  const extractDelayRef = useRef(800);

  useEffect(() => {
    return () => { if (rawBlobUrl) URL.revokeObjectURL(rawBlobUrl); };
  }, [rawBlobUrl]);

  const handleFile = useCallback(async (f: File) => {
    if (!f.name.match(/\.(html|htm)$/i)) { setError("请上传 .html 文件"); return; }
    setFile(f);
    setError("");
    setOutput("");
    setProcessing(true);
    shouldProcessRef.current = true;

    const text = await f.text();

    // Detect Tailwind CDN — requires JS execution, needs longer wait
    const hasTailwindCdn = /tailwindcss\.com|cdn\.tailwind/i.test(text);

    if (hasTailwindCdn) {
      // Tailwind: load original HTML, wait 3.5s for CDN to apply classes
      extractDelayRef.current = 3500;
      const blob = new Blob([text], { type: "text/html;charset=utf-8" });
      setRawBlobUrl(URL.createObjectURL(blob));
    } else {
      // CSS <style> blocks or inline styles: pre-inline synchronously (壹伴 approach)
      // — no CDN timing dependency, works instantly
      extractDelayRef.current = 600;
      const inlined = preInlineCss(text);
      const blob = new Blob([inlined], { type: "text/html;charset=utf-8" });
      setRawBlobUrl(URL.createObjectURL(blob));
    }
  }, []);

  // After the display iframe loads, wait for styles to settle then extract.
  // For CSS templates this is near-instant; for Tailwind we wait for the CDN.
  const handleIframeLoad = useCallback(() => {
    if (!shouldProcessRef.current) return;
    setTimeout(() => {
      if (!shouldProcessRef.current) return;
      shouldProcessRef.current = false;
      const iframe = rawIframeRef.current;
      if (!iframe?.contentDocument || !iframe?.contentWindow) {
        setProcessing(false);
        return;
      }
      try {
        const result = buildWechatHtml(
          iframe.contentDocument,
          iframe.contentWindow as Window,
        );
        setOutput(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "处理失败");
      } finally {
        setProcessing(false);
      }
    }, extractDelayRef.current);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    const f = e.dataTransfer.files[0]; if (f) handleFile(f);
  }, [handleFile]);

  const handleOpenCopyTab = () => { if (output) openCopyTab(output); };

  const handleCopyHtml = async () => {
    if (!output) return;
    try { await navigator.clipboard.writeText(output); setCopied("html"); setTimeout(() => setCopied(null), 2500); }
    catch { setError("复制失败，请手动从下方源码区域复制"); }
  };

  const reset = () => {
    setOutput(""); setRawBlobUrl(""); setFile(null);
    setError(""); setProcessing(false);
    shouldProcessRef.current = false;
  };

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
            上传任意 HTML 文件，转换为微信公众号原生{" "}
            <code className="bg-gray-100 px-1 rounded text-xs">&lt;section&gt;</code>{" "}
            格式，直接粘贴到编辑器
          </p>
        </div>

        {/* Upload — shown until a file is selected */}
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
              <p className="text-xs text-[#6b7280]">支持 .html / .htm 格式</p>
            </div>
            {error && <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg"><p className="text-sm text-red-600">{error}</p></div>}
          </>
        )}

        {/* Results — shown as soon as a blob URL exists */}
        {rawBlobUrl && (
          <div className="space-y-6">

            {/* Action bar */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-sm font-bold text-[#1b4332]">
                  {processing ? "正在提取样式（等待 Tailwind 渲染）…" : "转换完成"}
                </p>
                <p className="text-xs text-[#6b7280] mt-0.5">来源：{file?.name}</p>
              </div>
              <div className="flex gap-3 flex-wrap">
                <button onClick={reset}
                  className="text-xs border border-[#95d5b2] text-[#6b7280] px-4 py-2 rounded-lg hover:border-[#40916c] hover:text-[#40916c] transition-colors">
                  重新上传
                </button>
                <button onClick={handleCopyHtml} disabled={!output}
                  className="text-xs border border-[#95d5b2] text-[#6b7280] px-4 py-2 rounded-lg hover:border-[#40916c] hover:text-[#40916c] transition-colors disabled:opacity-40">
                  {copied === "html" ? "✓ 已复制" : "复制 HTML 源码"}
                </button>
                <button onClick={handleOpenCopyTab} disabled={!output}
                  className="text-xs bg-[#1b4332] text-white px-5 py-2 rounded-lg hover:bg-[#40916c] transition-colors font-medium disabled:opacity-40">
                  打开复制页 → 再按 Ctrl+C
                </button>
              </div>
            </div>

            {error && <div className="p-4 bg-red-50 border border-red-200 rounded-lg"><p className="text-sm text-red-600">{error}</p></div>}

            {/* Dual preview */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

              {/* Left: original (this iframe is also used for style extraction) */}
              <div className="border border-[#95d5b2] rounded-xl overflow-hidden">
                <div className="border-b border-[#95d5b2] bg-[#f0faf4] px-5 py-3 flex items-center justify-between">
                  <p className="text-xs font-medium text-[#52b788] tracking-widest uppercase">原始模板</p>
                  <p className="text-xs text-[#6b7280]">完整渲染 · 样式从此提取</p>
                </div>
                <div style={{ height: "520px" }} className="bg-white">
                  <iframe
                    ref={rawIframeRef}
                    src={rawBlobUrl}
                    onLoad={handleIframeLoad}
                    className="w-full h-full border-none"
                    title="原始模板"
                    sandbox="allow-same-origin allow-scripts"
                  />
                </div>
              </div>

              {/* Right: WeChat section-format */}
              <div className="border border-[#95d5b2] rounded-xl overflow-hidden">
                <div className="border-b border-[#95d5b2] bg-[#f0faf4] px-5 py-3 flex items-center justify-between">
                  <p className="text-xs font-medium text-[#52b788] tracking-widest uppercase">WeChat 格式</p>
                  <p className="text-xs text-[#6b7280]">section 原生格式 · 模拟手机宽度</p>
                </div>
                <div className="overflow-auto bg-[#f0f0f0]" style={{ height: "520px" }}>
                  {processing ? (
                    <div className="flex flex-col items-center justify-center h-full gap-3">
                      <div className="flex gap-1.5">
                        {[0,1,2].map(i => (
                          <span key={i} className="w-2 h-2 rounded-full bg-[#52b788] inline-block animate-bounce"
                            style={{ animationDelay: `${i*0.15}s` }} />
                        ))}
                      </div>
                      <p className="text-xs text-[#6b7280]">等待 Tailwind 渲染完成…</p>
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
            {output && (
              <div className="border border-[#95d5b2] rounded-xl overflow-hidden">
                <div className="border-b border-[#95d5b2] bg-[#f0faf4] px-5 py-3 flex items-center justify-between">
                  <p className="text-xs font-medium text-[#52b788] tracking-widest uppercase">WeChat HTML 源码</p>
                  <p className="text-xs text-[#6b7280]">全部为 &lt;section&gt; 原生格式</p>
                </div>
                <textarea readOnly value={output} rows={6}
                  className="w-full p-4 text-xs text-[#4b5563] font-mono bg-gray-50 focus:outline-none resize-y border-none" />
              </div>
            )}

            {/* Steps */}
            {output && (
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
