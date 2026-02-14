import { getSupabase } from "./supabase.service.js";

//To update and insert recruiter profile details

interface UpdateJobPayload {
  title?: string;
  description?: string;
  location?: string;
  type?: string;
  salary?: number;
  experience?: string;
}

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
  token: string,
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

//For jobs

//to create a job
export const createJob = async (
  payload: {
    recruiter_id: string;
    title: string;
    description: string;
    location: string;
    type: string;
    salary: number;
    experience: string;
  },
  token: string,
) => {
  const supabase = getSupabase(token);
  return supabase.from("jobs").insert([payload]).select().single();
};

export const getMyJobs = async (recruiter_id: string, token: string) => {
  const supabase = getSupabase(token);
  return supabase
    .from("jobs")
    .select("*")
    .eq("recruiter_id", recruiter_id)
    .order("created_at", { ascending: false });
};

//update a job
export const updateJob = async (
  jobId: string,
  recruiter_id: string,
  payload: UpdateJobPayload,
  token: string,
) => {
  const supabase = getSupabase(token);

  return await supabase
    .from("jobs")
    .update(payload)
    .eq("id", jobId)
    .eq("recruiter_id", recruiter_id)
    .select();
};

//delete a posted job

export const deleteJob = async (
  jobId: string,
  recruiter_id: string,
  token: string,
) => {
  const supabase = getSupabase(token);
  return await supabase
    .from("jobs")
    .delete()
    .eq("id", jobId)
    .eq("recruiter_id", recruiter_id);
};
