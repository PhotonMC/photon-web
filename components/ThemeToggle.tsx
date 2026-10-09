"use client";

import { useLayoutEffect, useEffect } from "react";
import {
  applyTheme,
  readStoredTheme,
  systemPrefersDark,
  writeStoredTheme,
} from "@/lib/theme";

/**
 * Theme toggle. The pre-paint inline script in the root layout sets the initial
 * `.dark` class; this component only handles user overrides.
 *
 * The aria-label is static on purpose: the server can't know the active theme,
 * and a state-dependent label would cause a hydration mismatch.
 */
export function ThemeToggle() {
  // Re-assert the theme after hydration. A no-op in production, but React
  // Strict Mode's dev remount can reset <html> attributes set by the script.
  useLayoutEffect(() => {
    const stored = readStoredTheme();
    applyTheme(stored ? stored === "dark" : systemPrefersDark());
  }, []);

  // Follow live OS changes until the visitor makes an explicit choice.
  useEffect(() => {
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (event: MediaQueryListEvent) => {
      if (!readStoredTheme()) applyTheme(event.matches);
    };
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  function toggle() {
    const nextIsDark = !document.documentElement.classList.contains("dark");
    applyTheme(nextIsDark);
    writeStoredTheme(nextIsDark ? "dark" : "light");
  }

  return (
    <button
      type="button"
      className="btn btn-outline btn-icon"
      onClick={toggle}
      aria-label="Toggle light and dark theme"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        aria-hidden="true"
        focusable="false"
      >
        <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" />
        <path d="M10 2a8 8 0 0 0 0 16V2z" fill="currentColor" />
      </svg>
    </button>
  );
}
