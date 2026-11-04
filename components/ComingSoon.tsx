import type { ReactNode } from "react";

/** A section that is not built yet says so, and invents nothing. */
export function ComingSoon({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <main className="mx-auto flex max-w-[720px] flex-col gap-6 px-5 py-12 sm:px-10">
      <p className="label-mono text-[12px]">Coming soon</p>
      <h1 className="text-[32px] leading-tight font-extrabold">{title}</h1>
      <p className="max-w-[560px] text-pretty text-muted">{children}</p>
    </main>
  );
}
