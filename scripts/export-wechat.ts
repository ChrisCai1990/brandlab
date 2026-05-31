import { batch1 } from "./articles-batch1";
import { batch2 } from "./articles-batch2";
import { batch3 } from "./articles-batch3";
import * as fs from "fs";
import * as path from "path";

const allArticles = [...batch1, ...batch2, ...batch3];

// Convert MDX markdown to WeChat-friendly HTML with inline styles
function mdxToWechatHtml(mdx: string): string {
  const lines = mdx.split("\n");
  const output: string[] = [];
  let inList = false;
  let listType: "ul" | "ol" | null = null;
  let inBlockquote = false;
  let blockquoteLines: string[] = [];
  let i = 0;

  const flushList = () => {
    if (inList) {
      output.push(listType === "ul" ? "</ul>" : "</ol>");
      inList = false;
      listType = null;
    }
  };

  const flushBlockquote = () => {
    if (inBlockquote) {
      const content = blockquoteLines
        .map((l) => l.replace(/^>\s?/, "").trim())
        .filter(Boolean)
        .join("<br>");
      output.push(
        `<section style="margin:24px 0;background:#f0faf4;border-left:4px solid #2d6a4f;border-radius:0 12px 12px 0;padding:20px 24px;">` +
        `<p style="margin:0 0 8px 0;font-size:11px;color:#40916c;font-weight:600;letter-spacing:2px;text-transform:uppercase;">核心公式</p>` +
        `<p style="margin:0;font-size:17px;font-weight:700;color:#1b4332;line-height:1.5;">${renderInline(content)}</p>` +
        `</section>`
      );
      inBlockquote = false;
      blockquoteLines = [];
    }
  };

  while (i < lines.length) {
    const line = lines[i];

    // Blockquote
    if (line.startsWith(">")) {
      flushList();
      inBlockquote = true;
      blockquoteLines.push(line);
      i++;
      continue;
    } else if (inBlockquote) {
      flushBlockquote();
    }

    // H2
    if (line.startsWith("## ")) {
      flushList();
      const text = line.slice(3).trim();
      output.push(
        `<h2 style="display:flex;align-items:center;gap:8px;font-size:16px;font-weight:700;color:#1b4332;margin:36px 0 14px 0;">` +
        `<span style="display:inline-block;width:4px;height:18px;background:#2d6a4f;border-radius:2px;flex-shrink:0;"></span>` +
        `${renderInline(text)}` +
        `</h2>`
      );
      i++;
      continue;
    }

    // H3
    if (line.startsWith("### ")) {
      flushList();
      const text = line.slice(4).trim();
      output.push(
        `<h3 style="font-size:15px;font-weight:700;color:#1b4332;margin:20px 0 8px 0;">${renderInline(text)}</h3>`
      );
      i++;
      continue;
    }

    // HR
    if (line.trim() === "---") {
      flushList();
      output.push(`<hr style="margin:28px 0;border:none;border-top:1px solid #95d5b2;">`);
      i++;
      continue;
    }

    // Unordered list item
    if (/^- /.test(line)) {
      if (!inList || listType !== "ul") {
        flushList();
        output.push(`<ul style="margin:0 0 16px 0;padding:0;list-style:none;">`);
        inList = true;
        listType = "ul";
      }
      const text = line.slice(2).trim();
      output.push(
        `<li style="display:flex;align-items:flex-start;gap:10px;margin-bottom:8px;font-size:14px;color:#6b7280;line-height:1.7;">` +
        `<span style="margin-top:7px;width:6px;height:6px;border-radius:50%;background:#52b788;flex-shrink:0;display:inline-block;"></span>` +
        `<span>${renderInline(text)}</span>` +
        `</li>`
      );
      i++;
      continue;
    }

    // Ordered list item
    if (/^\d+\. /.test(line)) {
      if (!inList || listType !== "ol") {
        flushList();
        output.push(`<ol style="margin:0 0 16px 0;padding:0;list-style:none;counter-reset:item;">`);
        inList = true;
        listType = "ol";
      }
      const text = line.replace(/^\d+\. /, "").trim();
      output.push(
        `<li style="display:flex;align-items:flex-start;gap:10px;margin-bottom:8px;font-size:14px;color:#6b7280;line-height:1.7;">` +
        `<span style="flex-shrink:0;width:20px;height:20px;border-radius:50%;background:#2d6a4f;color:white;font-size:11px;font-weight:700;display:inline-flex;align-items:center;justify-content:center;margin-top:2px;">${getListNumber(output)}</span>` +
        `<span>${renderInline(text)}</span>` +
        `</li>`
      );
      i++;
      continue;
    }

    // Empty line
    if (line.trim() === "") {
      flushList();
      i++;
      continue;
    }

    // Regular paragraph
    flushList();
    output.push(
      `<p style="font-size:14px;color:#6b7280;line-height:1.8;margin:0 0 16px 0;">${renderInline(line.trim())}</p>`
    );
    i++;
  }

  flushList();
  flushBlockquote();

  return output.join("\n");
}

