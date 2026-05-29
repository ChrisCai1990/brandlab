import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export async function POST(req: NextRequest) {
  const { direction, audience, advantage, goal } = await req.json();

  if (!direction || !audience || !advantage || !goal) {
    return NextResponse.json({ error: "请填写所有字段" }, { status: 400 });
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const prompt = `你是一位个人品牌策略专家。根据以下信息，为这位创作者生成账号定位方案：

账号方向：${direction}
目标受众：${audience}
核心优势：${advantage}
变现目标：${goal}

请生成以下内容（用中文，简洁有力）：

1. 一句话定位（20字以内，包含受众+价值+差异化）
2. 账号标签（5个关键词，用逗号分隔）
3. 内容策略（3个方向，每个方向一句话）
4. 差异化亮点（相比同类账号，你的独特之处，2-3句话）
5. 第一个爆款选题（5个具体标题）

格式用 JSON 返回：
{
  "positioning": "一句话定位",
  "tags": ["标签1", "标签2", "标签3", "标签4", "标签5"],
  "contentStrategy": ["方向1", "方向2", "方向3"],
  "differentiation": "差异化描述",
  "topics": ["选题1", "选题2", "选题3", "选题4", "选题5"]
}`;

  try {
    const message = await client.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid response");
    const result = JSON.parse(jsonMatch[0]);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "AI 生成失败，请稍后重试" }, { status: 500 });
  }
}
