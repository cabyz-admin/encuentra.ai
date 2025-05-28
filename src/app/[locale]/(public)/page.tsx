import { getUser } from "@/lib/supabase/queries/index";
import { getUserProfile } from "@/lib/supabase/queries/user";
import { redirect } from "next/navigation";
import { LandingPageContent } from "@/components/LandingPageContent";

export const metadata = {
  title: "Encuentra - Reverse Job Board",
  description: "Connect talented professionals with great companies",
};

export default async function LandingPage() {
  const { data: userData } = await getUser();
  
  // If user is logged in, check if they have completed onboarding
  if (userData?.user) {
    const { data: userProfile } = await getUserProfile(userData.user.id);
    
    if (userProfile) {
      if (userProfile.onboarding_completed) {
        redirect("/dashboard");
      } else {
        redirect(`/onboarding/${userProfile.onboarding_step}`);
      }
    } else {
      redirect("/user-type");
    }
  }
  
  return <LandingPageContent />;
}