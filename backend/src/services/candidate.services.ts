import { getSupabase } from "./supabase.service.js";
interface CandidateProfilePayload {
  user_id: string;
  education: string | null;
  college: string | null;
  degree: string | null;
  branch: string | null;
  graduation_year: string | null;
  experience_level: string | null;
  skills: string[] | null;
  resume_url: string | null;
  portfolio_url: string | null;
  location: string | null;
  job_type_preference: string | null;
}
//to Update a user profile
export const upsertProfileDetails = async (
  payload: CandidateProfilePayload,
  token: string,
) => {
  const supabase = getSupabase(token);

  return supabase
    .from("candidate_profiles") // ✅ correct table?
    .upsert(payload, { onConflict: "user_id" })
    .select()
    .single();
};

//To fectch candidate profile
export const getCandidateProfile = async (token: string) => {
  const supabase = getSupabase(token);

  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;

  return supabase
    .from("candidate_profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
};


//to fetch all the jobs

export const getAlljobs = async (token: string) => {
  const supabase = getSupabase(token);

  return supabase
    .from("jobs")
    .select("*")
    .eq("status","OPEN")
    .order("created_at",{ascending:false});
};