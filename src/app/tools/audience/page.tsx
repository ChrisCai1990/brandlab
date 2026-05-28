"use client";

import { useState } from "react";
import Link from "next/link";

const AI_PROMPT = `你是一位资深的用户研究专家，请帮我建立一份完整的粉丝画像分析报告。

【我的账号信息】
- 账号方向：[请填写]
- 目标平台：[请填写]
- 现有粉丝量：[请填写]

【请从以下维度帮我分析和构建粉丝画像】

## 一、人口统计特征
- 年龄分布（主要区间）：
- 性别比例：
- 地域分布：
- 职业构成：
- 收入水平：

## 二、心理特征
- 核心诉求（3个）：
- 主要焦虑（3个）：
- 价值观偏好：
- 消费决策习惯：

## 三、行为特征
- 活跃时间段：
- 内容消费偏好（图文/视频/直播）：
- 平均阅读时长：
- 互动行为模式（点赞/评论/收藏/分享的优先级）：
- 关注决策触发点：

## 四、用户旅程地图
- 从陌生到关注：
- 从关注到互动：
- 从互动到付费：

## 五、内容策略建议
- 最容易引发共鸣的内容角度：
- 最容易引发互动的内容形式：
- 最容易触发分享的内容类型：

## 六、变现路径匹配
- 最匹配的变现方式（按优先级排序）：
- 预估付费转化率：
- 关键信任建立节点：`;

const AGE_OPTIONS = ["18-24岁", "25-30岁", "31-35岁", "36-40岁", "40岁以上", "跨年龄段"];
const GENDER_OPTIONS = ["女性为主(>70%)", "男性为主(>70%)", "基本均衡", "不确定"];
const REGION_OPTIONS = ["一线城市为主", "二三线城市为主", "全国均衡", "海外华人"];
const ACTIVE_OPTIONS = ["早上7-9点", "午休12-14点", "下班后18-21点", "睡前21-24点", "全天均衡"];
const PAIN_OPTIONS = [
  "职场焦虑", "财务压力", "学习效率低", "时间管理差",
  "社交困难", "情感困惑", "健康问题", "育儿困境",
  "审美提升", "技能空缺", "职业迷茫", "生活方式升级",
];
const CONSUME_OPTIONS = ["点赞收藏型", "评论互动型", "主动分享型", "沉默阅读型"];

type AudienceForm = {
  age: string;
  gender: string;
  region: string;
  activeTime: string;
  pains: string[];
  consume: string;
  niche: string;
};

