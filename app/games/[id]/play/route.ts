import { GAME_ID, launch } from "@/lib/directory";
import {
  NAME_COOKIE,
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
  if (!session) return reply(303, "/account");
  const answer = await launch(session, id);
  if (answer.status === 200 && isHex32(answer.code)) {
    return reply(303, `photon://launch?code=${answer.code.toLowerCase()}`);
  }
  if (answer.status === 401) {
    return reply(303, "/account", [clearCookie(SESSION_COOKIE), clearCookie(NAME_COOKIE)]);
  }
  return reply(303, answer.status === 404 ? "/games" : "/signin/failed");
}
