import type { ReactNode } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { FOOTER_ITEMS } from "@/lib/config";

/** The shell of every page except the waitlist: the navigation bar, the page, the footer. */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <div className="flex-1">{children}</div>
      <footer className="label-mono border-t border-line px-5 py-5 text-center text-[12px] leading-relaxed">
        {FOOTER_ITEMS.map((item, i) => (
          <span key={item}>
            {i > 0 ? " ✦ " : null}
            <span className="whitespace-nowrap">{item}</span>
          </span>
        ))}
      </footer>
    </div>
  );
}
