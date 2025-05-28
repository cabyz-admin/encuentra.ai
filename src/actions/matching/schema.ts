import { z } from "zod";

export const updateMatchingPreferencesSchema = z.object({
  skill_weight: z.number().min(0).max(2).optional(),
  experience_weight: z.number().min(0).max(2).optional(),
  location_weight: z.number().min(0).max(2).optional(),
  industry_weight: z.number().min(0).max(2).optional(),
  company_size_weight: z.number().min(0).max(2).optional(),
  remote_preference_weight: z.number().min(0).max(2).optional(),
  salary_weight: z.number().min(0).max(2).optional(),
  behavioral_weight: z.number().min(0).max(2).optional(),
});

export const updateMatchingFiltersSchema = z.object({
  skills: z.array(z.string()).optional(),
  experience_levels: z.array(z.string()).optional(),
  locations: z.array(z.string()).optional(),
  industries: z.array(z.string()).optional(),
  remote_preferences: z.array(z.string()).optional(),
  min_salary: z.number().optional(),
  max_salary: z.number().optional(),
  employment_types: z.array(z.string()).optional(),
  radius_km: z.number().optional(),
});

export const updateLocationDataSchema = z.object({
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  radius_km: z.number().optional(),
});

export const likeUserSchema = z.object({
  userId: z.string().uuid(),
});

export const recordBehavioralDataSchema = z.object({
  targetId: z.string().uuid(),
  actionType: z.string(),
  metadata: z.record(z.any()).optional(),
});