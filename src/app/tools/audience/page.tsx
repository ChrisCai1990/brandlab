"use client";

import { useState } from "react";
import Link from "next/link";

const AGE_GROUPS = ["18-24岁", "25-30岁", "31-35岁", "36-45岁", "45岁以上"];
const GENDERS = ["女性为主", "男性为主", "男女均衡"];
const PAIN_POINTS = ["时间不够用", "不知道方向", "缺乏技能", "经济压力", "社交焦虑", "职业迷茫", "育儿困扰", "健康问题"];
const SCENES = ["上下班通勤", "睡前刷手机", "工作午休", "周末休闲", "学习时间"];

type Form = { age: string; gender: string; pains: string[]; scene: string; niche: string };

function generatePersona(form: Form) {
  const ageMap: Record<string, string> = {
    "18-24岁": "在校生或初入职场，对新鲜事物好奇，消费能力有限但种草意愿强",
    "25-30岁": "职场上升期，有一定收入，追求效率和自我提升，决策相对理性",
    "31-35岁": "家庭+职场双重压力，时间稀缺，偏好解决具体问题的内容",
    "36-45岁": "有消费力和决策权，重视品质和口碑，内容信任门槛较高",
    "45岁以上": "习惯熟悉的平台，内容偏好实用和养生，私域转化率高",
  };
  const genderMap: Record<string, string> = {
    女性为主: "情感化内容更易引发共鸣，视觉审美要求高，社群归属感强",
    男性为主: "偏好数据和逻辑，理性消费，技术型或工具型内容接受度高",
    男女均衡: "内容需兼顾实用性与情感共鸣，差异化定位空间更大",
  };

  const painDesc = form.pains.length > 0
    ? form.pains.join("、")
    : "核心痛点待明确";

  const contentAngles = [
    `痛点切入：围绕「${painDesc}」设计开篇钩子`,
    `解决方案：提供可直接操作的${form.niche || "领域"}方法论`,
    `案例佐证：用真实故事增强可信度`,
    `结果展示：让受众看到改变后的状态`,
  ];

  const sceneMap: Record<string, string> = {
    上下班通勤: "内容要简短有力，15秒视频或300字图文最佳",
    睡前刷手机: "情绪价值为主，可以稍长但要有沉浸感",
    工作午休: "干货密度高，能快速获取价值的清单类内容",
    周末休闲: "可接受长内容，深度故事和完整教程效果好",
    学习时间: "结构清晰，有框架有逻辑，配合收藏功能",
  };

  return {
    profile: {
      age: ageMap[form.age] || "年龄特征待补充",
      gender: genderMap[form.gender] || "性别特征待补充",
      pain: painDesc,
      scene: form.scene,
    },
    strategy: {
      angles: contentAngles,
      format: sceneMap[form.scene] || "根据消费场景调整内容形式",
      cta: form.pains.includes("不知道方向") || form.pains.includes("职业迷茫")
        ? "提供清单+模板，让读者有立即行动的抓手"
        : "在内容末尾提供进阶资源，引流至私域",
    },
    monetize: {
      method: form.pains.includes("经济压力") || form.pains.includes("职业迷茫")
        ? "知识付费 / 1对1咨询（受众有明确付费意愿）"
        : "广告合作 / 好物推荐（受众消费决策活跃）",
      trust: "先建立信任（免费干货），再引入付费产品，转化率更高",
    },
  };
}

