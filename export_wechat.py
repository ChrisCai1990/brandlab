"""
BrandLab 文章 → 公众号 HTML 导出工具
读取三个 TS 批次文件，解析文章数据，输出可粘贴到公众号编辑器的 HTML 文件
"""

import re
import os
import html as html_module

SCRIPTS_DIR = os.path.join(os.path.dirname(__file__), "scripts")
OUT_DIR = os.path.join(os.path.dirname(__file__), "wechat-export")


# ── 解析 TS 文件 ─────────────────────────────────────────────────────────────

def parse_ts_batch(filepath: str) -> list[dict]:
    with open(filepath, encoding="utf-8") as f:
        text = f.read()

    articles = []

    # 找到每个 slug: 出现的位置，然后往前找它所属的 { 开始位置
    for m in re.finditer(r'\n\s+slug\s*:', text):
        pos = m.start()
        # 往前找最近的 {
        brace_pos = text.rfind('\n  {', 0, pos)
        if brace_pos == -1:
            brace_pos = text.rfind('{', 0, pos)
        if brace_pos == -1:
            continue
        # 找到 { 的实际位置（跳过换行符）
        actual_brace = text.index('{', brace_pos)
        obj_text = extract_object(text, actual_brace)
        if obj_text:
            article = parse_article_obj(obj_text)
            if article and article.get("slug") and article not in articles:
                articles.append(article)

    return articles


def extract_object(text: str, start: int) -> str:
    """从 { 开始提取完整对象，处理模板字符串"""
    depth = 0
    in_template = False
    in_string_single = False
    in_string_double = False
    i = start
    result = []

    while i < len(text):
        ch = text[i]

        if in_template:
            result.append(ch)
            if ch == '`' and (i == 0 or text[i-1] != '\\'):
                in_template = False
            i += 1
            continue

        if in_string_single:
            result.append(ch)
            if ch == "'" and text[i-1] != '\\':
                in_string_single = False
            i += 1
            continue

        if in_string_double:
            result.append(ch)
            if ch == '"' and text[i-1] != '\\':
                in_string_double = False
            i += 1
            continue

        if ch == '`':
            in_template = True
        elif ch == "'":
            in_string_single = True
        elif ch == '"':
            in_string_double = True
        elif ch == '{':
            depth += 1
        elif ch == '}':
            depth -= 1
            result.append(ch)
            if depth == 0:
                return ''.join(result)
            i += 1
            continue

        result.append(ch)
        i += 1

    return ''.join(result)


def parse_article_obj(obj_text: str) -> dict:
    article = {}

    # slug, title, tag, desc, date, readTime — 简单字符串字段
    for field in ["slug", "title", "tag", "desc", "date", "readTime"]:
        m = re.search(rf'\b{field}\s*:\s*"([^"]*)"', obj_text)
        if not m:
            m = re.search(rf"\b{field}\s*:\s*'([^']*)'", obj_text)
        if m:
            article[field] = m.group(1)

    # content — 模板字符串（反引号）
    m = re.search(r'content\s*:\s*`([\s\S]*?)`\s*[,}]', obj_text)
    if m:
        article["content"] = m.group(1).strip()
    else:
        # fallback: 普通字符串
        m = re.search(r'content\s*:\s*"([\s\S]*?)"', obj_text)
        if m:
            article["content"] = m.group(1)

    return article


# ── MDX → 公众号 HTML 转换 ────────────────────────────────────────────────────

def render_inline(text: str) -> str:
    text = re.sub(
        r'\*\*(.+?)\*\*',
        r'<b style="font-weight:500;color:#333;">\1</b>',
        text
    )
    text = re.sub(
        r'(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)',
        r'<em style="font-style:italic;">\1</em>',
        text
    )
    text = re.sub(
        r'`(.+?)`',
        r'<code style="font-family:monospace;background:#E8F5EE;color:#2d6a4f;padding:1px 5px;border-radius:3px;font-size:13px;">\1</code>',
        text
    )
    return text


