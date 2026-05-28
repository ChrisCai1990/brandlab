import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "关于我们",
  description: "品牌拾研社的品牌故事、创始人IP与核心信念。认真做内容的人，在这里相遇。",
};

const beliefs = [
  {
    title: "专业不等于难看",
    desc: "干货可以很好看。我们相信有审美的内容，才能让人真正停下来读。",
  },
  {
    title: "认真是最好的策略",
    desc: "不追热点，不凑字数。每一条干货，我们都认真写、反复改。",
  },
  {
    title: "实用胜过正确",
    desc: "理论没用，能用才有用。我们只分享你今天就能执行的方法。",
  },
  {
    title: "个人品牌是长期主义",
    desc: "不谈一夜爆红，只讲慢慢变强。个人品牌是你最值得投资的资产。",
  },
];

const timeline = [
  { year: "2023 Q1", event: "品牌拾研社创立，开始在小红书发布个人品牌干货" },
  { year: "2023 Q3", event: "粉丝突破1万，推出第一套内容排期模板，反响热烈" },
  { year: "2023 Q4", event: "拓展至公众号和抖音，内容体系扩展为7大模块" },
  { year: "2024 Q1", event: "社群创作者突破5000人，正式上线品牌拾研社官网" },
];

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-[#0d2e2c] py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs text-[#5eada7] font-medium tracking-widest uppercase mb-4">关于我们</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            认真做内容的人，<br />
            <span className="text-[#5eada7]">在这里相遇</span>
          </h1>
          <p className="text-base text-[#99ceca] max-w-xl leading-relaxed">
            品牌拾研社是一个专注于个人品牌打造的内容社区。我们相信，每一个认真做内容的人，都值得拥有属于自己的影响力。
          </p>
        </div>
      </div>

      {/* Brand story */}
      <div className="py-20 px-6 border-b border-[#b2d8d5]">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs text-[#5eada7] font-medium tracking-widest uppercase mb-4">品牌故事</p>
              <h2 className="text-2xl font-bold text-[#0d2e2c] mb-5">从「想清楚」到「做出来」</h2>
              <div className="space-y-4 text-sm text-[#5a7e7c] leading-relaxed">
                <p>
                  2023年初，我们发现一个现象：很多人知道个人品牌很重要，但不知道从哪里开始，也不知道具体怎么做。市面上的内容要么太虚，要么太碎，缺乏真正能执行的系统方法。
                </p>
                <p>
                  于是我们开始做品牌拾研社——每天一条干货，专注个人品牌的打造与账号运营。不说废话，只讲能用的。
                </p>
                <p>
                  「拾」代表每天积累，「研」代表深度思考。我们相信，认真把每一条干货拾起来，终能研出自己的个人品牌。
                </p>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-4">
              {timeline.map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#0f766e] mt-1 shrink-0" />
                    {i < timeline.length - 1 && <div className="w-px flex-1 bg-[#b2d8d5] mt-1" />}
                  </div>
                  <div className="pb-5">
                    <div className="text-xs font-medium text-[#5eada7] mb-1">{item.year}</div>
                    <div className="text-sm text-[#0d2e2c]">{item.event}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Beliefs */}
      <div className="bg-[#e6f4f3] py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs text-[#5eada7] font-medium tracking-widest uppercase mb-3">我们相信什么</p>
            <h2 className="text-3xl font-bold text-[#0d2e2c]">这是我们做内容的底层逻辑</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {beliefs.map((b, i) => (
              <div key={i} className="bg-white border border-[#b2d8d5] rounded-xl p-7">
                <div className="w-6 h-0.5 bg-[#0f766e] mb-4" />
                <h3 className="text-base font-bold text-[#0d2e2c] mb-3">{b.title}</h3>
                <p className="text-sm text-[#5a7e7c] leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Founder */}
      <div className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs text-[#5eada7] font-medium tracking-widest uppercase mb-3">创始人IP</p>
            <h2 className="text-3xl font-bold text-[#0d2e2c]">认识我们的创始人</h2>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-10 bg-[#e6f4f3] border border-[#b2d8d5] rounded-2xl p-8">
            <div className="w-24 h-24 rounded-full bg-[#134e4a] flex items-center justify-center shrink-0">
              <span className="text-white text-2xl font-bold">拾</span>
            </div>
            <div>
              <div className="text-base font-bold text-[#0d2e2c] mb-1">品牌拾研社 · 创始人</div>
              <div className="text-xs text-[#5eada7] mb-4">个人品牌策略师 · 内容创作者</div>
              <p className="text-sm text-[#5a7e7c] leading-relaxed">
                深耕个人品牌领域5年，服务过100+ 创作者和超级个体的账号搭建。相信好的内容应该兼具实用性和审美，专注帮创作者找到属于自己的差异化定位和变现路径。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
