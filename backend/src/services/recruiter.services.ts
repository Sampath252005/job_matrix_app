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
const allowedStatus = [
  "PENDING",
  "SHORTLISTED",
  "REJECTED",
  "INTERVIEW",
  "HIRED",
];

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
  // const { data: roleCheck } = await supabase.rpc("get_role_test");
  // console.log("ROLE CHECK:", roleCheck);

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
type ApplicationWithJob = {
  id: string;
  jobs: {
    recruiter_id: string;
  };
};

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

//for get all applicattion related to a particular job posted by the recruiter
export const checkJobOwnership = async (
  jobId: string,
  recruiter_id: string,
  token: string,
) => {
  const supabase = getSupabase(token);

  return await supabase
    .from("jobs")
    .select("id")
    .eq("id", jobId)
    .eq("recruiter_id", recruiter_id)
    .single();
};

export const getApplicationsByJob = async (jobId: string, token: string) => {
  const supabase = getSupabase(token);

  return await supabase
    .from("applications")
    .select(
      `
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
`,
    )
    .eq("job_id", jobId);
};

export const updateStatusService = async (
  applicationId: string,
  recruiter_id: string,
  status: string,
  token: string,
) => {
  const supabase = getSupabase(token);

  if (!allowedStatus.includes(status)) {
    throw new Error("Invalid status value");
  }

  // 🔥 Typed query to avoid array confusion
  const { data: appData, error: appError } = await supabase
    .from("applications")
    .select(
      `
      id,
      jobs!inner (
        recruiter_id
      )
    `,
    )
    .eq("id", applicationId)
    .single<ApplicationWithJob>();

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

  if (error) throw error;

  return data;
};

//to close a job

export const closeJob = async (
  jobId: string,
  recruiter_id: string,
  token: string,
) => {
  const supabase = getSupabase(token);
  return supabase
    .from("jobs")
    .update({ status: "CLOSED" })
    .eq("id", jobId)
    .eq("recruiter_id", recruiter_id)
    .select()
    .single();
};

//to get dashboard stats of the recruiter
export const getRecruiterDashboardStats = async (
  recruiter_id: string,
  token: string
) => {
  const supabase = getSupabase(token);

  // Total jobs
  const { count: totalJobs } = await supabase
    .from("jobs")
    .select("*", { count: "exact", head: true })
    .eq("recruiter_id", recruiter_id);

  // Open jobs
  const { count: openJobs } = await supabase
    .from("jobs")
    .select("*", { count: "exact", head: true })
    .eq("recruiter_id", recruiter_id)
    .eq("status", "OPEN");

  // Total applications
  const { count: totalApplications } = await supabase
    .from("applications")
    .select("id, jobs!inner(recruiter_id)", {
      count: "exact",
      head: true,
    })
    .eq("jobs.recruiter_id", recruiter_id);

  // Shortlisted
  const { count: shortlisted } = await supabase
    .from("applications")
    .select("id, jobs!inner(recruiter_id)", {
      count: "exact",
      head: true,
    })
    .eq("jobs.recruiter_id", recruiter_id)
    .eq("status", "SHORTLISTED");

  // Hired
  const { count: hired } = await supabase
    .from("applications")
    .select("id, jobs!inner(recruiter_id)", {
      count: "exact",
      head: true,
    })
    .eq("jobs.recruiter_id", recruiter_id)
    .eq("status", "HIRED");

  // Interviews
  const { count: interviews } = await supabase
    .from("interviews")
    .select("*", { count: "exact", head: true })
    .eq("recruiter_id", recruiter_id);

  return {
    totalJobs: totalJobs ?? 0,
    openJobs: openJobs ?? 0,
    totalApplications: totalApplications ?? 0,
    shortlisted: shortlisted ?? 0,
    hired: hired ?? 0,
    interviews: interviews ?? 0,
  };
};

