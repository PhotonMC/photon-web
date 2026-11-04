import { GAME_ID, launch } from "@/lib/directory";
import {
  NAME_COOKIE,
  gameCookie,
  newState,
  stateCookie,
  SESSION_COOKIE,
  clearCookie,
  fromThisHost,
  isHex32,
  readCookie,
  reply,
} from "@/lib/signin";

/**
 * Play: a POST, so a link on another site cannot make one. The session cookie only says who this
 * browser is; whether it may launch is the backend's answer, never the name cookie's.
 */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  // Lax cookies still go to same-site sibling hosts, so the request must be from this host. The
  // host comes from the headers the proxy sent, as Next's own server actions do; the runtime
  // rebuilds `request.url` differently in dev, on Workers and behind a proxy.
  if (!fromThisHost(request)) {
    return new Response("forbidden", { status: 403, headers: { "Cache-Control": "no-store" } });
  }
  const { id } = await params;
  if (!GAME_ID.test(id)) return reply(303, "/games");
  const session = readCookie(request.headers.get("cookie"), SESSION_COOKIE);
  if (!session) {
    // Not signed in: the sign-in starts here, and carries this game through it so the player lands
    // in the game, not on an account page.
    const state = newState();
    return reply(303, `photon://signin?state=${state}`, [stateCookie(state), gameCookie(id)]);
  }
  const answer = await launch(session, id);
  if (answer.status === 200 && isHex32(answer.code)) {
    return reply(303, `photon://launch?code=${answer.code.toLowerCase()}`);
  }
  if (answer.status === 401) {
    return reply(303, "/account", [clearCookie(SESSION_COOKIE), clearCookie(NAME_COOKIE)]);
  }
  // A throttled or unreachable backend is a moment's wait, not a failed sign-in.
  if (answer.status === 429 || answer.status === 503) return reply(303, `/games/${id}?later=1`);
  return reply(303, answer.status === 404 ? "/games" : "/signin/failed");
}
