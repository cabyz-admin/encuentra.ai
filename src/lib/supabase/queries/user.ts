import { createClient } from "@/lib/supabase/clients/server";
import { UserType } from "@/types/user";

export async function getUserProfile(userId: string) {
  const supabase = createClient();

  try {
    const { data: userProfile, error: userProfileError } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (userProfileError) throw userProfileError;

    if (!userProfile) {
      return { data: null, error: null };
    }

    // Based on user type, fetch the appropriate profile
    if (userProfile.user_type === "candidate") {
      const { data: candidateProfile, error: candidateError } = await supabase
        .from("candidate_profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (candidateError) throw candidateError;

      return {
        data: {
          ...userProfile,
          candidateProfile,
        },
        error: null,
      };
    } else if (userProfile.user_type === "company") {
      const { data: companyProfile, error: companyError } = await supabase
        .from("company_profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (companyError) throw companyError;

      return {
        data: {
          ...userProfile,
          companyProfile,
        },
        error: null,
      };
    }

    return { data: userProfile, error: null };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return { data: null, error };
  }
}

export async function getCandidateProfiles(filters?: {
  skills?: string[];
  experience_level?: string;
  remote_preference?: string;
  location?: string;
  availability?: string;
}) {
  const supabase = createClient();

  try {
    let query = supabase
      .from("candidate_profiles")
      .select(`
        *,
        candidate_skills (
          skill_name,
          proficiency,
          years_of_experience
        ),
        candidate_experience (
          company_name,
          title,
          start_date,
          end_date,
          is_current
        ),
        candidate_education (
          institution,
          degree,
          field_of_study,
          start_date,
          end_date
        ),
        candidate_availability (
          status,
          available_from
        ),
        candidate_preferences (
          min_salary,
          max_salary,
          currency,
          employment_types,
          remote_preference,
          locations,
          industries
        ),
        users (
          full_name,
          email,
          avatar_url
        )
      `)
      .eq("is_public", true);

    // Apply filters if provided
    if (filters) {
      if (filters.experience_level) {
        query = query.eq("experience_level", filters.experience_level);
      }

      if (filters.availability) {
        query = query.eq("candidate_availability.status", filters.availability);
      }

      // More complex filters would require custom functions or post-processing
    }

    const { data, error } = await query;

    if (error) throw error;

    // Post-process for skills filter if needed
    if (filters?.skills && filters.skills.length > 0 && data) {
      return {
        data: data.filter(candidate => 
          candidate.candidate_skills.some(skill => 
            filters.skills?.includes(skill.skill_name)
          )
        ),
        error: null
      };
    }

    return { data, error: null };
  } catch (error) {
    console.error("Error fetching candidate profiles:", error);
    return { data: null, error };
  }
}

export async function getCandidateProfile(candidateId: string) {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("candidate_profiles")
      .select(`
        *,
        candidate_skills (
          id,
          skill_name,
          proficiency,
          years_of_experience
        ),
        candidate_experience (
          id,
          company_name,
          title,
          location,
          start_date,
          end_date,
          is_current,
          description
        ),
        candidate_education (
          id,
          institution,
          degree,
          field_of_study,
          start_date,
          end_date,
          is_current,
          description
        ),
        candidate_portfolios (
          id,
          title,
          description,
          url,
          image_url
        ),
        candidate_availability (
          status,
          available_from,
          notice_period_days
        ),
        candidate_preferences (
          min_salary,
          max_salary,
          currency,
          employment_types,
          remote_preference,
          locations,
          industries
        ),
        users (
          full_name,
          email,
          avatar_url
        )
      `)
      .eq("id", candidateId)
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error fetching candidate profile:", error);
    return { data: null, error };
  }
}

export async function getCompanyProfiles() {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("company_profiles")
      .select(`
        *,
        company_team_members (
          id,
          name,
          title,
          avatar_url
        ),
        company_job_interests (
          id,
          title,
          skills,
          experience_level
        ),
        users (
          full_name,
          email,
          avatar_url
        )
      `);

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error fetching company profiles:", error);
    return { data: null, error };
  }
}

export async function getCompanyProfile(companyId: string) {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("company_profiles")
      .select(`
        *,
        company_team_members (
          id,
          name,
          title,
          email,
          avatar_url
        ),
        company_job_interests (
          id,
          title,
          description,
          skills,
          experience_level,
          employment_type,
          remote_preference,
          min_salary,
          max_salary,
          currency,
          locations
        ),
        users (
          full_name,
          email,
          avatar_url
        )
      `)
      .eq("id", companyId)
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error fetching company profile:", error);
    return { data: null, error };
  }
}

export async function getSkillTags() {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("skill_tags")
      .select("*")
      .order("name");

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error fetching skill tags:", error);
    return { data: null, error };
  }
}

export async function getIndustryTags() {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("industry_tags")
      .select("*")
      .order("name");

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error fetching industry tags:", error);
    return { data: null, error };
  }
}

export async function getLocationData() {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("location_data")
      .select("*")
      .order("country", { ascending: true })
      .order("city", { ascending: true });

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error fetching location data:", error);
    return { data: null, error };
  }
}

export async function getConversations(userId: string) {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("conversations")
      .select(`
        *,
        initiator:initiator_id(
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
            headline
          ),
          company_profiles (
            company_name
          )
        ),
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
            headline
          ),
          company_profiles (
            company_name
          )
        ),
        messages (
          id,
          content,
          sender_id,
          read,
          created_at
        )
      `)
      .or(`initiator_id.eq.${userId},recipient_id.eq.${userId}`)
      .order("updated_at", { ascending: false });

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return { data: null, error };
  }
}

export async function getMessages(conversationId: string) {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("messages")
      .select(`
        *,
        sender:sender_id(
          id,
          users (
            full_name,
            email,
            avatar_url
          )
        )
      `)
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error fetching messages:", error);
    return { data: null, error };
  }
}

export async function getCandidateViews(candidateId: string) {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("candidate_views")
      .select(`
        *,
        viewer:viewer_id(
          id,
          users (
            full_name,
            email,
            avatar_url
          ),
          user_profiles (
            user_type
          ),
          company_profiles (
            company_name
          )
        )
      `)
      .eq("candidate_id", candidateId)
      .order("viewed_at", { ascending: false });

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error fetching candidate views:", error);
    return { data: null, error };
  }
}

export async function getSavedCandidates(companyId: string) {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("company_saved_candidates")
      .select(`
        *,
        candidate:candidate_id(
          id,
          users (
            full_name,
            email,
            avatar_url
          ),
          candidate_profiles (
            headline,
            location,
            experience_level,
            years_of_experience
          ),
          candidate_skills (
            skill_name,
            proficiency
          )
        )
      `)
      .eq("company_id", companyId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error fetching saved candidates:", error);
    return { data: null, error };
  }
}