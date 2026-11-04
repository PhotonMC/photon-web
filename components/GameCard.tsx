import { GameThumb } from "@/components/GameThumb";
import type { Game } from "@/lib/directory";

/**
 * One game on the list. The tile links to the game's page through a stretched link; the play
 * arrow is a separate POST form layered above it (a form inside a link is not valid HTML), shown
 * on hover and focus, and always on screens without hover.
 */
export function GameCard({ game }: { game: Game }) {
  return (
    <li className="group card relative overflow-hidden motion-safe:transition-[transform,box-shadow] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-hard-sm">
      <GameThumb game={game} />
      <div className="flex flex-col gap-2 p-4">
        <h2 className="text-lg leading-tight font-bold">
          <a
            href={`/games/${game.id}`}
            className="after:absolute after:inset-0 after:content-['']"
          >
            {game.name}
          </a>
        </h2>
        <p className="label-mono text-[11px] tracking-[0.2em]">
          {game.players} online · {game.version}
        </p>
      </div>
      {/* Play stays a POST form: the origin check of the route depends on it. */}
      <form
        method="post"
        action={`/games/${game.id}/play`}
        className="absolute right-3 bottom-3 z-10 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 [@media(hover:none)]:opacity-100"
      >
        <button
          type="submit"
          className="btn btn-icon"
          aria-label={`Play ${game.name}`}
          title="Play"
        >
          <span aria-hidden="true">&#9654;</span>
        </button>
      </form>
    </li>
  );
}
