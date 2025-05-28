import { getUser } from "@/lib/supabase/queries/index";
import { getUserProfile } from "@/lib/supabase/queries/user";
import { getMutualLikes, getConnectionStatus } from "@/lib/supabase/queries/matching";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ConnectionRequestButton } from "@/components/connections/connection-request-button";
import Link from "next/link";
import { MessageSquare } from "lucide-react";

export const metadata = {
  title: "Mutual Matches",
};

export default async function MutualMatchesPage() {
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
  
  // Fetch mutual likes
  const { data: mutualLikes } = await getMutualLikes(userData.user.id);
  
  // Get connection status for each mutual like
  const mutualLikesWithConnectionStatus = await Promise.all(
    (mutualLikes || []).map(async (like) => {
      const { data: connectionStatus } = await getConnectionStatus(userData.user.id, like.liker.id);
      
      return {
        ...like,
        connectionStatus: connectionStatus ? {
          exists: true,
          status: connectionStatus.status,
          senderId: connectionStatus.sender_id,
        } : undefined
      };
    })
  );
  
  // Get initials for avatar
  const getInitials = (name: string) => {
    if (!name) return "?";
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Mutual Matches</h1>
        <p className="text-muted-foreground">
          People who liked you back
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mutualLikesWithConnectionStatus && mutualLikesWithConnectionStatus.length > 0 ? (
          mutualLikesWithConnectionStatus.map((like) => {
            const isCompany = like.liker.user_profiles.user_type === "company";
            const name = isCompany 
              ? like.liker.company_profiles?.company_name 
              : like.liker.users.full_name;
            const subtitle = isCompany 
              ? like.liker.company_profiles?.industry 
              : like.liker.candidate_profiles?.headline;
            const avatar = isCompany
              ? like.liker.company_profiles?.logo_url || like.liker.users.avatar_url
              : like.liker.users.avatar_url;
            
            return (
              <Card key={like.id}>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={avatar} />
                      <AvatarFallback>{getInitials(name || "")}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base">{name}</CardTitle>
                      <CardDescription>{subtitle}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm mb-4">
                    You both liked each other's profiles!
                  </p>
                  
                  <div className="flex gap-2">
                    <ConnectionRequestButton
                      recipientId={like.liker.id}
                      recipientName={name || ""}
                      recipientType={isCompany ? "company" : "candidate"}
                      status={like.connectionStatus}
                    />
                    
                    {like.connectionStatus?.status === "accepted" && (
                      <Button asChild>
                        <Link href={`/messages/new?recipient=${like.liker.id}`}>
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Message
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className="col-span-full">
            <Card>
              <CardContent className="flex h-40 items-center justify-center">
                <div className="text-center">
                  <p className="text-muted-foreground mb-4">
                    No mutual matches yet. Keep liking profiles to find matches!
                  </p>
                  <Button asChild>
                    <Link href="/matches">
                      Find Matches
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}