import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "内容库",
  description: "个人品牌干货内容库，覆盖个人定位、视觉表达、内容运营、账号增长、平台策略、IP案例、工具方法、变现路径、私域运营9大模块。",
};

export default function LibraryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
