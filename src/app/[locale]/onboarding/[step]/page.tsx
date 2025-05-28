import { OnboardingLayout } from "@/components/onboarding/onboarding-layout";
import { BasicInfoForm } from "@/components/onboarding/candidate/basic-info-form";
import { SkillsForm } from "@/components/onboarding/candidate/skills-form";
import { ExperienceForm } from "@/components/onboarding/candidate/experience-form";
import { PreferencesForm } from "@/components/onboarding/candidate/preferences-form";
import { CompanyInfoForm } from "@/components/onboarding/company/company-info-form";
import { TeamForm } from "@/components/onboarding/company/team-form";
import { HiringInterestsForm } from "@/components/onboarding/company/hiring-interests-form";
import { getUser } from "@/lib/supabase/queries/index";
import { getUserProfile, getCandidateProfile, getCompanyProfile } from "@/lib/supabase/queries/user";
import { redirect } from "next/navigation";
import { OnboardingStep, UserType } from "@/types/user";

export const metadata = {
  title: "Onboarding",
};

export default async function OnboardingPage({ params }: { params: { step: string } }) {
  const step = parseInt(params.step);
  
  if (isNaN(step) || step < 1 || step > 4) {
    redirect("/onboarding/1");
  }
  
  const { data: userData } = await getUser();
  
  if (!userData?.user) {
    redirect("/login");
  }
  
  // Check if user has a profile
  const { data: userProfile } = await getUserProfile(userData.user.id);
  
  if (!userProfile) {
    redirect("/user-type");
  }
  
  // If user has completed onboarding, redirect to dashboard
  if (userProfile.onboarding_completed) {
    redirect("/dashboard");
  }
  
  const userType = userProfile.user_type as UserType;
  
  // Define onboarding steps based on user type
  const candidateSteps: Record<number, OnboardingStep> = {
    1: {
      id: 1,
      title: "Basic Information",
      description: "Tell us about yourself and your professional background",
      fields: ["headline", "bio", "location", "years_of_experience", "experience_level"],
      isCompleted: step > 1,
      isCurrent: step === 1,
    },
    2: {
      id: 2,
      title: "Skills",
      description: "Add your skills to help companies find you",
      fields: ["skills"],
      isCompleted: step > 2,
      isCurrent: step === 2,
    },
    3: {
      id: 3,
      title: "Experience & Education",
      description: "Add your work experience and education history",
      fields: ["experience", "education"],
      isCompleted: step > 3,
      isCurrent: step === 3,
    },
    4: {
      id: 4,
      title: "Preferences",
      description: "Set your job preferences and availability",
      fields: ["availability", "preferences"],
      isCompleted: false,
      isCurrent: step === 4,
    },
  };
  
  const companySteps: Record<number, OnboardingStep> = {
    1: {
      id: 1,
      title: "Company Information",
      description: "Tell us about your company",
      fields: ["company_name", "industry", "company_size", "founded_year", "headquarters_location", "bio"],
      isCompleted: step > 1,
      isCurrent: step === 1,
    },
    2: {
      id: 2,
      title: "Team Members",
      description: "Add key team members to showcase your company's leadership",
      fields: ["team_members"],
      isCompleted: step > 2,
      isCurrent: step === 2,
    },
    3: {
      id: 3,
      title: "Hiring Interests",
      description: "Add positions you're currently hiring for",
      fields: ["job_interests"],
      isCompleted: false,
      isCurrent: step === 3,
    },
  };
  
  const steps = userType === "candidate" ? candidateSteps : companySteps;
  
  // Get initial data for forms
  let initialData = {};
  
  if (userType === "candidate") {
    const { data: candidateProfile } = await getCandidateProfile(userData.user.id);
    if (candidateProfile) {
      initialData = {
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
      initialData = {
        ...companyProfile,
        teamMembers: companyProfile.company_team_members,
        jobInterests: companyProfile.company_job_interests,
      };
    }
  }
  
  // Render appropriate form based on user type and step
  const renderForm = () => {
    if (userType === "candidate") {
      switch (step) {
        case 1:
          return <BasicInfoForm initialData={initialData} />;
        case 2:
          return <SkillsForm initialSkills={initialData.skills} />;
        case 3:
          return <ExperienceForm initialExperiences={initialData.experiences} initialEducation={initialData.education} />;
        case 4:
          return <PreferencesForm initialAvailability={initialData.availability} initialPreferences={initialData.preferences} />;
        default:
          return null;
      }
    } else {
      switch (step) {
        case 1:
          return <CompanyInfoForm initialData={initialData} />;
        case 2:
          return <TeamForm initialTeamMembers={initialData.teamMembers} />;
        case 3:
          return <HiringInterestsForm initialJobInterests={initialData.jobInterests} />;
        default:
          return null;
      }
    }
  };
  
  return (
    <OnboardingLayout steps={steps} userType={userType}>
      {renderForm()}
    </OnboardingLayout>
  );
}