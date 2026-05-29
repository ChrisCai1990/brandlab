import Link from "next/link";
import { connectDB } from "@/lib/db";
import { Article } from "@/lib/models";
import { LogoutButton } from "@/components/admin/LogoutButton";

export const dynamic = "force-dynamic";

export default async function AdminArticlesPage() {
  await connectDB();
  const raw = await Article.find().sort({ createdAt: -1 }).select("title tag published date slug").lean();
  const articles = raw.map((a) => ({
    id: String(a._id),
    title: a.title,
    tag: a.tag,
    published: a.published,
    date: a.date,
    slug: a.slug,
  }));

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold text-[#1b4332]">内容管理</h1>
          <p className="text-xs text-[#6b7280] mt-0.5">共 {articles.length} 篇文章</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/" target="_blank"
            className="text-xs text-[#6b7280] border border-[#95d5b2] px-3 py-2 rounded-lg hover:border-[#52b788] transition-colors">
            查看网站 ↗
          </Link>
          <Link href="/admin/settings"
            className="text-xs text-[#6b7280] border border-[#95d5b2] px-3 py-2 rounded-lg hover:border-[#52b788] transition-colors">
            设置
          </Link>
          <LogoutButton />
          <Link href="/admin/articles/new"
            className="text-xs bg-[#1b4332] text-white px-4 py-2 rounded-lg hover:bg-[#40916c] transition-colors font-medium">
            + 新建文章
          </Link>
        </div>
      </div>

      <div className="bg-white border border-[#95d5b2] rounded-2xl overflow-hidden">
        {articles.length === 0 ? (
          <div className="text-center py-16 text-[#6b7280]">
            <p className="text-sm mb-4">还没有文章</p>
            <Link href="/admin/articles/new" className="text-xs text-[#40916c] hover:text-[#2d6a4f] font-medium">
              创建第一篇文章 →
            </Link>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#95d5b2] bg-[#f0faf4]">
                <th className="text-left text-[10px] text-[#6b7280] font-medium tracking-widest uppercase px-5 py-3">标题</th>
                <th className="text-left text-[10px] text-[#6b7280] font-medium tracking-widest uppercase px-4 py-3 hidden md:table-cell">分类</th>
                <th className="text-left text-[10px] text-[#6b7280] font-medium tracking-widest uppercase px-4 py-3 hidden md:table-cell">状态</th>
                <th className="text-left text-[10px] text-[#6b7280] font-medium tracking-widest uppercase px-4 py-3 hidden lg:table-cell">日期</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F5F2]">
              {articles.map((a) => (
                <tr key={a.id} className="hover:bg-[#f0faf4] transition-colors group">
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-[#1b4332] line-clamp-1">{a.title}</p>
                    <p className="text-[10px] text-[#6b7280] mt-0.5">/library/{a.slug}</p>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#f0faf4] text-[#40916c]">
                      {a.tag}
                    </span>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                      a.published ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500"
                    }`}>
                      {a.published ? "已发布" : "草稿"}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-xs text-[#6b7280] hidden lg:table-cell">
                    {new Date(a.date).toLocaleDateString("zh-CN")}
                  </td>
                  <td className="px-4 py-4">
                    <Link href={`/admin/articles/${a.id}/edit`}
                      className="text-xs text-[#40916c] hover:text-[#2d6a4f] font-medium">
                      编辑
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
