/**
 * Logo mark geometry — single source of truth, shared by the inline SVG
 * component, the generated icons and the Open Graph image.
 * (`app/icon.svg` is static and mirrors these numbers.)
 */

export const LOGO_VIEWBOX = "0 0 260 250";
export const LOGO_VIEWBOX_WIDTH = 260;
export const LOGO_VIEWBOX_HEIGHT = 250;
export const LOGO_STROKE_WIDTH = 14;
/** Each bar has a shadow copy offset by this many units on both axes. */
export const LOGO_SHADOW_OFFSET = 7;

export type LogoBar = { x1: number; y1: number; x2: number; y2: number };

export const LOGO_BARS: readonly LogoBar[] = [
  { x1: 140, y1: 15, x2: 132, y2: 90 },
  { x1: 13, y1: 78, x2: 83, y2: 113 },
  { x1: 170, y1: 127, x2: 242, y2: 117 },
  { x1: 90, y1: 168, x2: 38, y2: 222 },
  { x1: 140, y1: 163, x2: 192, y2: 237 },
];

/** Seconds between each bar's pulse start. */
export const LOGO_PULSE_STAGGER = 0.7;
