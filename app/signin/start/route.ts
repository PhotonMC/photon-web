import { newState, reply, stateCookie } from "@/lib/signin";

/**
 * Begins a sign-in: a state of this server's own making goes into an HttpOnly cookie and into the
 * link that opens the game. The state grants nothing by itself, and one is never taken from the
 * request, so an attacker cannot fix a victim's state in advance.
 */
export function GET() {
  const state = newState();
  return reply(302, `photon://signin?state=${state}`, [stateCookie(state)]);
}
