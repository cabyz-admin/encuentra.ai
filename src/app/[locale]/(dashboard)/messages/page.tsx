import { getUser } from "@/lib/supabase/queries/index";
import { getUserProfile, getConversations } from "@/lib/supabase/queries/user";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
  
  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };
  
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
          {conversations && conversations.length > 0 ? (
            <div className="divide-y">
              {conversations.map((conversation) => {
                // Determine the other party in the conversation
                const otherParty = conversation.initiator_id === userData.user.id
                  ? conversation.recipient
                  : conversation.initiator;
                
                // Get the latest message
                const latestMessage = conversation.messages && conversation.messages.length > 0
                  ? conversation.messages[conversation.messages.length - 1]
                  : null;
                
                // Determine name and avatar based on user type
                let name = otherParty?.users?.full_name || "User";
                let subtitle = "";
                
                if (otherParty?.user_profiles?.user_type === "candidate") {
                  subtitle = otherParty?.candidate_profiles?.headline || "Candidate";
                } else if (otherParty?.user_profiles?.user_type === "company") {
                  name = otherParty?.company_profiles?.company_name || name;
                  subtitle = otherParty?.company_profiles?.industry || "Company";
                }
                
                return (
                  <Link
                    key={conversation.id}
                    href={`/messages/${conversation.id}`}
                    className="flex items-center gap-4 py-4 transition-colors hover:bg-muted/50"
                  >
                    <Avatar>
                      <AvatarImage 
                        src={otherParty?.users?.avatar_url || 
                             (otherParty?.user_profiles?.user_type === "company" ? 
                              otherParty?.company_profiles?.logo_url : undefined)} 
                      />
                      <AvatarFallback>{getInitials(name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium truncate">{name}</h3>
                        {latestMessage && (
                          <span className="text-muted-foreground text-xs">
                            {formatDate(latestMessage.created_at)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-muted-foreground text-sm truncate">
                          {subtitle}
                        </p>
                        {latestMessage && !latestMessage.read && latestMessage.sender_id !== userData.user.id && (
                          <span className="h-2 w-2 rounded-full bg-primary"></span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="flex h-40 items-center justify-center">
              <p className="text-muted-foreground text-center">
                No conversations yet. Start by browsing candidates or companies and reaching out!
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}