import { getUser } from "@/lib/supabase/queries/index";
import { getUserProfile, getCandidateProfile, getCompanyProfile } from "@/lib/supabase/queries/user";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BasicInfoForm } from "@/components/onboarding/candidate/basic-info-form";
import { SkillsForm } from "@/components/onboarding/candidate/skills-form";
import { ExperienceForm } from "@/components/onboarding/candidate/experience-form";
import { PreferencesForm } from "@/components/onboarding/candidate/preferences-form";
import { CompanyInfoForm } from "@/components/onboarding/company/company-info-form";
import { TeamForm } from "@/components/onboarding/company/team-form";
import { HiringInterestsForm } from "@/components/onboarding/company/hiring-interests-form";

export const metadata = {
  title: "Edit Profile",
};

export default async function EditProfilePage() {
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
  
  // Get profile data
  let profileData = {};
  
  if (userProfile.user_type === "candidate") {
    const { data: candidateProfile } = await getCandidateProfile(userData.user.id);
    if (candidateProfile) {
      profileData = {
        ...candidateProfile,
        skills: candidateProfile.candidate_skills,
        experiences: candidateProfile.candidate_experience,
        education: candidateProfile.candidate_education,
        availability: candidateProfile.candidate_availability?.[0],
        preferences: candidateProfile.candidate_preferences?.[0],
      };
    }
  } else {
    const { data: companyProfile } = await getCompanyProfile(userData.user.id);
    if (companyProfile) {
      profileData = {
        ...companyProfile,
        teamMembers: companyProfile.company_team_members,
        jobInterests: companyProfile.company_job_interests,
      };
    }
  }
  
  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Edit Profile</h1>
        <p className="text-muted-foreground">
          Update your profile information
        </p>
      </div>
      
      {userProfile.user_type === "candidate" ? (
        <Tabs defaultValue="basic-info">
          <TabsList className="mb-6 grid w-full grid-cols-4">
            <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic-info">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Update your personal and professional information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BasicInfoForm initialData={profileData} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="skills">
            <Card>
              <CardHeader>
                <CardTitle>Skills</CardTitle>
                <CardDescription>
                  Add or update your skills
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SkillsForm initialSkills={profileData.skills} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="experience">
            <Card>
              <CardHeader>
                <CardTitle>Experience & Education</CardTitle>
                <CardDescription>
                  Manage your work experience and education history
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ExperienceForm 
                  initialExperiences={profileData.experiences} 
                  initialEducation={profileData.education} 
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle>Preferences & Availability</CardTitle>
                <CardDescription>
                  Update your job preferences and availability
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PreferencesForm 
                  initialAvailability={profileData.availability} 
                  initialPreferences={profileData.preferences} 
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        <Tabs defaultValue="company-info">
          <TabsList className="mb-6 grid w-full grid-cols-3">
            <TabsTrigger value="company-info">Company Info</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="hiring">Hiring Interests</TabsTrigger>
          </TabsList>
          
          <TabsContent value="company-info">
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
                <CardDescription>
                  Update your company details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CompanyInfoForm initialData={profileData} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="team">
            <Card>
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>
                  Manage your company's team members
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TeamForm initialTeamMembers={profileData.teamMembers} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="hiring">
            <Card>
              <CardHeader>
                <CardTitle>Hiring Interests</CardTitle>
                <CardDescription>
                  Manage positions you're currently hiring for
                </CardDescription>
              </CardHeader>
              <CardContent>
                <HiringInterestsForm initialJobInterests={profileData.jobInterests} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}