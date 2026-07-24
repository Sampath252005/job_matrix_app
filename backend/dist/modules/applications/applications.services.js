import { getSupabase } from "../../config/supabase.js";
const allowedStatus = [
    "PENDING",
    "SHORTLISTED",
    "REJECTED",
    "INTERVIEW",
    "HIRED",
];
export const checkJobOwnership = async (jobId, recruiter_id, token) => {
    const supabase = getSupabase(token);
    return await supabase
        .from("jobs")
        .select("id")
        .eq("id", jobId)
        .eq("recruiter_id", recruiter_id)
        .single();
};
export const getApplicationsByJob = async (jobId, token) => {
    const supabase = getSupabase(token);
    return await supabase
        .from("applications")
        .select(`
  id,
  status,
  applied_at,
  users!applications_candidate_id_fkey (
    id,
    name,
    email,
    candidate_profiles (
      education,
      college,
      degree,
      branch,
      skills,
      resume_url,
      portfolio_url,
      location
    )
  )
`)
        .eq("job_id", jobId);
};
export const updateStatusService = async (applicationId, recruiter_id, status, token) => {
    const supabase = getSupabase(token);
    if (!allowedStatus.includes(status)) {
        throw new Error("Invalid status value");
    }
    // 🔥 Typed query to avoid array confusion
    const { data: appData, error: appError } = await supabase
        .from("applications")
        .select(`
      id,
      jobs!inner (
        recruiter_id
      )
    `)
        .eq("id", applicationId)
        .single();
    if (appError || !appData) {
        throw new Error("Application not found");
    }
    const jobRecruiterId = appData.jobs.recruiter_id;
    if (jobRecruiterId !== recruiter_id) {
        throw new Error("Not authorized");
    }
    const { data, error } = await supabase
        .from("applications")
        .update({ status })
        .eq("id", applicationId)
        .select()
        .single();
    if (error)
        throw error;
    return data;
};
export const getShortListedApplication = async (jobId, token) => {
    const supabase = getSupabase(token);
    return await supabase
        .from("applications")
        .select(`
  id,
  status,
  applied_at,
  users!applications_candidate_id_fkey (
    id,
    name,
    email,
    candidate_profiles (
      education,
      college,
      degree,
      branch,
      skills,
      resume_url,
      portfolio_url,
      location
    )
  )
`)
        .eq("job_id", jobId)
        .eq("status", "SHORTLISTED");
};
//------------------------------------------------------candidate side application services--------------------------------//
export const applyToJobServices = async (jobId, candidateId, token) => {
    const supabase = getSupabase(token);
    const { data: existing } = await supabase
        .from("applications")
        .select("id")
        .eq("job_id", jobId)
        .eq("candidate_id", candidateId)
        .maybeSingle();
    if (existing) {
        throw new Error("Already applied to this job");
    }
    return await supabase
        .from("applications")
        .insert({
        job_id: jobId,
        candidate_id: candidateId,
        status: "PENDING",
    })
        .select()
        .single();
};
export const getMyApplicationsService = async (candidateId, token) => {
    const supabase = getSupabase(token);
    return await supabase
        .from("applications")
        .select(`
      id,
      status,
      applied_at,
      jobs (
        id,
        title,
        location,
        type,
        salary
      )
    `)
        .eq("candidate_id", candidateId)
        .order("applied_at", { ascending: false });
};
export const getApplicationByIdService = async (applicationId, candidateId, token) => {
    const supabase = getSupabase(token);
    return await supabase
        .from("applications")
        .select(`
      id,
      status,
      applied_at,
      jobs (
        id,
        title,
        description,
        location,
        type,
        salary
      )
    `)
        .eq("id", applicationId)
        .eq("candidate_id", candidateId)
        .single();
};
export const deleteApplcationService = async (applicationId, candidateId, token) => {
    const supabase = getSupabase(token);
    const { data: app, error: fetchError } = await supabase
        .from("applications")
        .select("id ,status")
        .eq("id", applicationId)
        .eq("candidate_id", candidateId)
        .single();
    console.log(fetchError, app);
    if (fetchError || !app) {
        throw new Error("Application not found or not authorized");
    }
    if (app.status === "HIRED") {
        throw new Error("Cannot withdraw after hiring");
    }
    const { error } = await supabase
        .from("applications")
        .delete()
        .eq("id", applicationId)
        .eq("candidate_id", candidateId);
    if (error)
        throw error;
    return true;
};
//# sourceMappingURL=applications.services.js.map