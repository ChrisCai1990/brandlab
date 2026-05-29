"use client";

import { useState } from "react";
import Link from "next/link";

const NICHES = ["职场成长", "副业变现", "亲子育儿", "护肤美妆", "健身减脂", "个人理财", "设计创作", "读书学习", "旅行生活", "科技数码"];
const PLATFORMS = ["小红书", "抖音", "公众号", "视频号", "B站"];
const STYLES = ["干货实操", "真实故事", "数据对比", "趣味科普", "情绪共鸣"];

const HOOKS = [
  { type: "痛点型", icon: "😤", desc: "直击读者最深的困扰" },
  { type: "数字型", icon: "📊", desc: "具体数字增强可信度" },
  { type: "故事型", icon: "📖", desc: "真实经历引发共鸣" },
  { type: "对比型", icon: "⚖️", desc: "制造认知落差" },
  { type: "方法型", icon: "🛠️", desc: "提供可操作的解法" },
];

type Topic = { title: string; tip: string };
type HookResult = { type: string; icon: string; desc: string; topics: Topic[] };

function generateTopics(niche: string, platform: string): HookResult[] {
  const platformTip: Record<string, string> = {
    小红书: "标题加表情，15字内，突出情绪",
    抖音: "前3秒必须有钩子，口播开场",
    公众号: "标题引发好奇，副标题补充说明",
    视频号: "封面文字简洁，联动微信生态",
    B站: "标题可稍长，加UP主人设标签",
  };
  const tip = platformTip[platform] || "标题突出核心价值";

  const templates: Record<string, string[]> = {
    痛点型: [
      `你是不是也在为「${niche}」焦虑？90%的人都踩过这个坑`,
      `做${niche}3个月，我终于搞清楚了这件事`,
    ],
    数字型: [
      `${niche}7个关键动作，帮我在30天内实现突破`,
      `我用这5个方法，把${niche}效率提升了3倍`,
    ],
    故事型: [
      `从一无所知到小有成就，我在${niche}这条路上犯的最贵错误`,
      `一年前我还在为${niche}发愁，现在已经…（附完整复盘）`,
    ],
    对比型: [
      `同样做${niche}，为什么有人越做越好，有人原地踏步？`,
      `${niche}新手 vs 高手，差距究竟在哪里（直接说结论）`,
    ],
    方法型: [
      `${niche}入门指南：从0到1的完整路径（建议收藏）`,
      `${niche}实操手册：我整理了最近半年最有用的方法`,
    ],
  };

  return HOOKS.map((hook) => ({
    ...hook,
    topics: (templates[hook.type] || []).map((title) => ({ title, tip })),
  }));
}

