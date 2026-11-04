import { notFound } from "next/navigation";
import { NoticePage } from "@/components/NoticePage";
import { findGame } from "@/lib/directory";

export const dynamic = "force-dynamic";

export default async function Game({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const game = await findGame(id);
  if (game === undefined) notFound();
  if (game === null) {
    return (
      <NoticePage title="Directory unavailable">
        <p>Photon&apos;s directory could not be reached. Try again in a moment.</p>
      </NoticePage>
    );
  }
  return (
    <main className="mx-auto flex min-h-dvh max-w-[720px] flex-col gap-6 px-5 py-10">
      <h1 className="text-[32px]">{game.name}</h1>
      <p className="text-muted">
        {game.players} online · {game.version}
      </p>
      <div className="flex flex-wrap gap-3">
        {game.images.map((src) => (
          // Operator pictures come from their own hosts; no referrer is sent to them.
          // eslint-disable-next-line @next/next/no-img-element
          <img key={src} src={src} alt="" referrerPolicy="no-referrer" className="max-h-48 rounded" />
        ))}
      </div>
      <p className="text-pretty">{game.description}</p>
      <form method="post" action={`/games/${game.id}/play`}>
        <button type="submit" className="rounded border border-current px-6 py-3 text-lg">
          Play
        </button>
      </form>
    </main>
  );
}
