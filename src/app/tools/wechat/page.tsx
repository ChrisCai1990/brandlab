"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";

// CSS properties worth capturing for WeChat
const STYLE_PROPS = [
  "color", "background-color",
  "font-size", "font-weight", "font-family", "font-style",
  "text-decoration", "text-align", "line-height", "letter-spacing",
  "margin-top", "margin-bottom", "margin-left", "margin-right",
  "padding-top", "padding-bottom", "padding-left", "padding-right",
  "border-top", "border-bottom", "border-left", "border-right",
  "border-radius", "display", "max-width", "width",
  "text-indent", "white-space", "word-break", "vertical-align", "opacity",
];

const REMOVE_TAGS = new Set(["script", "style", "link", "meta", "title", "noscript", "head"]);
const TAG_REMAP: Record<string, string> = {
  section: "div", article: "div", main: "div",
  header: "div", footer: "div", nav: "div", aside: "div",
  figure: "div", figcaption: "p",
};
const KEEP_ATTRS = new Set(["src", "alt", "href", "width", "height", "colspan", "rowspan"]);

function getInlineStyle(el: Element, win: Window): string {
  const cs = win.getComputedStyle(el as HTMLElement);
  const parts: string[] = [];

  for (const prop of STYLE_PROPS) {
    const val = cs.getPropertyValue(prop);
    if (!val || val === "initial" || val === "inherit" || val === "unset") continue;
    if (prop === "background-color" && (val === "rgba(0, 0, 0, 0)" || val === "transparent")) continue;
    if (["margin-top","margin-bottom","margin-left","margin-right",
         "padding-top","padding-bottom","padding-left","padding-right"].includes(prop) && val === "0px") continue;
    if (prop.startsWith("border") && val.includes("none")) continue;
    if (prop === "opacity" && val === "1") continue;
    if (prop === "text-indent" && val === "0px") continue;
    if (prop === "letter-spacing" && val === "normal") continue;
    if (prop === "vertical-align" && val === "baseline") continue;
    parts.push(`${prop}:${val}`);
  }

  return parts.join(";");
}

function processNode(node: Node, win: Window): string {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent || "";
  }
  if (node.nodeType !== Node.ELEMENT_NODE) return "";

  const el = node as Element;
  const tag = el.tagName.toLowerCase();

  if (REMOVE_TAGS.has(tag)) return "";

  if (tag === "br") return "<br />";
  if (tag === "hr") return '<hr style="border:none;border-top:1px solid #eee;margin:16px 0;" />';

  // Build inner content from children
  let inner = "";
  for (const child of Array.from(el.childNodes)) {
    inner += processNode(child, win);
  }

  if (tag === "img") {
    const src = el.getAttribute("src") || "";
    const alt = el.getAttribute("alt") || "";
    const extra = getInlineStyle(el, win);
    const style = `max-width:100%;height:auto;display:block;margin:8px auto${extra ? ";" + extra : ""}`;
    return `<img src="${src}" alt="${alt}" style="${style}" />`;
  }

  const outputTag = TAG_REMAP[tag] || tag;
  const styleStr = getInlineStyle(el, win);

  const attrParts: string[] = [];
  for (const attr of Array.from(el.attributes)) {
    if (KEEP_ATTRS.has(attr.name)) {
      attrParts.push(`${attr.name}="${attr.value}"`);
    }
  }

  const styleAttr = styleStr ? ` style="${styleStr}"` : "";
  const otherAttrs = attrParts.length > 0 ? " " + attrParts.join(" ") : "";

  return `<${outputTag}${styleAttr}${otherAttrs}>${inner}</${outputTag}>`;
}

