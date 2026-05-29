import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "公众号排版转换器",
  description: "把 HTML 模板一键转为微信公众号原生格式，背景色、圆角、flex 布局完整保留，复制粘贴即可发布。",
  openGraph: {
    title: "公众号排版转换器 · 品牌拾研社 BrandLab",
    description: "把 HTML 模板一键转为微信公众号原生格式，背景色、圆角、flex 布局完整保留，复制粘贴即可发布。",
    url: "https://brandlab.ink/tools/wechat",
    images: [
      {
        url: "https://brandlab.ink/tools/wechat/opengraph-image",
        width: 300,
        height: 300,
        alt: "公众号排版转换器 · 品牌拾研社 BrandLab",
      },
    ],
  },
  twitter: {
    card: "summary",
    images: ["https://brandlab.ink/tools/wechat/opengraph-image"],
  },
};

export default function WechatToolLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
