import { cookies } from "next/headers";
import { ThemeToggle } from "@/components/ThemeToggle";
import { shownName } from "@/components/SiteHeader";
import { NAME_COOKIE, SESSION_COOKIE } from "@/lib/signin";

export const metadata = {
  title: "Settings · Photon",
  robots: { index: false },
};

export default async function Settings() {
  const store = await cookies();
  const name = store.get(NAME_COOKIE)?.value;
  const signedIn = Boolean(store.get(SESSION_COOKIE) && name);
  return (
    <main className="mx-auto flex max-w-[720px] flex-col gap-8 px-5 py-12 sm:px-10">
      <h1 className="text-[32px] leading-tight font-extrabold">Settings</h1>

      <section
        className="card flex flex-col gap-4 p-6"
        aria-labelledby="appearance"
      >
        <h2 id="appearance" className="label-mono text-[12px]">
          Appearance
        </h2>
        <div className="flex items-center justify-between gap-4">
          <p className="text-muted">Light or dark, on this device.</p>
          <ThemeToggle />
        </div>
      </section>

      <section
        className="card flex flex-col gap-4 p-6"
        aria-labelledby="account"
      >
        <h2 id="account" className="label-mono text-[12px]">
          Account
        </h2>
        {signedIn && name ? (
          <>
            <p>
              Signed in as <strong>{shownName(name)}</strong>
            </p>
            <form action="/signin/out" method="post">
              <button type="submit" className="btn btn-outline px-5">
                Sign out
              </button>
            </form>
          </>
        ) : (
          <>
            <p className="text-muted">Not signed in on this browser.</p>
            <a href="/signin/start" className="btn w-fit px-5">
              Sign in with the game
            </a>
          </>
        )}
      </section>
    </main>
  );
}
