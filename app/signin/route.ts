import { GAME_ID, launch } from "@/lib/directory";
import {
  GAME_COOKIE,
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
  const game = readCookie(request.headers.get("cookie"), GAME_COOKIE);
  const spentGame = clearCookie(GAME_COOKIE);
  if (!isHex32(state)) {
    // No state of this browser's own: the code came with a state somebody else chose. It is spent
    // against a state that cannot match, so it cannot be used by whoever holds the real one.
    if (isHex32(code)) await exchange(code.toLowerCase(), NO_STATE);
    return reply(303, "/signin/browser", [spentGame]);
  }
  if (!isHex32(code)) return reply(303, "/signin/failed", [spent, spentGame]);
  const signedIn = await exchange(code.toLowerCase(), state.toLowerCase());
  if (!signedIn) return reply(303, "/signin/failed", [spent, spentGame]);
  const cookies = [spent, spentGame, sessionCookie(signedIn.session), nameCookie(signedIn.name)];
  return reply(303, await next(game, signedIn.session), cookies);
}

/** Where a fresh sign-in goes: into the game the Play press was for, else to the account page. */
async function next(game: string | null, session: string): Promise<string> {
  if (game === null || !GAME_ID.test(game)) return "/account";
  const answer = await launch(session, game);
  if (answer.status === 200 && isHex32(answer.code)) {
    return `photon://launch?code=${answer.code.toLowerCase()}`;
  }
  // The launch did not work out: the game's page has Play beside the signed-in state.
  return `/games/${game}`;
}
