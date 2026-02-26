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
// export const upsertProfileDetails = async (
//   payload: CandidateProfilePayload,
//   token: string,
// ) => {
//   const supabase = getSupabase(token);

//   return supabase
//     .from("candidate_profiles") // ✅ correct table?
//     .upsert(payload, { onConflict: "user_id" })
//     .select()
//     .single();
// };

// //To fectch candidate profile
// export const getCandidateProfile = async (token: string) => {
//   const supabase = getSupabase(token);

//   const { data: userData } = await supabase.auth.getUser();
//   const userId = userData.user?.id;

//   return supabase
//     .from("candidate_profiles")
//     .select("*")
//     .eq("user_id", userId)
//     .maybeSingle();
// };

//to fetch all the jobs

export const getAlljobs = async (token: string) => {
  const supabase = getSupabase(token);

  return supabase
    .from("jobs")
    .select("*")
    .eq("status", "OPEN")
    .order("created_at", { ascending: false });
};

//to get job deatils based on the id

export const GetJobDetailsFromDb = async (jobId: string, token: string) => {
  const supabase = getSupabase(token);

  return supabase
    .from("jobs")
    .select(
      `
      id,
      title,
      description,
      location,
      type,
      salary,
      experience,
      created_at,
      users (
        id,
        name,
        company_profiles (
          company_name,
          website,
          industry,
          company_size,
          description,
          logo_url
        )
      )
    `,
    )
    .eq("id", jobId)
    .eq("status", "OPEN")
    .single();
};
