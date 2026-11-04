import { NAME_COOKIE, SESSION_COOKIE, clearCookie, reply } from "@/lib/signin";

/** Signing out is a POST, so another site cannot do it with a link. The backend has no revoke yet. */
export function POST() {
  return reply(303, "/", [clearCookie(SESSION_COOKIE), clearCookie(NAME_COOKIE)]);
}
