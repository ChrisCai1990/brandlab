import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "品牌拾研社 · BrandLab";
export const size = { width: 1200, height: 630 };
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
              background: "#40916c",
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
            <span style={{ fontSize: "14px", color: "#52b788" }}>BrandLab</span>
          </div>
        </div>

        {/* Headline — use flex column instead of <br /> */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            marginBottom: "24px",
          }}
        >
          <span style={{ fontSize: "60px", fontWeight: "bold", color: "white", lineHeight: 1.2 }}>
            每天一条干货，
          </span>
          <span style={{ fontSize: "60px", fontWeight: "bold", color: "white", lineHeight: 1.2 }}>
            帮你做出个人品牌
          </span>
        </div>

        {/* Subtitle */}
        <div style={{ display: "flex" }}>
          <span style={{ fontSize: "24px", color: "#74c69d" }}>
            专为创作者、超级个体、想靠账号变现的创业者
          </span>
        </div>

        {/* Tags */}
        <div style={{ display: "flex", gap: "12px", marginTop: "48px" }}>
          {["个人定位", "内容运营", "账号增长", "视觉表达", "工具方法"].map((tag) => (
            <div
              key={tag}
              style={{
                background: "#40916c",
                color: "#74c69d",
                fontSize: "16px",
                padding: "8px 18px",
                borderRadius: "999px",
                display: "flex",
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
