import { GameThumb } from "@/components/GameThumb";
import type { Game } from "@/lib/directory";

/** One game on the list: the whole tile is a link, and it presses in like a button. */
export function GameCard({ game }: { game: Game }) {
  return (
    <li>
      <a
        href={`/games/${game.id}`}
        className="card group block overflow-hidden motion-safe:transition-[transform,box-shadow] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-hard-sm"
      >
        <GameThumb game={game} />
        <div className="flex flex-col gap-2 p-4">
          <h2 className="text-lg leading-tight font-bold">{game.name}</h2>
          <p className="label-mono text-[11px] tracking-[0.2em]">
            {game.players} online · {game.version}
          </p>
        </div>
      </a>
    </li>
  );
}
