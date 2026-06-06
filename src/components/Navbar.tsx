"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { BookmarkCount } from "@/components/BookmarkCount";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => setIsLoggedIn(r.ok))
      .catch(() => setIsLoggedIn(false));
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-black border-b border-[#1f1f1f]">
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 border border-[#333333] flex items-center justify-center">
            <span className="text-white text-xs font-bold">拾</span>
          </div>
          <div className="leading-tight">
            <div className="text-sm font-bold text-white tracking-wide">品牌拾研社</div>
            <div className="text-[10px] text-[#555555] tracking-widest font-medium">BrandLab</div>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {[
            { href: "/library", label: "内容库" },
            { href: "/member", label: "会员" },
            { href: "/tools", label: "工具资源" },
            { href: "/about", label: "关于我们" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-[#888888] hover:text-white transition-colors font-medium"
            >
              {item.label}
            </Link>
          ))}
          <BookmarkCount />
          <Link
            href={isLoggedIn ? "/account" : "/login"}
            className="text-sm text-[#888888] hover:text-white transition-colors font-medium"
          >
            {isLoggedIn ? "账户" : "登录"}
          </Link>
          <Link
            href="/contact"
            className="text-sm border border-white text-white px-4 py-2 font-medium hover:bg-white hover:text-black transition-colors"
          >
            加入社群
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setOpen(!open)}
          aria-label="菜单"
        >
          <span className={`block w-5 h-0.5 bg-white transition-all ${open ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-5 h-0.5 bg-white transition-all ${open ? "opacity-0" : ""}`} />
          <span className={`block w-5 h-0.5 bg-white transition-all ${open ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-black border-t border-[#1f1f1f] px-6 py-4 flex flex-col gap-4">
          {[
            { href: "/library", label: "内容库" },
            { href: "/member", label: "会员" },
            { href: "/tools", label: "工具资源" },
            { href: "/about", label: "关于我们" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-[#888888] hover:text-white font-medium"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <BookmarkCount />
          <Link
            href={isLoggedIn ? "/account" : "/login"}
            className="text-sm text-[#888888] hover:text-white font-medium"
            onClick={() => setOpen(false)}
          >
            {isLoggedIn ? "账户" : "登录"}
          </Link>
          <Link
            href="/contact"
            className="text-sm border border-white text-white px-4 py-2 font-medium text-center hover:bg-white hover:text-black transition-colors"
            onClick={() => setOpen(false)}
          >
            加入社群
          </Link>
        </div>
      )}
    </header>
  );
}
