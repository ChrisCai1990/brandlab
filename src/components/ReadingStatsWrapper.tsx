"use client";

import dynamic from "next/dynamic";

const ReadingStats = dynamic(() => import("@/components/ReadingStats").then((m) => m.ReadingStats), { ssr: false });

export function ReadingStatsWrapper({ total }: { total: number }) {
  return <ReadingStats total={total} />;
}
