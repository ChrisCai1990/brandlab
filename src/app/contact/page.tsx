import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "联系合作",
  description: "加入品牌拾研社创作者社群，或洽谈内容合作、课程合作、投稿等商务事宜。",
};

const cooperationTypes = [
  {
    title: "内容合作",
    desc: "产品测评 / 联名内容 / 话题共创，欢迎有调性的品牌合作",
    icon: "✍️",
  },
  {
    title: "课程合作",
    desc: "与个人品牌相关的课程联合推广或联合出品",
    icon: "🎓",
  },
  {
    title: "工具推荐",
    desc: "专为创作者设计的工具或SaaS产品，可以聊聊",
    icon: "🛠️",
  },
  {
    title: "社群活动",
    desc: "线上活动、直播连线、社群共创等形式均可探讨",
    icon: "🌐",
  },
];

const platforms = [
  { name: "小红书", handle: "@品牌拾研社", desc: "主阵地，每日更新" },
  { name: "微信公众号", handle: "品牌拾研社", desc: "深度长文，周更" },
  { name: "抖音", handle: "@BrandLab", desc: "短视频，知识分享" },
];

export default function ContactPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-[#1A2E22] py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs text-[#6BAF8A] font-medium tracking-widest uppercase mb-4">联系 / 合作</p>
          <h1 className="text-4xl font-bold text-white mb-4">
            一起做有意思的事
          </h1>
          <p className="text-base text-[#A8D5BB]">
            欢迎投稿、商务合作、加入社群，或者只是来打个招呼。
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: WeChat & Platforms */}
          <div className="space-y-8">
            {/* WeChat */}
            <div>
              <p className="text-xs text-[#6BAF8A] font-medium tracking-widest uppercase mb-4">加入社群</p>
              <div className="border border-[#C8DDD2] rounded-xl p-6">
                <div className="flex items-start gap-5">
                  <Image
                    src="/qrcode.png"
                    alt="微信二维码"
                    width={112}
                    height={112}
                    className="rounded-xl shrink-0"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-[#1A2E22] mb-2">扫码加微信</h3>
                    <p className="text-xs text-[#6B7A6E] leading-relaxed mb-3">
                      加微信备注「社群」，即可加入品牌拾研社创作者社群，免费获取3套模板。
                    </p>
                    <div className="space-y-1">
                      <p className="text-xs text-[#6B7A6E] flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-[#6BAF8A]" />
                        免费获取3套创作模板
                      </p>
                      <p className="text-xs text-[#6B7A6E] flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-[#6BAF8A]" />
                        5000+ 创作者社群交流
                      </p>
                      <p className="text-xs text-[#6B7A6E] flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-[#6BAF8A]" />
                        第一时间获取新内容
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Platforms */}
            <div>
              <p className="text-xs text-[#6BAF8A] font-medium tracking-widest uppercase mb-4">找到我们</p>
              <div className="space-y-3">
                {platforms.map((p) => (
                  <div key={p.name} className="flex items-center justify-between border border-[#C8DDD2] rounded-xl px-5 py-4 hover:border-[#6BAF8A] transition-colors">
                    <div>
                      <div className="text-sm font-medium text-[#1A2E22]">{p.name}</div>
                      <div className="text-xs text-[#6B7A6E] mt-0.5">{p.desc}</div>
                    </div>
                    <div className="text-xs text-[#6BAF8A] font-medium">{p.handle}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Cooperation */}
          <div className="space-y-8">
            {/* Cooperation types */}
            <div>
              <p className="text-xs text-[#6BAF8A] font-medium tracking-widest uppercase mb-4">商务合作</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                {cooperationTypes.map((c) => (
                  <div key={c.title} className="border border-[#C8DDD2] rounded-xl p-4">
                    <div className="text-xl mb-2">{c.icon}</div>
                    <h3 className="text-xs font-bold text-[#1A2E22] mb-1">{c.title}</h3>
                    <p className="text-[10px] text-[#6B7A6E] leading-relaxed">{c.desc}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-[#6B7A6E]">
                商务合作请加微信，备注「合作」，我们会在48小时内回复。
              </p>
            </div>

            {/* Submission */}
            <div className="bg-[#E8F5EE] border border-[#C8DDD2] rounded-xl p-6">
              <p className="text-xs text-[#6BAF8A] font-medium tracking-widest uppercase mb-3">投稿</p>
              <h3 className="text-sm font-bold text-[#1A2E22] mb-2">你有干货，我们来传播</h3>
              <p className="text-xs text-[#6B7A6E] leading-relaxed mb-4">
                如果你在个人品牌、账号运营、IP变现方面有实战经验，欢迎投稿。我们接受：案例复盘 / 方法论分享 / 工具测评。
              </p>
              <div className="text-xs text-[#2D6A4F] font-medium">
                投稿邮箱：submit@brandlab.cn
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
