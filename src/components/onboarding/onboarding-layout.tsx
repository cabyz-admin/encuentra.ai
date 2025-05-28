"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getUserProfile } from "@/lib/supabase/queries/user";
import { updateUserProfileAction } from "@/actions/user/user-actions";
import { OnboardingStep, UserType } from "@/types/user";
import { Loader2 } from "lucide-react";

interface OnboardingLayoutProps {
  children: React.ReactNode;
  steps: Record<number, OnboardingStep>;
  userType: UserType;
}

export function OnboardingLayout({ children, steps, userType }: OnboardingLayoutProps) {
  const router = useRouter();
  const params = useParams();
  const currentStep = Number(params.step) || 1;
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const maxSteps = Object.keys(steps).length;

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data } = await getUserProfile();
        if (data) {
          setUserProfile(data);
          
          // If user has completed onboarding, redirect to dashboard
          if (data.onboarding_completed) {
            router.push("/dashboard");
            return;
          }
          
          // If user is on a different step than stored in DB, update
          if (data.onboarding_step !== currentStep) {
            await updateUserProfileAction({ onboarding_step: currentStep });
          }
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [currentStep, router]);

  const handleNext = async () => {
    setIsSubmitting(true);
    try {
      if (currentStep < maxSteps) {
        await updateUserProfileAction({ onboarding_step: currentStep + 1 });
        router.push(`/onboarding/${currentStep + 1}`);
      } else {
        // Complete onboarding
        await updateUserProfileAction({ 
          onboarding_step: currentStep,
          onboarding_completed: true 
        });
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error updating onboarding step:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = async () => {
    if (currentStep > 1) {
      await updateUserProfileAction({ onboarding_step: currentStep - 1 });
      router.push(`/onboarding/${currentStep - 1}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container max-w-3xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          {userType === "candidate" ? "Candidate Profile Setup" : "Company Profile Setup"}
        </h1>
        <p className="text-muted-foreground mt-2">
          Step {currentStep} of {maxSteps}
        </p>
      </div>

      <div className="mb-6 flex space-x-2">
        {Object.entries(steps).map(([stepNumber, step]) => (
          <div 
            key={stepNumber}
            className={`h-2 flex-1 rounded-full ${
              Number(stepNumber) < currentStep 
                ? "bg-primary" 
                : Number(stepNumber) === currentStep 
                ? "bg-primary/50" 
                : "bg-muted"
            }`}
          />
        ))}
      </div>

      <Card className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold">{steps[currentStep].title}</h2>
          <p className="text-muted-foreground mt-1">{steps[currentStep].description}</p>
        </div>

        <div className="mb-8">
          {children}
        </div>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1 || isSubmitting}
          >
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : currentStep === maxSteps ? (
              "Complete"
            ) : (
              "Next"
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}