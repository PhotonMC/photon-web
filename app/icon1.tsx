import { ImageResponse } from "next/og";
import { LogoSvg } from "@/lib/logo-image";

// PNG fallback for browsers without SVG favicon support (the adaptive
// light/dark favicon lives in icon.svg).
export const size = { width: 96, height: 96 };
export const contentType = "image/png";

export default function IconPng() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#FFFFFF",
        }}
      >
        <LogoSvg width={80} />
      </div>
    ),
    size,
  );
}
