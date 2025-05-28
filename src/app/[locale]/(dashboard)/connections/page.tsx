import { getUser } from "@/lib/supabase/queries/index";
import { getUserProfile } from "@/lib/supabase/queries/user";
import { getPendingConnectionRequests, getSentConnectionRequests } from "@/lib/supabase/queries/connections";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ConnectionRequestCard } from "@/components/connections/connection-request-card";

export const metadata = {
  title: "Connections",
};

export default async function ConnectionsPage() {
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
  
  // Fetch connection requests
  const { data: pendingRequests } = await getPendingConnectionRequests(userData.user.id);
  const { data: sentRequests } = await getSentConnectionRequests(userData.user.id);
  
  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Connections</h1>
        <p className="text-muted-foreground">
          Manage your connection requests
        </p>
      </div>
      
      <Tabs defaultValue="pending">
        <TabsList className="mb-6">
          <TabsTrigger value="pending">
            Pending Requests
            {pendingRequests && pendingRequests.length > 0 && (
              <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                {pendingRequests.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="sent">Sent Requests</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending">
          <div className="space-y-6">
            {pendingRequests && pendingRequests.length > 0 ? (
              pendingRequests.map((request) => (
                <ConnectionRequestCard 
                  key={request.id} 
                  request={request} 
                  onRespond={() => {}}
                />
              ))
            ) : (
              <Card>
                <CardContent className="flex h-40 items-center justify-center">
                  <p className="text-muted-foreground text-center">
                    No pending connection requests
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="sent">
          <div className="space-y-6">
            {sentRequests && sentRequests.length > 0 ? (
              sentRequests.map((request) => (
                <Card key={request.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">
                          {request.recipient.user_profiles.user_type === "company"
                            ? request.recipient.company_profiles?.company_name
                            : request.recipient.users.full_name}
                        </CardTitle>
                        <CardDescription>
                          {request.recipient.user_profiles.user_type === "company"
                            ? request.recipient.company_profiles?.industry
                            : request.recipient.candidate_profiles?.headline}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground text-sm">
                          {new Date(request.created_at).toLocaleDateString()}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          request.status === "pending" 
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300" 
                            : request.status === "accepted"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                        }`}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {request.message && (
                      <div className="mb-4">
                        <p className="text-sm font-medium">Your message:</p>
                        <p className="text-sm">{request.message}</p>
                      </div>
                    )}
                    
                    {request.status !== "pending" && request.response_message && (
                      <div>
                        <p className="text-sm font-medium">Response:</p>
                        <p className="text-sm">{request.response_message}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="flex h-40 items-center justify-center">
                  <p className="text-muted-foreground text-center">
                    No sent connection requests
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}