"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <button
      onClick={handleLogout}
      className="text-xs text-[#5a7e7c] border border-[#b2d8d5] px-3 py-2 rounded-lg hover:border-red-300 hover:text-red-500 transition-colors"
    >
      退出
    </button>
  );
}
