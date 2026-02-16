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
  token: string
) => {
  const supabase = getSupabase(token);

  return supabase
    .from("candidate_profiles") // ✅ correct table?
    .upsert(payload, { onConflict: "user_id" })
    .select()
    .single();
};