def mdx_to_html(mdx: str) -> str:
    lines = mdx.split("\n")
    output = []
    in_ul = False
    in_ol = False
    ol_counter = [0]
    in_blockquote = False
    bq_lines = []

    def flush_list():
        nonlocal in_ul, in_ol
        if in_ul:
            output.append("</ul>")
            in_ul = False
        if in_ol:
            output.append("</ol>")
            in_ol = False
            ol_counter[0] = 0

    def flush_blockquote():
        nonlocal in_blockquote, bq_lines
        if in_blockquote:
            raw = " ".join(
                l.lstrip("> ").strip()
                for l in bq_lines
                if l.lstrip("> ").strip()
            )
            # strip markdown bold/italic markers, keep text
            content = re.sub(r'\*+(.+?)\*+', r'\1', raw)
            # formula box: dark green centered (matches reference file)
            output.append(
                '<div style="background:#1B4332;border-radius:10px;padding:18px 20px;margin:20px 0;text-align:center;">'
                f'<div style="font-size:16px;font-weight:500;color:#fff;line-height:1.6;">{content}</div>'
                '</div>'
            )
            in_blockquote = False
            bq_lines.clear()

    for line in lines:
        # blockquote
        if line.startswith(">"):
            flush_list()
            in_blockquote = True
            bq_lines.append(line)
            continue
        elif in_blockquote and line.strip() == "":
            flush_blockquote()
            continue
        elif in_blockquote:
            flush_blockquote()

        # H2 — section heading with "— " prefix and bottom border
        if line.startswith("## "):
            flush_list()
            text = render_inline(line[3:].strip())
            output.append(
                f'<div style="font-size:15px;font-weight:500;color:#333;margin:28px 0 10px;'
                f'padding-bottom:8px;border-bottom:0.5px solid #e5e5e5;">'
                f'<span style="color:#2D6A4F;">— </span>{text}</div>'
            )
            continue

        # H3 — sub-heading bold
        if line.startswith("### "):
            flush_list()
            text = render_inline(line[4:].strip())
            output.append(
                f'<p style="margin-bottom:6px;"><b style="font-weight:500;color:#333;">{text}</b></p>'
            )
            continue

        # HR
        if line.strip() == "---":
            flush_list()
            output.append('<hr style="margin:24px 0;border:none;border-top:0.5px solid #e5e5e5;">')
            continue

        # Unordered list — light green callout style bullet
        if re.match(r'^- ', line):
            if in_ol:
                flush_list()
            if not in_ul:
                output.append('<div style="display:flex;flex-direction:column;">')
                in_ul = True
            text = render_inline(line[2:].strip())
            # use table-cell to avoid gap, compatible with WeChat
            output.append(
                '<div style="display:table;width:100%;margin-bottom:10px;">'
                '<span style="display:table-cell;width:14px;vertical-align:top;padding-top:7px;">'
                '<span style="display:inline-block;width:5px;height:5px;border-radius:50%;background:#2D6A4F;"></span>'
                '</span>'
                f'<span style="display:table-cell;font-size:14px;color:#555;line-height:1.7;">{text}</span>'
                '</div>'
            )
            continue

        # Ordered list — circular badge (matches reference file)
        m = re.match(r'^(\d+)\. (.*)', line)
        if m:
            if in_ul:
                flush_list()
            if not in_ol:
                output.append('<div style="display:flex;flex-direction:column;">')
                in_ol = True
                ol_counter[0] = 0
            ol_counter[0] += 1
            text = render_inline(m.group(2).strip())
            # table-cell avoids gap, circle badge matches reference
            output.append(
                '<div style="display:table;width:100%;margin-bottom:12px;">'
                f'<span style="display:table-cell;width:34px;vertical-align:top;">'
                f'<span style="display:inline-block;width:26px;height:26px;border-radius:50%;'
                f'background:#E8F5EE;color:#1B4332;font-size:12px;font-weight:500;'
                f'text-align:center;line-height:26px;">{ol_counter[0]}</span>'
                f'</span>'
                f'<span style="display:table-cell;font-size:14px;color:#555;line-height:1.7;vertical-align:top;padding-top:4px;">{text}</span>'
                '</div>'
            )
            continue

        # Empty line
        if line.strip() == "":
            flush_list()
            continue

        # Regular paragraph
        flush_list()
        output.append(
            f'<p style="margin-bottom:16px;">{render_inline(line.strip())}</p>'
        )

    flush_list()
    flush_blockquote()
    return "\n".join(output)