export default function AudiencePage() {
  const [form, setForm] = useState<Form>({ age: "", gender: "", pains: [], scene: "", niche: "" });
  const [result, setResult] = useState<ReturnType<typeof generatePersona> | null>(null);

  function togglePain(pain: string) {
    setForm(f => ({
      ...f,
      pains: f.pains.includes(pain) ? f.pains.filter(p => p !== pain) : [...f.pains, pain],
    }));
  }

  const canGenerate = form.age && form.gender;

  return (
    <div className="bg-white min-h-screen">
      <div className="border-b border-[#95d5b2] bg-[#f0faf4]">
        <div className="max-w-5xl mx-auto px-8 py-3 flex items-center gap-2 text-xs text-[#6b7280]">
          <Link href="/" className="hover:text-[#40916c]">首页</Link>
          <span>/</span>
          <Link href="/tools" className="hover:text-[#40916c]">工具资源</Link>
          <span>/</span>
          <span className="text-[#1b4332] font-medium">粉丝画像分析表</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-12">
        <div className="mb-10">
          <p className="text-xs text-[#52b788] font-medium tracking-widest uppercase mb-2">免费工具</p>
          <h1 className="text-3xl font-bold text-[#1b4332] mb-3">粉丝画像分析表</h1>
          <p className="text-sm text-[#6b7280]">描述你的目标受众，生成结构化画像 + 内容策略 + 变现路径</p>
        </div>

        <div className="bg-[#f0faf4] border border-[#95d5b2] rounded-2xl p-8 mb-10 space-y-6">
          <div>
            <label className="block text-xs font-medium text-[#52b788] tracking-widest uppercase mb-2">你的账号方向</label>
            <input type="text" value={form.niche} onChange={(e) => setForm(f => ({ ...f, niche: e.target.value }))}
              placeholder="例如：职场成长、亲子育儿、护肤美妆"
              className="w-full border border-[#95d5b2] rounded-lg px-4 py-2.5 text-sm text-[#1b4332] placeholder-[#6b7280]/40 focus:outline-none focus:border-[#40916c] bg-white" />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#52b788] tracking-widest uppercase mb-3">受众年龄段 <span className="text-rose-400">*</span></label>
            <div className="flex flex-wrap gap-2">
              {AGE_GROUPS.map((a) => (
                <button key={a} onClick={() => setForm(f => ({ ...f, age: a }))}
                  className={`text-xs px-4 py-2 rounded-full border transition-all ${form.age === a ? "border-[#40916c] bg-[#f0faf4] text-[#40916c] font-medium" : "border-[#95d5b2] text-[#6b7280] hover:border-[#52b788]"}`}>
                  {a}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#52b788] tracking-widest uppercase mb-3">性别比例 <span className="text-rose-400">*</span></label>
            <div className="flex flex-wrap gap-2">
              {GENDERS.map((g) => (
                <button key={g} onClick={() => setForm(f => ({ ...f, gender: g }))}
                  className={`text-xs px-4 py-2 rounded-full border transition-all ${form.gender === g ? "border-[#40916c] bg-[#f0faf4] text-[#40916c] font-medium" : "border-[#95d5b2] text-[#6b7280] hover:border-[#52b788]"}`}>
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#52b788] tracking-widest uppercase mb-3">主要痛点（可多选）</label>
            <div className="flex flex-wrap gap-2">
              {PAIN_POINTS.map((p) => (
                <button key={p} onClick={() => togglePain(p)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all ${form.pains.includes(p) ? "border-[#40916c] bg-[#f0faf4] text-[#40916c] font-medium" : "border-[#95d5b2] text-[#6b7280] hover:border-[#52b788]"}`}>
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#52b788] tracking-widest uppercase mb-3">主要内容消费场景</label>
            <div className="flex flex-wrap gap-2">
              {SCENES.map((s) => (
                <button key={s} onClick={() => setForm(f => ({ ...f, scene: f.scene === s ? "" : s }))}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all ${form.scene === s ? "border-[#40916c] bg-[#f0faf4] text-[#40916c] font-medium" : "border-[#95d5b2] text-[#6b7280] hover:border-[#52b788]"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button onClick={() => setResult(generatePersona(form))} disabled={!canGenerate}
              className="bg-[#1b4332] text-white px-8 py-3 rounded-lg text-sm font-medium hover:bg-[#40916c] transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
              生成画像 →
            </button>
          </div>
        </div>

        {result && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#1b4332]">粉丝画像分析结果</h2>

            <div className="bg-[#1b4332] rounded-xl p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "年龄特征", value: form.age },
                { label: "性别构成", value: form.gender },
                { label: "核心痛点", value: result.profile.pain },
                { label: "消费场景", value: form.scene || "未指定" },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-[10px] text-[#52b788] font-medium uppercase tracking-widest mb-1">{label}</p>
                  <p className="text-xs text-white font-medium">{value}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-[#95d5b2] rounded-xl p-5">
                <p className="text-xs text-[#52b788] font-medium tracking-widest uppercase mb-3">受众深度画像</p>
                <div className="space-y-3">
                  <div><p className="text-[10px] text-[#52b788] mb-0.5">年龄洞察</p><p className="text-xs text-[#1b4332] leading-relaxed">{result.profile.age}</p></div>
                  <div><p className="text-[10px] text-[#52b788] mb-0.5">性别洞察</p><p className="text-xs text-[#1b4332] leading-relaxed">{result.profile.gender}</p></div>
                </div>
              </div>
              <div className="border border-[#95d5b2] rounded-xl p-5">
                <p className="text-xs text-[#52b788] font-medium tracking-widest uppercase mb-3">变现建议</p>
                <div className="space-y-3">
                  <div><p className="text-[10px] text-[#52b788] mb-0.5">推荐变现方式</p><p className="text-xs text-[#1b4332] leading-relaxed">{result.monetize.method}</p></div>
                  <div><p className="text-[10px] text-[#52b788] mb-0.5">转化策略</p><p className="text-xs text-[#1b4332] leading-relaxed">{result.monetize.trust}</p></div>
                </div>
              </div>
            </div>

            <div className="border border-[#95d5b2] rounded-xl p-5">
              <p className="text-xs text-[#52b788] font-medium tracking-widest uppercase mb-4">内容策略建议</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-[10px] text-[#52b788] font-medium mb-2">四个内容切入角度</p>
                  <div className="space-y-1.5">
                    {result.strategy.angles.map((a, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="text-[10px] text-[#52b788] font-bold w-3 shrink-0">{i + 1}</span>
                        <p className="text-xs text-[#1b4332] leading-relaxed">{a}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-[#52b788] font-medium mb-2">内容形式建议</p>
                  <p className="text-xs text-[#1b4332] leading-relaxed">{result.strategy.format}</p>
                </div>
                <div>
                  <p className="text-[10px] text-[#52b788] font-medium mb-2">行动号召（CTA）</p>
                  <p className="text-xs text-[#1b4332] leading-relaxed">{result.strategy.cta}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
