import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export async function POST(req: NextRequest) {
  const { niche, platform, frequency, audience } = await req.json();

  if (!niche || !platform || !frequency) {
    return NextResponse.json({ error: "请填写账号方向、平台和更新频率" }, { status: 400 });
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const audienceHint = audience ? `目标受众：${audience}` : "";
  const freqNum = parseInt(frequency) || 5;
  // 按频率计算30天内发布的天数
  const totalDays = Math.round((freqNum / 7) * 30);

  const prompt = `你是一位专业的内容策划师，请为以下账号生成30天内容排期计划。

账号方向：${niche}
目标平台：${platform}
${audienceHint}
每周更新频率：每周${freqNum}条（30天共约${totalDays}条内容）

内容类型（7类，交替使用）：个人定位、内容运营、账号增长、视觉表达、平台策略、IP案例、工具方法
钩子类型（5种，交替使用）：痛点型、数字型、案例型、反常识型、对比型

要求：
- 生成${totalDays}条内容计划，合理分布在30天内
- 每条选题标题要有吸引力，包含账号方向关键词
- 标题20字以内，符合${platform}风格
- 七类内容要均衡分布，不要连续重复同一类型
- 标题自然，像真人写的

请用JSON格式返回（只返回JSON，不要其他文字）：
{
  "total": ${totalDays},
  "items": [
    {
      "day": 1,
      "type": "个人定位",
      "hook": "痛点型",
      "title": "选题标题",
      "angle": "核心角度一句话"
    }
  ],
  "extras": [
    { "title": "备用选题1", "type": "内容运营" },
    { "title": "备用选题2", "type": "账号增长" },
    { "title": "备用选题3", "type": "工具方法" }
  ]
}`;

  try {
    const message = await client.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 4000,
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
    console.error("calendar AI error:", err);
    return NextResponse.json({ error: "生成失败，请稍后重试" }, { status: 500 });
  }
}
