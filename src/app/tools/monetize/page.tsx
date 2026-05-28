"use client";

import { useState } from "react";
import Link from "next/link";

const FOLLOWER_RANGES = ["0-1000", "1000-5000", "5000-1万", "1万-5万", "5万-20万", "20万以上"];
const NICHES = ["职场成长", "副业变现", "亲子育儿", "护肤美妆", "健身减脂", "个人理财", "设计创作", "读书学习", "旅行生活", "科技数码"];
const STRENGTHS = ["写作能力强", "有专业知识", "有真实案例", "善于制作视频", "人脉资源丰富", "有产品/服务"];

type Form = { followers: string; niche: string; strengths: string[] };

type MonetizeMethod = { name: string; stars: number; minFollowers: string; desc: string; action: string };

function generatePlan(form: Form) {
  const allMethods: MonetizeMethod[] = [
    { name: "广告合作", stars: 4, minFollowers: "5000", desc: "品牌付费推广，客单价500-5万不等，粉丝质量比数量重要", action: "打造媒体Kit，主动联系对口品牌" },
    { name: "知识付费/卖课", stars: 5, minFollowers: "1000", desc: "变现天花板最高，可从9.9元小课做起，逐步升至999+高客单", action: "先验证痛点，输出免费内容建立信任后推付费产品" },
    { name: "带货佣金", stars: 3, minFollowers: "1000", desc: "门槛低、现金流快，但需积累带货口碑，避免乱推烂货", action: "从自用产品分享开始，建立真实带货人设" },
    { name: "私域社群", stars: 4, minFollowers: "500", desc: "复购率高、用户粘性强，适合长期经营，月费制或年费制", action: "先提供免费价值，再推出收费会员层级" },
    { name: "咨询/一对一", stars: 5, minFollowers: "500", desc: "单价高（300-1000元/次），但时间换钱，需控制接单量", action: "通过内容展示专业度，私信转化意向咨询客户" },
    { name: "联名/IP授权", stars: 2, minFollowers: "5万", desc: "适合IP成熟期，需要较强的品牌辨识度和粉丝认同", action: "先建立强标签，再寻找品牌合作联名机会" },
  ];

  const followerNum = parseInt(form.followers.replace(/[^0-9]/g, "")) || 0;

  const ranked = allMethods
    .map((m) => {
      const minNum = parseInt(m.minFollowers.replace(/[^0-9]/g, "")) || 0;
      const feasible = followerNum >= minNum;
      const hasStrengthBonus = form.strengths.includes("有专业知识") && ["知识付费/卖课", "咨询/一对一"].includes(m.name);
      return { ...m, feasible, stars: feasible ? (hasStrengthBonus ? Math.min(m.stars + 1, 5) : m.stars) : Math.max(m.stars - 2, 1) };
    })
    .sort((a, b) => (b.feasible ? 1 : 0) - (a.feasible ? 1 : 0) || b.stars - a.stars);

  const phases = [
    {
      phase: "第一阶段（0-3个月）",
      color: "text-[#0f766e] bg-[#e6f4f3]",
      goal: "建立信任，积累第一批忠实粉丝",
      tasks: ["每周稳定更新3-5条内容", "100%回复评论建立互动", "输出免费资源引流私域", `尝试${ranked[0]?.name || "知识付费"}的最低门槛产品`],
    },
    {
      phase: "第二阶段（3-12个月）",
      color: "text-blue-600 bg-blue-50",
      goal: "验证变现模型，实现月入稳定",
      tasks: ["打磨1个核心变现产品", "建立内容→私域→变现的漏斗", "收集真实用户反馈优化产品", "复盘数据，聚焦最高ROI的变现方式"],
    },
    {
      phase: "第三阶段（1年以上）",
      color: "text-violet-600 bg-violet-50",
      goal: "规模化，打造个人IP品牌溢价",
      tasks: ["开发高客单价产品（999+）", "搭建团队或合伙人体系", "探索IP授权或联名合作", "建立可复制的内容生产SOP"],
    },
  ];

  return { ranked, phases };
}