def article_to_html(a: dict) -> str:
    body = mdx_to_html(a.get("content", ""))
    title = html_module.escape(a.get("title", ""))
    desc = html_module.escape(a.get("desc", ""))
    tag = html_module.escape(a.get("tag", ""))
    read_time = a.get("readTime", "5")

    return f"""<!-- 品牌拾研社 · {tag} · {title} -->
<!-- 粘贴到公众号编辑器源码模式（左下角 <> 按钮） -->
<div style="max-width:640px;margin:0 auto;padding:1.5rem 0;font-family:-apple-system,'PingFang SC','Helvetica Neue',sans-serif;">

  <div style="background:#1B4332;border-radius:12px;padding:28px 24px 24px;margin-bottom:24px;">
    <div style="font-size:10px;letter-spacing:.1em;color:#6BAF8A;margin-bottom:8px;">BRANDLAB · 品牌拾研社 · {tag}</div>
    <div style="display:inline-block;font-size:11px;padding:3px 10px;border-radius:20px;background:rgba(255,255,255,.1);color:#A8D5BB;margin-bottom:12px;">{tag}</div>
    <div style="font-size:22px;font-weight:500;color:#fff;line-height:1.4;margin-bottom:6px;">{title}</div>
    <div style="font-size:13px;color:#A8D5BB;line-height:1.6;">{desc}</div>
  </div>

  <div style="margin-bottom:20px;padding-bottom:16px;border-bottom:0.5px solid #e5e5e5;">
    <span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:#2D6A4F;vertical-align:middle;margin-right:8px;"></span>
    <span style="font-size:12px;color:#888;vertical-align:middle;">品牌拾研社 BrandLab · 预计阅读 {read_time} 分钟</span>
  </div>

  <div style="font-size:15px;color:#333;line-height:1.85;">
{body}

    <div style="text-align:center;padding:14px;background:#f5f5f5;border-radius:10px;margin:20px 0;font-size:14px;color:#555;line-height:1.7;">
      这篇内容对你有帮助吗？<br>
      <b style="color:#1B4332;font-weight:500;">评论区告诉我——我看到都会回复。</b>
    </div>
  </div>

  <div style="background:#1B4332;border-radius:10px;padding:18px;text-align:center;margin-top:24px;">
    <div style="font-size:15px;font-weight:500;color:#fff;margin-bottom:4px;">品牌拾研社 BrandLab</div>
    <div style="font-size:12px;color:#6BAF8A;">每天一条干货 · 帮你把账号做成有影响力的个人品牌</div>
  </div>

</div>"""


# ── 主程序 ────────────────────────────────────────────────────────────────────

def main():
    os.makedirs(OUT_DIR, exist_ok=True)

    batch_files = [
        os.path.join(SCRIPTS_DIR, "articles-batch1.ts"),
        os.path.join(SCRIPTS_DIR, "articles-batch2.ts"),
        os.path.join(SCRIPTS_DIR, "articles-batch3.ts"),
    ]

    all_articles = []
    for f in batch_files:
        articles = parse_ts_batch(f)
        print(f"  {os.path.basename(f)}: 解析到 {len(articles)} 篇")
        all_articles.extend(articles)

    print(f"\n共 {len(all_articles)} 篇，开始导出...\n")

    for idx, article in enumerate(all_articles, 1):
        html = article_to_html(article)
        slug = article.get("slug", f"article-{idx}")
        tag = article.get("tag", "未分类")
        filename = f"{idx:02d}_{tag}_{slug}.html"
        out_path = os.path.join(OUT_DIR, filename)
        with open(out_path, "w", encoding="utf-8") as f:
            f.write(html)
        print(f"✓ [{idx}/{len(all_articles)}] {article.get('title', slug)}")

    print(f"\n✅ 全部 {len(all_articles)} 篇已导出到: {OUT_DIR}")


if __name__ == "__main__":
    main()