function convertToWechat(html: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const iframe = document.createElement("iframe");
    iframe.setAttribute("sandbox", "allow-same-origin allow-scripts");
    iframe.style.cssText =
      "position:fixed;top:-9999px;left:-9999px;width:750px;height:5000px;border:none;visibility:hidden;";
    document.body.appendChild(iframe);

    const cleanup = () => {
      try { document.body.removeChild(iframe); } catch {}
    };

    const processAndResolve = () => {
      try {
        const doc = iframe.contentDocument!;
        const win = iframe.contentWindow!;
        const body = doc.body;
        if (!body) { cleanup(); reject(new Error("HTML 解析失败")); return; }

        let content = "";
        for (const child of Array.from(body.childNodes)) {
          content += processNode(child, win);
        }

        const wrapper =
          `<section style="max-width:100%;font-family:-apple-system,BlinkMacSystemFont,'PingFang SC','Microsoft YaHei',sans-serif;color:#333;word-break:break-all;">` +
          content +
          `</section>`;

        cleanup();
        resolve(wrapper);
      } catch (err) {
        cleanup();
        reject(err instanceof Error ? err : new Error("处理失败"));
      }
    };

    const fallback = setTimeout(processAndResolve, 12000);

    iframe.onload = () => {
      // Wait for Tailwind CDN / inline scripts to apply styles
      setTimeout(() => {
        clearTimeout(fallback);
        processAndResolve();
      }, 2800);
    };

    try {
      const doc = iframe.contentDocument!;
      doc.open();
      doc.write(html);
      doc.close();
    } catch (err) {
      clearTimeout(fallback);
      cleanup();
      reject(err instanceof Error ? err : new Error("写入失败"));
    }
  });
}

async function copyAsRichText(html: string): Promise<void> {
  // Render into a hidden contenteditable div and use execCommand('copy').
  // This produces a "browser page selection" copy that WeChat editor accepts,
  // unlike ClipboardItem which writes raw HTML and gets stripped on paste.
  const container = document.createElement("div");
  container.contentEditable = "true";
  container.style.cssText =
    "position:fixed;top:-9999px;left:-9999px;width:750px;opacity:0;pointer-events:none;";
  container.innerHTML = html;
  document.body.appendChild(container);

  try {
    const range = document.createRange();
    range.selectNodeContents(container);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
    document.execCommand("copy");
    sel?.removeAllRanges();
  } finally {
    document.body.removeChild(container);
  }
}