function getListNumber(output: string[]): number {
  let count = 0;
  for (const line of output) {
    if (line.includes('border-radius:50%;background:#2d6a4f')) count++;
  }
  return count + 1;
}

function renderInline(text: string): string {
  // Bold **text**
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong style="font-weight:700;color:#1b4332;">$1</strong>');
  // Italic *text*
  text = text.replace(/\*(.+?)\*/g, '<em style="font-style:italic;color:#40916c;">$1</em>');
  // Code `text`
  text = text.replace(/`(.+?)`/g, '<code style="font-family:monospace;background:#f0faf4;color:#2d6a4f;padding:1px 6px;border-radius:4px;font-size:13px;">$1</code>');
  return text;
}

function articleToHtml(article: {
  slug: string;
  title: string;
  tag: string;
  desc: string;
  date: string;
  readTime: string;
  content: string;
}): string {
  const body = mdxToWechatHtml(article.content);

  return `<!-- 品牌拾研社 · ${article.tag} · ${article.title} -->
<!-- 公众号文章导出 | 请粘贴到公众号编辑器的 HTML 模式 -->
<section style="max-width:677px;margin:0 auto;font-family:-apple-system,BlinkMacSystemFont,'PingFang SC','Hiragino Sans GB','Microsoft YaHei',sans-serif;background:#ffffff;padding:0 0 32px 0;">

  <!-- 分类标签 -->
  <p style="margin:0 0 12px 0;">
    <span style="display:inline-block;font-size:12px;font-weight:600;color:#2d6a4f;background:#f0faf4;border:1px solid #95d5b2;border-radius:20px;padding:4px 12px;">${article.tag}</span>
    <span style="display:inline-block;font-size:12px;color:#9ca3af;margin-left:8px;">${article.readTime} 分钟阅读</span>
  </p>

  <!-- 标题 -->
  <h1 style="font-size:22px;font-weight:800;color:#1b4332;line-height:1.4;margin:0 0 16px 0;">${article.title}</h1>

  <!-- 摘要 -->
  <p style="font-size:15px;color:#6b7280;line-height:1.7;margin:0 0 32px 0;padding-left:12px;border-left:3px solid #52b788;">${article.desc}</p>

  <!-- 正文 -->
${body}

  <!-- 底部署名 -->
  <section style="margin-top:40px;padding:20px 24px;background:#f0faf4;border-radius:12px;text-align:center;">
    <p style="margin:0 0 6px 0;font-size:13px;font-weight:700;color:#1b4332;">品牌拾研社 · BrandLab</p>
    <p style="margin:0;font-size:12px;color:#6b7280;">每天一条干货，帮你做好个人品牌</p>
  </section>

</section>`;
}

// Create output directory
const outDir = path.join(__dirname, "..", "wechat-export");
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

// Export each article
let count = 0;
for (const article of allArticles) {
  const html = articleToHtml(article as any);
  const filename = `${String(count + 1).padStart(2, "0")}_${article.tag}_${article.slug}.html`;
  fs.writeFileSync(path.join(outDir, filename), html, "utf-8");
  count++;
  console.log(`✓ [${count}/${allArticles.length}] ${article.title}`);
}

console.log(`\n✅ 全部 ${count} 篇文章已导出到 wechat-export/`);
