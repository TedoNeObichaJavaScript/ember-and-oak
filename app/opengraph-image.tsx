import { ImageResponse } from "next/og";

export const alt = "Ember & Oak — Wood-Fired Bistro";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex", flexDirection: "column",
          padding: 80, justifyContent: "space-between",
          background: "linear-gradient(135deg, #0B0A09 0%, #1A1614 60%, #5C3A1E 100%)",
          color: "#F5F1EA", fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 22, letterSpacing: 6, textTransform: "uppercase", color: "#D97706" }}>
          <div style={{ width: 10, height: 10, borderRadius: 999, background: "#D97706" }} />
          Est. 2024 · Wood-Fired Bistro
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 130, lineHeight: 1, letterSpacing: -5, fontWeight: 300 }}>Smoke, oak, and</div>
          <div style={{ fontSize: 130, lineHeight: 1, letterSpacing: -5, fontWeight: 300, fontStyle: "italic", color: "#D97706" }}>
            the season&rsquo;s best.
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", fontSize: 26 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ fontSize: 36, letterSpacing: -1 }}>Ember &amp; Oak</div>
            <div style={{ color: "#F5F1EAaa", fontSize: 22 }}>412 Birch Lane · Wed–Sun</div>
          </div>
          <div style={{ display: "flex", gap: 40, color: "#F5F1EAcc", fontSize: 22 }}>
            <div style={{ display: "flex", flexDirection: "column" }}><span style={{ color: "#D97706", fontSize: 56 }}>32</span><span>seats</span></div>
            <div style={{ display: "flex", flexDirection: "column" }}><span style={{ color: "#D97706", fontSize: 56 }}>12</span><span>farms</span></div>
            <div style={{ display: "flex", flexDirection: "column" }}><span style={{ color: "#D97706", fontSize: 56 }}>1</span><span>hearth</span></div>
          </div>
        </div>
      </div>
    ),
    size
  );
}