export default function WechatConverterPage() {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<"rich" | "html" | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (f: File) => {
    if (!f.name.match(/\.(html|htm)$/i)) {
      setError("请上传 .html 文件");
      return;
    }
    setFile(f);
    setError("");
    setOutput("");
    setProcessing(true);
    try {
      const text = await f.text();
      const result = await convertToWechat(text);
      setOutput(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "处理失败，请重试");
    } finally {
      setProcessing(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const f = e.dataTransfer.files[0];
      if (f) handleFile(f);
    },
    [handleFile]
  );

  const handleCopy = async (type: "rich" | "html") => {
    if (!output) return;
    try {
      if (type === "rich") {
        await copyAsRichText(output);
      } else {
        await navigator.clipboard.writeText(output);
      }
      setCopied(type);
      setTimeout(() => setCopied(null), 2500);
    } catch {
      setError("复制失败，请手动从下方源码区域复制");
    }
  };

  const reset = () => {
    setOutput("");
    setFile(null);
    setError("");
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-[#95d5b2] bg-[#f0faf4]">
        <div className="max-w-5xl mx-auto px-8 py-3 flex items-center gap-2 text-xs text-[#6b7280]">
          <Link href="/" className="hover:text-[#40916c] transition-colors">首页</Link>
          <span>/</span>
          <Link href="/tools" className="hover:text-[#40916c] transition-colors">工具资源</Link>
          <span>/</span>
          <span className="text-[#1b4332] font-medium">公众号排版转换器</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="mb-10">
          <p className="text-xs text-[#52b788] font-medium tracking-widest uppercase mb-2">工具</p>
          <h1 className="text-3xl font-bold text-[#1b4332] mb-3">公众号排版转换器</h1>
          <p className="text-sm text-[#6b7280]">
            上传 Claude Code 生成的 HTML 模板，自动提取样式转为内联，一键复制粘贴到微信公众号编辑器
          </p>
        </div>

        {/* Upload area */}
        {!output && (
          <>
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => !processing && fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-16 text-center transition-all ${
                processing
                  ? "border-[#95d5b2] bg-[#f0faf4]/60 cursor-wait"
                  : isDragging
                  ? "border-[#40916c] bg-[#f0faf4] cursor-copy"
                  : "border-[#95d5b2] hover:border-[#52b788] hover:bg-[#f0faf4]/50 cursor-pointer"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".html,.htm"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFile(f);
                  e.target.value = "";
                }}
              />
              <div className="text-4xl mb-4">{processing ? "⏳" : "📄"}</div>
              {processing ? (
                <div>
                  <p className="text-sm font-medium text-[#1b4332] mb-2">
                    正在处理：{file?.name}
                  </p>
                  <p className="text-xs text-[#6b7280] mb-4">
                    等待样式计算完成（约 3 秒）…
                  </p>
                  <div className="flex justify-center gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="w-2 h-2 rounded-full bg-[#52b788] inline-block animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-sm font-medium text-[#1b4332] mb-2">
                    拖拽 HTML 文件到这里，或点击选择
                  </p>
                  <p className="text-xs text-[#6b7280]">支持 .html / .htm 格式</p>
                </div>
              )}
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
          </>
        )}

        {/* Output */}
        {output && (
          <div className="space-y-6">
            {/* Action bar */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-sm font-bold text-[#1b4332]">转换完成</p>
                <p className="text-xs text-[#6b7280] mt-0.5">来源：{file?.name}</p>
              </div>
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={reset}
                  className="text-xs border border-[#95d5b2] text-[#6b7280] px-4 py-2 rounded-lg hover:border-[#40916c] hover:text-[#40916c] transition-colors"
                >
                  重新上传
                </button>
                <button
                  onClick={() => handleCopy("html")}
                  className="text-xs border border-[#95d5b2] text-[#6b7280] px-4 py-2 rounded-lg hover:border-[#40916c] hover:text-[#40916c] transition-colors"
                >
                  {copied === "html" ? "✓ 已复制" : "复制 HTML 源码"}
                </button>
                <button
                  onClick={() => handleCopy("rich")}
                  className="text-xs bg-[#1b4332] text-white px-5 py-2 rounded-lg hover:bg-[#40916c] transition-colors font-medium"
                >
                  {copied === "rich"
                    ? "✓ 复制成功！去公众号粘贴"
                    : "复制富文本 → 粘贴到公众号"}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Visual preview */}
            <div className="border border-[#95d5b2] rounded-xl overflow-hidden">
              <div className="border-b border-[#95d5b2] bg-[#f0faf4] px-5 py-3 flex items-center justify-between">
                <p className="text-xs font-medium text-[#52b788] tracking-widest uppercase">
                  预览效果
                </p>
                <p className="text-xs text-[#6b7280]">以公众号编辑器实际显示为准</p>
              </div>
              <div className="overflow-auto max-h-[640px] p-8 bg-white">
                <div
                  style={{ maxWidth: "600px", margin: "0 auto" }}
                  dangerouslySetInnerHTML={{ __html: output }}
                />
              </div>
            </div>

            {/* HTML source */}
            <div className="border border-[#95d5b2] rounded-xl overflow-hidden">
              <div className="border-b border-[#95d5b2] bg-[#f0faf4] px-5 py-3">
                <p className="text-xs font-medium text-[#52b788] tracking-widest uppercase">
                  HTML 源码
                </p>
              </div>
              <textarea
                readOnly
                value={output}
                rows={8}
                className="w-full p-4 text-xs text-[#4b5563] font-mono bg-gray-50 focus:outline-none resize-y border-none"
              />
            </div>

            {/* Steps */}
            <div className="bg-[#f0faf4] border border-[#95d5b2] rounded-xl p-5">
              <p className="text-xs font-bold text-[#1b4332] mb-3">粘贴步骤</p>
              <ol className="space-y-1.5">
                {[
                  "点击上方「复制富文本」按钮",
                  "打开微信公众号后台 → 素材管理 → 新建图文",
                  "在正文编辑区域按 Ctrl+V（Windows）或 Cmd+V（Mac）",
                  "检查排版，适当调整后发布",
                ].map((step, i) => (
                  <li key={i} className="text-xs text-[#6b7280] flex items-start gap-2">
                    <span className="text-[#52b788] font-bold shrink-0 w-4">{i + 1}.</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
