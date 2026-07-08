import { getSupabase } from "../../config/supabase.js";
const allowedStatus = [
    "PENDING",
    "SHORTLISTED",
    "REJECTED",
    "INTERVIEW",
    "HIRED",
];
export const createJob = async (payload, token) => {
    const supabase = getSupabase(token);
    return supabase.from("jobs").insert([payload]).select().single();
};
//get job id
export const getJobById = async (recruiter_id, token, jobId) => {
    const supabase = getSupabase(token);
    return supabase
        .from("jobs")
        .select("*")
        .eq("id", jobId)
        .eq("recruiter_id", recruiter_id);
};
export const getMyJobs = async (recruiter_id, token) => {
    const supabase = getSupabase(token);
    return supabase
        .from("jobs")
        .select("*")
        .eq("recruiter_id", recruiter_id)
        .order("created_at", { ascending: false });
};
//update a job
export const updateJob = async (jobId, recruiter_id, payload, token) => {
    const supabase = getSupabase(token);
    return await supabase
        .from("jobs")
        .update(payload)
        .eq("id", jobId)
        .eq("recruiter_id", recruiter_id)
        .select();
};
//delete a posted job
export const deleteJob = async (jobId, recruiter_id, token) => {
    const supabase = getSupabase(token);
    return await supabase
        .from("jobs")
        .delete()
        .eq("id", jobId)
        .eq("recruiter_id", recruiter_id);
};
export const closeJob = async (jobId, recruiter_id, token) => {
    const supabase = getSupabase(token);
    return supabase
        .from("jobs")
        .update({ status: "CLOSED" })
        .eq("id", jobId)
        .eq("recruiter_id", recruiter_id)
        .select()
        .single();
};
export const toGetAllCurrentJOb = async (recruiter_id, token) => {
    const supabase = getSupabase(token);
    return supabase
        .from("jobs")
        .select("*")
        .eq("recruiter_id", recruiter_id)
        .eq("status", "OPEN")
        .order("created_at", { ascending: false });
};
//----------------------------------------------------------------candidate jobs api------------------------------------------------------
export const getAlljobs = async (token) => {
    const supabase = getSupabase(token);
    return supabase
        .from("jobs")
        .select("*")
        .eq("status", "OPEN")
        .order("created_at", { ascending: false });
};
//to get job deatils based on the id
export const GetJobDetailsFromDb = async (jobId, token) => {
    const supabase = getSupabase(token);
    return supabase
        .from("jobs")
        .select(`
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
    `)
        .eq("id", jobId)
        .eq("status", "OPEN")
        .single();
};
export const searchJobsService = async (filters, token) => {
    const supabase = getSupabase(token);
    let query = supabase
        .from("jobs")
        .select("*")
        .eq("status", "OPEN"); // assuming you have this
    if (filters.location) {
        query = query.ilike("location", `%${filters.location}%`);
    }
    if (filters.type) {
        query = query.eq("type", filters.type);
    }
    if (filters.skill) {
        query = query.ilike("title", `%${filters.skill}%`);
    }
    const { data, error } = await query.order("created_at", { ascending: false });
    if (error)
        throw error;
    return data;
};
//# sourceMappingURL=jobs.services.js.map