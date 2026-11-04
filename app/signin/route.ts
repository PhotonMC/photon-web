import {
  STATE_COOKIE,
  clearCookie,
  exchange,
  NO_STATE,
  isHex32,
  nameCookie,
  readCookie,
  reply,
  sessionCookie,
} from "@/lib/signin";

/**
 * The game opens this with a web code. The code and the cookie's state are swapped for a session
 * on the server; the answer is only ever a redirect, so the address that carries the code is never
 * a page that loads anything.
 */
export async function GET(request: Request) {
  const code = new URL(request.url).searchParams.get("code");
  const state = readCookie(request.headers.get("cookie"), STATE_COOKIE);
  const spent = clearCookie(STATE_COOKIE);
  if (!isHex32(state)) {
    // No state of this browser's own: the code came with a state somebody else chose. It is spent
    // against a state that cannot match, so it cannot be used by whoever holds the real one.
    if (isHex32(code)) await exchange(code.toLowerCase(), NO_STATE);
    return reply(303, "/signin/browser");
  }
  if (!isHex32(code)) return reply(303, "/signin/failed", [spent]);
  const signedIn = await exchange(code.toLowerCase(), state.toLowerCase());
  if (!signedIn) return reply(303, "/signin/failed", [spent]);
  return reply(303, "/account", [
    spent,
    sessionCookie(signedIn.session),
    nameCookie(signedIn.name),
  ]);
}
