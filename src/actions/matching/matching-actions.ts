"use server";

import { authActionClient } from "@/actions/safe-action";
import { 
  updateMatchingPreferences, 
  updateMatchingFilters, 
  updateLocationData,
  likeUser,
  recordBehavioralData,
  calculateMatchingScores
} from "@/lib/supabase/mutations/matching";
import { 
  updateMatchingPreferencesSchema, 
  updateMatchingFiltersSchema, 
  updateLocationDataSchema,
  likeUserSchema,
  recordBehavioralDataSchema
} from "./schema";

export const updateMatchingPreferencesAction = authActionClient
  .schema(updateMatchingPreferencesSchema)
  .metadata({
    name: "update-matching-preferences",
  })
  .action(async ({ parsedInput, ctx: { user } }) => {
    const result = await updateMatchingPreferences(user.id, parsedInput);
    return result;
  });

export const updateMatchingFiltersAction = authActionClient
  .schema(updateMatchingFiltersSchema)
  .metadata({
    name: "update-matching-filters",
  })
  .action(async ({ parsedInput, ctx: { user } }) => {
    const result = await updateMatchingFilters(user.id, parsedInput);
    return result;
  });

export const updateLocationDataAction = authActionClient
  .schema(updateLocationDataSchema)
  .metadata({
    name: "update-location-data",
  })
  .action(async ({ parsedInput, ctx: { user } }) => {
    const result = await updateLocationData(user.id, parsedInput);
    return result;
  });

export const likeUserAction = authActionClient
  .schema(likeUserSchema)
  .metadata({
    name: "like-user",
  })
  .action(async ({ parsedInput: { userId }, ctx: { user } }) => {
    const result = await likeUser(user.id, userId);
    return result;
  });

export const recordBehavioralDataAction = authActionClient
  .schema(recordBehavioralDataSchema)
  .metadata({
    name: "record-behavioral-data",
  })
  .action(async ({ parsedInput: { targetId, actionType, metadata }, ctx: { user } }) => {
    const result = await recordBehavioralData(user.id, targetId, actionType, metadata);
    return result;
  });

export const calculateMatchingScoresAction = authActionClient
  .schema(z.object({}))
  .metadata({
    name: "calculate-matching-scores",
  })
  .action(async ({ ctx: { user } }) => {
    const result = await calculateMatchingScores();
    return result;
  });