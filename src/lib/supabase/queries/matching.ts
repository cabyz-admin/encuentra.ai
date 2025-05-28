import { createClient } from "@/lib/supabase/clients/server";

export async function getMatchingPreferences(userId: string) {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("matching_preferences")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error fetching matching preferences:", error);
    return { data: null, error };
  }
}

export async function getMatchingFilters(userId: string) {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("matching_filters")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error fetching matching filters:", error);
    return { data: null, error };
  }
}

export async function getLocationData(userId: string) {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("matching_location_data")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error fetching location data:", error);
    return { data: null, error };
  }
}

export async function getTopMatches(userId: string, userType: string, limit: number = 10) {
  const supabase = createClient();

  try {
    let query;

    if (userType === "candidate") {
      // Get top company matches for a candidate
      query = supabase
        .from("matching_scores")
        .select(`
          id,
          score,
          score_breakdown,
          company:company_id(
            id,
            company_name,
            industry,
            headquarters_location,
            logo_url,
            company_job_interests(
              id,
              title,
              skills
            ),
            users(
              full_name,
              email,
              avatar_url
            )
          )
        `)
        .eq("candidate_id", userId)
        .order("score", { ascending: false })
        .limit(limit);
    } else {
      // Get top candidate matches for a company
      query = supabase
        .from("matching_scores")
        .select(`
          id,
          score,
          score_breakdown,
          candidate:candidate_id(
            id,
            headline,
            location,
            experience_level,
            years_of_experience,
            avatar_url,
            candidate_skills(
              skill_name,
              proficiency
            ),
            users(
              full_name,
              email,
              avatar_url
            )
          )
        `)
        .eq("company_id", userId)
        .order("score", { ascending: false })
        .limit(limit);
    }

    const { data, error } = await query;

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error fetching top matches:", error);
    return { data: null, error };
  }
}

export async function getUserLikes(userId: string) {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("user_likes")
      .select("*")
      .eq("liker_id", userId);

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error fetching user likes:", error);
    return { data: null, error };
  }
}

export async function getMutualLikes(userId: string) {
  const supabase = createClient();

  try {
    // Get users who the current user has liked
    const { data: likedUsers, error: likedError } = await supabase
      .from("user_likes")
      .select("liked_id")
      .eq("liker_id", userId);

    if (likedError) throw likedError;

    if (!likedUsers || likedUsers.length === 0) {
      return { data: [], error: null };
    }

    // Get users who have liked the current user and are also liked by the current user
    const likedIds = likedUsers.map(like => like.liked_id);
    
    const { data, error } = await supabase
      .from("user_likes")
      .select(`
        id,
        created_at,
        liker:liker_id(
          id,
          users(
            full_name,
            email,
            avatar_url
          ),
          user_profiles(
            user_type
          ),
          candidate_profiles(
            headline,
            location,
            experience_level
          ),
          company_profiles(
            company_name,
            industry,
            headquarters_location
          )
        )
      `)
      .eq("liked_id", userId)
      .in("liker_id", likedIds);

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error fetching mutual likes:", error);
    return { data: null, error };
  }
}

export async function checkUserLiked(likerId: string, likedId: string) {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("user_likes")
      .select("*")
      .eq("liker_id", likerId)
      .eq("liked_id", likedId)
      .maybeSingle();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error checking if user is liked:", error);
    return { data: null, error };
  }
}

export async function getBehavioralData(userId: string, targetId: string, actionType?: string) {
  const supabase = createClient();

  try {
    let query = supabase
      .from("matching_behavioral_data")
      .select("*")
      .eq("user_id", userId)
      .eq("target_id", targetId);
    
    if (actionType) {
      query = query.eq("action_type", actionType);
    }

    const { data, error } = await query;

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error fetching behavioral data:", error);
    return { data: null, error };
  }
}