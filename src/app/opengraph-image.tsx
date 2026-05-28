import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "品牌拾研社 · BrandLab";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#1A2E22",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Logo badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "14px",
              background: "#2D6A4F",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "28px",
              fontWeight: "bold",
              color: "white",
            }}
          >
            拾
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "20px", fontWeight: "bold", color: "white" }}>品牌拾研社</span>
            <span style={{ fontSize: "14px", color: "#6BAF8A" }}>BrandLab</span>
          </div>
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: "60px",
            fontWeight: "bold",
            color: "white",
            lineHeight: 1.2,
            marginBottom: "24px",
            maxWidth: "800px",
          }}
        >
          每天一条干货，
          <br />
          帮你做出个人品牌
        </div>

        {/* Subtitle */}
        <div style={{ fontSize: "24px", color: "#A8D5BB", maxWidth: "700px" }}>
          专为创作者、超级个体、想靠账号变现的创业者
        </div>

        {/* Tags */}
        <div style={{ display: "flex", gap: "12px", marginTop: "48px" }}>
          {["个人定位", "内容运营", "账号增长", "视觉表达", "工具方法"].map((tag) => (
            <div
              key={tag}
              style={{
                background: "#2D6A4F",
                color: "#A8D5BB",
                fontSize: "16px",
                padding: "8px 18px",
                borderRadius: "999px",
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
