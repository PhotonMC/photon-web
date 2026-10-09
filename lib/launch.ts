/**
 * Launch-date helpers. Pure functions, no `Date.now()` — callers pass the
 * current time in so these stay trivially testable and prerender-safe.
 */

// An ISO 8601 date-time that carries an explicit offset (`Z`, `+03:00`, `-0500`).
// Offset-less strings are rejected because `Date.parse` would silently
// interpret them in the viewer's local zone, making the launch moment differ
// from visitor to visitor.
const ISO_WITH_OFFSET =
  /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}(:?\d{2})?)$/i;

/** Returns the launch instant as epoch milliseconds, or `null` if unset/invalid. */
export function parseLaunchDate(value: string | undefined | null): number | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!ISO_WITH_OFFSET.test(trimmed)) return null;
  const ms = Date.parse(trimmed);
  return Number.isNaN(ms) ? null : ms;
}

export type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

/** Time remaining until `targetMs`, clamped at zero. */
export function timeLeft(targetMs: number, nowMs: number): TimeLeft {
  const total = Math.max(0, Math.floor((targetMs - nowMs) / 1000));
  return {
    days: Math.floor(total / 86_400),
    hours: Math.floor((total % 86_400) / 3_600),
    minutes: Math.floor((total % 3_600) / 60),
    seconds: total % 60,
  };
}
