import { Countdown } from "@/components/Countdown";
import { LogoMark } from "@/components/LogoMark";
import { ThemeToggle } from "@/components/ThemeToggle";
import { WaitlistForm } from "@/components/WaitlistForm";
import { TAGLINE, TAGLINE_EMPHASIS, siteConfig } from "@/lib/config";

const FOOTER_ITEMS = [
  "Rust",
  "WASM Sandbox",
  "Hot Reload",
  "Auto-Sync",
  "1:1 Parity",
];

const headerLinkClass =
  "label-mono inline-flex min-h-11 items-center text-[12px] tracking-[0.24em] underline-offset-[6px] hover:text-ink hover:underline";

function ExternalLink({ href, children }: { href?: string; children: string }) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={headerLinkClass}
    >
      {children}&nbsp;↗
    </a>
  );
}

export default function Home() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 px-5 py-6 sm:px-10">
        <span className="label-mono text-[12px] tracking-[0.32em]">
          Status · Building
        </span>
        <nav
          aria-label="Community"
          className="ml-auto flex items-center gap-4 sm:gap-6"
        >
          <ExternalLink href={siteConfig.githubUrl}>GitHub</ExternalLink>
          <ExternalLink href={siteConfig.discordUrl}>Discord</ExternalLink>
          <ThemeToggle />
        </nav>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-5 py-10 text-center">
        <div className="flex flex-col items-center justify-center gap-x-10 gap-y-8 sm:flex-row">
          <LogoMark className="h-auto w-[200px] shrink-0 text-ink" />
          <h1 className="wordmark">photon</h1>
        </div>

        <p className="label-mono mt-8 -translate-x-3 sm:-translate-x-6 font-mono text-base tracking-[0.42em]">
          Minecraft client
        </p>

        <p className="mt-10 max-w-[640px] text-[22px] leading-snug text-pretty text-muted">
          {TAGLINE}{" "}
          <strong className="font-bold text-ink">{TAGLINE_EMPHASIS}</strong>
        </p>

        <div className="mt-12">
          <Countdown target={siteConfig.launchDate} />
        </div>

        <div className="mt-12 flex w-full justify-center">
          <WaitlistForm />
        </div>
      </main>

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
