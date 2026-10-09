import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { cacheLife } from "next/cache";
import { ImageResponse } from "next/og";
import { LogoSvg } from "@/lib/logo-image";

export const alt = "Photon — Minecraft client, coming soon";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function loadFigtree() {
  "use cache";
  cacheLife("max");
  const file = await readFile(
    join(process.cwd(), "app", "Figtree-ExtraBold.ttf"),
  );
  return Uint8Array.from(file).buffer;
}

export default async function OpenGraphImage() {
  const figtree = await loadFigtree();

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
          color: "#0B0B0C",
        }}
      >
        <div style={{ display: "flex", marginRight: 56 }}>
          <LogoSvg width={260} />
        </div>
        <div
          style={{
            display: "flex",
            fontFamily: "Figtree",
            fontWeight: 800,
            fontSize: 230,
            lineHeight: 0.85,
            letterSpacing: -11.5,
            textShadow: "10px 10px 0 #CDD0DA",
          }}
        >
          photon
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Figtree", data: figtree, weight: 800, style: "normal" }],
    },
  );
}
