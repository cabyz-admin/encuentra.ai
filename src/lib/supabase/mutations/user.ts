import { createClient } from "@/lib/supabase/clients/server";
import { UserType } from "@/types/user";
import { TablesInsert } from "../types/db";

export async function createUserProfile(userId: string, userType: UserType) {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("user_profiles")
      .insert({
        id: userId,
        user_type: userType,
        onboarding_step: 1,
        onboarding_completed: false,
      })
      .select()
      .single();

    if (error) throw error;

    // Create the appropriate profile based on user type
    if (userType === "candidate") {
      const { error: candidateError } = await supabase
        .from("candidate_profiles")
        .insert({
          id: userId,
          is_public: false,
        });

      if (candidateError) throw candidateError;
    } else if (userType === "company") {
      const { error: companyError } = await supabase
        .from("company_profiles")
        .insert({
          id: userId,
          company_name: "", // Will be filled during onboarding
        });

      if (companyError) throw companyError;
    }

    return { data, error: null };
  } catch (error) {
    console.error("Error creating user profile:", error);
    return { data: null, error };
  }
}

export async function updateUserProfile(userId: string, data: any) {
  const supabase = createClient();

  try {
    const { data: updatedData, error } = await supabase
      .from("user_profiles")
      .update(data)
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;

    return { data: updatedData, error: null };
  } catch (error) {
    console.error("Error updating user profile:", error);
    return { data: null, error };
  }
}

export async function updateCandidateProfile(userId: string, data: any) {
  const supabase = createClient();

  try {
    const { data: updatedData, error } = await supabase
      .from("candidate_profiles")
      .update(data)
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;

    return { data: updatedData, error: null };
  } catch (error) {
    console.error("Error updating candidate profile:", error);
    return { data: null, error };
  }
}

export async function updateCompanyProfile(userId: string, data: any) {
  const supabase = createClient();

  try {
    const { data: updatedData, error } = await supabase
      .from("company_profiles")
      .update(data)
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;

    return { data: updatedData, error: null };
  } catch (error) {
    console.error("Error updating company profile:", error);
    return { data: null, error };
  }
}

export async function addCandidateSkill(
  candidateId: string,
  skillData: TablesInsert<"candidate_skills">
) {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("candidate_skills")
      .insert({
        ...skillData,
        candidate_id: candidateId,
      })
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error adding candidate skill:", error);
    return { data: null, error };
  }
}

export async function updateCandidateSkill(
  skillId: string,
  skillData: Partial<TablesInsert<"candidate_skills">>
) {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("candidate_skills")
      .update(skillData)
      .eq("id", skillId)
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error updating candidate skill:", error);
    return { data: null, error };
  }
}

export async function deleteCandidateSkill(skillId: string) {
  const supabase = createClient();

  try {
    const { error } = await supabase
      .from("candidate_skills")
      .delete()
      .eq("id", skillId);

    if (error) throw error;

    return { error: null };
  } catch (error) {
    console.error("Error deleting candidate skill:", error);
    return { error };
  }
}

export async function addCandidateExperience(
  candidateId: string,
  experienceData: TablesInsert<"candidate_experience">
) {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("candidate_experience")
      .insert({
        ...experienceData,
        candidate_id: candidateId,
      })
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error adding candidate experience:", error);
    return { data: null, error };
  }
}

export async function updateCandidateExperience(
  experienceId: string,
  experienceData: Partial<TablesInsert<"candidate_experience">>
) {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("candidate_experience")
      .update(experienceData)
      .eq("id", experienceId)
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error updating candidate experience:", error);
    return { data: null, error };
  }
}

export async function deleteCandidateExperience(experienceId: string) {
  const supabase = createClient();

  try {
    const { error } = await supabase
      .from("candidate_experience")
      .delete()
      .eq("id", experienceId);

    if (error) throw error;

    return { error: null };
  } catch (error) {
    console.error("Error deleting candidate experience:", error);
    return { error };
  }
}

export async function addCandidateEducation(
  candidateId: string,
  educationData: TablesInsert<"candidate_education">
) {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("candidate_education")
      .insert({
        ...educationData,
        candidate_id: candidateId,
      })
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error adding candidate education:", error);
    return { data: null, error };
  }
}

export async function updateCandidateEducation(
  educationId: string,
  educationData: Partial<TablesInsert<"candidate_education">>
) {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("candidate_education")
      .update(educationData)
      .eq("id", educationId)
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error updating candidate education:", error);
    return { data: null, error };
  }
}

export async function deleteCandidateEducation(educationId: string) {
  const supabase = createClient();

  try {
    const { error } = await supabase
      .from("candidate_education")
      .delete()
      .eq("id", educationId);

    if (error) throw error;

    return { error: null };
  } catch (error) {
    console.error("Error deleting candidate education:", error);
    return { error };
  }
}

export async function addCandidatePortfolio(
  candidateId: string,
  portfolioData: TablesInsert<"candidate_portfolios">
) {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("candidate_portfolios")
      .insert({
        ...portfolioData,
        candidate_id: candidateId,
      })
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error adding candidate portfolio:", error);
    return { data: null, error };
  }
}

