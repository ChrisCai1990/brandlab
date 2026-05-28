import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
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
          padding: "64px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div
            style={{
              width: 48,
              height: 48,
              background: "#2D6A4F",
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 24,
              fontWeight: 700,
            }}
          >
            拾
          </div>
          <div>
            <div style={{ color: "white", fontSize: 18, fontWeight: 700 }}>品牌拾研社</div>
            <div style={{ color: "#6BAF8A", fontSize: 12, letterSpacing: "0.1em" }}>BrandLab</div>
          </div>
        </div>

        {/* Headline */}
        <div>
          <div
            style={{
              color: "#6BAF8A",
              fontSize: 14,
              fontWeight: 500,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              marginBottom: 20,
            }}
          >
            每日更新 · 个人品牌干货社区
          </div>
          <div
            style={{
              color: "white",
              fontSize: 52,
              fontWeight: 800,
              lineHeight: 1.2,
              maxWidth: 800,
            }}
          >
            每天一条干货，
            <br />
            帮你把账号做成有影响力的个人品牌
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ color: "#A8D5BB", fontSize: 16 }}>
            拾起每一条干货，研出你的个人品牌。
          </div>
          <div
            style={{
              background: "#1B4332",
              border: "1px solid #6BAF8A",
              color: "white",
              fontSize: 14,
              fontWeight: 600,
              padding: "10px 24px",
              borderRadius: 8,
            }}
          >
            brandlab.cn
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
