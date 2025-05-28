import { getUser } from "@/lib/supabase/queries/index";
import { getUserProfile, getCandidateProfile, getCompanyProfile, getCandidateViews, getSavedCandidates } from "@/lib/supabase/queries/user";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Eye, Users, Briefcase, Edit, MessageSquare } from "lucide-react";

export const metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
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
  
  // Fetch appropriate data based on user type
  let profileData;
  let stats = [];
  
  if (userProfile.user_type === "candidate") {
    const { data: candidateProfile } = await getCandidateProfile(userData.user.id);
    profileData = candidateProfile;
    
    // Get profile views
    const { data: views } = await getCandidateViews(userData.user.id);
    
    stats = [
      {
        title: "Profile Views",
        value: views?.length || 0,
        icon: <Eye className="h-4 w-4" />,
        description: "Companies that viewed your profile",
      },
      {
        title: "Skills",
        value: candidateProfile?.candidate_skills?.length || 0,
        icon: <Briefcase className="h-4 w-4" />,
        description: "Skills on your profile",
      },
      {
        title: "Profile Completion",
        value: getProfileCompletionPercentage(candidateProfile) + "%",
        icon: <Edit className="h-4 w-4" />,
        description: "Complete your profile to increase visibility",
      },
    ];
  } else {
    const { data: companyProfile } = await getCompanyProfile(userData.user.id);
    profileData = companyProfile;
    
    // Get saved candidates
    const { data: savedCandidates } = await getSavedCandidates(userData.user.id);
    
    stats = [
      {
        title: "Saved Candidates",
        value: savedCandidates?.length || 0,
        icon: <Users className="h-4 w-4" />,
        description: "Candidates you've saved",
      },
      {
        title: "Job Interests",
        value: companyProfile?.company_job_interests?.length || 0,
        icon: <Briefcase className="h-4 w-4" />,
        description: "Positions you're hiring for",
      },
      {
        title: "Profile Completion",
        value: getProfileCompletionPercentage(companyProfile) + "%",
        icon: <Edit className="h-4 w-4" />,
        description: "Complete your profile to attract candidates",
      },
    ];
  }
  
  return (
    <div className="container py-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {userData.user.user_metadata.full_name || userData.user.email}
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/profile/edit">
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Link>
          </Button>
          <Button asChild>
            <Link href="/messages">
              <MessageSquare className="mr-2 h-4 w-4" />
              Messages
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-muted-foreground text-xs">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {userProfile.user_type === "candidate" ? (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Profile Overview</CardTitle>
                <CardDescription>
                  Your public candidate profile
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">Headline</h3>
                    <p>{profileData?.headline || "Not set"}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Location</h3>
                    <p>{profileData?.location || "Not set"}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Experience</h3>
                    <p>{profileData?.experience_level || "Not set"}</p>
                  </div>
                  <div className="pt-2">
                    <Button asChild variant="outline">
                      <Link href={`/candidate/${userData.user.id}`}>
                        View Public Profile
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Profile Views</CardTitle>
                <CardDescription>
                  Companies that viewed your profile
                </CardDescription>
              </CardHeader>
              <CardContent>
                {profileData?.candidate_views?.length > 0 ? (
                  <div className="space-y-4">
                    {profileData.candidate_views.slice(0, 5).map((view) => (
                      <div key={view.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-muted"></div>
                          <div>
                            <p className="font-medium">{view.viewer?.company_profiles?.company_name || "Company"}</p>
                            <p className="text-muted-foreground text-xs">
                              {new Date(view.viewed_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/company/${view.viewer_id}`}>
                            View
                          </Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex h-24 items-center justify-center">
                    <p className="text-muted-foreground text-sm">No profile views yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Company Overview</CardTitle>
                <CardDescription>
                  Your public company profile
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">Company Name</h3>
                    <p>{profileData?.company_name || "Not set"}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Industry</h3>
                    <p>{profileData?.industry || "Not set"}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Location</h3>
                    <p>{profileData?.headquarters_location || "Not set"}</p>
                  </div>
                  <div className="pt-2">
                    <Button asChild variant="outline">
                      <Link href={`/company/${userData.user.id}`}>
                        View Public Profile
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Saved Candidates</CardTitle>
                <CardDescription>
                  Candidates you've saved
                </CardDescription>
              </CardHeader>
              <CardContent>
                {profileData?.company_saved_candidates?.length > 0 ? (
                  <div className="space-y-4">
                    {profileData.company_saved_candidates.slice(0, 5).map((saved) => (
                      <div key={saved.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-muted"></div>
                          <div>
                            <p className="font-medium">{saved.candidate?.users?.full_name || "Candidate"}</p>
                            <p className="text-muted-foreground text-xs">
                              {saved.candidate?.candidate_profiles?.headline || ""}
                            </p>
                          </div>
                        </div>
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/candidate/${saved.candidate_id}`}>
                            View
                          </Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex h-24 items-center justify-center">
                    <p className="text-muted-foreground text-sm">No saved candidates yet</p>
                  </div>
                )}
                <div className="mt-4">
                  <Button asChild>
                    <Link href="/browse">
                      Browse Candidates
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}

// Helper function to calculate profile completion percentage
function getProfileCompletionPercentage(profile: any): number {
  if (!profile) return 0;
  
  let completedFields = 0;
  let totalFields = 0;
  
  if (profile.headline) completedFields++;
  totalFields++;
  
  if (profile.bio) completedFields++;
  totalFields++;
  
  if (profile.location) completedFields++;
  totalFields++;
  
  if (profile.candidate_skills?.length > 0) completedFields++;
  totalFields++;
  
  if (profile.candidate_experience?.length > 0) completedFields++;
  totalFields++;
  
  if (profile.candidate_education?.length > 0) completedFields++;
  totalFields++;
  
  if (profile.candidate_availability) completedFields++;
  totalFields++;
  
  if (profile.candidate_preferences) completedFields++;
  totalFields++;
  
  if (profile.company_name) completedFields++;
  totalFields++;
  
  if (profile.industry) completedFields++;
  totalFields++;
  
  if (profile.company_size) completedFields++;
  totalFields++;
  
  if (profile.headquarters_location) completedFields++;
  totalFields++;
  
  if (profile.company_team_members?.length > 0) completedFields++;
  totalFields++;
  
  if (profile.company_job_interests?.length > 0) completedFields++;
  totalFields++;
  
  return Math.round((completedFields / totalFields) * 100);
}