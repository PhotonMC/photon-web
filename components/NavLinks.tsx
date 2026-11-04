"use client";

import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/games", label: "Games" },
  { href: "/avatar", label: "Avatar" },
  { href: "/marketplace", label: "Marketplace" },
  { href: "/settings", label: "Settings" },
] as const;

/** The sections of the site; the one the visitor is in is underlined. */
export function NavLinks({ className = "" }: { className?: string }) {
  const path = usePathname();
  return (
    <nav
      aria-label="Sections"
      className={`flex flex-wrap items-center gap-x-4 gap-y-1 sm:gap-x-7 ${className}`}
    >
      {LINKS.map(({ href, label }) => {
        const here = path === href || path.startsWith(`${href}/`);
        return (
          <a
            key={href}
            href={href}
            aria-current={here ? "page" : undefined}
            className={`label-mono inline-flex min-h-11 items-center text-[12px] tracking-[0.14em] underline-offset-[10px] sm:tracking-[0.24em] hover:text-ink hover:underline ${
              here ? "text-ink underline decoration-2" : ""
            }`}
          >
            {label}
          </a>
        );
      })}
    </nav>
  );
}