export async function updateCandidatePortfolio(
  portfolioId: string,
  portfolioData: Partial<TablesInsert<"candidate_portfolios">>
) {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("candidate_portfolios")
      .update(portfolioData)
      .eq("id", portfolioId)
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error updating candidate portfolio:", error);
    return { data: null, error };
  }
}

export async function deleteCandidatePortfolio(portfolioId: string) {
  const supabase = createClient();

  try {
    const { error } = await supabase
      .from("candidate_portfolios")
      .delete()
      .eq("id", portfolioId);

    if (error) throw error;

    return { error: null };
  } catch (error) {
    console.error("Error deleting candidate portfolio:", error);
    return { error };
  }
}

export async function updateCandidateAvailability(
  candidateId: string,
  availabilityData: TablesInsert<"candidate_availability">
) {
  const supabase = createClient();

  try {
    // Check if availability record exists
    const { data: existingData, error: checkError } = await supabase
      .from("candidate_availability")
      .select("*")
      .eq("id", candidateId)
      .maybeSingle();

    if (checkError) throw checkError;

    let data;
    let error;

    if (existingData) {
      // Update existing record
      const result = await supabase
        .from("candidate_availability")
        .update(availabilityData)
        .eq("id", candidateId)
        .select()
        .single();
      
      data = result.data;
      error = result.error;
    } else {
      // Insert new record
      const result = await supabase
        .from("candidate_availability")
        .insert({
          ...availabilityData,
          id: candidateId,
        })
        .select()
        .single();
      
      data = result.data;
      error = result.error;
    }

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error updating candidate availability:", error);
    return { data: null, error };
  }
}

export async function updateCandidatePreferences(
  candidateId: string,
  preferencesData: TablesInsert<"candidate_preferences">
) {
  const supabase = createClient();

  try {
    // Check if preferences record exists
    const { data: existingData, error: checkError } = await supabase
      .from("candidate_preferences")
      .select("*")
      .eq("id", candidateId)
      .maybeSingle();

    if (checkError) throw checkError;

    let data;
    let error;

    if (existingData) {
      // Update existing record
      const result = await supabase
        .from("candidate_preferences")
        .update(preferencesData)
        .eq("id", candidateId)
        .select()
        .single();
      
      data = result.data;
      error = result.error;
    } else {
      // Insert new record
      const result = await supabase
        .from("candidate_preferences")
        .insert({
          ...preferencesData,
          id: candidateId,
        })
        .select()
        .single();
      
      data = result.data;
      error = result.error;
    }

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error updating candidate preferences:", error);
    return { data: null, error };
  }
}

export async function addCompanyTeamMember(
  companyId: string,
  teamMemberData: TablesInsert<"company_team_members">
) {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("company_team_members")
      .insert({
        ...teamMemberData,
        company_id: companyId,
      })
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error adding company team member:", error);
    return { data: null, error };
  }
}

export async function updateCompanyTeamMember(
  teamMemberId: string,
  teamMemberData: Partial<TablesInsert<"company_team_members">>
) {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("company_team_members")
      .update(teamMemberData)
      .eq("id", teamMemberId)
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error updating company team member:", error);
    return { data: null, error };
  }
}

export async function deleteCompanyTeamMember(teamMemberId: string) {
  const supabase = createClient();

  try {
    const { error } = await supabase
      .from("company_team_members")
      .delete()
      .eq("id", teamMemberId);

    if (error) throw error;

    return { error: null };
  } catch (error) {
    console.error("Error deleting company team member:", error);
    return { error };
  }
}

export async function addCompanyJobInterest(
  companyId: string,
  jobInterestData: TablesInsert<"company_job_interests">
) {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("company_job_interests")
      .insert({
        ...jobInterestData,
        company_id: companyId,
      })
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error adding company job interest:", error);
    return { data: null, error };
  }
}

export async function updateCompanyJobInterest(
  jobInterestId: string,
  jobInterestData: Partial<TablesInsert<"company_job_interests">>
) {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("company_job_interests")
      .update(jobInterestData)
      .eq("id", jobInterestId)
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error updating company job interest:", error);
    return { data: null, error };
  }
}

export async function deleteCompanyJobInterest(jobInterestId: string) {
  const supabase = createClient();

  try {
    const { error } = await supabase
      .from("company_job_interests")
      .delete()
      .eq("id", jobInterestId);

    if (error) throw error;

    return { error: null };
  } catch (error) {
    console.error("Error deleting company job interest:", error);
    return { error };
  }
}

export async function saveCandidate(
  companyId: string,
  candidateId: string,
  notes?: string
) {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("company_saved_candidates")
      .insert({
        company_id: companyId,
        candidate_id: candidateId,
        notes,
      })
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error saving candidate:", error);
    return { data: null, error };
  }
}

export async function unsaveCandidate(companyId: string, candidateId: string) {
  const supabase = createClient();

  try {
    const { error } = await supabase
      .from("company_saved_candidates")
      .delete()
      .eq("company_id", companyId)
      .eq("candidate_id", candidateId);

    if (error) throw error;

    return { error: null };
  } catch (error) {
    console.error("Error unsaving candidate:", error);
    return { error };
  }
}

export async function recordCandidateView(candidateId: string, viewerId: string) {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("candidate_views")
      .insert({
        candidate_id: candidateId,
        viewer_id: viewerId,
      })
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error recording candidate view:", error);
    return { data: null, error };
  }
}