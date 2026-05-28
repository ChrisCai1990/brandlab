#!/usr/bin/env python3
"""
brandlab 一键部署脚本
用法: python deploy.py "提交说明"
      python deploy.py "提交说明" --no-build   # 跳过本地 build 验证
"""

import subprocess
import sys
import os

ROOT = os.path.dirname(os.path.abspath(__file__))


def run(cmd, cwd=ROOT, capture=False):
    result = subprocess.run(
        cmd, shell=True, cwd=cwd,
        capture_output=capture, text=True
    )
    return result


def main():
    args = sys.argv[1:]
    skip_build = "--no-build" in args
    args = [a for a in args if not a.startswith("--")]

    if not args:
        print("用法: python deploy.py \"提交说明\" [--no-build]")
        sys.exit(1)

    message = args[0]

    # ── 1. 本地 build 验证 ──────────────────────────────────────
    if not skip_build:
        print("▶ 正在本地构建验证...")
        result = run("npm run build")
        if result.returncode != 0:
            print("\n✗ 构建失败，已阻止部署。修复后重试。")
            sys.exit(1)
        print("✓ 构建通过\n")

    # ── 2. git add ──────────────────────────────────────────────
    print("▶ 暂存所有变更...")
    result = run("git add -A")
    if result.returncode != 0:
        print("✗ git add 失败")
        sys.exit(1)

    # 检查是否有变更
    status = run("git status --porcelain", capture=True)
    if not status.stdout.strip() and not skip_build:
        staged = run("git diff --cached --name-only", capture=True)
        if not staged.stdout.strip():
            print("✓ 没有需要提交的变更")
            sys.exit(0)

    # ── 3. git commit ───────────────────────────────────────────
    print("▶ 提交...")
    safe_msg = message.replace('"', '\\"')
    result = run(f'git commit -m "{safe_msg}"')
    if result.returncode != 0:
        # 可能是 nothing to commit
        out = run("git status --short", capture=True)
        if not out.stdout.strip():
            print("✓ 没有新变更，跳过提交")
        else:
            print("✗ git commit 失败")
            sys.exit(1)

    # ── 4. git push ─────────────────────────────────────────────
    print("▶ 推送到 GitHub...")
    result = run("git push origin master")
    if result.returncode != 0:
        print("✗ git push 失败")
        sys.exit(1)

    print("\n✓ 部署已触发！Railway 正在构建，约 2-3 分钟后生效。")


if __name__ == "__main__":
    main()