export default function MonetizePage() {
  const [form, setForm] = useState<Form>({ followers: "", niche: "", strengths: [] });
  const [result, setResult] = useState<ReturnType<typeof generatePlan> | null>(null);

  function toggleStrength(s: string) {
    setForm(f => ({ ...f, strengths: f.strengths.includes(s) ? f.strengths.filter(x => x !== s) : [...f.strengths, s] }));
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="border-b border-[#b2d8d5] bg-[#f0f9f8]">
        <div className="max-w-5xl mx-auto px-8 py-3 flex items-center gap-2 text-xs text-[#5a7e7c]">
          <Link href="/" className="hover:text-[#0f766e]">首页</Link>
          <span>/</span>
          <Link href="/tools" className="hover:text-[#0f766e]">工具资源</Link>
          <span>/</span>
          <span className="text-[#0d2e2c] font-medium">变现路径规划表</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-12">
        <div className="mb-10">
          <p className="text-xs text-[#5eada7] font-medium tracking-widest uppercase mb-2">免费工具</p>
          <h1 className="text-3xl font-bold text-[#0d2e2c] mb-3">变现路径规划表</h1>
          <p className="text-sm text-[#5a7e7c]">告诉我你的粉丝量和账号方向，生成最适合你的变现优先级 + 三阶段行动路线图</p>
        </div>

        <div className="bg-[#f0f9f8] border border-[#b2d8d5] rounded-2xl p-8 mb-10 space-y-6">
          <div>
            <label className="block text-xs font-medium text-[#5eada7] tracking-widest uppercase mb-3">目前粉丝量 <span className="text-rose-400">*</span></label>
            <div className="flex flex-wrap gap-2">
              {FOLLOWER_RANGES.map((r) => (
                <button key={r} onClick={() => setForm(f => ({ ...f, followers: r }))}
                  className={`text-xs px-4 py-2 rounded-full border transition-all ${form.followers === r ? "border-[#0f766e] bg-[#e6f4f3] text-[#0f766e] font-medium" : "border-[#b2d8d5] text-[#5a7e7c] hover:border-[#5eada7]"}`}>
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#5eada7] tracking-widest uppercase mb-3">账号方向</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {NICHES.map((n) => (
                <button key={n} onClick={() => setForm(f => ({ ...f, niche: n }))}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all ${form.niche === n ? "border-[#0f766e] bg-[#e6f4f3] text-[#0f766e] font-medium" : "border-[#b2d8d5] text-[#5a7e7c] hover:border-[#5eada7]"}`}>
                  {n}
                </button>
              ))}
            </div>
            <input type="text" value={NICHES.includes(form.niche) ? "" : form.niche}
              onChange={(e) => setForm(f => ({ ...f, niche: e.target.value }))}
              placeholder="或自定义输入"
              className="w-full border border-[#b2d8d5] rounded-lg px-4 py-2.5 text-sm text-[#0d2e2c] placeholder-[#5a7e7c]/40 focus:outline-none focus:border-[#0f766e] bg-white" />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#5eada7] tracking-widest uppercase mb-3">你的核心优势（可多选）</label>
            <div className="flex flex-wrap gap-2">
              {STRENGTHS.map((s) => (
                <button key={s} onClick={() => toggleStrength(s)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all ${form.strengths.includes(s) ? "border-[#0f766e] bg-[#e6f4f3] text-[#0f766e] font-medium" : "border-[#b2d8d5] text-[#5a7e7c] hover:border-[#5eada7]"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button onClick={() => setResult(generatePlan(form))} disabled={!form.followers}
              className="bg-[#0d2e2c] text-white px-8 py-3 rounded-lg text-sm font-medium hover:bg-[#0f766e] transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
              生成规划 →
            </button>
          </div>
        </div>

        {result && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-[#0d2e2c] mb-4">变现方式优先级</h2>
              <div className="space-y-3">
                {result.ranked.map((m, i) => (
                  <div key={m.name} className={`border rounded-xl p-4 flex items-start gap-4 ${m.feasible ? "border-[#b2d8d5]" : "border-[#e8f0ee] opacity-60"}`}>
                    <div className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold bg-[#e6f4f3] text-[#0f766e]">{i + 1}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-[#0d2e2c]">{m.name}</span>
                        <span className="text-[10px] text-[#5eada7]">{"★".repeat(m.stars)}{"☆".repeat(5 - m.stars)}</span>
                        {!m.feasible && <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">需{m.minFollowers}+粉丝</span>}
                      </div>
                      <p className="text-xs text-[#5a7e7c] mb-1">{m.desc}</p>
                      <p className="text-[10px] text-[#0f766e] font-medium">行动：{m.action}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold text-[#0d2e2c] mb-4">三阶段行动路线图</h2>
              <div className="space-y-4">
                {result.phases.map((phase) => (
                  <div key={phase.phase} className="border border-[#b2d8d5] rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`text-[10px] font-medium px-2.5 py-1 rounded-full ${phase.color}`}>{phase.phase}</span>
                      <span className="text-xs text-[#5a7e7c]">目标：{phase.goal}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {phase.tasks.map((task, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#5eada7] shrink-0" />
                          <p className="text-xs text-[#0d2e2c]">{task}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
