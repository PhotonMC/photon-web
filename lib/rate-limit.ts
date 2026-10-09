/**
 * Fixed-window, in-memory rate limiter keyed by client IP.
 *
 * Limitation: state lives in the memory of a single server instance. On
 * serverless platforms (Vercel) each warm instance keeps its own counters, so
 * this is a best-effort brake on casual abuse, not a hard guarantee. Swap the
 * body of `rateLimit` for a shared store (e.g. Upstash Redis) if you need
 * strict global limits — the call site won't change.
 */

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;
const MAX_TRACKED_IPS = 10_000;

type Entry = { count: number; resetAt: number };

const hits = new Map<string, Entry>();

function sweep(now: number) {
  for (const [key, entry] of hits) {
    if (entry.resetAt <= now) hits.delete(key);
  }
}

export type RateLimitResult =
  | { ok: true }
  | { ok: false; retryAfterSeconds: number };

export function rateLimit(key: string, now: number = Date.now()): RateLimitResult {
  if (hits.size >= MAX_TRACKED_IPS) {
    sweep(now);
    // Still full of live entries: drop the oldest rather than grow unbounded.
    if (hits.size >= MAX_TRACKED_IPS) {
      const oldest = hits.keys().next().value;
      if (oldest !== undefined) hits.delete(oldest);
    }
  }

  const entry = hits.get(key);
  if (!entry || entry.resetAt <= now) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true };
  }

  entry.count += 1;
  if (entry.count > MAX_REQUESTS) {
    return {
      ok: false,
      retryAfterSeconds: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)),
    };
  }
  return { ok: true };
}

/** Best-effort client IP from proxy headers; falls back to a shared bucket. */
export function clientIp(request: Request): string {
  const headers = request.headers;
  const cf = headers.get("cf-connecting-ip");
  if (cf) return cf.trim();
  const direct =
    headers.get("x-vercel-forwarded-for") ?? headers.get("x-real-ip");
  if (direct) return direct.trim();
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return "unknown";
}