export default function TopicsPage() {
  const [form, setForm] = useState({ niche: "", platform: "", style: "" });
  const [result, setResult] = useState<HookResult[] | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const canGenerate = form.niche && form.platform;

  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="border-b border-[#95d5b2] bg-[#f0faf4]">
        <div className="max-w-5xl mx-auto px-8 py-3 flex items-center gap-2 text-xs text-[#6b7280]">
          <Link href="/" className="hover:text-[#40916c]">首页</Link>
          <span>/</span>
          <Link href="/tools" className="hover:text-[#40916c]">工具资源</Link>
          <span>/</span>
          <span className="text-[#1b4332] font-medium">爆款选题生成器</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-12">
        <div className="mb-10">
          <p className="text-xs text-[#52b788] font-medium tracking-widest uppercase mb-2">免费工具</p>
          <h1 className="text-3xl font-bold text-[#1b4332] mb-3">爆款选题生成器</h1>
          <p className="text-sm text-[#6b7280]">输入账号方向，一键生成覆盖5种钩子类型的10个爆款选题</p>
        </div>

        <div className="bg-[#f0faf4] border border-[#95d5b2] rounded-2xl p-8 mb-10 space-y-6">
          <div>
            <label className="block text-xs font-medium text-[#52b788] tracking-widest uppercase mb-3">账号方向 <span className="text-rose-400">*</span></label>
            <div className="flex flex-wrap gap-2 mb-3">
              {NICHES.map((n) => (
                <button key={n} onClick={() => setForm(f => ({ ...f, niche: n }))}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all ${form.niche === n ? "border-[#40916c] bg-[#f0faf4] text-[#40916c] font-medium" : "border-[#95d5b2] text-[#6b7280] hover:border-[#52b788]"}`}>
                  {n}
                </button>
              ))}
            </div>
            <input type="text" value={NICHES.includes(form.niche) ? "" : form.niche}
              onChange={(e) => setForm(f => ({ ...f, niche: e.target.value }))}
              placeholder="或自定义输入，例如：智能硬件测评"
              className="w-full border border-[#95d5b2] rounded-lg px-4 py-2.5 text-sm text-[#1b4332] placeholder-[#6b7280]/40 focus:outline-none focus:border-[#40916c] bg-white" />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#52b788] tracking-widest uppercase mb-3">目标平台 <span className="text-rose-400">*</span></label>
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map((p) => (
                <button key={p} onClick={() => setForm(f => ({ ...f, platform: p }))}
                  className={`text-xs px-4 py-2 rounded-full border transition-all ${form.platform === p ? "border-[#40916c] bg-[#f0faf4] text-[#40916c] font-medium" : "border-[#95d5b2] text-[#6b7280] hover:border-[#52b788]"}`}>
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#52b788] tracking-widest uppercase mb-3">内容风格</label>
            <div className="flex flex-wrap gap-2">
              {STYLES.map((s) => (
                <button key={s} onClick={() => setForm(f => ({ ...f, style: f.style === s ? "" : s }))}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all ${form.style === s ? "border-[#40916c] bg-[#f0faf4] text-[#40916c] font-medium" : "border-[#95d5b2] text-[#6b7280] hover:border-[#52b788]"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button onClick={() => setResult(generateTopics(form.niche, form.platform))} disabled={!canGenerate}
              className="bg-[#1b4332] text-white px-8 py-3 rounded-lg text-sm font-medium hover:bg-[#40916c] transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
              生成选题 ⚡
            </button>
          </div>
        </div>

        {result && (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-[#1b4332]">10个爆款选题</h2>
                <p className="text-xs text-[#6b7280] mt-1">基于「{form.niche}」· {form.platform}</p>
              </div>
              <button onClick={() => copy(result.flatMap(h => h.topics.map(t => t.title)).join("\n"), "all")}
                className="text-xs border border-[#95d5b2] text-[#6b7280] px-4 py-2 rounded-lg hover:border-[#40916c] hover:text-[#40916c] transition-colors">
                {copied === "all" ? "✓ 已复制" : "复制全部"}
              </button>
            </div>
            <div className="space-y-4">
              {result.map((hook) => (
                <div key={hook.type} className="border border-[#95d5b2] rounded-xl overflow-hidden">
                  <div className="bg-[#f0faf4] border-b border-[#95d5b2] px-5 py-3 flex items-center gap-2">
                    <span>{hook.icon}</span>
                    <span className="text-xs font-bold text-[#1b4332]">{hook.type}</span>
                    <span className="text-[10px] text-[#6b7280]">· {hook.desc}</span>
                  </div>
                  <div className="divide-y divide-[#f0faf4]">
                    {hook.topics.map((t, i) => (
                      <div key={i} className="px-5 py-4 flex items-start justify-between gap-4 hover:bg-[#fafffe] transition-colors group">
                        <div>
                          <p className="text-sm text-[#1b4332] font-medium leading-snug">{t.title}</p>
                          <p className="text-[10px] text-[#6b7280] mt-1">{t.tip}</p>
                        </div>
                        <button onClick={() => copy(t.title, `${hook.type}-${i}`)}
                          className="shrink-0 text-[10px] text-[#52b788] border border-[#95d5b2] px-2.5 py-1 rounded hover:border-[#40916c] hover:text-[#40916c] transition-colors">
                          {copied === `${hook.type}-${i}` ? "✓" : "复制"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 bg-[#1b4332] rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-white mb-1">想要更多定制选题？</p>
                <p className="text-xs text-[#74c69d]">加入社群，获取完整版选题库 + 爆款拆解模板</p>
              </div>
              <Link href="/contact" className="shrink-0 text-xs bg-[#2d6a4f] border border-[#52b788] text-white px-5 py-2.5 rounded-lg hover:bg-[#40916c] transition-colors">加入社群</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
