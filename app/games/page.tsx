import { NoticePage } from "@/components/NoticePage";
import { listGames } from "@/lib/directory";

export const metadata = { title: "Games · Photon" };
export const dynamic = "force-dynamic";

export default async function Games() {
  const games = await listGames();
  if (!games) {
    return (
      <NoticePage title="Directory unavailable">
        <p>Photon&apos;s directory could not be reached. Try again in a moment.</p>
      </NoticePage>
    );
  }
  return (
    <main className="mx-auto flex min-h-dvh max-w-[960px] flex-col gap-6 px-5 py-10">
      <h1 className="text-[28px]">Games</h1>
      <ul className="grid gap-4 sm:grid-cols-2">
        {games.map((game) => (
          <li key={game.id} className="rounded border border-current/20 p-4">
            <a className="text-lg underline" href={`/games/${game.id}`}>
              {game.name}
            </a>
            <p className="text-muted">
              {game.players} online · {game.version}
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}
