export const THEME_STORAGE_KEY = "photon-theme";

/**
 * Inline script, injected into <head>, that sets the `dark` class on <html>
 * before first paint. Saved choice wins; otherwise the system preference.
 */
export const themeInitScript = `(function(){try{var s=localStorage.getItem("${THEME_STORAGE_KEY}");var d=s?s==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.classList.toggle("dark",d)}catch(e){}})()`;

export function readStoredTheme(): "light" | "dark" | null {
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
}

export function writeStoredTheme(theme: "light" | "dark"): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Storage unavailable (private mode, blocked) — the choice just won't persist.
  }
}

export function systemPrefersDark(): boolean {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function applyTheme(dark: boolean): void {
  document.documentElement.classList.toggle("dark", dark);
}
