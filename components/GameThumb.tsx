import type { Game } from "@/lib/directory";

/** The picture of a game: its first image, or a flat placeholder with its first letter. */
export function GameThumb({
  game,
  className = "",
}: {
  game: Game;
  className?: string;
}) {
  const picture = game.images[0];
  return (
    <div
      className={`relative aspect-video w-full overflow-hidden border-b-2 border-ink bg-line ${className}`}
    >
      {picture ? (
        // Operator pictures come from their own hosts; no referrer is sent to them.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={picture}
          alt=""
          referrerPolicy="no-referrer"
          className="size-full object-cover"
        />
      ) : (
        <span
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center text-[64px] leading-none font-extrabold text-muted"
        >
          {game.name.slice(0, 1).toUpperCase()}
        </span>
      )}
    </div>
  );
}
