import { cache } from "react";
import { backendUrl } from "@/lib/signin";

/** A server of the backend's directory, as the game pages show it. */
export type Game = {
  id: string;
  name: string;
  description: string;
  version: string;
  players: number;
  images: string[];
  /** `https` addresses of video files, checked again here; the page plays them in a video element. */
  videos: string[];
};

/** A video file address: https, no spaces, a sensible length. */
export const VIDEO_URL = /^https:\/\/[\x21-\x7e]{1,492}$/;

/** Ids are lower-case words and dashes; anything else is not looked up. */
export const GAME_ID = /^[a-z0-9-]{1,64}$/;

function asGame(value: unknown): Game | null {
  if (typeof value !== "object" || value === null) return null;
  const entry = value as Record<string, unknown>;
  const { id, name, description, version, players, images, videos } = entry;
  if (typeof id !== "string" || !GAME_ID.test(id)) return null;
  if (typeof name !== "string" || typeof description !== "string") return null;
  if (typeof version !== "string" || typeof players !== "number") return null;
  const pictures = Array.isArray(images) ? images : [];
  const clips = Array.isArray(videos) ? videos : [];
  return {
    id,
    name,
    description,
    version,
    players,
    // The operator's pictures are shown from their own hosts: only https ones.
    images: pictures.filter(
      (url): url is string =>
        typeof url === "string" && url.startsWith("https://"),
    ),
    videos: clips.filter(
      (url): url is string => typeof url === "string" && VIDEO_URL.test(url),
    ),
  };
}

/**
 * The directory, or null when the backend cannot be reached. One request asks the backend once,
 * however many parts of the page look at the list.
 */
export const listGames = cache(async (): Promise<Game[] | null> => {
  const base = backendUrl();
  if (!base) return null;
  try {
    const answer = await fetch(`${base}/v1/servers`, {
      signal: AbortSignal.timeout(5000),
      cache: "no-store",
    });
    if (!answer.ok) return null;
    const body: unknown = await answer.json();
    if (!Array.isArray(body)) return null;
    return body.map(asGame).filter((game): game is Game => game !== null);
  } catch {
    return null;
  }
});

export async function findGame(id: string): Promise<Game | null | undefined> {
  if (!GAME_ID.test(id)) return undefined;
  const games = await listGames();
  if (!games) return null;
  return games.find((game) => game.id === id);
}

/** A launch code for a server, for the holder of a session; the backend decides who may. */
export async function launch(
  session: string,
  server: string,
): Promise<{ status: number; code?: string }> {
  const base = backendUrl();
  if (!base) return { status: 503 };
  try {
    const answer = await fetch(`${base}/v1/launch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session}`,
      },
      body: JSON.stringify({ server }),
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });
    if (!answer.ok) return { status: answer.status };
    const body = (await answer.json()) as { code?: unknown };
    return typeof body.code === "string"
      ? { status: 200, code: body.code }
      : { status: 502 };
  } catch {
    return { status: 503 };
  }
}
