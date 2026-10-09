import {
  LOGO_BARS,
  LOGO_PULSE_STAGGER,
  LOGO_SHADOW_OFFSET,
  LOGO_STROKE_WIDTH,
  LOGO_VIEWBOX,
} from "@/lib/logo";

type LogoMarkProps = {
  className?: string;
  /** Accessible name. Omit when the mark is purely decorative (default). */
  title?: string;
};

/**
 * The Photon burst: five straight bars, each drawn twice — a hard-offset
 * shadow copy, then the main bar in `currentColor`. Bars pulse in sequence
 * (see `.logo-bar` in globals.css; disabled under prefers-reduced-motion).
 */
export function LogoMark({ className, title }: LogoMarkProps) {
  const o = LOGO_SHADOW_OFFSET;

  return (
    <svg
      viewBox={LOGO_VIEWBOX}
      className={className}
      fill="none"
      strokeWidth={LOGO_STROKE_WIDTH}
      strokeLinecap="butt"
      overflow="visible"
      focusable="false"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      {LOGO_BARS.map((bar, i) => (
        <g
          key={i}
          className="logo-bar"
          style={{ animationDelay: `${(i * LOGO_PULSE_STAGGER).toFixed(1)}s` }}
        >
          <line
            x1={bar.x1 + o}
            y1={bar.y1 + o}
            x2={bar.x2 + o}
            y2={bar.y2 + o}
            style={{ stroke: "var(--shadow)" }}
          />
          <line
            x1={bar.x1}
            y1={bar.y1}
            x2={bar.x2}
            y2={bar.y2}
            stroke="currentColor"
          />
        </g>
      ))}
    </svg>
  );
}
