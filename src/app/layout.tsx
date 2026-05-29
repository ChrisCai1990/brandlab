import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "品牌拾研社 · BrandLab",
    template: "%s · 品牌拾研社",
  },
  description: "每天一条干货，帮你把账号做成有影响力的个人品牌。专为创作者、超级个体、想靠账号变现的创业者。",
  metadataBase: new URL("https://brandlab.ink"),
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: "品牌拾研社 · BrandLab",
    title: "品牌拾研社 · BrandLab",
    description: "每天一条干货，帮你把账号做成有影响力的个人品牌。专为创作者、超级个体、想靠账号变现的创业者。",
    url: "https://brandlab.ink",
    images: [
      {
        url: "https://brandlab.ink/opengraph-image",
        width: 1200,
        height: 630,
        alt: "品牌拾研社 · BrandLab",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://brandlab.ink/opengraph-image"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
