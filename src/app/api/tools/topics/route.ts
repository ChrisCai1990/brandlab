import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export async function POST(req: NextRequest) {
  const { niche, platform, style } = await req.json();

  if (!niche || !platform) {
    return NextResponse.json({ error: "请填写账号方向和目标平台" }, { status: 400 });
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const styleHint = style ? `内容风格偏好：${style}` : "";

  const prompt = `你是一位擅长内容策划的个人品牌顾问。请为以下账号生成10个爆款选题标题。

账号方向：${niche}
目标平台：${platform}
${styleHint}

要求：
- 每种钩子类型各2个标题（共10个）
- 标题要具体、有吸引力，符合${platform}平台风格
- 标题长度控制在20字以内
- 要包含账号方向的关键词
- 语气自然，像真人写的，不要太AI感

钩子类型说明：
- 痛点型：直击用户最深的困扰或焦虑
- 数字型：用具体数字增强可信度和吸引力
- 故事型：用真实经历或案例引发共鸣
- 对比型：制造认知落差或前后反差
- 方法型：提供可操作的解决方案

请用JSON格式返回：
{
  "hooks": [
    {
      "type": "痛点型",
      "icon": "😤",
      "desc": "直击读者最深的困扰",
      "topics": [
        { "title": "选题标题1", "tip": "平台发布建议" },
        { "title": "选题标题2", "tip": "平台发布建议" }
      ]
    },
    {
      "type": "数字型",
      "icon": "📊",
      "desc": "具体数字增强可信度",
      "topics": [
        { "title": "选题标题1", "tip": "平台发布建议" },
        { "title": "选题标题2", "tip": "平台发布建议" }
      ]
    },
    {
      "type": "故事型",
      "icon": "📖",
      "desc": "真实经历引发共鸣",
      "topics": [...]
    },
    {
      "type": "对比型",
      "icon": "⚖️",
      "desc": "制造认知落差",
      "topics": [...]
    },
    {
      "type": "方法型",
      "icon": "🛠️",
      "desc": "提供可操作的解法",
      "topics": [...]
    }
  ]
}

tip字段是针对${platform}平台的具体发布建议（一句话，例如：标题加表情，15字内，突出情绪）。`;

  try {
    const message = await client.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "AI 返回格式异常，请重试" }, { status: 500 });
    }

    const result = JSON.parse(jsonMatch[0]);
    return NextResponse.json(result);
  } catch (err) {
    console.error("topics AI error:", err);
    return NextResponse.json({ error: "生成失败，请稍后重试" }, { status: 500 });
  }
}
