import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${SITE_NAME} - Free ATS-friendly resume builder`;

// Satori (next/og) shudhu flexbox bojhe: ek er beshi child thakle display: "flex" dite hobe.
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          padding: 80,
          background: "#6D65E9",
          color: "#fff",
        }}
      >
        {/* Left: text */}
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 640 }}>
          <div style={{ fontSize: 36, fontWeight: 700, opacity: 0.85 }}>
            {SITE_NAME}
          </div>
          <div
            style={{
              fontSize: 68,
              fontWeight: 700,
              lineHeight: 1.1,
              marginTop: 24,
            }}
          >
            Free ATS-Friendly Resume Builder
          </div>
          <div style={{ fontSize: 30, opacity: 0.85, marginTop: 28 }}>
            Smart templates and AI-powered guidance.
          </div>
        </div>

        {/* Right: resume card illustration */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: 330,
            height: 430,
            padding: 32,
            background: "#fff",
            borderRadius: 24,
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: 36,
                background: "#6D65E9",
              }}
            />
            <div style={{ display: "flex", flexDirection: "column", marginLeft: 20 }}>
              <div style={{ width: 130, height: 16, borderRadius: 8, background: "#2b2b3c" }} />
              <div style={{ width: 90, height: 12, borderRadius: 6, background: "#c9c6f7", marginTop: 12 }} />
            </div>
          </div>

          <div style={{ width: 120, height: 14, borderRadius: 7, background: "#6D65E9", marginTop: 40 }} />
          <div style={{ width: "100%", height: 10, borderRadius: 5, background: "#e5e5ef", marginTop: 20 }} />
          <div style={{ width: "92%", height: 10, borderRadius: 5, background: "#e5e5ef", marginTop: 12 }} />
          <div style={{ width: "76%", height: 10, borderRadius: 5, background: "#e5e5ef", marginTop: 12 }} />

          <div style={{ width: 120, height: 14, borderRadius: 7, background: "#6D65E9", marginTop: 36 }} />
          <div style={{ width: "100%", height: 10, borderRadius: 5, background: "#e5e5ef", marginTop: 20 }} />
          <div style={{ width: "84%", height: 10, borderRadius: 5, background: "#e5e5ef", marginTop: 12 }} />
        </div>
      </div>
    ),
    { ...size }
  );
}