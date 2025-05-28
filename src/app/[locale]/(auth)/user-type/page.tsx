import { UserTypeSelection } from "@/components/auth/user-type-selection";
import { getUser } from "@/lib/supabase/queries/index";
import { getUserProfile } from "@/lib/supabase/queries/user";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Select User Type",
};

export default async function UserTypePage() {
  const { data: userData } = await getUser();
  
  if (!userData?.user) {
    redirect("/login");
  }
  
  // Check if user already has a profile
  const { data: userProfile } = await getUserProfile(userData.user.id);
  
  if (userProfile) {
    // If user has already selected a type, redirect to appropriate page
    if (userProfile.onboarding_completed) {
      redirect("/dashboard");
    } else {
      redirect(`/onboarding/${userProfile.onboarding_step}`);
    }
  }
  
  return <UserTypeSelection />;
}