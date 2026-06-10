import { ImageResponse } from "next/og";
import { BAT_PATH } from "@/components/atmosphere/BatMark";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/** Favicon: the original night-mark on void, amber-lit. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#050507",
          borderRadius: 12,
        }}
      >
        <svg width="52" height="26" viewBox="0 0 200 100" fill="#f5b21a">
          <path d={BAT_PATH} />
        </svg>
      </div>
    ),
    size,
  );
}
