import { getUser } from "@/lib/supabase/queries/index";
import { getUserProfile, getCandidateProfile, getCompanyProfile } from "@/lib/supabase/queries/user";
import { createConversationAction } from "@/actions/messaging/messaging-actions";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageInput } from "@/components/messaging/message-input";

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
  
  // Create or get conversation
  const { data: conversation, error } = await createConversationAction({
    recipientId: searchParams.recipient,
  });
  
  if (error) {
    console.error("Error creating conversation:", error);
    redirect("/messages");
  }
  
  if (conversation) {
    redirect(`/messages/${conversation.id}`);
  }
  
  return (
    <div className="container py-8">
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>New Message</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center">Creating conversation...</p>
        </CardContent>
      </Card>
    </div>
  );
}