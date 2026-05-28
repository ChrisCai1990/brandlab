"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#b2d8d5]">
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-[#134e4a] flex items-center justify-center">
            <span className="text-white text-xs font-bold">拾</span>
          </div>
          <div className="leading-tight">
            <div className="text-sm font-bold text-[#0d2e2c] tracking-wide">品牌拾研社</div>
            <div className="text-[10px] text-[#5eada7] tracking-widest font-medium">BrandLab</div>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { href: "/library", label: "内容库" },
            { href: "/tools", label: "工具资源" },
            { href: "/about", label: "关于我们" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-[#5a7e7c] hover:text-[#134e4a] transition-colors font-medium"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="text-sm bg-[#134e4a] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#0f766e] transition-colors"
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
          <span className={`block w-5 h-0.5 bg-[#0d2e2c] transition-all ${open ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-5 h-0.5 bg-[#0d2e2c] transition-all ${open ? "opacity-0" : ""}`} />
          <span className={`block w-5 h-0.5 bg-[#0d2e2c] transition-all ${open ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-[#b2d8d5] px-6 py-4 flex flex-col gap-4">
          {[
            { href: "/library", label: "内容库" },
            { href: "/tools", label: "工具资源" },
            { href: "/about", label: "关于我们" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-[#5a7e7c] hover:text-[#134e4a] font-medium"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="text-sm bg-[#134e4a] text-white px-4 py-2 rounded-lg font-medium text-center"
            onClick={() => setOpen(false)}
          >
            加入社群
          </Link>
        </div>
      )}
    </header>
  );
}
