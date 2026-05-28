import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "内容库",
  description: "200+ 篇个人品牌干货，覆盖个人定位、视觉表达、内容运营、账号增长、平台策略、IP案例、工具方法7大模块。",
};

export default function LibraryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
