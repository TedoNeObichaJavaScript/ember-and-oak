import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex",
          alignItems: "center", justifyContent: "center",
          background: "radial-gradient(circle at 35% 30%, #D97706 0%, #5C3A1E 55%, #0B0A09 100%)",
          color: "#F5F1EA", fontSize: 38, fontWeight: 500,
          fontFamily: "Georgia, serif",
        }}
      >
        E
      </div>
    ),
    size
  );
}
