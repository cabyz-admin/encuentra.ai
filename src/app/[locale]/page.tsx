import { redirect } from "next/navigation";

export default function LocaleRootPage() {
  // Redirect to the dashboard if the user is on the root locale page
  redirect("/");
}