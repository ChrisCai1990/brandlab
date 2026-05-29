export type Category =
  | "个人定位"
  | "视觉表达"
  | "内容运营"
  | "账号增长"
  | "平台策略"
  | "IP案例"
  | "工具方法";

export interface Article {
  slug: string;
  tag: Category;
  title: string;
  desc: string;
  date: string;
  readTime: string;
  sections: {
    pain: string;
    formula: string;
    steps: { title: string; body: string }[];
    caseStudy: string;
    pitfalls: string[];
    action: string;
  };
}

export const categories = [
  "个人定位",
  "视觉表达",
  "内容运营",
  "账号增长",
  "平台策略",
  "IP案例",
  "工具方法",
] as const;
