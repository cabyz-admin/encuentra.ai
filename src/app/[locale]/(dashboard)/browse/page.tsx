import { getUser } from "@/lib/supabase/queries/index";
import { getUserProfile, getCandidateProfiles } from "@/lib/supabase/queries/user";
import { getMatchingFilters, checkUserLiked } from "@/lib/supabase/queries/matching";
import { redirect } from "next/navigation";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MatchingFiltersForm } from "@/components/matching/matching-filters-form";
import Link from "next/link";
import { MapPin, Briefcase, Heart, MessageSquare, Filter } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const metadata = {
  title: "Browse Candidates",
};

export default async function BrowseCandidatesPage({
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
  
  // Only companies can browse candidates
  if (userProfile.user_type !== "company") {
    redirect("/dashboard");
  }
  
  // Get active tab from search params
  const activeTab = searchParams.tab as string || "browse";
  
  // Get saved filters
  const { data: savedFilters } = await getMatchingFilters(userData.user.id);
  
  // Parse filters from search params or use saved filters
  const filters = {
    skills: searchParams.skills ? 
      Array.isArray(searchParams.skills) ? 
        searchParams.skills : [searchParams.skills] : 
      savedFilters?.skills,
    experience_levels: searchParams.experience_levels ? 
      Array.isArray(searchParams.experience_levels) ? 
        searchParams.experience_levels : [searchParams.experience_levels] : 
      savedFilters?.experience_levels,
    remote_preferences: searchParams.remote_preferences ? 
      Array.isArray(searchParams.remote_preferences) ? 
        searchParams.remote_preferences : [searchParams.remote_preferences] : 
      savedFilters?.remote_preferences,
    locations: searchParams.locations ? 
      Array.isArray(searchParams.locations) ? 
        searchParams.locations : [searchParams.locations] : 
      savedFilters?.locations,
    industries: searchParams.industries ? 
      Array.isArray(searchParams.industries) ? 
        searchParams.industries : [searchParams.industries] : 
      savedFilters?.industries,
    min_salary: searchParams.min_salary ? 
      parseInt(searchParams.min_salary as string) : 
      savedFilters?.min_salary,
    max_salary: searchParams.max_salary ? 
      parseInt(searchParams.max_salary as string) : 
      savedFilters?.max_salary,
    employment_types: searchParams.employment_types ? 
      Array.isArray(searchParams.employment_types) ? 
        searchParams.employment_types : [searchParams.employment_types] : 
      savedFilters?.employment_types,
  };
  
  // Fetch candidates
  const { data: candidates } = await getCandidateProfiles(filters);
  
  // Check if candidates are liked
  const candidatesWithLikeStatus = await Promise.all(
    (candidates || []).map(async (candidate) => {
      const { data: isLiked } = await checkUserLiked(userData.user.id, candidate.id);
      return {
        ...candidate,
        isLiked: !!isLiked
      };
    })
  );
  
  return (
    <div className="container py-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold">Browse Candidates</h1>
          <p className="text-muted-foreground">
            Find and connect with talented professionals
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant={activeTab === "filters" ? "default" : "outline"}>
            <Link href="/browse?tab=filters">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Link>
          </Button>
          <Button asChild variant={activeTab === "browse" ? "default" : "outline"}>
            <Link href="/browse?tab=browse">
              Browse
            </Link>
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue={activeTab} className="mt-6">
        <TabsContent value="browse">
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {candidatesWithLikeStatus && candidatesWithLikeStatus.length > 0 ? (
              candidatesWithLikeStatus.map((candidate) => (
                <Card key={candidate.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={candidate.avatar_url || candidate.users?.avatar_url} />
                          <AvatarFallback>
                            {candidate.users?.full_name ? candidate.users.full_name.charAt(0) : "C"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h2 className="text-lg font-semibold">
                            {candidate.users?.full_name || "Candidate"}
                          </h2>
                          <p className="text-muted-foreground text-sm">{candidate.headline || "Professional"}</p>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      {candidate.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{candidate.location}</span>
                        </div>
                      )}
                      {candidate.experience_level && (
                        <div className="flex items-center gap-1">
                          <Briefcase className="h-3 w-3" />
                          <span>{formatExperienceLevel(candidate.experience_level)}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4">
                      <h3 className="text-sm font-medium">Skills</h3>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {candidate.candidate_skills?.slice(0, 5).map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill.skill_name}
                          </Badge>
                        ))}
                        {candidate.candidate_skills?.length > 5 && (
                          <Badge variant="outline" className="text-xs">
                            +{candidate.candidate_skills.length - 5} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {candidate.bio && (
                      <div className="mt-4">
                        <p className="line-clamp-3 text-sm">{candidate.bio}</p>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-4">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/candidate/${candidate.id}`}>
                        View Profile
                      </Link>
                    </Button>
                    <div className="flex gap-2">
                      <Button 
                        variant={candidate.isLiked ? "default" : "outline"} 
                        size="icon"
                        asChild
                      >
                        <Link href={`/matches?candidateId=${candidate.id}`}>
                          <Heart className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button asChild variant="ghost" size="icon">
                        <Link href={`/messages/new?recipient=${candidate.id}`}>
                          <MessageSquare className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full flex h-40 items-center justify-center">
                <p className="text-muted-foreground">No candidates found matching your criteria</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="filters">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Filter Candidates</h2>
              <p className="text-muted-foreground text-sm">
                Set your preferences to find the perfect candidates
              </p>
            </CardHeader>
            <CardContent>
              <MatchingFiltersForm 
                initialData={savedFilters} 
                userType="company"
                onApplyFilters={() => {
                  // Redirect to browse tab after applying filters
                  window.location.href = "/browse?tab=browse";
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function formatExperienceLevel(level: string): string {
  switch (level) {
    case "entry":
      return "Entry Level";
    case "mid":
      return "Mid Level";
    case "senior":
      return "Senior Level";
    case "executive":
      return "Executive Level";
    default:
      return level;
  }
}