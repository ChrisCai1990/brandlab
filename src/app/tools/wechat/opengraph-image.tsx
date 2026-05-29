import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "公众号排版转换器 · 品牌拾研社 BrandLab";
export const size = { width: 300, height: 300 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#1b4332",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "16px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Logo badge */}
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "20px",
            background: "#40916c",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "40px",
            fontWeight: "bold",
            color: "white",
          }}
        >
          拾
        </div>

        {/* Brand name */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
          <span style={{ fontSize: "18px", fontWeight: "bold", color: "white" }}>
            品牌拾研社
          </span>
          <span style={{ fontSize: "12px", color: "#52b788", letterSpacing: "2px" }}>
            BrandLab
          </span>
        </div>

        {/* Tool label */}
        <div
          style={{
            background: "#2d6a4f",
            color: "#74c69d",
            fontSize: "13px",
            padding: "6px 16px",
            borderRadius: "999px",
            display: "flex",
          }}
        >
          公众号排版转换器
        </div>
      </div>
    ),
    { ...size }
  );
}
