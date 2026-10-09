import {
  LOGO_BARS,
  LOGO_SHADOW_OFFSET,
  LOGO_STROKE_WIDTH,
  LOGO_VIEWBOX,
  LOGO_VIEWBOX_HEIGHT,
  LOGO_VIEWBOX_WIDTH,
} from "@/lib/logo";

/**
 * Satori-compatible (ImageResponse) rendering of the logo mark, used by the
 * Open Graph image and the raster icons. Satori can't resolve CSS variables,
 * so colors are passed in as literals.
 */
export function LogoSvg({
  width,
  ink = "#0B0B0C",
  shadow = "#CDD0DA",
}: {
  width: number;
  ink?: string;
  shadow?: string;
}) {
  const o = LOGO_SHADOW_OFFSET;
  const height = Math.round((width * LOGO_VIEWBOX_HEIGHT) / LOGO_VIEWBOX_WIDTH);

  return (
    <svg
      width={width}
      height={height}
      viewBox={LOGO_VIEWBOX}
      fill="none"
      strokeWidth={LOGO_STROKE_WIDTH}
      strokeLinecap="butt"
    >
      {LOGO_BARS.map((b, i) => (
        <line
          key={`s${i}`}
          x1={b.x1 + o}
          y1={b.y1 + o}
          x2={b.x2 + o}
          y2={b.y2 + o}
          stroke={shadow}
        />
      ))}
      {LOGO_BARS.map((b, i) => (
        <line
          key={`m${i}`}
          x1={b.x1}
          y1={b.y1}
          x2={b.x2}
          y2={b.y2}
          stroke={ink}
        />
      ))}
    </svg>
  );
}
