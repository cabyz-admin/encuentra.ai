import { getUser } from "@/lib/supabase/queries/index";
import { getUserProfile, getMessages } from "@/lib/supabase/queries/user";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageThread } from "@/components/messaging/message-thread";
import { TypingIndicator } from "@/components/ui/typing-indicator";
import { createClient } from "@/lib/supabase/clients/server";
import { RealtimePresence } from "@/components/ui/realtime-presence";

export const metadata = {
  title: "Conversation",
};

export default async function ConversationPage({ params }: { params: { id: string } }) {
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
  
  // Fetch messages
  const { data: messages } = await getMessages(params.id);
  
  if (!messages || messages.length === 0) {
    // Check if conversation exists
    const supabase = createClient();
    const { data: conversation } = await supabase
      .from("conversations")
      .select("*")
      .eq("id", params.id)
      .single();
    
    if (!conversation) {
      redirect("/messages");
    }
  }
  
  // Get other party info from messages or conversation
  let otherPartyId = "";
  let otherPartyName = "User";
  let otherPartyAvatar = "";
  
  if (messages && messages.length > 0) {
    // Get other party from messages
    const firstMessage = messages[0];
    const conversationData = firstMessage.conversation;
    
    otherPartyId = conversationData.initiator_id === userData.user.id
      ? conversationData.recipient_id
      : conversationData.initiator_id;
    
    const otherPartySender = messages.find(msg => msg.sender_id !== userData.user.id)?.sender;
    
    if (otherPartySender) {
      otherPartyName = otherPartySender.users?.full_name || "User";
      otherPartyAvatar = otherPartySender.users?.avatar_url || "";
    }
  } else if (conversation) {
    // Get other party from conversation
    otherPartyId = conversation.initiator_id === userData.user.id
      ? conversation.recipient_id
      : conversation.initiator_id;
    
    // Fetch other party info
    const { data: otherPartyData } = await supabase
      .from("users")
      .select("*")
      .eq("id", otherPartyId)
      .single();
    
    if (otherPartyData) {
      otherPartyName = otherPartyData.full_name || "User";
      otherPartyAvatar = otherPartyData.avatar_url || "";
    }
  }
  
  return (
    <div className="container py-8">
      <Card className="flex h-[calc(100vh-10rem)] flex-col">
        <CardHeader className="border-b px-4 py-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center">
              {otherPartyName}
              <RealtimePresence userId={otherPartyId} channelName={`presence:${otherPartyId}`}>
                {(isOnline) => (
                  isOnline ? (
                    <span className="ml-2 h-2 w-2 rounded-full bg-green-500"></span>
                  ) : (
                    <span className="ml-2 h-2 w-2 rounded-full bg-gray-300"></span>
                  )
                )}
              </RealtimePresence>
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden p-0 flex flex-col">
          <TypingIndicator conversationId={params.id} userId={userData.user.id} />
          <MessageThread
            initialMessages={messages || []}
            conversationId={params.id}
            userId={userData.user.id}
            otherPartyName={otherPartyName}
            otherPartyAvatar={otherPartyAvatar}
          />
        </CardContent>
      </Card>
    </div>
  );
}