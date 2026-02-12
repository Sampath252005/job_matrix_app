import { createClient, SupabaseClient } from "@supabase/supabase-js";

export const getSupabase = (accessToken?: string): SupabaseClient => {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_KEY; // publishable / anon key

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("❌ Missing SUPABASE_URL or SUPABASE_KEY in .env");
  }
  

  return createClient(supabaseUrl, supabaseKey, {
    global: accessToken
      ? {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      : {},
  });
};
