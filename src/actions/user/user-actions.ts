"use server";

import { authActionClient } from "@/actions/safe-action";
import { createUserProfile, updateUserProfile, updateCandidateProfile, updateCompanyProfile, addCandidateSkill, updateCandidateSkill, deleteCandidateSkill, addCandidateExperience, updateCandidateExperience, deleteCandidateExperience, addCandidateEducation, updateCandidateEducation, deleteCandidateEducation, addCandidatePortfolio, updateCandidatePortfolio, deleteCandidatePortfolio, updateCandidateAvailability, updateCandidatePreferences, addCompanyTeamMember, updateCompanyTeamMember, deleteCompanyTeamMember, addCompanyJobInterest, updateCompanyJobInterest, deleteCompanyJobInterest, saveCandidate, unsaveCandidate, recordCandidateView } from "@/lib/supabase/mutations/user";
import { selectUserTypeSchema, updateUserProfileSchema, updateCandidateProfileSchema, candidateSkillSchema, candidateExperienceSchema, candidateEducationSchema, candidatePortfolioSchema, candidateAvailabilitySchema, candidatePreferencesSchema, updateCompanyProfileSchema, companyTeamMemberSchema, companyJobInterestSchema, saveCandidateSchema, candidateViewSchema } from "./schema";

export const selectUserTypeAction = authActionClient
  .schema(selectUserTypeSchema)
  .metadata({
    name: "select-user-type",
  })
  .action(async ({ parsedInput: { userType }, ctx: { user } }) => {
    const result = await createUserProfile(user.id, userType);
    return result;
  });

export const updateUserProfileAction = authActionClient
  .schema(updateUserProfileSchema)
  .metadata({
    name: "update-user-profile",
  })
  .action(async ({ parsedInput, ctx: { user } }) => {
    const result = await updateUserProfile(user.id, parsedInput);
    return result;
  });

export const updateCandidateProfileAction = authActionClient
  .schema(updateCandidateProfileSchema)
  .metadata({
    name: "update-candidate-profile",
  })
  .action(async ({ parsedInput, ctx: { user } }) => {
    const result = await updateCandidateProfile(user.id, parsedInput);
    return result;
  });

export const addCandidateSkillAction = authActionClient
  .schema(candidateSkillSchema)
  .metadata({
    name: "add-candidate-skill",
  })
  .action(async ({ parsedInput, ctx: { user } }) => {
    const result = await addCandidateSkill(user.id, parsedInput);
    return result;
  });

export const updateCandidateSkillAction = authActionClient
  .schema(candidateSkillSchema.extend({ id: z.string().uuid() }))
  .metadata({
    name: "update-candidate-skill",
  })
  .action(async ({ parsedInput, ctx: { user } }) => {
    const { id, ...data } = parsedInput;
    const result = await updateCandidateSkill(id, data);
    return result;
  });

export const deleteCandidateSkillAction = authActionClient
  .schema(z.object({ id: z.string().uuid() }))
  .metadata({
    name: "delete-candidate-skill",
  })
  .action(async ({ parsedInput: { id }, ctx: { user } }) => {
    const result = await deleteCandidateSkill(id);
    return result;
  });

export const addCandidateExperienceAction = authActionClient
  .schema(candidateExperienceSchema)
  .metadata({
    name: "add-candidate-experience",
  })
  .action(async ({ parsedInput, ctx: { user } }) => {
    const result = await addCandidateExperience(user.id, parsedInput);
    return result;
  });

export const updateCandidateExperienceAction = authActionClient
  .schema(candidateExperienceSchema.extend({ id: z.string().uuid() }))
  .metadata({
    name: "update-candidate-experience",
  })
  .action(async ({ parsedInput, ctx: { user } }) => {
    const { id, ...data } = parsedInput;
    const result = await updateCandidateExperience(id, data);
    return result;
  });

export const deleteCandidateExperienceAction = authActionClient
  .schema(z.object({ id: z.string().uuid() }))
  .metadata({
    name: "delete-candidate-experience",
  })
  .action(async ({ parsedInput: { id }, ctx: { user } }) => {
    const result = await deleteCandidateExperience(id);
    return result;
  });

export const addCandidateEducationAction = authActionClient
  .schema(candidateEducationSchema)
  .metadata({
    name: "add-candidate-education",
  })
  .action(async ({ parsedInput, ctx: { user } }) => {
    const result = await addCandidateEducation(user.id, parsedInput);
    return result;
  });

export const updateCandidateEducationAction = authActionClient
  .schema(candidateEducationSchema.extend({ id: z.string().uuid() }))
  .metadata({
    name: "update-candidate-education",
  })
  .action(async ({ parsedInput, ctx: { user } }) => {
    const { id, ...data } = parsedInput;
    const result = await updateCandidateEducation(id, data);
    return result;
  });

export const deleteCandidateEducationAction = authActionClient
  .schema(z.object({ id: z.string().uuid() }))
  .metadata({
    name: "delete-candidate-education",
  })
  .action(async ({ parsedInput: { id }, ctx: { user } }) => {
    const result = await deleteCandidateEducation(id);
    return result;
  });

