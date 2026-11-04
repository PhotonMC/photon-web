/**
 * Website sign-in (ADR 0023). The browser starts the flow with a state only it holds, the game
 * proves the player and opens `/signin?code=` here, and this server swaps the code plus the state
 * for a session at the backend. The browser's JavaScript never calls the backend, and the state
 * is made here, never taken from a request.
 */

const production = process.env.NODE_ENV === "production";

// `__Host-` keeps a subdomain from planting the cookie; it needs Secure, so only in production.
const prefix = production ? "__Host-" : "";
export const STATE_COOKIE = `${prefix}photon_state`;
export const SESSION_COOKIE = `${prefix}photon_session`;
/** The player's name, to show; it is not a secret and grants nothing. */
export const NAME_COOKIE = "photon_name";

const STATE_SECONDS = 120;
const SESSION_SECONDS = 60 * 60 * 24 * 7;

export const NO_STORE_HEADERS = {
  "Cache-Control": "no-store",
  // The code is in the address, so the next page must not hear of it.
  "Referrer-Policy": "no-referrer",
};

/** The backend's address: server-only, never a `NEXT_PUBLIC_` variable. */
export function backendUrl(): string | null {
  const value = process.env.PHOTON_BACKEND_URL;
  return value ? value.replace(/\/+$/, "") : null;
}

export function isHex32(value: string | null | undefined): value is string {
  return typeof value === "string" && /^[0-9a-f]{32}$/i.test(value);
}

/** A state no browser has: real ones are 128 random bits. */
export const NO_STATE = "0".repeat(32);

/** 16 random bytes in hex. */
export function newState(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function attributes(maxAge: number): string {
  // Lax, not Strict: the browser the game opens is a navigation another app started, and a Strict
  // cookie is not reliably sent on that.
  return `Path=/; Max-Age=${maxAge}; HttpOnly; SameSite=Lax${production ? "; Secure" : ""}`;
}

export function setCookie(name: string, value: string, seconds: number): string {
  return `${name}=${value}; ${attributes(seconds)}`;
}

export const stateCookie = (state: string) => setCookie(STATE_COOKIE, state, STATE_SECONDS);
export const sessionCookie = (session: string) => setCookie(SESSION_COOKIE, session, SESSION_SECONDS);
export const clearCookie = (name: string) => `${name}=; ${attributes(0)}`;

export function nameCookie(name: string): string {
  return `${NAME_COOKIE}=${encodeURIComponent(name)}; Path=/; Max-Age=${SESSION_SECONDS}; SameSite=Lax${production ? "; Secure" : ""}`;
}

export function readCookie(header: string | null, name: string): string | null {
  for (const part of (header ?? "").split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return rest.join("=");
  }
  return null;
}

/** A response with the headers every sign-in answer carries, and any number of cookies. */
export function reply(status: number, location: string | null, cookies: string[] = []): Response {
  const headers = new Headers(NO_STORE_HEADERS);
  if (location) headers.set("Location", location);
  for (const cookie of cookies) headers.append("Set-Cookie", cookie);
  return new Response(null, { status, headers });
}

export type Exchange = { session: string; name: string };

/** Spends a web code at the backend. Nothing is logged: the code, the state and the session are secrets. */
export async function exchange(code: string, state: string): Promise<Exchange | null> {
  const base = backendUrl();
  if (!base) return null;
  try {
    const answer = await fetch(`${base}/v1/web/exchange`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, state }),
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });
    if (!answer.ok) return null;
    const body = (await answer.json()) as { session?: unknown; name?: unknown };
    if (typeof body.session !== "string" || typeof body.name !== "string") return null;
    return { session: body.session, name: body.name };
  } catch {
    return null;
  }
}
