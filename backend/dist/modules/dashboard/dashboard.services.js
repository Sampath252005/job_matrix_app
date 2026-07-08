import { getSupabase } from "../../config/supabase.js";
export const getRecruiterDashboardStats = async (recruiter_id, token) => {
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
export const getCandidateDashboardStats = async (candidate_id, token) => {
    const supabase = getSupabase(token);
    // Total applications
    const { count: totalApplications } = await supabase
        .from("applications")
        .select("*", { count: "exact", head: true })
        .eq("candidate_id", candidate_id);
    // Shortlisted
    const { count: shortlisted } = await supabase
        .from("applications")
        .select("*", { count: "exact", head: true })
        .eq("candidate_id", candidate_id)
        .eq("status", "SHORTLISTED");
    // Rejected
    const { count: rejected } = await supabase
        .from("applications")
        .select("*", { count: "exact", head: true })
        .eq("candidate_id", candidate_id)
        .eq("status", "REJECTED");
    // Hired
    const { count: hired } = await supabase
        .from("applications")
        .select("*", { count: "exact", head: true })
        .eq("candidate_id", candidate_id)
        .eq("status", "HIRED");
    // Interviews
    const { count: interviews } = await supabase
        .from("interviews")
        .select("*", { count: "exact", head: true })
        .eq("candidate_id", candidate_id);
    return {
        totalApplications: totalApplications ?? 0,
        shortlisted: shortlisted ?? 0,
        rejected: rejected ?? 0,
        hired: hired ?? 0,
        interviews: interviews ?? 0,
    };
};
//# sourceMappingURL=dashboard.services.js.map