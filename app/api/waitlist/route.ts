import { z } from "zod";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { addToWaitlist } from "@/lib/waitlist-store";

const MAX_BODY_BYTES = 2_048;

const bodySchema = z.object({
  email: z.string(),
  // Honeypot: real users never see this field, so it must stay empty.
  website: z.string().optional(),
});

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .max(254)
  .pipe(z.email());

function respond(
  body: { ok: true } | { ok: false; error: string },
  status: number,
  headers?: Record<string, string>,
) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store", ...headers },
  });
}

export async function POST(request: Request) {
  // Rate-limit first, so malformed and honeypot hits count against the IP too.
  const limit = rateLimit(clientIp(request));
  if (!limit.ok) {
    return respond({ ok: false, error: "rate_limited" }, 429, {
      "Retry-After": String(limit.retryAfterSeconds),
    });
  }

  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > MAX_BODY_BYTES) {
    return respond({ ok: false, error: "payload_too_large" }, 413);
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return respond({ ok: false, error: "invalid_email" }, 400);
  }

  const body = bodySchema.safeParse(json);
  if (!body.success) {
    return respond({ ok: false, error: "invalid_email" }, 400);
  }

  // Bots that fill the honeypot get a convincing success and are dropped.
  if (body.data.website) {
    return respond({ ok: true }, 200);
  }

  const email = emailSchema.safeParse(body.data.email);
  if (!email.success) {
    return respond({ ok: false, error: "invalid_email" }, 400);
  }

  try {
    // Duplicates resolve successfully inside the store, so the response is
    // identical for new and existing addresses (no membership leak).
    await addToWaitlist(email.data);
  } catch (error) {
    console.error("[waitlist] failed to store signup", error);
    return respond({ ok: false, error: "server_error" }, 500);
  }

  return respond({ ok: true }, 200);
}
