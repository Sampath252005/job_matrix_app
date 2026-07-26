import { getSupabase } from "../../services/supabase.service.js";
import { emitNewAnnouncement } from "./announcement.socket.js";

export interface CreateAnnouncementInput {
  title: string;
  content: string;
  audience?: "PUBLIC" | "APPLICANTS" | "SHORTLISTED" | "INTERVIEW";
  is_pinned?: boolean;
}

export interface UpdateAnnouncementInput {
  title?: string;
  content?: string;
  audience?: "PUBLIC" | "APPLICANTS" | "SHORTLISTED" | "INTERVIEW";
  is_pinned?: boolean;
}

const verifyRecruiterOwnsJob = async (
  jobId: string,
  recruiterId: string,
  accessToken: string,
) => {
  const supabase = getSupabase(accessToken);

  const { data: job, error } = await supabase
    .from("jobs")
    .select("id, recruiter_id")
    .eq("id", jobId)
    .single();

  if (error || !job) {
    throw new Error("Job not found");
  }

  if (job.recruiter_id !== recruiterId) {
    throw new Error(
      "You are not authorized to manage announcements for this job",
    );
  }

  return job;
};

export const createAnnouncementService = async (
  jobId: string,
  recruiterId: string,
  accessToken: string,
  input: CreateAnnouncementInput,
) => {
  const supabase = getSupabase(accessToken);

  await verifyRecruiterOwnsJob(
    jobId,
    recruiterId,
    accessToken,
  );

  const { data: announcement, error } = await supabase
    .from("job_announcements")
    .insert({
      job_id: jobId,
      recruiter_id: recruiterId,
      title: input.title.trim(),
      content: input.content.trim(),
      audience: input.audience ?? "APPLICANTS",
      is_pinned: input.is_pinned ?? false,
    })
    .select("*")
    .single();

  if (error) {
    console.error("Create announcement error:", error);
    throw new Error(error.message);
  }


 try {
    await emitNewAnnouncement(
      announcement,
      accessToken,
    );
  } catch (socketError) {
    /*
     * Do not fail the API request if Socket.IO emission fails.
     * The announcement is already safely stored.
     */
    console.error(
      "Announcement socket emission failed:",
      socketError,
    );
  }


  return announcement;
};

export const getJobAnnouncementsService = async (
  jobId: string,
  userId: string,
  userRole: string,
  accessToken: string,
) => {
  const supabase = getSupabase(accessToken);

  const { data: job, error: jobError } = await supabase
    .from("jobs")
    .select("id, recruiter_id")
    .eq("id", jobId)
    .single();

  if (jobError || !job) {
    throw new Error("Job not found");
  }

  /*
   * Recruiter who owns the job can view every announcement.
   */
  if (
    userRole.toUpperCase() === "RECRUITER" &&
    job.recruiter_id === userId
  ) {
    const { data, error } = await supabase
      .from("job_announcements")
      .select("*")
      .eq("job_id", jobId)
      .order("is_pinned", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data ?? [];
  }

  /*
   * Check whether the candidate applied for the job.
   */
  const { data: application, error: applicationError } =
    await supabase
      .from("applications")
      .select("id, status")
      .eq("job_id", jobId)
      .eq("candidate_id", userId)
      .maybeSingle();

  if (applicationError) {
    console.error(
      "Application verification error:",
      applicationError,
    );

    throw new Error(applicationError.message);
  }

  /*
   * Every authenticated user can see PUBLIC announcements.
   */
  const allowedAudiences: string[] = ["PUBLIC"];

  if (application) {
    allowedAudiences.push("APPLICANTS");

    const status = application.status?.toUpperCase();

    if (status === "SHORTLISTED") {
      allowedAudiences.push("SHORTLISTED");
    }

    if (status === "INTERVIEW") {
      allowedAudiences.push(
        "SHORTLISTED",
        "INTERVIEW",
      );
    }

    if (status === "HIRED") {
      allowedAudiences.push(
        "SHORTLISTED",
        "INTERVIEW",
      );
    }
  }

  const uniqueAudiences = [...new Set(allowedAudiences)];

  const { data, error } = await supabase
    .from("job_announcements")
    .select("*")
    .eq("job_id", jobId)
    .in("audience", uniqueAudiences)
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
};

export const updateAnnouncementService = async (
  announcementId: string,
  recruiterId: string,
  accessToken: string,
  input: UpdateAnnouncementInput,
) => {
  const supabase = getSupabase(accessToken);

  const { data: existingAnnouncement, error: findError } =
    await supabase
      .from("job_announcements")
      .select("id, job_id, recruiter_id")
      .eq("id", announcementId)
      .single();

  if (findError || !existingAnnouncement) {
    throw new Error("Announcement not found");
  }

  if (
    existingAnnouncement.recruiter_id !== recruiterId
  ) {
    throw new Error(
      "You are not authorized to update this announcement",
    );
  }

  await verifyRecruiterOwnsJob(
    existingAnnouncement.job_id,
    recruiterId,
    accessToken,
  );

  const updateData: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (input.title !== undefined) {
    updateData.title = input.title.trim();
  }

  if (input.content !== undefined) {
    updateData.content = input.content.trim();
  }

  if (input.audience !== undefined) {
    updateData.audience = input.audience;
  }

  if (input.is_pinned !== undefined) {
    updateData.is_pinned = input.is_pinned;
  }

  const { data: announcement, error } = await supabase
    .from("job_announcements")
    .update(updateData)
    .eq("id", announcementId)
    .eq("recruiter_id", recruiterId)
    .select("*")
    .single();

  if (error) {
    console.error("Update announcement error:", error);
    throw new Error(error.message);
  }

  return announcement;
};

export const deleteAnnouncementService = async (
  announcementId: string,
  recruiterId: string,
  accessToken: string,
) => {
  const supabase = getSupabase(accessToken);

  const { data: existingAnnouncement, error: findError } =
    await supabase
      .from("job_announcements")
      .select("id, job_id, recruiter_id")
      .eq("id", announcementId)
      .single();

  if (findError || !existingAnnouncement) {
    throw new Error("Announcement not found");
  }

  if (
    existingAnnouncement.recruiter_id !== recruiterId
  ) {
    throw new Error(
      "You are not authorized to delete this announcement",
    );
  }

  await verifyRecruiterOwnsJob(
    existingAnnouncement.job_id,
    recruiterId,
    accessToken,
  );

  const { error } = await supabase
    .from("job_announcements")
    .delete()
    .eq("id", announcementId)
    .eq("recruiter_id", recruiterId);

  if (error) {
    console.error("Delete announcement error:", error);
    throw new Error(error.message);
  }

  return {
    message: "Announcement deleted successfully",
  };
};
