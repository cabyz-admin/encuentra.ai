import { getUser } from "@/lib/supabase/queries/index";
import { getUserProfile, getMessages } from "@/lib/supabase/queries/user";
import { markMessagesAsReadAction } from "@/actions/messaging/messaging-actions";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageInput } from "@/components/messaging/message-input";

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
  
  // Mark messages as read
  if (messages && messages.length > 0) {
    await markMessagesAsReadAction({ conversationId: params.id });
  }
  
  // Get other party info from first message
  let otherPartyId = "";
  let otherPartyName = "";
  let otherPartyAvatar = "";
  
  if (messages && messages.length > 0) {
    const firstMessage = messages[0];
    otherPartyId = firstMessage.sender_id === userData.user.id
      ? firstMessage.conversation.recipient_id
      : firstMessage.sender_id;
    
    const otherPartySender = messages.find(msg => msg.sender_id !== userData.user.id)?.sender;
    
    if (otherPartySender) {
      otherPartyName = otherPartySender.users?.full_name || "User";
      otherPartyAvatar = otherPartySender.users?.avatar_url || "";
    }
  }
  
  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  // Format date
  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const formatMessageDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
  };
  
  // Group messages by date
  const groupMessagesByDate = (messages: any[]) => {
    const groups: { [key: string]: any[] } = {};
    
    messages.forEach(message => {
      const date = new Date(message.created_at).toLocaleDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    
    return Object.entries(groups).map(([date, messages]) => ({
      date,
      messages,
    }));
  };
  
  const messageGroups = messages ? groupMessagesByDate(messages) : [];
  
  return (
    <div className="container py-8">
      <Card className="flex h-[calc(100vh-10rem)] flex-col">
        <CardHeader className="border-b px-4 py-3">
          <CardTitle className="text-lg">
            {otherPartyName || "Conversation"}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-0">
          <div className="flex flex-col-reverse p-4">
            {messageGroups.map((group, groupIndex) => (
              <div key={groupIndex} className="mb-6">
                <div className="mb-4 flex justify-center">
                  <span className="bg-muted text-muted-foreground rounded-full px-3 py-1 text-xs">
                    {formatMessageDate(group.messages[0].created_at)}
                  </span>
                </div>
                <div className="space-y-4">
                  {group.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender_id === userData.user.id ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`flex max-w-[80%] ${message.sender_id === userData.user.id ? "flex-row-reverse" : "flex-row"}`}>
                        {message.sender_id !== userData.user.id && (
                          <Avatar className="mr-2 h-8 w-8">
                            <AvatarImage src={otherPartyAvatar} />
                            <AvatarFallback>{getInitials(otherPartyName)}</AvatarFallback>
                          </Avatar>
                        )}
                        <div>
                          <div
                            className={`rounded-lg px-4 py-2 ${
                              message.sender_id === userData.user.id
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            }`}
                          >
                            <p>{message.content}</p>
                          </div>
                          <div
                            className={`mt-1 text-xs text-muted-foreground ${
                              message.sender_id === userData.user.id ? "text-right" : ""
                            }`}
                          >
                            {formatMessageTime(message.created_at)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            {messages && messages.length === 0 && (
              <div className="flex h-40 items-center justify-center">
                <p className="text-muted-foreground text-center">
                  No messages yet. Start the conversation!
                </p>
              </div>
            )}
          </div>
        </CardContent>
        <div className="border-t p-4">
          <MessageInput conversationId={params.id} />
        </div>
      </Card>
    </div>
  );
}