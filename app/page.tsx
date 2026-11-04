import { redirect } from "next/navigation";

/** The site opens on the games; the waitlist page is still at `/waitlist`. */
export default function Home() {
  // A temporary redirect: a permanent one is cached by browsers and is painful to undo.
  redirect("/games");
}
