"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { UserType } from "@/types/user";
import { selectUserTypeAction } from "@/actions/user/user-actions";
import { useRouter } from "next/navigation";
import { Briefcase, User } from "lucide-react";

export function UserTypeSelection() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<UserType | null>(null);
  const router = useRouter();

  const handleSelectUserType = async (userType: UserType) => {
    setIsLoading(true);
    setSelectedType(userType);
    
    try {
      const result = await selectUserTypeAction({ userType });
      
      if (result.error) {
        console.error("Error selecting user type:", result.error);
        return;
      }
      
      // Redirect to onboarding
      router.push("/onboarding/1");
    } catch (error) {
      console.error("Error selecting user type:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-md py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Join Encuentra</h1>
        <p className="text-muted-foreground mt-2">
          Select how you want to use the platform
        </p>
      </div>

      <div className="grid gap-4">
        <Card className={`cursor-pointer transition-all ${selectedType === "candidate" ? "ring-2 ring-primary" : ""}`} onClick={() => setSelectedType("candidate")}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              I'm a Candidate
            </CardTitle>
            <CardDescription>
              Create a profile and get discovered by companies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Create a professional profile</li>
              <li>Showcase your skills and experience</li>
              <li>Get contacted by companies</li>
              <li>Find your next opportunity</li>
            </ul>
          </CardContent>
        </Card>

        <Card className={`cursor-pointer transition-all ${selectedType === "company" ? "ring-2 ring-primary" : ""}`} onClick={() => setSelectedType("company")}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              I'm a Company
            </CardTitle>
            <CardDescription>
              Find and connect with talented candidates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Browse candidate profiles</li>
              <li>Filter by skills, experience, and more</li>
              <li>Contact candidates directly</li>
              <li>Build your team efficiently</li>
            </ul>
          </CardContent>
        </Card>

        <Button 
          onClick={() => selectedType && handleSelectUserType(selectedType)} 
          disabled={!selectedType || isLoading}
          className="mt-4"
        >
          {isLoading ? "Processing..." : "Continue"}
        </Button>
      </div>
    </div>
  );
}