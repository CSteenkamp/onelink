import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Linkist — Your Internet, One Link";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 30%, #0f172a 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            background: "linear-gradient(90deg, #a855f7, #ec4899)",
            backgroundClip: "text",
            color: "transparent",
            marginBottom: 16,
          }}
        >
          Linkist
        </div>
        <div
          style={{
            fontSize: 32,
            color: "#94a3b8",
            maxWidth: 600,
            textAlign: "center",
            lineHeight: 1.4,
          }}
        >
          Your Internet, One Link
        </div>
        <div
          style={{
            fontSize: 20,
            color: "#64748b",
            marginTop: 24,
          }}
        >
          linkist.vip
        </div>
      </div>
    ),
    { ...size }
  );
}
