import { getUser } from "@/lib/supabase/queries/index";
import { getUserProfile } from "@/lib/supabase/queries/user";
import { getTopMatches, getMatchingPreferences, getMatchingFilters, getUserLikes, checkUserLiked } from "@/lib/supabase/queries/matching";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { MatchCard } from "@/components/matching/match-card";
import { MatchingPreferencesForm } from "@/components/matching/matching-preferences-form";
import { MatchingFiltersForm } from "@/components/matching/matching-filters-form";
import { LocationForm } from "@/components/matching/location-form";
import Link from "next/link";
import { Settings, Sliders } from "lucide-react";

export const metadata = {
  title: "Matches",
};

export default async function MatchesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
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
  
  // Get active tab from search params
  const activeTab = searchParams.tab as string || "matches";
  
  // Fetch matching data
  const { data: matchingPreferences } = await getMatchingPreferences(userData.user.id);
  const { data: matchingFilters } = await getMatchingFilters(userData.user.id);
  const { data: topMatches } = await getTopMatches(userData.user.id, userProfile.user_type);
  const { data: userLikes } = await getUserLikes(userData.user.id);
  
  // Process matches to include like status
  const processedMatches = topMatches?.map(match => {
    const targetId = userProfile.user_type === "candidate" ? match.company?.id : match.candidate?.id;
    const isLiked = userLikes?.some(like => like.liked_id === targetId);
    
    return {
      ...match,
      isLiked
    };
  });
  
  return (
    <div className="container py-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold">Matches</h1>
          <p className="text-muted-foreground">
            Find your perfect {userProfile.user_type === "candidate" ? "company" : "candidate"} match
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/matches?tab=preferences">
              <Settings className="mr-2 h-4 w-4" />
              Preferences
            </Link>
          </Button>
          <Button asChild>
            <Link href="/matches?tab=filters">
              <Sliders className="mr-2 h-4 w-4" />
              Filters
            </Link>
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue={activeTab} className="mt-6">
        <TabsList className="mb-6">
          <TabsTrigger value="matches">Top Matches</TabsTrigger>
          <TabsTrigger value="preferences">Matching Preferences</TabsTrigger>
          <TabsTrigger value="filters">Filters</TabsTrigger>
          <TabsTrigger value="location">Location</TabsTrigger>
        </TabsList>
        
        <TabsContent value="matches">
          <div className="space-y-6">
            {processedMatches && processedMatches.length > 0 ? (
              processedMatches.map((match) => (
                <MatchCard 
                  key={match.id} 
                  match={match} 
                  userType={userProfile.user_type as "candidate" | "company"}
                  isLiked={match.isLiked}
                />
              ))
            ) : (
              <Card>
                <CardContent className="flex h-40 items-center justify-center">
                  <div className="text-center">
                    <p className="text-muted-foreground mb-4">
                      No matches found. Try adjusting your filters or preferences.
                    </p>
                    <Button asChild>
                      <Link href="/matches?tab=filters">
                        Adjust Filters
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Matching Preferences</CardTitle>
              <CardDescription>
                Customize how we match you with {userProfile.user_type === "candidate" ? "companies" : "candidates"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MatchingPreferencesForm initialData={matchingPreferences} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="filters">
          <Card>
            <CardHeader>
              <CardTitle>Matching Filters</CardTitle>
              <CardDescription>
                Filter your matches based on specific criteria
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MatchingFiltersForm 
                initialData={matchingFilters} 
                userType={userProfile.user_type as "candidate" | "company"} 
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="location">
          <Card>
            <CardHeader>
              <CardTitle>Location Settings</CardTitle>
              <CardDescription>
                Set your location preferences for better matching
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LocationForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}