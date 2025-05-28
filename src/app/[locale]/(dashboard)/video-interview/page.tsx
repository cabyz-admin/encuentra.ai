import { getUser } from "@/lib/supabase/queries/index";
import { getUserProfile } from "@/lib/supabase/queries/user";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VideoInterviewClient } from "@/components/video/video-interview-client";
import Link from "next/link";
import { Camera, CheckCircle } from "lucide-react";

export const metadata = {
  title: "Video Interview",
};

export default async function VideoInterviewPage({
  searchParams,
}: {
  searchParams: { completed?: string };
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
  
  // Check if interview is completed from search params
  const isCompleted = searchParams.completed === "true";
  
  // Generate questions based on user type
  const questions = userProfile.user_type === "candidate" 
    ? [
        "Tell us about yourself and your professional background.",
        "What are your key skills and strengths?",
        "What are you looking for in your next role?",
        "Why should companies hire you?",
        "What makes you stand out from other candidates?"
      ]
    : [
        "Tell us about your company and what you do.",
        "What kind of candidates are you looking for?",
        "What makes your company a great place to work?",
        "What growth opportunities do you offer employees?",
        "What is your company culture like?"
      ];
  
  if (isCompleted) {
    return (
      <div className="container py-16">
        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-500" />
              Interview Completed
            </CardTitle>
            <CardDescription>
              Thank you for completing your video interview!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Your video responses have been recorded and will be used to enhance your profile. 
              This will help you stand out and get better matches.
            </p>
            <p>
              You can now continue using the platform to find your perfect 
              {userProfile.user_type === "candidate" ? " company" : " candidate"} match.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/dashboard">
                Go to Dashboard
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">AI Video Interview</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Record short video responses to key questions to enhance your profile and improve your matches.
        </p>
      </div>
      
      <div className="mx-auto max-w-3xl">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Before You Begin</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-2">
              <div className="bg-primary/10 text-primary flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                1
              </div>
              <div>
                <h3 className="font-medium">Find a quiet place</h3>
                <p className="text-muted-foreground text-sm">
                  Make sure you're in a quiet environment with minimal background noise.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <div className="bg-primary/10 text-primary flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                2
              </div>
              <div>
                <h3 className="font-medium">Check your lighting</h3>
                <p className="text-muted-foreground text-sm">
                  Ensure you have good lighting so you're clearly visible.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <div className="bg-primary/10 text-primary flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                3
              </div>
              <div>
                <h3 className="font-medium">Test your camera and microphone</h3>
                <p className="text-muted-foreground text-sm">
                  You'll have a chance to test your equipment before starting.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <div className="bg-primary/10 text-primary flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                4
              </div>
              <div>
                <h3 className="font-medium">Be yourself</h3>
                <p className="text-muted-foreground text-sm">
                  Speak naturally and authentically. There are no right or wrong answers.
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-muted-foreground text-sm">
              You'll have up to 60 seconds to answer each question. You can retake your answers if needed.
            </p>
          </CardFooter>
        </Card>
        
        <VideoInterviewClient questions={questions} />
      </div>
    </div>
  );
}