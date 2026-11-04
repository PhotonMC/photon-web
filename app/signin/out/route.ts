import {
  NAME_COOKIE,
  SESSION_COOKIE,
  clearCookie,
  fromThisHost,
  readCookie,
  revoke,
  reply,
} from "@/lib/signin";

/**
 * Signing out is a POST from this site, so another site cannot do it with a link. The session is
 * ended at the backend, and the cookies go whatever the backend says.
 */
export async function POST(request: Request) {
  if (!fromThisHost(request)) {
    return new Response("forbidden", { status: 403, headers: { "Cache-Control": "no-store" } });
  }
  const session = readCookie(request.headers.get("cookie"), SESSION_COOKIE);
  if (session) await revoke(session);
  return reply(303, "/", [clearCookie(SESSION_COOKIE), clearCookie(NAME_COOKIE)]);
}
