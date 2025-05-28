import { getUser } from "@/lib/supabase/queries/index";
import { getUserProfile } from "@/lib/supabase/queries/user";
import { getPendingConnectionRequests } from "@/lib/supabase/queries/connections";
import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/header";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: userData } = await getUser();
  
  if (!userData?.user) {
    redirect("/login");
  }
  
  // Check if user has a profile
  const { data: userProfile } = await getUserProfile(userData.user.id);
  
  if (!userProfile) {
    redirect("/user-type");
  }
  
  // If user hasn't completed onboarding, redirect to onboarding
  if (!userProfile.onboarding_completed) {
    redirect(`/onboarding/${userProfile.onboarding_step}`);
  }
  
  // Check for pending connection requests
  const { data: pendingRequests } = await getPendingConnectionRequests(userData.user.id);
  
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader userProfile={userProfile} user={userData.user} />
      <main className="flex-1">{children}</main>
    </div>
  );
}