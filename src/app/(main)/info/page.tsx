import { redirect } from "next/navigation";

// Redirect /info to home page (directory is now on the home page)
export default function InfoPage() {
  redirect("/");
}
