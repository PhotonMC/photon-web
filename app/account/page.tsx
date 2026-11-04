import { cookies } from "next/headers";
import { NoticePage } from "@/components/NoticePage";
import { NAME_COOKIE, SESSION_COOKIE } from "@/lib/signin";

export const metadata = { title: "Account · Photon", robots: { index: false } };

/** The name cookie is the browser's to set, so a bad escape must not break the page. */
function shown(name: string): string {
  try {
    return decodeURIComponent(name);
  } catch {
    return name;
  }
}

export default async function Account() {
  const store = await cookies();
  const name = store.get(NAME_COOKIE)?.value;
  if (!store.get(SESSION_COOKIE) || !name) {
    return (
      <NoticePage title="Not signed in">
        <p>
          <a className="underline" href="/signin/start">
            Sign in with the game
          </a>
        </p>
      </NoticePage>
    );
  }
  return (
    <NoticePage title={`Signed in as ${shown(name)}`}>
      <form action="/signin/out" method="post">
        <button type="submit" className="underline">
          Sign out
        </button>
      </form>
    </NoticePage>
  );
}
