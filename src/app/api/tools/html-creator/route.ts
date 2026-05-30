import { NextRequest, NextResponse } from "next/server";

const TEMPLATE_PROMPTS: Record<string, string> = {
  xiaohongshu: `你需要生成一个高度还原小红书APP风格的图文笔记HTML页面。

设计要求：
- 整体宽度 390px，白色背景，居中展示
- 顶部：圆形头像占位（灰色）+ 用户名 + "关注"按钮
- 封面区：渐变色背景块（珊瑚红/粉色系）+ 大号加粗标题 + 相关emoji
- 正文：分段落，关键字/核心观点加粗高亮（用珊瑚红色 #FF2442）
- 底部：互动栏（❤️ 点赞数、⭐ 收藏数、💬 评论数）+ 话题标签行
- 字体：PingFang SC, Microsoft YaHei, sans-serif
- 整体感觉：活泼、年轻、高颜值`,

  "quote-card": `你需要生成一个精美的金句/观点分享卡片HTML。

设计要求：
- 卡片尺寸 600×380px，居中展示，圆角 16px，有阴影
- 背景：深色渐变（深蓝/深绿/深紫 任选一种，显档次）
- 大号白色装饰引号（"）在左上角，字号约 80px，半透明
- 金句主文字：白色，居中，字号 22-28px，加粗，行距 1.6
- 作者/来源：底部小字，半透明白色
- 底部加品牌水印区（小字：brandlab.ink）
- 整体感：高级感、有设计感、适合截图分享`,

  "personal-intro": `你需要生成一个一页式个人品牌介绍HTML名片页。

设计要求：
- 全页面，背景：米白色(#fafaf8) 或极浅灰
- 顶部区：居中圆形头像占位（120px，灰色渐变）+ 姓名（大号加粗）+ 职业头衔（绿色 #40916c）
- 标签区：3-5个胶囊标签（浅绿背景）
- 简介区：一句话定位（显眼）+ 核心优势描述段落
- 成就区：3-4个数据指标横排（大数字 + 说明）
- 联系方式：小图标 + 微信/公众号/邮箱
- 底部：brandlab.ink 水印
- 专业、干净、有质感`,

  "data-card": `你需要生成一个成就/数据展示卡片HTML。

设计要求：
- 卡片宽 720px，居中展示，深色背景（深绿 #1b4332 或深蓝）
- 顶部：标题文字（白色）
- 核心数据区：3-4个大数字并排，每个包含：超大数字（60px+，白色或亮色）+ 单位 + 说明文字
- 数据之间用竖线分隔
- 底部：来源说明小字 + 日期 + brandlab.ink
- 整体：震撼感、数据说话、适合截图炫耀`,

  article: `你需要生成一篇公众号风格的精美文章排版HTML。

设计要求：
- 最大宽度 680px，左右 padding 24px，居中，白色背景
- 顶部：文章标题（大号加粗，#1b4332）+ 作者信息小字 + 分割线
- 正文：字号 16px，行距 1.9，段间距 1.2em
- 二级标题（H2）：左侧加 4px 实色边框（#40916c）+ 微加粗
- 引用块：浅绿背景(#f0faf4) + 左边框 + 圆角
- 重点词：加粗 + 绿色(#2d6a4f)
- 末尾：分割线 + 居中小字"— END —"
- 整体：阅读舒适、排版精致`,

  poster: `你需要生成一个活动/课程海报HTML。

设计要求：
- 尺寸 750×1000px，竖版，居中展示
- 背景：深色渐变（深绿 #1b4332 到 #2d6a4f，或用深色图案背景）
- 顶部：活动类型标签（亮色胶囊）
- 主标题：极大字号（48-60px），白色加粗，2行以内
- 副标题/slogan：小一号，半透明白色
- 信息区：时间、平台/地点、主讲人，图标+文字横排，清晰可读
- 报名信息区：浅色背景块，包含二维码占位矩形 + "扫码报名"
- 底部：主办方/品牌 logo 区
- 整体：视觉冲击强、信息层次清晰`,
};

const BASE_CONSTRAINTS = `
【硬性约束 - 必须遵守】
1. 必须输出完整的单文件HTML（包含 <!DOCTYPE html>、<head>、<style>、<body>）
2. 所有CSS必须写在<style>标签内，不得引用外部CSS文件
3. 不得使用外部图片URL，头像/图片用CSS渐变色块或SVG占位代替
4. 字体只用系统字体：PingFang SC, Microsoft YaHei, Hiragino Sans GB, sans-serif
5. 不得使用 Lorem Ipsum，所有文字使用用户提供的真实内容（可适当补充）
6. 对比度要足够高（深色背景配白字，浅色背景配深字）
7. 代码必须干净、有效，直接可在浏览器打开
8. 只输出HTML代码，不要有任何解释文字，不要用markdown代码块包裹
`;

export async function POST(req: NextRequest) {
  const { template, content } = await req.json();

  if (!template || !content?.trim()) {
    return NextResponse.json({ error: "请选择模板并填写内容" }, { status: 400 });
  }

  const templatePrompt = TEMPLATE_PROMPTS[template];
  if (!templatePrompt) {
    return NextResponse.json({ error: "无效的模板类型" }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "未配置 Gemini API Key" }, { status: 500 });
  }

  const prompt = `${templatePrompt}

${BASE_CONSTRAINTS}

【用户提供的内容】
${content.trim()}

现在请生成完整的HTML代码：`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 8192,
          },
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error("Gemini API error:", err);
      return NextResponse.json({ error: "AI 生成失败，请稍后重试" }, { status: 500 });
    }

    const data = await response.json();
    let html: string = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    if (!html) {
      return NextResponse.json({ error: "AI 未返回内容，请重试" }, { status: 500 });
    }

    // 去掉可能的 markdown 代码块包裹
    html = html.replace(/^```html\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/i, "").trim();

    // 确保是完整 HTML
    if (!html.includes("<!DOCTYPE") && !html.includes("<html")) {
      html = `<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>生成内容</title></head><body>${html}</body></html>`;
    }

    return NextResponse.json({ html });
  } catch (e) {
    console.error("html-creator error:", e);
    return NextResponse.json({ error: "服务异常，请稍后重试" }, { status: 500 });
  }
}
