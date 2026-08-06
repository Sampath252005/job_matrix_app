import { getSupabase } from "../../config/supabase.js";
import { getIO } from "../../socket/socket.js";
const allowedStatus = [
  "PENDING",
  "SHORTLISTED",
  "REJECTED",
  "INTERVIEW",
  "HIRED",
];

interface ApplicationWithJob {
  id: string;
  jobs: {
    recruiter_id: string;
  };
}

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

const getStatusMessage = (status: string, jobTitle?: string) => {
  const title = jobTitle || "the position";

  switch (status) {
    case "SHORTLISTED":
      return `Congratulations! You have been shortlisted for ${title}.`;

    case "REJECTED":
      return `Your application for ${title} was not selected.`;

    case "INTERVIEW":
      return `An interview has been scheduled for ${title}.`;

    case "HIRED":
      return `Congratulations! You have been selected for ${title}.`;

    default:
      return `Your application status for ${title} is now ${status}.`;
  }
};

const getNotificationTitle = (status: string) => {
  switch (status) {
    case "SHORTLISTED":
      return "Application shortlisted";

    case "REJECTED":
      return "Application update";

    case "INTERVIEW":
      return "Interview scheduled";

    case "HIRED":
      return "Application selected";

    default:
      return "Application status updated";
  }
};

const getNotificationType = (status: string) => {
  switch (status) {
    case "SHORTLISTED":
      return "APPLICATION_SHORTLISTED";

    case "REJECTED":
      return "APPLICATION_REJECTED";

    case "INTERVIEW":
      return "INTERVIEW_SCHEDULED";

    case "HIRED":
      return "APPLICATION_SELECTED";

    default:
      return "GENERAL";
  }
};

interface ApplicationWithJob {
  id: string;
  jobs: {
    recruiter_id: string;
  };
}

interface UpdatedApplication {
  id: string;
  status: string;
  candidate_id: string;
  job_id: string;
  jobs: {
    title: string;
  } | null;
}

export const updateStatusService = async (
  applicationId: string,
  recruiterId: string,
  status: string,
  token: string,
) => {
  const supabase = getSupabase(token);

  const normalizedStatus = status.toUpperCase();

  if (!allowedStatus.includes(normalizedStatus)) {
    throw new Error("Invalid status value");
  }

  /*
   * Step 1: Verify that the recruiter owns the job.
   */
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

  if (appData.jobs.recruiter_id !== recruiterId) {
    throw new Error("Not authorized");
  }

  /*
   * Step 2: Update the application status.
   */
  const { data: application, error: updateError } = await supabase
    .from("applications")
    .update({
      status: normalizedStatus,
      updated_at: new Date().toISOString(),
    })
    .eq("id", applicationId)
    .select(
      `
        id,
        status,
        candidate_id,
        job_id,
        jobs (
          title
        )
      `,
    )
    .single<UpdatedApplication>();

  if (updateError || !application) {
    throw new Error(
      updateError?.message || "Failed to update application status",
    );
  }

  const jobTitle = application.jobs?.title || "the position";

  const message = getStatusMessage(application.status, jobTitle);

  /*
   * Step 3: Save the notification in Supabase.
   */
  const { data: savedNotification, error: notificationError } = await supabase
    .from("notifications")
    .insert({
      user_id: application.candidate_id,
      application_id: application.id,
      type: getNotificationType(application.status),
      title: getNotificationTitle(application.status),
      message,
      data: {
        applicationId: application.id,
        jobId: application.job_id,
        jobTitle,
        status: application.status,
      },
    })
    .select()
    .single();

  if (notificationError) {
    console.error("Notification creation failed:", notificationError);
  }

  /*
   * Step 4: Send the real-time Socket.IO notification.
   */
  const io = getIO();

  io.to(`user:${application.candidate_id}`).emit(
    "notification:new",
    savedNotification || {
      applicationId: application.id,
      application_id: application.id,
      jobId: application.job_id,
      jobTitle,
      status: application.status,
      title: getNotificationTitle(application.status),
      message,
      is_read: false,
      created_at: new Date().toISOString(),
    },
  );

  /*
   * Step 5: Return the updated result.
   */
  return {
    application,
    notification: savedNotification,
  };
};
export const getShortListedApplication = async (
  jobId: string,
  token: string,
) => {
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
    .eq("job_id", jobId)
    .in("status", ["SHORTLISTED", "INTERVIEW"]);
};

//------------------------------------------------------candidate side application services--------------------------------//
export const applyToJobServices = async (
  jobId: string,
  candidateId: string,
  token: string,
) => {
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

export const getMyApplicationsService = async (
  candidateId: string,
  token: string,
) => {
  const supabase = getSupabase(token);
  return await supabase
    .from("applications")
    .select(
      `
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
    `,
    )
    .eq("candidate_id", candidateId)
    .order("applied_at", { ascending: false });
};

export const getApplicationByIdService = async (
  applicationId: string,
  candidateId: string,
  token: string,
) => {
  const supabase = getSupabase(token);
  return await supabase
    .from("applications")
    .select(
      `
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
    `,
    )
    .eq("id", applicationId)
    .eq("candidate_id", candidateId)
    .single();
};

export const deleteApplcationService = async (
  applicationId: string,
  candidateId: string,
  token: string,
) => {
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

  if (error) throw error;

  return true;
};
