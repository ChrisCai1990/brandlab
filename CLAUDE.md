@AGENTS.md

# 当前进度（每次切换账号时更新）

> 更新时间：请在此写日期

## 最近做了什么
（填写）

## 下一步
（填写）

## 未解决问题
（填写）

---

# BrandLab 项目说明

- **线上**：https://brandlab.ink
- **GitHub**：https://github.com/ChrisCai1990/brandlab（branch: master）
- **部署**：⚠️ 已迁到 Chris 私人 ECS `39.106.218.225`（代码 `/opt/brandlab`），**不再走 Railway，push 后不会自动上线**。流程：`git push origin master` → SSH 登服务器 → `cd /opt/brandlab && git pull` → `NODE_OPTIONS=--max-old-space-size=2560 npm run build` → 补 standalone 静态资源 → `pm2 restart brandlab`（详见记忆 project-brandlab）
- **框架**：Next.js App Router（standalone 输出）+ 本机 docker MongoDB + Nginx 反代 3000 + PM2 + Tailwind CSS v4

## 管理后台
- 地址：https://brandlab.ink/admin/login
- 手机号：15068820376 / 密码：BrandLab@2026

## 数据库状态
- 35 篇文章，7 大分类，全部 published
- 分类：个人定位 / 视觉表达 / 内容运营 / 账号增长 / 平台策略 / IP案例 / 工具方法
