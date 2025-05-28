import { Database } from "@/lib/supabase/types/db";

export type UserType = Database["public"]["Enums"]["user_type"];
export type AvailabilityStatus = Database["public"]["Enums"]["availability_status"];
export type ExperienceLevel = Database["public"]["Enums"]["experience_level"];
export type EmploymentType = Database["public"]["Enums"]["employment_type"];
export type RemotePreference = Database["public"]["Enums"]["remote_preference"];
export type SkillLevel = Database["public"]["Enums"]["skill_level"];

export type User = Database["public"]["Tables"]["users"]["Row"];
export type UserProfile = Database["public"]["Tables"]["user_profiles"]["Row"];
export type CandidateProfile = Database["public"]["Tables"]["candidate_profiles"]["Row"];
export type CompanyProfile = Database["public"]["Tables"]["company_profiles"]["Row"];

export interface UserWithProfile extends User {
  profile?: UserProfile;
  candidateProfile?: CandidateProfile;
  companyProfile?: CompanyProfile;
}

export interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  fields: string[];
  isCompleted: boolean;
  isCurrent: boolean;
}

export interface CandidateOnboardingSteps {
  1: OnboardingStep; // Basic Info
  2: OnboardingStep; // Skills
  3: OnboardingStep; // Experience
  4: OnboardingStep; // Preferences
}

export interface CompanyOnboardingSteps {
  1: OnboardingStep; // Company Info
  2: OnboardingStep; // Team Details
  3: OnboardingStep; // Hiring Interests
}

export type OnboardingSteps = CandidateOnboardingSteps | CompanyOnboardingSteps;