import { ImageResponse } from "next/og";
import { profile, hero } from "@/lib/content";

export const alt = `${profile.name} — ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "70px",
          background:
            "radial-gradient(80% 70% at 50% 110%, #15120a 0%, #0b0b0f 55%, #050507 100%)",
          color: "#e8e6e0",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 22,
            letterSpacing: 8,
            color: "#f5b21a",
          }}
        >
          <span>{hero.kicker}</span>
          <span style={{ color: "#6b7280" }}>{profile.status}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 110,
              fontWeight: 800,
              lineHeight: 1,
              textTransform: "uppercase",
              letterSpacing: -2,
            }}
          >
            {profile.name}
          </div>
          <div style={{ display: "flex", marginTop: 24, alignItems: "center" }}>
            <div
              style={{ width: 70, height: 4, background: "#f5b21a", marginRight: 20 }}
            />
            <div style={{ fontSize: 32, color: "rgba(232,230,224,0.75)" }}>
              {profile.tagline}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 20, letterSpacing: 6, color: "#6b7280" }}>
          {`${profile.role.toUpperCase()} — BUILT AFTER DARK`}
        </div>
      </div>
    ),
    size,
  );
}
