import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex",
          alignItems: "center", justifyContent: "center",
          background: "radial-gradient(circle at 35% 30%, #D97706 0%, #5C3A1E 55%, #0B0A09 100%)",
          color: "#F5F1EA", fontSize: 110, fontWeight: 400,
          fontFamily: "Georgia, serif", letterSpacing: -4,
        }}
      >
        E&amp;O
      </div>
    ),
    size
  );
}
