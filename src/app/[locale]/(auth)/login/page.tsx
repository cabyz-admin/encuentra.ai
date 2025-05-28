import { GoogleSignin } from "@/components/google-signin";
import { getUser } from "@/lib/supabase/queries/index";
import { getUserProfile } from "@/lib/supabase/queries/user";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Login",
};

export default async function LoginPage() {
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
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30">
      <div className="w-full max-w-md space-y-8 rounded-lg border bg-background p-8 shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Welcome to Encuentra</h1>
          <p className="text-muted-foreground mt-2">
            The Reverse Job Board for Top Talent
          </p>
        </div>
        
        <div className="flex flex-col items-center space-y-4">
          <GoogleSignin />
          
          <div className="text-muted-foreground mt-4 text-center text-sm">
            By signing in, you agree to our{" "}
            <Link href="#" className="text-primary hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="#" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}