import { getSupabase } from "./supabase.service.js";


//To update and insert recruiter profile details
export const upsertProfileDetails = async (
  payload: {
    user_id: string;
    company_name: string;
    website: string;
    company_size: number | null;
    description: string;
    logo_url: string | null;
    industry: string;
  },
  token: string
) => {

  const supabase = getSupabase(token); // ✅ PASS TOKEN HERE
 const { data: roleCheck } = await supabase.rpc("get_role_test");
console.log("ROLE CHECK:", roleCheck);

  console.log("Recruiter service function called");

  return supabase
    .from("company_profiles")
    .upsert(payload, { onConflict: "user_id" })
    .select()
    .single();
};

export const getRecruiterProfile = async (token: string) => {
  const supabase = getSupabase(token);

  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  

  return supabase
    .from("company_profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
};


