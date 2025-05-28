import { getUser } from "@/lib/supabase/queries/index";
import { getUserProfile, getCandidateProfile, getCompanyProfile } from "@/lib/supabase/queries/user";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NewConversation } from "@/components/messaging/new-conversation";

export const metadata = {
  title: "New Message",
};

export default async function NewMessagePage({
  searchParams,
}: {
  searchParams: { recipient?: string };
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
  
  // Check if recipient is provided
  if (!searchParams.recipient) {
    redirect("/messages");
  }
  
  // Get recipient info
  let recipientName = "User";
  
  // Check if recipient is a candidate or company
  const { data: candidateProfile } = await getCandidateProfile(searchParams.recipient);
  const { data: companyProfile } = await getCompanyProfile(searchParams.recipient);
  
  if (candidateProfile) {
    recipientName = candidateProfile.users?.full_name || "Candidate";
  } else if (companyProfile) {
    recipientName = companyProfile.company_name || "Company";
  }
  
  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">New Message</h1>
        <p className="text-muted-foreground">
          Start a new conversation
        </p>
      </div>
      
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>New Conversation</CardTitle>
        </CardHeader>
        <CardContent>
          <NewConversation 
            recipientId={searchParams.recipient} 
            recipientName={recipientName} 
          />
        </CardContent>
      </Card>
    </div>
  );
}