import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Client-side Supabase client
export function createSupabaseClient() {
  return createClient(supabaseUrl, supabaseAnonKey)
}

// Server-side Supabase client
export function createServerClient() {
  return createClient(supabaseUrl, supabaseAnonKey)
}

// Auth queries
export async function getUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return { data: { user } }
}

// Middleware helper
export async function updateSession(request: any, response: any) {
  const user = null // Simplified for now
  return { response, user }
}
