"use client";

import { useState } from "react";

export function ShareButtons({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);

  function copyLink() {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const weiboUrl = `https://service.weibo.com/share/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title + " - 品牌拾研社")}`;

  return (
    <div className="flex items-center gap-2 mt-8 pt-6 border-t border-[#95d5b2]">
      <span className="text-[10px] text-[#6b7280] font-medium tracking-widest uppercase shrink-0">分享</span>
      <button onClick={copyLink}
        className="text-xs border border-[#95d5b2] text-[#6b7280] px-3 py-1.5 rounded-lg hover:border-[#40916c] hover:text-[#40916c] transition-colors">
        {copied ? "✓ 已复制链接" : "复制链接"}
      </button>
      <a href={weiboUrl} target="_blank" rel="noopener noreferrer"
        className="text-xs border border-[#95d5b2] text-[#6b7280] px-3 py-1.5 rounded-lg hover:border-[#40916c] hover:text-[#40916c] transition-colors">
        分享到微博
      </a>
    </div>
  );
}
