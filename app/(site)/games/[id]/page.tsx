import { notFound } from "next/navigation";
import { GameCard } from "@/components/GameCard";
import { GameThumb } from "@/components/GameThumb";
import { NoticePage } from "@/components/NoticePage";
import { findGame, listGames } from "@/lib/directory";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const game = await findGame((await params).id);
  return { title: game ? `${game.name} · Photon` : "Game · Photon" };
}

export const dynamic = "force-dynamic";

export default async function Game({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ later?: string }>;
}) {
  const { id } = await params;
  const { later } = await searchParams;
  const game = await findGame(id);
  if (game === undefined) notFound();
  if (game === null) {
    return (
      <NoticePage title="Directory unavailable">
        <p>
          Photon&apos;s directory could not be reached. Try again in a moment.
        </p>
      </NoticePage>
    );
  }
  const [video] = game.videos;
  const others = ((await listGames()) ?? [])
    .filter((other) => other.id !== game.id)
    .slice(0, 3);
  return (
    <main className="mx-auto flex max-w-[960px] flex-col gap-8 px-5 py-10 sm:px-10">
      <div className="card overflow-hidden">
        {video ? (
          // An uploaded file from the operator's host: nothing is fetched until play.
          <video
            src={video}
            controls
            preload="metadata"
            poster={game.images[0]}
            className="aspect-video w-full bg-ink"
          />
        ) : (
          <GameThumb game={game} className="border-b-0" />
        )}
      </div>

      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-[32px] leading-tight font-extrabold">
            {game.name}
          </h1>
          <p className="label-mono text-[12px]">
            {game.players} online · {game.version}
          </p>
        </div>
        {/* Play stays a POST form: the origin check of the route depends on it. */}
        <form method="post" action={`/games/${game.id}/play`}>
          <button type="submit" className="btn px-10 py-4 text-xl">
            Play
          </button>
        </form>
      </div>

      {later === "1" && (
        <p role="status" className="card p-4 text-muted">
          Photon is busy right now. Try Play again in a moment.
        </p>
      )}

      {game.description && (
        <p className="max-w-[640px] text-pretty text-muted">
          {game.description}
        </p>
      )}

      {game.images.length > 0 && (
        <div className="flex flex-wrap gap-4">
          {game.images.map((src) => (
            // Operator pictures come from their own hosts; no referrer is sent to them.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={src}
              src={src}
              alt=""
              referrerPolicy="no-referrer"
              className="max-h-48 rounded-card border-2 border-ink"
            />
          ))}
        </div>
      )}

      {others.length > 0 && (
        <section className="flex flex-col gap-4">
          <h2 className="label-mono text-[12px]">Other games</h2>
          <ul className="grid gap-8 sm:grid-cols-3">
            {others.map((other) => (
              <GameCard key={other.id} game={other} />
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
