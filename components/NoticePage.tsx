import type { ReactNode } from "react";

/** A plain page for the sign-in's endings: a heading, a line, and what to do next. */
export function NoticePage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <main className="flex min-h-[60dvh] flex-col items-center justify-center gap-6 px-5 py-10 text-center">
      <h1 className="text-[28px] leading-tight">{title}</h1>
      <div className="max-w-[520px] text-pretty text-muted">{children}</div>
    </main>
  );
}
