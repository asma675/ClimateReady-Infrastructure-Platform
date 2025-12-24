import { createClient } from "@supabase/supabase-js";

// Vite exposes env vars that start with VITE_ to the client bundle.
// Add these in Vercel Project Settings -> Environment Variables.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const hasSupabase =
  typeof supabaseUrl === "string" && supabaseUrl.length > 0 &&
  typeof supabaseAnonKey === "string" && supabaseAnonKey.length > 0;

export const supabase = hasSupabase ? createClient(supabaseUrl, supabaseAnonKey) : null;
