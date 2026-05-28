import { ImageResponse } from "next/og";
import { getArticleBySlug } from "@/lib/articles";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  const title = article?.title ?? "品牌拾研社";
  const tag = article?.tag ?? "";
  const desc = article?.desc ?? "每天一条干货，帮你做出个人品牌";

  return new ImageResponse(
    (
      <div
        style={{
          background: "#1A2E22",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top: tag */}
        {tag && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#6BAF8A",
              }}
            />
            <span style={{ fontSize: "18px", color: "#6BAF8A", fontWeight: "600" }}>{tag}</span>
          </div>
        )}

        {/* Middle: title + desc */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              fontSize: title.length > 20 ? "44px" : "52px",
              fontWeight: "bold",
              color: "white",
              lineHeight: 1.3,
              maxWidth: "900px",
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: "22px",
              color: "#A8D5BB",
              lineHeight: 1.5,
              maxWidth: "800px",
            }}
          >
            {desc}
          </div>
        </div>

        {/* Bottom: branding */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: "#2D6A4F",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
                fontWeight: "bold",
                color: "white",
              }}
            >
              拾
            </div>
            <span style={{ fontSize: "18px", color: "#6BAF8A" }}>品牌拾研社 · BrandLab</span>
          </div>
          <span style={{ fontSize: "16px", color: "#3D5048" }}>brandlab.cn</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
