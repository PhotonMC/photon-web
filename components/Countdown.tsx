"use client";

import { useSyncExternalStore } from "react";
import { parseLaunchDate, timeLeft } from "@/lib/launch";

/** Ticks once per wall-clock second, aligned to the second boundary. */
function subscribe(onChange: () => void) {
  let timer: ReturnType<typeof setTimeout>;
  const tick = () => {
    onChange();
    timer = setTimeout(tick, 1000 - (Date.now() % 1000) + 5);
  };
  timer = setTimeout(tick, 1000 - (Date.now() % 1000) + 5);
  return () => clearTimeout(timer);
}

/** Whole seconds since epoch — stable within a second, so React can bail out. */
const getSnapshot = () => Math.floor(Date.now() / 1000);

/** Server (and hydration) value: no clock, so the markup renders `--`. */
const getServerSnapshot = () => null;

const pad = (n: number) => String(n).padStart(2, "0");

const PLACEHOLDER = "--";

type CountdownProps = {
  /** ISO 8601 with timezone, e.g. `2026-12-01T18:00:00+03:00`. */
  target?: string;
};

export function Countdown({ target }: CountdownProps) {
  const nowSeconds = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const targetMs = parseLaunchDate(target);

  const values =
    targetMs === null || nowSeconds === null
      ? null
      : timeLeft(targetMs, nowSeconds * 1000);

  const cells = [
    { label: "Days", value: values && pad(values.days) },
    { label: "Hours", value: values && pad(values.hours) },
    { label: "Min", value: values && pad(values.minutes) },
    { label: "Sec", value: values && pad(values.seconds) },
  ];

  return (
    <div
      role="timer"
      aria-label="Time until launch"
      className="grid grid-cols-[repeat(2,120px)] justify-center gap-4 sm:grid-cols-[repeat(4,120px)]"
    >
      {cells.map(({ label, value }) => (
        <div
          key={label}
          className="card flex w-[120px] flex-col items-center px-2 py-4"
        >
          <span className="font-mono text-5xl leading-none font-bold tabular-nums">
            {value ?? PLACEHOLDER}
          </span>
          {/* Trailing letter-spacing is balanced with equal left padding so the
              label stays optically centered. */}
          <span className="label-mono mt-3 pl-[0.3em] text-[11px] leading-none tracking-[0.3em]">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
