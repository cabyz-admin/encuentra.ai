import { z } from "zod";
import { UserType } from "@/types/user";

export const selectUserTypeSchema = z.object({
  userType: z.enum(["candidate", "company"]),
});

export const updateUserProfileSchema = z.object({
  onboarding_step: z.number().optional(),
  onboarding_completed: z.boolean().optional(),
});

export const updateCandidateProfileSchema = z.object({
  headline: z.string().optional(),
  bio: z.string().optional(),
  location: z.string().optional(),
  years_of_experience: z.number().optional(),
  experience_level: z.enum(["entry", "mid", "senior", "executive"]).optional(),
  avatar_url: z.string().optional(),
  resume_url: z.string().optional(),
  linkedin_url: z.string().optional(),
  github_url: z.string().optional(),
  website_url: z.string().optional(),
  is_public: z.boolean().optional(),
});

export const candidateSkillSchema = z.object({
  skill_name: z.string(),
  proficiency: z.enum(["beginner", "intermediate", "advanced", "expert"]),
  years_of_experience: z.number().optional(),
});

export const candidateExperienceSchema = z.object({
  company_name: z.string(),
  title: z.string(),
  location: z.string().optional(),
  start_date: z.string(),
  end_date: z.string().optional(),
  is_current: z.boolean().default(false),
  description: z.string().optional(),
});

export const candidateEducationSchema = z.object({
  institution: z.string(),
  degree: z.string(),
  field_of_study: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  is_current: z.boolean().default(false),
  description: z.string().optional(),
});

export const candidatePortfolioSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  url: z.string().url(),
  image_url: z.string().optional(),
});

export const candidateAvailabilitySchema = z.object({
  status: z.enum(["active", "passive", "not_looking"]),
  available_from: z.string().optional(),
  notice_period_days: z.number().optional(),
});

export const candidatePreferencesSchema = z.object({
  min_salary: z.number().optional(),
  max_salary: z.number().optional(),
  currency: z.string().default("USD"),
  employment_types: z.array(z.enum(["full_time", "part_time", "contract", "freelance", "internship"])).optional(),
  remote_preference: z.enum(["remote", "hybrid", "onsite"]).optional(),
  locations: z.array(z.string()).optional(),
  industries: z.array(z.string()).optional(),
});

export const updateCompanyProfileSchema = z.object({
  company_name: z.string().optional(),
  industry: z.string().optional(),
  company_size: z.string().optional(),
  founded_year: z.number().optional(),
  website_url: z.string().optional(),
  linkedin_url: z.string().optional(),
  logo_url: z.string().optional(),
  headquarters_location: z.string().optional(),
  bio: z.string().optional(),
  culture: z.string().optional(),
  benefits: z.string().optional(),
});

export const companyTeamMemberSchema = z.object({
  name: z.string(),
  title: z.string(),
  email: z.string().email().optional(),
  avatar_url: z.string().optional(),
});

export const companyJobInterestSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  skills: z.array(z.string()).optional(),
  experience_level: z.enum(["entry", "mid", "senior", "executive"]).optional(),
  employment_type: z.enum(["full_time", "part_time", "contract", "freelance", "internship"]).default("full_time"),
  remote_preference: z.enum(["remote", "hybrid", "onsite"]).default("remote"),
  min_salary: z.number().optional(),
  max_salary: z.number().optional(),
  currency: z.string().default("USD"),
  locations: z.array(z.string()).optional(),
});

export const saveCandidateSchema = z.object({
  candidateId: z.string().uuid(),
  notes: z.string().optional(),
});

export const candidateViewSchema = z.object({
  candidateId: z.string().uuid(),
});