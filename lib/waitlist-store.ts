import "server-only";

/**
 * Waitlist storage, backed by Resend Contacts.
 *
 * Env:
 *   RESEND_API_KEY     (required in production)
 *   RESEND_SEGMENT_ID  (optional) segment the contact is added to
 *
 * Resend keys contacts by email, so a repeat signup is a no-op on their side
 * and dedupe needs no extra state here. Callers must treat "already on the
 * list" exactly like "newly added" to avoid leaking membership.
 *
 * To use a different backend (e.g. Postgres + Drizzle) replace the body of
 * `addToWaitlist`; the route handler only depends on its signature.
 */

const RESEND_CONTACTS_URL = "https://api.resend.com/contacts";

export async function addToWaitlist(email: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY?.trim();

  if (!apiKey) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("RESEND_API_KEY is not configured");
    }
    // Local development: no provider configured, accept and log instead.
    console.info(`[waitlist] (dev, not persisted) ${email}`);
    return;
  }

  const segmentId = process.env.RESEND_SEGMENT_ID?.trim();

  const response = await fetch(RESEND_CONTACTS_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      unsubscribed: false,
      ...(segmentId ? { segments: [{ id: segmentId }] } : {}),
    }),
    signal: AbortSignal.timeout(8_000),
    cache: "no-store",
  });

  if (response.ok) return;

  const detail = await response.text().catch(() => "");
  // Treat "already exists" as success (dedupe).
  if (response.status === 409 || /already exist/i.test(detail)) return;

  throw new Error(`Resend responded ${response.status}: ${detail.slice(0, 300)}`);
}
