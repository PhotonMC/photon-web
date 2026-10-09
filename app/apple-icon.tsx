import { ImageResponse } from "next/og";
import { LogoSvg } from "@/lib/logo-image";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
        <LogoSvg width={128} />
      </div>
    ),
    size,
  );
}
