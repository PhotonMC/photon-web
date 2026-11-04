import { GameCard } from "@/components/GameCard";
import { NoticePage } from "@/components/NoticePage";
import { listGames } from "@/lib/directory";

export const metadata = { title: "Games · Photon" };
export const dynamic = "force-dynamic";

export default async function Games() {
  const games = await listGames();
  if (!games) {
    return (
      <NoticePage title="Directory unavailable">
        <p>
          Photon&apos;s directory could not be reached. Try again in a moment.
        </p>
      </NoticePage>
    );
  }
  return (
    <main className="mx-auto flex max-w-[1100px] flex-col gap-8 px-5 py-10 sm:px-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-[32px] leading-tight font-extrabold">Games</h1>
        <p className="label-mono text-[12px]">{games.length} to play</p>
      </div>
      {games.length === 0 ? (
        <p className="card p-6 text-muted">No games are listed right now.</p>
      ) : (
        <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </ul>
      )}
    </main>
  );
}
