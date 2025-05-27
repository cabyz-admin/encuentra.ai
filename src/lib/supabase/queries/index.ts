import { createClient } from "@/lib/supabase/clients/server";

export async function getUser() {
  const supabase = createClient();

  try {
    const result = await supabase.auth.getUser();

    return result;
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
}

export async function getPosts() {
  const supabase = createClient();

  try {
    const result = await supabase.from("posts").select("*");

    return result;
  } catch (error) {
    console.error('Error getting posts:', error);
    throw error;
  }
}
