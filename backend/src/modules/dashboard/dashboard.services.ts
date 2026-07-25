import { getSupabase } from "../../config/supabase.js";

const APPLICATION_STATUSES = [
  "PENDING",
  "SHORTLISTED",
  "INTERVIEW",
  "HIRED",
  "REJECTED",
] as const;

function getMonthlyTrend(dates: Array<string | null | undefined>) {
  const now = new Date();
  const months = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - (5 - index), 1),
    );
    return {
      key: `${date.getUTCFullYear()}-${date.getUTCMonth()}`,
      label: date.toLocaleDateString("en", { month: "short" }),
      count: 0,
    };
  });

  const monthMap = new Map(months.map((month) => [month.key, month]));
  dates.forEach((value) => {
    if (!value) return;
    const date = new Date(value);
    const month = monthMap.get(
      `${date.getUTCFullYear()}-${date.getUTCMonth()}`,
    );
    if (month) month.count += 1;
  });

  return months.map(({ label, count }) => ({ label, count }));
}

function getStatusDistribution(rows: Array<{ status: string }>) {
  return APPLICATION_STATUSES.map((status) => ({
    status,
    count: rows.filter((row) => row.status === status).length,
  }));
}
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

  const { count: pending } = await supabase
    .from("applications")
    .select("id, jobs!inner(recruiter_id)", {
      count: "exact",
      head: true,
    })
    .eq("jobs.recruiter_id", recruiter_id)
    .eq("status", "PENDING");

  const { count: rejected } = await supabase
    .from("applications")
    .select("id, jobs!inner(recruiter_id)", {
      count: "exact",
      head: true,
    })
    .eq("jobs.recruiter_id", recruiter_id)
    .eq("status", "REJECTED");

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
    .from("applications")
    .select("id, jobs!inner(recruiter_id)", {
      count: "exact",
      head: true,
    })
    .eq("jobs.recruiter_id", recruiter_id)
    .eq("status", "INTERVIEW");

  const { count: submittedAssessments } = await supabase
    .from("assessment_attempts")
    .select("id, assessments!inner(recruiter_id)", {
      count: "exact",
      head: true,
    })
    .eq("assessments.recruiter_id", recruiter_id)
    .eq("status", "SUBMITTED");

  return {
    totalJobs: totalJobs ?? 0,
    openJobs: openJobs ?? 0,
    totalApplications: totalApplications ?? 0,
    pending: pending ?? 0,
    shortlisted: shortlisted ?? 0,
    rejected: rejected ?? 0,
    hired: hired ?? 0,
    interviews: interviews ?? 0,
    submittedAssessments: submittedAssessments ?? 0,
  };
};



export const getCandidateDashboardStats = async (
  candidate_id: string,
  token: string
) => {
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

  const { count: pending } = await supabase
    .from("applications")
    .select("*", { count: "exact", head: true })
    .eq("candidate_id", candidate_id)
    .eq("status", "PENDING");

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
    .from("applications")
    .select("*", { count: "exact", head: true })
    .eq("candidate_id", candidate_id)
    .eq("status", "INTERVIEW");

  const { count: submittedAssessments } = await supabase
    .from("assessment_attempts")
    .select("*", { count: "exact", head: true })
    .eq("candidate_id", candidate_id)
    .eq("status", "SUBMITTED");

  return {
    totalApplications: totalApplications ?? 0,
    pending: pending ?? 0,
    shortlisted: shortlisted ?? 0,
    rejected: rejected ?? 0,
    hired: hired ?? 0,
    interviews: interviews ?? 0,
    submittedAssessments: submittedAssessments ?? 0,
  };
};

export const getRecruiterDashboardAnalytics = async (
  recruiterId: string,
  token: string,
) => {
  const supabase = getSupabase(token);
  const { data: applications, error: applicationsError } = await supabase
    .from("applications")
    .select("status, applied_at, jobs!inner(recruiter_id)")
    .eq("jobs.recruiter_id", recruiterId);

  if (applicationsError) throw applicationsError;

  const { data: attempts, error: attemptsError } = await supabase
    .from("assessment_attempts")
    .select("status, score, submitted_at, assessments!inner(recruiter_id)")
    .eq("assessments.recruiter_id", recruiterId);

  if (attemptsError) throw attemptsError;

  const submittedAttempts = (attempts ?? []).filter(
    (attempt) => attempt.status !== "STARTED",
  );
  const averageScore = submittedAttempts.length
    ? submittedAttempts.reduce(
        (total, attempt) => total + Number(attempt.score ?? 0),
        0,
      ) / submittedAttempts.length
    : 0;

  return {
    monthlyApplications: getMonthlyTrend(
      (applications ?? []).map((application) => application.applied_at),
    ),
    statusDistribution: getStatusDistribution(applications ?? []),
    assessmentPerformance: {
      submitted: submittedAttempts.length,
      averageScore: Number(averageScore.toFixed(1)),
    },
  };
};

export const getCandidateDashboardAnalytics = async (
  candidateId: string,
  token: string,
) => {
  const supabase = getSupabase(token);
  const { data: applications, error: applicationsError } = await supabase
    .from("applications")
    .select("status, applied_at")
    .eq("candidate_id", candidateId);

  if (applicationsError) throw applicationsError;

  const { data: attempts, error: attemptsError } = await supabase
    .from("assessment_attempts")
    .select("status, score, submitted_at")
    .eq("candidate_id", candidateId);

  if (attemptsError) throw attemptsError;

  const submittedAttempts = (attempts ?? []).filter(
    (attempt) => attempt.status !== "STARTED",
  );
  const averageScore = submittedAttempts.length
    ? submittedAttempts.reduce(
        (total, attempt) => total + Number(attempt.score ?? 0),
        0,
      ) / submittedAttempts.length
    : 0;

  return {
    monthlyApplications: getMonthlyTrend(
      (applications ?? []).map((application) => application.applied_at),
    ),
    statusDistribution: getStatusDistribution(applications ?? []),
    assessmentPerformance: {
      submitted: submittedAttempts.length,
      averageScore: Number(averageScore.toFixed(1)),
    },
  };
};
