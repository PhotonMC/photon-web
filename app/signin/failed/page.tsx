import { NoticePage } from "@/components/NoticePage";

export const metadata = { title: "Sign-in failed · Photon", robots: { index: false } };

export default function Failed() {
  return (
    <NoticePage title="Sign-in did not work">
      <p>
        The link from the game was used up, had expired, or could not be checked. Start again from
        the game.
      </p>
    </NoticePage>
  );
}
