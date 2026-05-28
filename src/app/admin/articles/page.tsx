import Link from "next/link";
import { prisma } from "@/lib/db";
import { LogoutButton } from "@/components/admin/LogoutButton";

export const dynamic = "force-dynamic";

export default async function AdminArticlesPage() {
  const articles = await prisma.article.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, tag: true, published: true, date: true, slug: true },
  });

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold text-[#1A2E22]">内容管理</h1>
          <p className="text-xs text-[#6B7A6E] mt-0.5">共 {articles.length} 篇文章</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="text-xs text-[#6B7A6E] border border-[#C8DDD2] px-3 py-2 rounded-lg hover:border-[#6BAF8A] transition-colors"
          >
            查看网站 ↗
          </Link>
          <LogoutButton />
          <Link
            href="/admin/articles/new"
            className="text-xs bg-[#1A2E22] text-white px-4 py-2 rounded-lg hover:bg-[#2D6A4F] transition-colors font-medium"
          >
            + 新建文章
          </Link>
        </div>
      </div>

      {/* Article list */}
      <div className="bg-white border border-[#C8DDD2] rounded-2xl overflow-hidden">
        {articles.length === 0 ? (
          <div className="text-center py-16 text-[#6B7A6E]">
            <p className="text-sm mb-4">还没有文章</p>
            <Link
              href="/admin/articles/new"
              className="text-xs text-[#2D6A4F] hover:text-[#1B4332] font-medium"
            >
              创建第一篇文章 →
            </Link>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#C8DDD2] bg-[#F7FBF8]">
                <th className="text-left text-[10px] text-[#6B7A6E] font-medium tracking-widest uppercase px-5 py-3">标题</th>
                <th className="text-left text-[10px] text-[#6B7A6E] font-medium tracking-widest uppercase px-4 py-3 hidden md:table-cell">分类</th>
                <th className="text-left text-[10px] text-[#6B7A6E] font-medium tracking-widest uppercase px-4 py-3 hidden md:table-cell">状态</th>
                <th className="text-left text-[10px] text-[#6B7A6E] font-medium tracking-widest uppercase px-4 py-3 hidden lg:table-cell">日期</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F5F2]">
              {articles.map((a) => (
                <tr key={a.id} className="hover:bg-[#F7FBF8] transition-colors group">
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-[#1A2E22] line-clamp-1">{a.title}</p>
                    <p className="text-[10px] text-[#6B7A6E] mt-0.5">/library/{a.slug}</p>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#E8F5EE] text-[#2D6A4F]">
                      {a.tag}
                    </span>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                      a.published
                        ? "bg-green-50 text-green-600"
                        : "bg-gray-100 text-gray-500"
                    }`}>
                      {a.published ? "已发布" : "草稿"}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-xs text-[#6B7A6E] hidden lg:table-cell">
                    {new Date(a.date).toLocaleDateString("zh-CN")}
                  </td>
                  <td className="px-4 py-4">
                    <Link
                      href={`/admin/articles/${a.id}/edit`}
                      className="text-xs text-[#2D6A4F] hover:text-[#1B4332] font-medium"
                    >
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
