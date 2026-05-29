import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "品牌拾研社 · BrandLab";
export const size = { width: 300, height: 300 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#2d6a4f",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 48,
          color: "white",
          fontSize: 140,
          fontWeight: 700,
          fontFamily: "sans-serif",
        }}
      >
        拾
      </div>
    ),
    { ...size }
  );
}