export const addCandidatePortfolioAction = authActionClient
  .schema(candidatePortfolioSchema)
  .metadata({
    name: "add-candidate-portfolio",
  })
  .action(async ({ parsedInput, ctx: { user } }) => {
    const result = await addCandidatePortfolio(user.id, parsedInput);
    return result;
  });

export const updateCandidatePortfolioAction = authActionClient
  .schema(candidatePortfolioSchema.extend({ id: z.string().uuid() }))
  .metadata({
    name: "update-candidate-portfolio",
  })
  .action(async ({ parsedInput, ctx: { user } }) => {
    const { id, ...data } = parsedInput;
    const result = await updateCandidatePortfolio(id, data);
    return result;
  });

export const deleteCandidatePortfolioAction = authActionClient
  .schema(z.object({ id: z.string().uuid() }))
  .metadata({
    name: "delete-candidate-portfolio",
  })
  .action(async ({ parsedInput: { id }, ctx: { user } }) => {
    const result = await deleteCandidatePortfolio(id);
    return result;
  });

export const updateCandidateAvailabilityAction = authActionClient
  .schema(candidateAvailabilitySchema)
  .metadata({
    name: "update-candidate-availability",
  })
  .action(async ({ parsedInput, ctx: { user } }) => {
    const result = await updateCandidateAvailability(user.id, parsedInput);
    return result;
  });

export const updateCandidatePreferencesAction = authActionClient
  .schema(candidatePreferencesSchema)
  .metadata({
    name: "update-candidate-preferences",
  })
  .action(async ({ parsedInput, ctx: { user } }) => {
    const result = await updateCandidatePreferences(user.id, parsedInput);
    return result;
  });

export const updateCompanyProfileAction = authActionClient
  .schema(updateCompanyProfileSchema)
  .metadata({
    name: "update-company-profile",
  })
  .action(async ({ parsedInput, ctx: { user } }) => {
    const result = await updateCompanyProfile(user.id, parsedInput);
    return result;
  });

export const addCompanyTeamMemberAction = authActionClient
  .schema(companyTeamMemberSchema)
  .metadata({
    name: "add-company-team-member",
  })
  .action(async ({ parsedInput, ctx: { user } }) => {
    const result = await addCompanyTeamMember(user.id, parsedInput);
    return result;
  });

export const updateCompanyTeamMemberAction = authActionClient
  .schema(companyTeamMemberSchema.extend({ id: z.string().uuid() }))
  .metadata({
    name: "update-company-team-member",
  })
  .action(async ({ parsedInput, ctx: { user } }) => {
    const { id, ...data } = parsedInput;
    const result = await updateCompanyTeamMember(id, data);
    return result;
  });

export const deleteCompanyTeamMemberAction = authActionClient
  .schema(z.object({ id: z.string().uuid() }))
  .metadata({
    name: "delete-company-team-member",
  })
  .action(async ({ parsedInput: { id }, ctx: { user } }) => {
    const result = await deleteCompanyTeamMember(id);
    return result;
  });

export const addCompanyJobInterestAction = authActionClient
  .schema(companyJobInterestSchema)
  .metadata({
    name: "add-company-job-interest",
  })
  .action(async ({ parsedInput, ctx: { user } }) => {
    const result = await addCompanyJobInterest(user.id, parsedInput);
    return result;
  });

export const updateCompanyJobInterestAction = authActionClient
  .schema(companyJobInterestSchema.extend({ id: z.string().uuid() }))
  .metadata({
    name: "update-company-job-interest",
  })
  .action(async ({ parsedInput, ctx: { user } }) => {
    const { id, ...data } = parsedInput;
    const result = await updateCompanyJobInterest(id, data);
    return result;
  });

export const deleteCompanyJobInterestAction = authActionClient
  .schema(z.object({ id: z.string().uuid() }))
  .metadata({
    name: "delete-company-job-interest",
  })
  .action(async ({ parsedInput: { id }, ctx: { user } }) => {
    const result = await deleteCompanyJobInterest(id);
    return result;
  });

export const saveCandidateAction = authActionClient
  .schema(saveCandidateSchema)
  .metadata({
    name: "save-candidate",
  })
  .action(async ({ parsedInput: { candidateId, notes }, ctx: { user } }) => {
    const result = await saveCandidate(user.id, candidateId, notes);
    return result;
  });

export const unsaveCandidateAction = authActionClient
  .schema(z.object({ candidateId: z.string().uuid() }))
  .metadata({
    name: "unsave-candidate",
  })
  .action(async ({ parsedInput: { candidateId }, ctx: { user } }) => {
    const result = await unsaveCandidate(user.id, candidateId);
    return result;
  });

export const recordCandidateViewAction = authActionClient
  .schema(candidateViewSchema)
  .metadata({
    name: "record-candidate-view",
  })
  .action(async ({ parsedInput: { candidateId }, ctx: { user } }) => {
    const result = await recordCandidateView(candidateId, user.id);
    return result;
  });