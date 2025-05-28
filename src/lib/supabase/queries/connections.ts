import { createClient } from "@/lib/supabase/clients/server";

export async function getPendingConnectionRequests(userId: string) {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("connection_requests")
      .select(`
        *,
        sender:sender_id(
          id,
          users (
            full_name,
            email,
            avatar_url
          ),
          user_profiles (
            user_type
          ),
          candidate_profiles (
            headline,
            location,
            experience_level
          ),
          company_profiles (
            company_name,
            industry,
            headquarters_location
          )
        )
      `)
      .eq("recipient_id", userId)
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error fetching pending connection requests:", error);
    return { data: null, error };
  }
}

export async function getSentConnectionRequests(userId: string) {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("connection_requests")
      .select(`
        *,
        recipient:recipient_id(
          id,
          users (
            full_name,
            email,
            avatar_url
          ),
          user_profiles (
            user_type
          ),
          candidate_profiles (
            headline,
            location,
            experience_level
          ),
          company_profiles (
            company_name,
            industry,
            headquarters_location
          )
        )
      `)
      .eq("sender_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error fetching sent connection requests:", error);
    return { data: null, error };
  }
}

export async function getConnectionStatus(userId: string, otherUserId: string) {
  const supabase = createClient();

  try {
    // Check if there's a connection request between the users
    const { data, error } = await supabase
      .from("connection_requests")
      .select("*")
      .or(`and(sender_id.eq.${userId},recipient_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},recipient_id.eq.${userId})`)
      .maybeSingle();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error getting connection status:", error);
    return { data: null, error };
  }
}