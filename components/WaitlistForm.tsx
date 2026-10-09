"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success" }
  | { kind: "error"; message: string };

// Deliberately loose; the server does the authoritative zod validation.
const LOOSE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MESSAGES = {
  invalid: "Please enter a valid email address.",
  rateLimited: "Too many attempts. Please try again in a few minutes.",
  server: "Something went wrong on our side. Please try again.",
} as const;

export function WaitlistForm() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const inputId = useId();
  const errorId = useId();
  const successRef = useRef<HTMLDivElement>(null);

  // The form unmounts on success, which would drop keyboard focus onto <body>.
  // Move it to the confirmation instead.
  useEffect(() => {
    if (status.kind === "success") successRef.current?.focus();
  }, [status.kind]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status.kind === "submitting") return;

    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") ?? "").trim();
    const website = String(data.get("website") ?? "");

    if (!LOOSE_EMAIL.test(email) || email.length > 254) {
      setStatus({ kind: "error", message: MESSAGES.invalid });
      return;
    }

    setStatus({ kind: "submitting" });
    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, website }),
      });

      if (response.ok) {
        setStatus({ kind: "success" });
      } else if (response.status === 400) {
        setStatus({ kind: "error", message: MESSAGES.invalid });
      } else if (response.status === 429) {
        setStatus({ kind: "error", message: MESSAGES.rateLimited });
      } else {
        setStatus({ kind: "error", message: MESSAGES.server });
      }
    } catch {
      setStatus({ kind: "error", message: MESSAGES.server });
    }
  }

  const submitting = status.kind === "submitting";
  const error = status.kind === "error" ? status.message : null;

  return (
    <div className="w-full max-w-[560px]">
      {/* Persistent live region: it must already be in the DOM when its content
          changes for screen readers to announce the result. */}
      <div role="status" aria-live="polite">
        {status.kind === "success" ? (
          <div
            ref={successRef}
            tabIndex={-1}
            className="card flex min-h-14 items-center justify-center px-5 py-4 text-lg font-semibold"
          >
            ✓ You&apos;re on the list. We&apos;ll email you at launch.
          </div>
        ) : null}
      </div>

      {status.kind !== "success" ? (
        <form onSubmit={onSubmit} noValidate>
          <div className="flex flex-col gap-4 sm:flex-row">
            <label htmlFor={inputId} className="sr-only">
              Email address
            </label>
            <input
              id={inputId}
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@example.com"
              required
              maxLength={254}
              className="field sm:flex-1"
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? errorId : undefined}
            />

            {/* Honeypot: invisible to people, tempting to bots. */}
            <div
              aria-hidden="true"
              className="absolute -left-[9999px] h-px w-px overflow-hidden"
            >
              <label>
                Leave this field empty
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </label>
            </div>

            <button
              type="submit"
              className="btn h-14 shrink-0 px-7 text-lg"
              disabled={submitting}
            >
              {submitting ? "Joining…" : "Join the waitlist"}
            </button>
          </div>

          {error ? (
            <p
              id={errorId}
              role="alert"
              className="mt-4 text-left text-base font-semibold"
            >
              {error}
            </p>
          ) : null}
        </form>
      ) : null}
    </div>
  );
}
