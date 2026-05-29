import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Article } from "@/lib/models";

export const dynamic = "force-dynamic";

export async function GET() {
  await connectDB();
  const articles = await Article.find({ published: true })
    .sort({ date: -1 })
    .limit(20)
    .select("slug title desc date tag")
    .lean();

  const baseUrl = "https://brandlab.ink";
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>品牌拾研社 · BrandLab</title>
    <link>${baseUrl}</link>
    <description>每天一条干货，帮你把账号做成有影响力的个人品牌</description>
    <language>zh-CN</language>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    ${articles.map((a) => `<item>
      <title><![CDATA[${a.title}]]></title>
      <link>${baseUrl}/library/${a.slug}</link>
      <guid>${baseUrl}/library/${a.slug}</guid>
      <description><![CDATA[${a.desc}]]></description>
      <pubDate>${new Date(a.date).toUTCString()}</pubDate>
      <category>${a.tag}</category>
    </item>`).join("\n    ")}
  </channel>
</rss>`;

  return new NextResponse(rss, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
