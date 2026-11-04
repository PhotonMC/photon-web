import { cookies } from "next/headers";
import Link from "next/link";
import { LogoMark } from "@/components/LogoMark";
import { NavLinks } from "@/components/NavLinks";
import { ThemeToggle } from "@/components/ThemeToggle";
import { NAME_COOKIE, SESSION_COOKIE } from "@/lib/signin";

/** The name cookie is the browser's to set, so a bad escape must not break the page. */
export function shownName(name: string): string {
  try {
    return decodeURIComponent(name);
  } catch {
    return name;
  }
}

/** The bar every page of the site shares: where you are, where you can go, and who you are. */
export async function SiteHeader() {
  const store = await cookies();
  const name = store.get(NAME_COOKIE)?.value;
  const signedIn = Boolean(store.get(SESSION_COOKIE) && name);
  return (
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-[1100px] flex-wrap items-center gap-x-8 gap-y-1 px-5 py-3 sm:px-10">
        <Link
          href="/games"
          aria-label="Photon"
          className="flex min-h-11 items-center gap-3"
        >
          <LogoMark className="h-auto w-9 shrink-0 text-ink" />
          <span className="text-[22px] leading-none font-extrabold tracking-tight">
            photon
          </span>
        </Link>
        <NavLinks />
        <div className="ml-auto flex items-center gap-4">
          {signedIn && name ? (
            <a
              href="/settings"
              className="label-mono inline-flex min-h-11 items-center text-[12px] tracking-[0.24em] text-ink"
            >
              {shownName(name)}
            </a>
          ) : (
            <a
              href="/signin/start"
              className="btn btn-outline min-h-11 px-4 text-[14px]"
            >
              Sign in
            </a>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
