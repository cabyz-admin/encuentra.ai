import { getUser } from "@/lib/supabase/queries/index";
import { getUserProfile, getCandidateProfiles } from "@/lib/supabase/queries/user";
import { redirect } from "next/navigation";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { MessageSquare, Bookmark, MapPin, Briefcase } from "lucide-react";

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
  
  // Parse filters from search params
  const filters = {
    skills: searchParams.skills ? 
      Array.isArray(searchParams.skills) ? 
        searchParams.skills : [searchParams.skills] : 
      undefined,
    experience_level: searchParams.experience_level as string | undefined,
    remote_preference: searchParams.remote_preference as string | undefined,
    location: searchParams.location as string | undefined,
    availability: searchParams.availability as string | undefined,
  };
  
  // Fetch candidates
  const { data: candidates } = await getCandidateProfiles(filters);
  
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
          <Button asChild variant="outline">
            <Link href="/browse">
              Clear Filters
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {candidates && candidates.length > 0 ? (
          candidates.map((candidate) => (
            <Card key={candidate.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold">
                      {candidate.users?.full_name || "Candidate"}
                    </h2>
                    <p className="text-muted-foreground">{candidate.headline || "Professional"}</p>
                  </div>
                  {candidate.avatar_url && (
                    <div className="h-12 w-12 overflow-hidden rounded-full">
                      <img 
                        src={candidate.avatar_url} 
                        alt={candidate.users?.full_name || "Candidate"} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
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
              <CardFooter className="flex justify-between">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/candidate/${candidate.id}`}>
                    View Profile
                  </Link>
                </Button>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon">
                    <Bookmark className="h-4 w-4" />
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