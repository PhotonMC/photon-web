/**
 * Site-wide configuration. Everything environment-specific lives here so the
 * components stay free of `process.env` lookups.
 *
 * `NEXT_PUBLIC_*` values are inlined at build time, so they must be referenced
 * with the literal `process.env.NEXT_PUBLIC_X` form.
 */

export const TAGLINE =
  "Minecraft, rebuilt from scratch in Rust. Hot-loaded WASM mods, servers that ship their own mods, and 100% vanilla parity.";

export const TAGLINE_EMPHASIS = "Coming soon.";

export const DESCRIPTION = `${TAGLINE} ${TAGLINE_EMPHASIS}`;

export const TITLE = "Photon — Coming soon";

function clean(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function resolveSiteUrl(): string {
  const explicit = clean(process.env.NEXT_PUBLIC_SITE_URL);
  if (explicit) return explicit;
  const vercel = clean(process.env.VERCEL_PROJECT_PRODUCTION_URL);
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

export const siteConfig = {
  /** ISO 8601 with timezone, e.g. `2026-12-01T18:00:00+03:00`. */
  launchDate: clean(process.env.NEXT_PUBLIC_LAUNCH_DATE),
  githubUrl: clean(process.env.NEXT_PUBLIC_GITHUB_URL),
  discordUrl: clean(process.env.NEXT_PUBLIC_DISCORD_URL),
  siteUrl: resolveSiteUrl(),
} as const;
