import { NoticePage } from "@/components/NoticePage";

export const metadata = { title: "Use the same browser · Photon", robots: { index: false } };

export default function SameBrowser() {
  return (
    <NoticePage title="Finish in the browser you started in">
      <p>
        This browser did not start the sign-in. Open the sign-in page again in the browser you want
        to sign in with, and let the game open that one.
      </p>
    </NoticePage>
  );
}
