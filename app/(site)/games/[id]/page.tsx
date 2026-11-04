import { notFound } from "next/navigation";
import { GameThumb } from "@/components/GameThumb";
import { NoticePage } from "@/components/NoticePage";
import { findGame } from "@/lib/directory";

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
  return (
    <main className="mx-auto flex max-w-[960px] flex-col gap-8 px-5 py-10 sm:px-10">
      <div className="card overflow-hidden">
        {video ? (
          // The address is built here from a checked id, so a directory entry cannot frame another site.
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video}`}
            title={`${game.name} video`}
            loading="lazy"
            allowFullScreen
            allow="encrypted-media; picture-in-picture; fullscreen"
            className="aspect-video w-full"
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
    </main>
  );
}
