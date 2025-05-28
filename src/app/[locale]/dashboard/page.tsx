import { redirect } from "next/navigation";

export default function DashboardPage() {
  // Redirect to the actual dashboard page
  redirect("/en/dashboard");
}