function generatePersona(form: AudienceForm) {
  const ageMap: Record<string, { label: string; trait: string }> = {
    "18-24岁": { label: "Z世代", trait: "追求个性表达，对新事物接受度高，品牌忠诚度较低" },
    "25-30岁": { label: "职场新人", trait: "有上进心，对实用干货敏感，初步具备付费意愿" },
    "31-35岁": { label: "职场中坚", trait: "有明确目标感，时间稀缺，付费决策理性且快速" },
    "36-40岁": { label: "成熟消费者", trait: "追求品质与效率，付费能力强，口碑传播力高" },
    "40岁以上": { label: "资深用户", trait: "经验丰富，偏好权威背书，转化周期较长但客单价高" },
    "跨年龄段": { label: "广泛受众", trait: "内容普适性强，需要差异化触达不同子群体" },
  };

  const genderMap: Record<string, string> = {
    "女性为主(>70%)": "内容偏好感性表达与实用技巧，种草心智强，社交分享意愿高",
    "男性为主(>70%)": "偏好数据与逻辑，直接性强，决策理性，转化路径更短",
    "基本均衡": "内容需兼顾感性与理性，可用不同切入角度触达两类受众",
    "不确定": "建议先发布3-5篇内容观察后台数据，根据实际受众调整方向",
  };

  const consumeMap: Record<string, { strategy: string; priority: string }> = {
    "点赞收藏型": { strategy: "提高内容的「收藏价值」——可反复使用的清单、模板、公式", priority: "收藏率 > 点赞率 > 评论率" },
    "评论互动型": { strategy: "在内容末尾设置开放性问题，引导评论，打造「话题型」内容", priority: "评论率 > 点赞率 > 收藏率" },
    "主动分享型": { strategy: "制造「看到就想分享」的共鸣感，让内容有「替我说出来了」的效果", priority: "分享率 > 互动率" },
    "沉默阅读型": { strategy: "注重内容深度与完播率，用高质量换取算法推流，而非互动数", priority: "完播率 > 点赞率" },
  };

  const ageInfo = ageMap[form.age] || { label: "目标受众", trait: "有明确需求，对专业内容有较强接受度" };
  const consumeInfo = consumeMap[form.consume] || consumeMap["点赞收藏型"];

  return {
    persona: {
      name: `${ageInfo.label} · ${form.niche || "目标用户"}`,
      age: form.age,
      gender: form.gender,
      region: form.region,
      activeTime: form.activeTime,
      trait: ageInfo.trait,
    },
    psychology: {
      gender: genderMap[form.gender] || "需进一步调研受众特征",
      pains: form.pains.length > 0 ? form.pains : ["核心痛点待确认"],
      motivation: `在${form.activeTime || "碎片化时间"}内寻找能快速解决「${form.pains[0] || "核心问题"}」的实用方法`,
    },
    behavior: {
      consume: consumeInfo.strategy,
      priority: consumeInfo.priority,
      decision: "看到账号→浏览近期3-5条内容→判断「是否对我有用」→决定是否关注",
    },
    content: {
      hook: `以「${form.pains[0] || "痛点"}」为切入口，${form.gender.includes("女") ? "配合真实案例与情绪共鸣" : "提供数据支撑与逻辑框架"}`,
      format: form.activeTime?.includes("睡前") ? "短平快的干货清单，5分钟内能看完" : "结构清晰的深度内容，有可收藏的核心价值",
      viral: "让粉丝感觉「你说出了我的心声」，触发主动分享",
    },
    monetize: {
      path: form.pains.some(p => ["职场焦虑", "职业迷茫", "技能空缺"].includes(p))
        ? "知识付费课程 → 1对1咨询 → 社群订阅"
        : form.pains.some(p => ["审美提升", "健康问题"].includes(p))
        ? "好物种草带货 → 品牌合作 → 联名产品"
        : "社群会员 → 知识付费 → 品牌合作",
      rate: "内容型账号平均付费转化率 1-3%，优质垂直账号可达 5-8%",
      trust: "持续输出3个月以上，建立「专业可信」人设后，转化成本大幅下降",
    },
  };
}

