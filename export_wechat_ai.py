"""
BrandLab 文章 → 公众号 HTML（AI 版）
调用 brandlab.ink/api/tools/wechat-format 接口，用 Claude AI 生成排版 HTML
"""

import re
import os
import json
import time
import requests

SCRIPTS_DIR = os.path.join(os.path.dirname(__file__), "scripts")
OUT_DIR     = os.path.join(os.path.dirname(__file__), "wechat-export-ai")
API_URL     = "https://brandlab.ink/api/tools/wechat-format"


# ── 解析 TS 批次文件（同 export_wechat.py）────────────────────────────────────

def extract_object(text, start):
    depth = 0
    in_template = in_single = in_double = False
    i = start
    result = []
    prev = ''
    while i < len(text):
        ch = text[i]
        if in_template:
            result.append(ch)
            if ch == '`' and prev != '\\':
                in_template = False
            prev = ch; i += 1; continue
        if in_single:
            result.append(ch)
            if ch == "'" and prev != '\\':
                in_single = False
            prev = ch; i += 1; continue
        if in_double:
            result.append(ch)
            if ch == '"' and prev != '\\':
                in_double = False
            prev = ch; i += 1; continue
        if ch == '`':   in_template = True
        elif ch == "'": in_single = True
        elif ch == '"': in_double = True
        elif ch == '{': depth += 1
        elif ch == '}':
            depth -= 1
            result.append(ch)
            if depth == 0:
                return ''.join(result)
            prev = ch; i += 1; continue
        result.append(ch)
        prev = ch; i += 1
    return ''.join(result)


def parse_article_obj(obj_text):
    article = {}
    for field in ["slug", "title", "tag", "desc", "date", "readTime"]:
        m = re.search(rf'\b{field}\s*:\s*"([^"]*)"', obj_text)
        if not m:
            m = re.search(rf"\b{field}\s*:\s*'([^']*)'", obj_text)
        if m:
            article[field] = m.group(1)
    m = re.search(r'content\s*:\s*`([\s\S]*?)`\s*[,}]', obj_text)
    if m:
        article["content"] = m.group(1).strip()
    return article


def parse_ts_batch(filepath):
    with open(filepath, encoding="utf-8") as f:
        text = f.read()
    articles = []
    seen_slugs = set()
    for m in re.finditer(r'\n\s+slug\s*:', text):
        pos = m.start()
        brace_pos = text.rfind('\n  {', 0, pos)
        if brace_pos == -1:
            continue
        actual_brace = text.index('{', brace_pos)
        obj_text = extract_object(text, actual_brace)
        if not obj_text:
            continue
        article = parse_article_obj(obj_text)
        slug = article.get("slug")
        if slug and slug not in seen_slugs:
            seen_slugs.add(slug)
            articles.append(article)
    return articles


# ── 调 AI 接口 ────────────────────────────────────────────────────────────────

def build_prompt(article):
    """把文章信息组合成适合 AI 排版的输入"""
    tag       = article.get("tag", "")
    title     = article.get("title", "")
    desc      = article.get("desc", "")
    read_time = article.get("readTime", "5")
    content   = article.get("content", "")
    slug      = article.get("slug", "")

    # 从 slug 推算期数（按分类内序号，这里简单用全局序号由调用方传入）
    return f"""分类：{tag}
标题：{title}
副标题：{desc}
预计阅读：{read_time} 分钟

{content}"""


def call_wechat_format(prompt_text, idx, total, retries=3):
    for attempt in range(retries):
        try:
            resp = requests.post(
                API_URL,
                json={"content": prompt_text},
                timeout=60,
            )
            if resp.status_code == 200:
                data = resp.json()
                if "html" in data and data["html"]:
                    return data["html"]
                print(f"  ⚠ API 返回无内容: {data}")
            else:
                print(f"  ⚠ HTTP {resp.status_code}: {resp.text[:100]}")
        except Exception as e:
            print(f"  ⚠ 请求异常 (attempt {attempt+1}): {e}")
        if attempt < retries - 1:
            time.sleep(5)
    return None


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
        arts = parse_ts_batch(f)
        print(f"  {os.path.basename(f)}: {len(arts)} 篇")
        all_articles.extend(arts)

    total = len(all_articles)
    print(f"\n共 {total} 篇，开始 AI 转换（每篇约 10-15 秒）...\n")

    success = 0
    failed  = []

    for idx, article in enumerate(all_articles, 1):
        slug  = article.get("slug", f"article-{idx}")
        tag   = article.get("tag", "未分类")
        title = article.get("title", slug)

        # 跳过已生成的文件
        filename = f"{idx:02d}_{tag}_{slug}.html"
        out_path = os.path.join(OUT_DIR, filename)
        if os.path.exists(out_path):
            print(f"  [跳过] [{idx}/{total}] {title}")
            success += 1
            continue

        print(f"  [{idx}/{total}] {title}...", end=" ", flush=True)

        prompt = build_prompt(article)
        html   = call_wechat_format(prompt, idx, total)

        if html:
            with open(out_path, "w", encoding="utf-8") as f:
                f.write(html)
            print("✓")
            success += 1
        else:
            print("✗ 失败")
            failed.append((idx, slug, title))

        # 每篇之间间隔 3 秒，避免过快
        if idx < total:
            time.sleep(3)

    print(f"\n完成：{success}/{total} 篇成功")
    if failed:
        print(f"失败 {len(failed)} 篇：")
        for i, s, t in failed:
            print(f"  [{i}] {t} ({s})")
    else:
        print(f"输出目录：{OUT_DIR}")


if __name__ == "__main__":
    main()
