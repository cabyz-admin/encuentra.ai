import { getUser } from "@/lib/supabase/queries/index";
import { getUserProfile, getConversations } from "@/lib/supabase/queries/user";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConversationList } from "@/components/messaging/conversation-list";

export const metadata = {
  title: "Messages",
};

export default async function MessagesPage() {
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
  
  // Fetch conversations
  const { data: conversations } = await getConversations(userData.user.id);
  
  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Messages</h1>
        <p className="text-muted-foreground">
          Connect with candidates and companies
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Conversations</CardTitle>
        </CardHeader>
        <CardContent>
          <ConversationList 
            initialConversations={conversations || []} 
            userId={userData.user.id} 
          />
        </CardContent>
      </Card>
    </div>
  );
}