export default function AudiencePage() {
  const [form, setForm] = useState<AudienceForm>({
    age: "", gender: "", region: "", activeTime: "", pains: [], consume: "", niche: "",
  });
  const [result, setResult] = useState<ReturnType<typeof generatePersona> | null>(null);
  const [copied, setCopied] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const canGenerate = form.age && form.gender;

  function togglePain(p: string) {
    setForm(f => ({
      ...f,
      pains: f.pains.includes(p) ? f.pains.filter(x => x !== p) : f.pains.length < 4 ? [...f.pains, p] : f.pains,
    }));
  }

  function handleGenerate() {
    setResult(generatePersona(form));
  }

  function copyResult() {
    if (!result) return;
    const text = `粉丝画像分析报告

【核心画像】
年龄层：${result.persona.age} (${result.persona.name})
性别比例：${result.persona.gender}
地域分布：${result.persona.region}
活跃时间：${result.persona.activeTime}
用户特征：${result.persona.trait}

【心理特征】
行为偏好：${result.psychology.gender}
核心痛点：${result.psychology.pains.join("、")}
行为动机：${result.psychology.motivation}

【行为特征】
消费模式：${result.behavior.consume}
指标优先级：${result.behavior.priority}
关注决策路径：${result.behavior.decision}

【内容策略】
钩子方向：${result.content.hook}
内容形式：${result.content.format}
传播引爆点：${result.content.viral}

【变现匹配】
推荐路径：${result.monetize.path}
预估转化率：${result.monetize.rate}
信任建立节点：${result.monetize.trust}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="border-b border-[#C8DDD2] bg-[#F7FBF8]">
        <div className="max-w-5xl mx-auto px-8 py-3 flex items-center gap-2 text-xs text-[#6B7A6E]">
          <Link href="/" className="hover:text-[#2D6A4F]">首页</Link>
          <span>/</span>
          <Link href="/tools" className="hover:text-[#2D6A4F]">工具资源</Link>
          <span>/</span>
          <span className="text-[#1A2E22] font-medium">粉丝画像分析表</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-12">
        <div className="mb-10">
          <p className="text-xs text-[#6BAF8A] font-medium tracking-widest uppercase mb-2">免费工具</p>
          <h1 className="text-3xl font-bold text-[#1A2E22] mb-3">粉丝画像分析表</h1>
          <p className="text-sm text-[#6B7A6E]">填写你对受众的了解，生成结构化的粉丝画像，让每条内容都有精准落点</p>
        </div>

        {/* Form */}
        <div className="bg-[#F7FBF8] border border-[#C8DDD2] rounded-2xl p-8 mb-10 space-y-7">
          {/* 账号方向 */}
          <div>
            <label className="block text-xs font-medium text-[#6BAF8A] tracking-widest uppercase mb-2">账号方向</label>
            <input
              type="text"
              value={form.niche}
              onChange={(e) => setForm(f => ({ ...f, niche: e.target.value }))}
              placeholder="例如：职场干货、油皮护肤、副业变现"
              className="w-full border border-[#C8DDD2] rounded-lg px-4 py-2.5 text-sm text-[#1A2E22] placeholder-[#6B7A6E]/40 focus:outline-none focus:border-[#2D6A4F] bg-white"
            />
          </div>

          {/* 年龄 + 性别 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-medium text-[#6BAF8A] tracking-widest uppercase mb-3">
                主要年龄层 <span className="text-rose-400">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {AGE_OPTIONS.map((a) => (
                  <button key={a} onClick={() => setForm(f => ({ ...f, age: a }))}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all ${form.age === a ? "border-[#2D6A4F] bg-[#E8F5EE] text-[#2D6A4F] font-medium" : "border-[#C8DDD2] text-[#6B7A6E] hover:border-[#6BAF8A]"}`}>
                    {a}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#6BAF8A] tracking-widest uppercase mb-3">
                性别比例 <span className="text-rose-400">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {GENDER_OPTIONS.map((g) => (
                  <button key={g} onClick={() => setForm(f => ({ ...f, gender: g }))}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all ${form.gender === g ? "border-[#2D6A4F] bg-[#E8F5EE] text-[#2D6A4F] font-medium" : "border-[#C8DDD2] text-[#6B7A6E] hover:border-[#6BAF8A]"}`}>
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 地域 + 活跃时间 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-medium text-[#6BAF8A] tracking-widest uppercase mb-3">地域分布</label>
              <div className="flex flex-wrap gap-2">
                {REGION_OPTIONS.map((r) => (
                  <button key={r} onClick={() => setForm(f => ({ ...f, region: r }))}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all ${form.region === r ? "border-[#2D6A4F] bg-[#E8F5EE] text-[#2D6A4F] font-medium" : "border-[#C8DDD2] text-[#6B7A6E] hover:border-[#6BAF8A]"}`}>
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#6BAF8A] tracking-widest uppercase mb-3">主要活跃时间</label>
              <div className="flex flex-wrap gap-2">
                {ACTIVE_OPTIONS.map((a) => (
                  <button key={a} onClick={() => setForm(f => ({ ...f, activeTime: a }))}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all ${form.activeTime === a ? "border-[#2D6A4F] bg-[#E8F5EE] text-[#2D6A4F] font-medium" : "border-[#C8DDD2] text-[#6B7A6E] hover:border-[#6BAF8A]"}`}>
                    {a}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 核心痛点 */}
          <div>
            <label className="block text-xs font-medium text-[#6BAF8A] tracking-widest uppercase mb-1">
              核心痛点（最多选4个）
            </label>
            <p className="text-[10px] text-[#6B7A6E] mb-3">已选 {form.pains.length}/4</p>
            <div className="flex flex-wrap gap-2">
              {PAIN_OPTIONS.map((p) => (
                <button key={p} onClick={() => togglePain(p)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all ${form.pains.includes(p) ? "border-rose-400 bg-rose-50 text-rose-600 font-medium" : "border-[#C8DDD2] text-[#6B7A6E] hover:border-[#6BAF8A]"}`}>
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* 消费行为 */}
          <div>
            <label className="block text-xs font-medium text-[#6BAF8A] tracking-widest uppercase mb-3">粉丝消费行为偏好</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {CONSUME_OPTIONS.map((c) => (
                <button key={c} onClick={() => setForm(f => ({ ...f, consume: c }))}
                  className={`text-xs px-3 py-2 rounded-lg border transition-all text-center ${form.consume === c ? "border-[#2D6A4F] bg-[#E8F5EE] text-[#2D6A4F] font-medium" : "border-[#C8DDD2] text-[#6B7A6E] hover:border-[#6BAF8A]"}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleGenerate}
              disabled={!canGenerate}
              className="bg-[#1A2E22] text-white px-8 py-3 rounded-lg text-sm font-medium hover:bg-[#2D6A4F] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              生成画像 →
            </button>
          </div>
        </div>

        {/* Result */}
        {result && (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-[#1A2E22]">你的粉丝画像</h2>
                <p className="text-xs text-[#6B7A6E] mt-1">{result.persona.name}</p>
              </div>
              <button onClick={copyResult}
                className="text-xs border border-[#C8DDD2] text-[#6B7A6E] px-4 py-2 rounded-lg hover:border-[#2D6A4F] hover:text-[#2D6A4F] transition-colors">
                {copied ? "✓ 已复制" : "复制全部"}
              </button>
            </div>

            <div className="space-y-4">
              {/* 核心画像卡片 */}
              <div className="bg-[#1A2E22] rounded-xl p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "年龄层", value: result.persona.age },
                  { label: "性别偏向", value: result.persona.gender },
                  { label: "地域", value: result.persona.region || "全国均衡" },
                  { label: "活跃时段", value: result.persona.activeTime || "碎片化时间" },
                ].map((item) => (
                  <div key={item.label} className="text-center">
                    <p className="text-[10px] text-[#6BAF8A] mb-1">{item.label}</p>
                    <p className="text-xs font-bold text-white">{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="border border-[#C8DDD2] rounded-xl p-5">
                <p className="text-[10px] text-[#6BAF8A] font-medium mb-1">用户特征概述</p>
                <p className="text-xs text-[#3D5048] leading-relaxed">{result.persona.trait}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 心理特征 */}
                <div className="border border-[#C8DDD2] rounded-xl p-5">
                  <p className="text-xs text-[#6BAF8A] font-medium tracking-widest uppercase mb-4">心理特征</p>
                  <div className="space-y-3">
                    <div>
                      <p className="text-[10px] text-[#6BAF8A] font-medium mb-1">行为偏好</p>
                      <p className="text-xs text-[#3D5048] leading-relaxed">{result.psychology.gender}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-[#6BAF8A] font-medium mb-1.5">核心痛点</p>
                      <div className="flex flex-wrap gap-1.5">
                        {result.psychology.pains.map((p) => (
                          <span key={p} className="text-[10px] bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full font-medium">{p}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] text-[#6BAF8A] font-medium mb-1">行为动机</p>
                      <p className="text-xs text-[#3D5048] leading-relaxed">{result.psychology.motivation}</p>
                    </div>
                  </div>
                </div>

                {/* 行为特征 */}
                <div className="border border-[#C8DDD2] rounded-xl p-5">
                  <p className="text-xs text-[#6BAF8A] font-medium tracking-widest uppercase mb-4">行为特征</p>
                  <div className="space-y-3">
                    <div>
                      <p className="text-[10px] text-[#6BAF8A] font-medium mb-1">内容消费策略</p>
                      <p className="text-xs text-[#3D5048] leading-relaxed">{result.behavior.consume}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-[#6BAF8A] font-medium mb-1">指标优先级</p>
                      <p className="text-xs font-medium text-[#2D6A4F]">{result.behavior.priority}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-[#6BAF8A] font-medium mb-1">关注决策路径</p>
                      <p className="text-xs text-[#3D5048] leading-relaxed">{result.behavior.decision}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 内容策略 + 变现匹配 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-[#C8DDD2] rounded-xl p-5">
                  <p className="text-xs text-[#6BAF8A] font-medium tracking-widest uppercase mb-4">内容策略建议</p>
                  <div className="space-y-3">
                    {[
                      { label: "选题钩子", value: result.content.hook },
                      { label: "内容形式", value: result.content.format },
                      { label: "传播引爆点", value: result.content.viral },
                    ].map((r) => (
                      <div key={r.label}>
                        <p className="text-[10px] text-[#6BAF8A] font-medium mb-0.5">{r.label}</p>
                        <p className="text-xs text-[#3D5048] leading-relaxed">{r.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border border-[#C8DDD2] rounded-xl p-5">
                  <p className="text-xs text-[#6BAF8A] font-medium tracking-widest uppercase mb-4">变现路径匹配</p>
                  <div className="space-y-3">
                    {[
                      { label: "推荐变现路径", value: result.monetize.path },
                      { label: "预估付费转化率", value: result.monetize.rate },
                      { label: "信任建立节点", value: result.monetize.trust },
                    ].map((r) => (
                      <div key={r.label}>
                        <p className="text-[10px] text-[#6BAF8A] font-medium mb-0.5">{r.label}</p>
                        <p className="text-xs text-[#3D5048] leading-relaxed">{r.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-[#1A2E22] rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-white mb-1">想要更精准的受众分析？</p>
                <p className="text-xs text-[#A8D5BB]">加入社群，获取完整粉丝画像Excel模板 + 平台数据解读指南</p>
              </div>
              <Link href="/contact" className="shrink-0 text-xs bg-[#1B4332] border border-[#6BAF8A] text-white px-5 py-2.5 rounded-lg hover:bg-[#2D6A4F] transition-colors">
                加入社群
              </Link>
            </div>
          </>
        )}

        {/* AI Prompt */}
        <div className="mt-16 border-t border-[#C8DDD2] pt-14">
          <div className="mb-6">
            <p className="text-xs text-[#6BAF8A] font-medium tracking-widest uppercase mb-2">进阶方案</p>
            <h2 className="text-xl font-bold text-[#1A2E22] mb-2">用 AI 深度分析你的粉丝画像</h2>
            <p className="text-sm text-[#6B7A6E]">把下方提示词复制到 ChatGPT 或 Claude，结合你的真实平台数据，获得深度的受众分析报告。</p>
          </div>
          <div className="border border-[#C8DDD2] rounded-2xl overflow-hidden">
            <div className="bg-[#F7FBF8] border-b border-[#C8DDD2] px-5 py-3 flex items-center justify-between">
              <span className="text-xs font-medium text-[#1A2E22]">AI 提示词模板</span>
              <button
                onClick={() => { navigator.clipboard.writeText(AI_PROMPT); setCopiedPrompt(true); setTimeout(() => setCopiedPrompt(false), 2000); }}
                className="text-xs border border-[#C8DDD2] text-[#6B7A6E] px-4 py-1.5 rounded-lg hover:border-[#2D6A4F] hover:text-[#2D6A4F] transition-colors"
              >
                {copiedPrompt ? "✓ 已复制" : "复制提示词"}
              </button>
            </div>
            <div className="bg-white px-6 py-5">
              <pre className="text-[11px] text-[#3D5048] leading-relaxed whitespace-pre-wrap font-mono">{AI_PROMPT}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
