import { createClient } from "@/lib/supabase/clients/server";
import { TablesInsert } from "../types/db";

export async function updateMatchingPreferences(
  userId: string,
  data: Partial<TablesInsert<"matching_preferences">>
) {
  const supabase = createClient();

  try {
    // Check if preferences record exists
    const { data: existingData, error: checkError } = await supabase
      .from("matching_preferences")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (checkError) throw checkError;

    let result;

    if (existingData) {
      // Update existing record
      result = await supabase
        .from("matching_preferences")
        .update(data)
        .eq("id", userId)
        .select()
        .single();
    } else {
      // Insert new record
      result = await supabase
        .from("matching_preferences")
        .insert({
          ...data,
          id: userId,
        })
        .select()
        .single();
    }

    if (result.error) throw result.error;

    return { data: result.data, error: null };
  } catch (error) {
    console.error("Error updating matching preferences:", error);
    return { data: null, error };
  }
}

export async function updateMatchingFilters(
  userId: string,
  data: Partial<TablesInsert<"matching_filters">>
) {
  const supabase = createClient();

  try {
    // Check if filters record exists
    const { data: existingData, error: checkError } = await supabase
      .from("matching_filters")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (checkError) throw checkError;

    let result;

    if (existingData) {
      // Update existing record
      result = await supabase
        .from("matching_filters")
        .update(data)
        .eq("id", userId)
        .select()
        .single();
    } else {
      // Insert new record
      result = await supabase
        .from("matching_filters")
        .insert({
          ...data,
          id: userId,
        })
        .select()
        .single();
    }

    if (result.error) throw result.error;

    return { data: result.data, error: null };
  } catch (error) {
    console.error("Error updating matching filters:", error);
    return { data: null, error };
  }
}

export async function updateLocationData(
  userId: string,
  data: Partial<TablesInsert<"matching_location_data">>
) {
  const supabase = createClient();

  try {
    // Check if location data record exists
    const { data: existingData, error: checkError } = await supabase
      .from("matching_location_data")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (checkError) throw checkError;

    let result;

    if (existingData) {
      // Update existing record
      result = await supabase
        .from("matching_location_data")
        .update(data)
        .eq("user_id", userId)
        .select()
        .single();
    } else {
      // Insert new record
      result = await supabase
        .from("matching_location_data")
        .insert({
          ...data,
          user_id: userId,
        })
        .select()
        .single();
    }

    if (result.error) throw result.error;

    return { data: result.data, error: null };
  } catch (error) {
    console.error("Error updating location data:", error);
    return { data: null, error };
  }
}

export async function likeUser(
  likerId: string,
  likedId: string
) {
  const supabase = createClient();

  try {
    // Check if like already exists
    const { data: existingLike, error: checkError } = await supabase
      .from("user_likes")
      .select("*")
      .eq("liker_id", likerId)
      .eq("liked_id", likedId)
      .maybeSingle();

    if (checkError) throw checkError;

    // If like already exists, return it
    if (existingLike) {
      return { data: existingLike, error: null };
    }

    // Create new like
    const { data, error } = await supabase
      .from("user_likes")
      .insert({
        liker_id: likerId,
        liked_id: likedId,
      })
      .select()
      .single();

    if (error) throw error;

    // Record behavioral data
    await recordBehavioralData(likerId, likedId, 'like');

    // Check if there's a mutual like
    const { data: mutualLike, error: mutualError } = await supabase
      .from("user_likes")
      .select("*")
      .eq("liker_id", likedId)
      .eq("liked_id", likerId)
      .maybeSingle();

    if (mutualError) throw mutualError;

    return { 
      data: { 
        ...data, 
        isMutualMatch: !!mutualLike 
      }, 
      error: null 
    };
  } catch (error) {
    console.error("Error liking user:", error);
    return { data: null, error };
  }
}

export async function unlikeUser(
  likerId: string,
  likedId: string
) {
  const supabase = createClient();

  try {
    const { error } = await supabase
      .from("user_likes")
      .delete()
      .eq("liker_id", likerId)
      .eq("liked_id", likedId);

    if (error) throw error;

    // Record behavioral data
    await recordBehavioralData(likerId, likedId, 'unlike');

    return { error: null };
  } catch (error) {
    console.error("Error unliking user:", error);
    return { error };
  }
}

export async function recordBehavioralData(
  userId: string,
  targetId: string,
  actionType: string,
  metadata: Record<string, any> = {}
) {
  const supabase = createClient();

  try {
    // Call the database function to record behavioral data
    const { data, error } = await supabase
      .rpc('record_behavioral_data', {
        user_id: userId,
        target_id: targetId,
        action_type: actionType,
        metadata
      });

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error recording behavioral data:", error);
    return { data: null, error };
  }
}

export async function calculateMatchingScores() {
  const supabase = createClient();

  try {
    // Call the database function to update matching scores
    const { data, error } = await supabase
      .rpc('update_matching_scores');

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error calculating matching scores:", error);
    return { data: null, error };
  }
}