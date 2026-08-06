import { getSupabase } from "../../config/supabase.js";
import { AccessToken } from "livekit-server-sdk";

export type InterviewType = "ONLINE" | "OFFLINE";

export type InterviewStatus =
  | "SCHEDULED"
  | "LIVE"
  | "COMPLETED"
  | "CANCELLED";

export type InterviewRound =
  | "APTITUDE"
  | "TECHNICAL"
  | "MANAGERIAL"
  | "HR"
  | "FINAL"
  | "OTHER";

export interface CreateInterviewInput {
  application_id: string;
  scheduled_at: string;
  duration_minutes?: number;
  interview_type?: InterviewType;
  round_type?: InterviewRound;
  title?: string;
  notes?: string | null;
  location?: string | null;
  meeting_link?: string | null;
}

interface ApplicationRecord {
  id: string;
  job_id: string;
  candidate_id: string;
  status: string;
  jobs:
    | {
        id: string;
        recruiter_id: string;
        title: string;
      }
    | {
        id: string;
        recruiter_id: string;
        title: string;
      }[];
}

const allowedApplicationStatuses = [
  "SHORTLISTED",
  "INTERVIEW",
];

const allowedInterviewTypes: InterviewType[] = [
  "ONLINE",
  "OFFLINE",
];

const allowedRoundTypes: InterviewRound[] = [
  "APTITUDE",
  "TECHNICAL",
  "MANAGERIAL",
  "HR",
  "FINAL",
  "OTHER",
];

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const MAX_TITLE_LENGTH = 150;
const MAX_LOCATION_LENGTH = 250;
const MAX_NOTES_LENGTH = 2000;
const MAX_MEETING_LINK_LENGTH = 2048;

const validateUuid = (value: string, field: string) => {
  if (!UUID_PATTERN.test(value)) {
    throw new Error(`Invalid ${field}`);
  }
};

const validateOptionalText = (
  value: string | null | undefined,
  field: string,
  maxLength: number,
) => {
  if (value !== undefined && value !== null && typeof value !== "string") {
    throw new Error(`Invalid ${field}`);
  }
  if (value?.trim().length && value.trim().length > maxLength) {
    throw new Error(`${field} cannot exceed ${maxLength} characters`);
  }
};

const validateMeetingLink = (value: string | null | undefined) => {
  validateOptionalText(value, "Meeting link", MAX_MEETING_LINK_LENGTH);
  if (!value?.trim()) return;
  try {
    const url = new URL(value.trim());
    if (url.protocol !== "https:" && url.protocol !== "http:") throw new Error();
  } catch {
    throw new Error("Meeting link must be a valid HTTP or HTTPS URL");
  }
};

export const createInterviewService = async (
  recruiterId: string,
  token: string,
  input: CreateInterviewInput,
) => {
  const supabase = getSupabase(token);

  validateUuid(input.application_id, "application ID");
  validateOptionalText(input.title, "Interview title", MAX_TITLE_LENGTH);
  validateOptionalText(input.location, "Location", MAX_LOCATION_LENGTH);
  validateOptionalText(input.notes, "Notes", MAX_NOTES_LENGTH);
  validateMeetingLink(input.meeting_link);

  if (
    input.interview_type !== undefined &&
    typeof input.interview_type !== "string"
  ) {
    throw new Error("Invalid interview type");
  }
  if (
    input.round_type !== undefined &&
    typeof input.round_type !== "string"
  ) {
    throw new Error("Invalid interview round");
  }

  const interviewType =
    input.interview_type?.toUpperCase() as InterviewType || "ONLINE";

  const roundType =
    input.round_type?.toUpperCase() as InterviewRound ||
    "TECHNICAL";

  if (!allowedInterviewTypes.includes(interviewType)) {
    throw new Error("Invalid interview type");
  }

  if (!allowedRoundTypes.includes(roundType)) {
    throw new Error("Invalid interview round");
  }

  if (typeof input.scheduled_at !== "string" || !input.scheduled_at.trim()) {
    throw new Error("Interview date and time are required");
  }
  const scheduledDate = new Date(input.scheduled_at);

  if (Number.isNaN(scheduledDate.getTime())) {
    throw new Error("Invalid interview date");
  }

  if (scheduledDate.getTime() <= Date.now()) {
    throw new Error(
      "Interview must be scheduled for a future time",
    );
  }

  const durationMinutes =
    input.duration_minutes ?? 30;

  if (
    !Number.isInteger(durationMinutes) ||
    durationMinutes < 5 ||
    durationMinutes > 480
  ) {
    throw new Error(
      "Interview duration must be between 5 and 480 minutes",
    );
  }

  const title =
    input.title?.trim() || `${roundType} Interview`;

  if (title.length > MAX_TITLE_LENGTH) {
    throw new Error(
      "Interview title cannot exceed 150 characters",
    );
  }

  if (
    interviewType === "OFFLINE" &&
    !input.location?.trim()
  ) {
    throw new Error(
      "Location is required for an offline interview",
    );
  }

  /*
   * Fetch the application and its job.
   * This gives us candidate_id, job_id and job ownership.
   */
  const { data: application, error: applicationError } =
    await supabase
      .from("applications")
      .select(`
        id,
        job_id,
        candidate_id,
        status,
        jobs!inner (
          id,
          recruiter_id,
          title
        )
      `)
      .eq("id", input.application_id)
      .single<ApplicationRecord>();

  if (applicationError || !application) {
    throw new Error("Application not found");
  }

  const job = Array.isArray(application.jobs)
    ? application.jobs[0]
    : application.jobs;

  if (!job) {
    throw new Error("Job not found");
  }

  if (job.recruiter_id !== recruiterId) {
    throw new Error(
      "You are not authorized to schedule this interview",
    );
  }

  const applicationStatus =
    application.status.toUpperCase();

  if (
    !allowedApplicationStatuses.includes(
      applicationStatus,
    )
  ) {
    throw new Error(
      "Only shortlisted candidates can be scheduled for an interview",
    );
  }

  /*
   * Your unique constraint prevents the same round
   * from being scheduled twice for one application.
   *
   * Checking first gives a clearer error message.
   */
  const { data: existingInterview, error: existingError } =
    await supabase
      .from("interviews")
      .select("id")
      .eq("application_id", application.id)
      .eq("round_type", roundType)
      .maybeSingle();

  if (existingError) {
    throw new Error(existingError.message);
  }

  if (existingInterview) {
    throw new Error(
      `${roundType} interview already exists for this application`,
    );
  }

  /*
   * Basic exact-time conflict check for recruiter.
   */
  const { data: recruiterConflict, error: recruiterError } =
    await supabase
      .from("interviews")
      .select("id")
      .eq("recruiter_id", recruiterId)
      .eq("scheduled_at", scheduledDate.toISOString())
      .in("status", ["SCHEDULED", "LIVE"])
      .maybeSingle();

  if (recruiterError) {
    throw new Error(recruiterError.message);
  }

  if (recruiterConflict) {
    throw new Error(
      "Recruiter already has an interview at this time",
    );
  }

  /*
   * Basic exact-time conflict check for candidate.
   */
  const { data: candidateConflict, error: candidateError } =
    await supabase
      .from("interviews")
      .select("id")
      .eq("candidate_id", application.candidate_id)
      .eq("scheduled_at", scheduledDate.toISOString())
      .in("status", ["SCHEDULED", "LIVE"])
      .maybeSingle();

  if (candidateError) {
    throw new Error(candidateError.message);
  }

  if (candidateConflict) {
    throw new Error(
      "Candidate already has an interview at this time",
    );
  }

  const { data: interview, error: insertError } =
    await supabase
      .from("interviews")
      .insert({
        application_id: application.id,
        job_id: application.job_id,
        candidate_id: application.candidate_id,
        recruiter_id: recruiterId,

        scheduled_at: scheduledDate.toISOString(),
        duration_minutes: durationMinutes,
        interview_type: interviewType,
        round_type: roundType,
        title,

        location:
          interviewType === "OFFLINE"
            ? input.location?.trim()
            : null,

        meeting_link:
          input.meeting_link?.trim() || null,

        notes:
          input.notes?.trim() || null,

        status: "SCHEDULED",
      })
      .select(`
        id,
        application_id,
        job_id,
        candidate_id,
        recruiter_id,
        scheduled_at,
        duration_minutes,
        interview_type,
        round_type,
        title,
        location,
        meeting_link,
        notes,
        status,
        room_name,
        created_at,
        updated_at
      `)
      .single();

  if (insertError || !interview) {
    console.error(
      "Create interview error:",
      insertError,
    );

    if (
      insertError?.code === "23505"
    ) {
      throw new Error(
        "This interview round already exists",
      );
    }

    throw new Error(
      insertError?.message ||
        "Failed to create interview",
    );
  }

  /*
   * Optional: update the application status.
   */
  if (applicationStatus === "SHORTLISTED") {
    const { error: statusError } = await supabase
      .from("applications")
      .update({
        status: "INTERVIEW",
      })
      .eq("id", application.id);

    if (statusError) {
      console.error(
        "Application status update failed:",
        statusError,
      );
    }
  }

  return interview;
};



interface InterviewTokenRecord {
  id: string;
  room_name: string;
  candidate_id: string;
  recruiter_id: string;
  interview_type: "ONLINE" | "OFFLINE";
  status:
    | "SCHEDULED"
    | "LIVE"
    | "COMPLETED"
    | "CANCELLED";
  scheduled_at: string;
  duration_minutes: number;
  title: string;
  round_type: string;
}

interface InterviewTokenResult {
  serverUrl: string;
  participantToken: string;
  roomName: string;
  participantIdentity: string;
  participantRole: "RECRUITER" | "CANDIDATE";
  interview: InterviewTokenRecord;
}

export const generateInterviewTokenService = async (
  interviewId: string,
  userId: string,
  userEmail: string,
  accessToken: string,
): Promise<InterviewTokenResult> => {
  validateUuid(interviewId, "interview ID");
  const supabase = getSupabase(accessToken);

  const livekitUrl = process.env.LIVEKIT_URL;
  const livekitApiKey = process.env.LIVEKIT_API_KEY;
  const livekitApiSecret =
    process.env.LIVEKIT_API_SECRET;

  if (
    !livekitUrl ||
    !livekitApiKey ||
    !livekitApiSecret
  ) {
    throw new Error(
      "LiveKit environment variables are not configured",
    );
  }

  const { data: interview, error } = await supabase
    .from("interviews")
    .select(`
      id,
      room_name,
      candidate_id,
      recruiter_id,
      interview_type,
      status,
      scheduled_at,
      duration_minutes,
      title,
      round_type
    `)
    .eq("id", interviewId)
    .single<InterviewTokenRecord>();

  if (error || !interview) {
    console.error("Fetch interview error:", error);
    throw new Error("Interview not found");
  }

  const isRecruiter =
    interview.recruiter_id === userId;

  const isCandidate =
    interview.candidate_id === userId;

  if (!isRecruiter && !isCandidate) {
    throw new Error(
      "You are not authorized to join this interview",
    );
  }

  if (interview.interview_type !== "ONLINE") {
    throw new Error(
      "Live video is not available for an offline interview",
    );
  }

  if (interview.status === "CANCELLED") {
    throw new Error(
      "This interview has been cancelled",
    );
  }

  if (interview.status === "COMPLETED") {
    throw new Error(
      "This interview has already been completed",
    );
  }

  if (
    !["SCHEDULED", "LIVE"].includes(
      interview.status,
    )
  ) {
    throw new Error(
      "This interview is not available to join",
    );
  }

  if (!interview.room_name) {
    throw new Error(
      "LiveKit room is not configured",
    );
  }

  const participantRole = isRecruiter
    ? "RECRUITER"
    : "CANDIDATE";

  const token = new AccessToken(
    livekitApiKey,
    livekitApiSecret,
    {
      identity: userId,
      name: userEmail,
      ttl: "1h",
      metadata: JSON.stringify({
        interviewId: interview.id,
        role: participantRole,
        roundType: interview.round_type,
      }),
    },
  );

  token.addGrant({
    roomJoin: true,
    room: interview.room_name,
    canPublish: true,
    canSubscribe: true,
    canPublishData: true,
  });

  const participantToken = await token.toJwt();

  return {
    serverUrl: livekitUrl,
    participantToken,
    roomName: interview.room_name,
    participantIdentity: userId,
    participantRole,
    interview,
  };
};


export interface UpdateInterviewInput {
  scheduled_at?: string;
  duration_minutes?: number;
  interview_type?: InterviewType;
  round_type?: InterviewRound;
  title?: string;
  meeting_link?: string | null;
  location?: string | null;
  notes?: string | null;
}

const allowedStatuses: InterviewStatus[] = [
  "SCHEDULED",
  "LIVE",
  "COMPLETED",
  "CANCELLED",
];

const interviewSelect = `
  id,
  application_id,
  job_id,
  candidate_id,
  recruiter_id,
  scheduled_at,
  duration_minutes,
  interview_type,
  round_type,
  title,
  room_name,
  meeting_link,
  location,
  notes,
  status,
  created_at,
  updated_at,
  jobs (
    id,
    title,
    location
  ),
  candidate:users!interviews_candidate_id_fkey (
    id,
    name,
    email
  ),
  recruiter:users!interviews_recruiter_id_fkey (
    id,
    name,
    email
  ),
  applications (
    id,
    status
  )
`;

/**
 * Verify that the user is either the interview's candidate
 * or recruiter.
 */
const verifyInterviewParticipant = async (
  interviewId: string,
  userId: string,
  token: string,
) => {
  validateUuid(interviewId, "interview ID");
  const supabase = getSupabase(token);

  const { data: interview, error } = await supabase
    .from("interviews")
    .select(`
      id,
      candidate_id,
      recruiter_id,
      status,
      interview_type
    `)
    .eq("id", interviewId)
    .single();

  if (error || !interview) {
    throw new Error("Interview not found");
  }

  const isCandidate =
    interview.candidate_id === userId;

  const isRecruiter =
    interview.recruiter_id === userId;

  if (!isCandidate && !isRecruiter) {
    throw new Error(
      "You are not authorized to access this interview",
    );
  }

  return {
    interview,
    isCandidate,
    isRecruiter,
  };
};

/**
 * GET /api/interviews/:interviewId
 */
export const getInterviewByIdService = async (
  interviewId: string,
  userId: string,
  token: string,
) => {
  const supabase = getSupabase(token);

  await verifyInterviewParticipant(
    interviewId,
    userId,
    token,
  );

  const { data: interview, error } =
    await supabase
      .from("interviews")
      .select(interviewSelect)
      .eq("id", interviewId)
      .single();

  if (error || !interview) {
    console.error(
      "Get interview error:",
      error,
    );

    throw new Error("Interview not found");
  }

  return interview;
};

/**
 * PATCH /api/interviews/:interviewId
 *
 * Recruiter only.
 */
export const updateInterviewService = async (
  interviewId: string,
  recruiterId: string,
  token: string,
  input: UpdateInterviewInput,
) => {
  const supabase = getSupabase(token);

  validateUuid(interviewId, "interview ID");
  validateOptionalText(input.title, "Interview title", MAX_TITLE_LENGTH);
  validateOptionalText(input.location, "Location", MAX_LOCATION_LENGTH);
  validateOptionalText(input.notes, "Notes", MAX_NOTES_LENGTH);
  validateMeetingLink(input.meeting_link);

  const { data: existingInterview, error: findError } =
    await supabase
      .from("interviews")
      .select(`
        id,
        recruiter_id,
        status,
        scheduled_at,
        duration_minutes,
        interview_type,
        round_type,
        title,
        location,
        meeting_link,
        notes
      `)
      .eq("id", interviewId)
      .single();

  if (findError || !existingInterview) {
    throw new Error("Interview not found");
  }

  if (
    existingInterview.recruiter_id !==
    recruiterId
  ) {
    throw new Error(
      "You are not authorized to update this interview",
    );
  }

  if (
    existingInterview.status === "COMPLETED"
  ) {
    throw new Error(
      "A completed interview cannot be updated",
    );
  }

  if (
    existingInterview.status === "CANCELLED"
  ) {
    throw new Error(
      "A cancelled interview cannot be updated",
    );
  }

  const updateData: Record<
    string,
    string | number | null
  > = {};

  if (input.scheduled_at !== undefined) {
    if (typeof input.scheduled_at !== "string" || !input.scheduled_at.trim()) {
      throw new Error("Invalid interview date");
    }
    const scheduledDate = new Date(
      input.scheduled_at,
    );

    if (
      Number.isNaN(scheduledDate.getTime())
    ) {
      throw new Error(
        "Invalid interview date",
      );
    }

    if (
      scheduledDate.getTime() <= Date.now()
    ) {
      throw new Error(
        "Interview must be scheduled for a future time",
      );
    }

    updateData.scheduled_at =
      scheduledDate.toISOString();
  }

  if (
    input.duration_minutes !== undefined
  ) {
    if (
      !Number.isInteger(
        input.duration_minutes,
      ) ||
      input.duration_minutes < 5 ||
      input.duration_minutes > 480
    ) {
      throw new Error(
        "Interview duration must be between 5 and 480 minutes",
      );
    }

    updateData.duration_minutes =
      input.duration_minutes;
  }

  if (
    input.interview_type !== undefined
  ) {
    if (typeof input.interview_type !== "string") {
      throw new Error("Invalid interview type");
    }
    const interviewType =
      input.interview_type.toUpperCase() as InterviewType;

    if (
      !allowedInterviewTypes.includes(
        interviewType,
      )
    ) {
      throw new Error(
        "Invalid interview type",
      );
    }

    updateData.interview_type =
      interviewType;
  }

  if (input.round_type !== undefined) {
    if (typeof input.round_type !== "string") {
      throw new Error("Invalid interview round");
    }
    const roundType =
      input.round_type.toUpperCase() as InterviewRound;

    if (
      !allowedRoundTypes.includes(
        roundType,
      )
    ) {
      throw new Error(
        "Invalid interview round",
      );
    }

    updateData.round_type = roundType;
  }

  if (input.title !== undefined) {
    const title = input.title.trim();

    if (!title) {
      throw new Error(
        "Interview title cannot be empty",
      );
    }

    if (title.length > MAX_TITLE_LENGTH) {
      throw new Error(
        "Interview title cannot exceed 150 characters",
      );
    }

    updateData.title = title;
  }

  if (input.notes !== undefined) {
    updateData.notes =
      input.notes?.trim() || null;
  }

  if (input.location !== undefined) {
    updateData.location =
      input.location?.trim() || null;
  }

  if (
    input.meeting_link !== undefined
  ) {
    updateData.meeting_link =
      input.meeting_link?.trim() || null;
  }

  const finalInterviewType =
    (updateData.interview_type as
      | InterviewType
      | undefined) ??
    existingInterview.interview_type;

  const finalLocation =
    input.location !== undefined
      ? input.location?.trim() || null
      : existingInterview.location;

  if (
    finalInterviewType === "OFFLINE" &&
    !finalLocation
  ) {
    throw new Error(
      "Location is required for an offline interview",
    );
  }

  if (
    finalInterviewType === "ONLINE"
  ) {
    updateData.location = null;
  }

  if (
    Object.keys(updateData).length === 0
  ) {
    throw new Error(
      "Provide at least one field to update",
    );
  }

  const { data: interview, error } =
    await supabase
      .from("interviews")
      .update(updateData)
      .eq("id", interviewId)
      .eq("recruiter_id", recruiterId)
      .select(interviewSelect)
      .single();

  if (error || !interview) {
    console.error(
      "Update interview error:",
      error,
    );

    if (error?.code === "23505") {
      throw new Error(
        "This interview round already exists for the application",
      );
    }

    throw new Error(
      error?.message ||
        "Failed to update interview",
    );
  }

  return interview;
};

/**
 * PATCH /api/interviews/:interviewId/status
 *
 * Recruiter only.
 */
export const updateInterviewStatusService =
  async (
    interviewId: string,
    recruiterId: string,
    token: string,
    status: string,
  ) => {
    validateUuid(interviewId, "interview ID");
    if (typeof status !== "string") {
      throw new Error("Invalid interview status");
    }
    const supabase = getSupabase(token);

    const normalizedStatus =
      status.toUpperCase() as InterviewStatus;

    if (
      !allowedStatuses.includes(
        normalizedStatus,
      )
    ) {
      throw new Error(
        "Invalid interview status",
      );
    }

    const {
      data: existingInterview,
      error: findError,
    } = await supabase
      .from("interviews")
      .select(`
        id,
        recruiter_id,
        candidate_id,
        status,
        application_id
      `)
      .eq("id", interviewId)
      .single();

    if (
      findError ||
      !existingInterview
    ) {
      throw new Error(
        "Interview not found",
      );
    }

    if (
      existingInterview.recruiter_id !==
      recruiterId
    ) {
      throw new Error(
        "You are not authorized to update this interview",
      );
    }

    const currentStatus =
      existingInterview.status as InterviewStatus;

    if (
      currentStatus === normalizedStatus
    ) {
      throw new Error(
        `Interview is already ${normalizedStatus}`,
      );
    }

    const validTransitions: Record<
      InterviewStatus,
      InterviewStatus[]
    > = {
      SCHEDULED: [
        "LIVE",
        "CANCELLED",
      ],
      LIVE: [
        "COMPLETED",
        "CANCELLED",
      ],
      COMPLETED: [],
      CANCELLED: [],
    };

    if (
      !validTransitions[currentStatus]?.includes(
        normalizedStatus,
      )
    ) {
      throw new Error(
        `Cannot change interview status from ${currentStatus} to ${normalizedStatus}`,
      );
    }

    const { data: interview, error } =
      await supabase
        .from("interviews")
        .update({
          status: normalizedStatus,
        })
        .eq("id", interviewId)
        .eq(
          "recruiter_id",
          recruiterId,
        )
        .select(interviewSelect)
        .single();

    if (error || !interview) {
      console.error(
        "Update interview status error:",
        error,
      );

      throw new Error(
        error?.message ||
          "Failed to update interview status",
      );
    }

    return interview;
  };

/**
 * GET /api/interviews/me
 *
 * Candidate interviews.
 */
export const getMyInterviewsService =
  async (
    candidateId: string,
    token: string,
  ) => {
    const supabase = getSupabase(token);

    const { data: interviews, error } =
      await supabase
        .from("interviews")
        .select(interviewSelect)
        .eq(
          "candidate_id",
          candidateId,
        )
        .order("scheduled_at", {
          ascending: true,
        });

    if (error) {
      console.error(
        "Get candidate interviews error:",
        error,
      );

      throw new Error(error.message);
    }

    return interviews ?? [];
  };

/**
 * GET /api/interviews/recruiter
 *
 * Logged-in recruiter's interviews.
 */
export const getRecruiterInterviewsService =
  async (
    recruiterId: string,
    token: string,
  ) => {
    const supabase = getSupabase(token);

    const { data: interviews, error } =
      await supabase
        .from("interviews")
        .select(interviewSelect)
        .eq(
          "recruiter_id",
          recruiterId,
        )
        .order("scheduled_at", {
          ascending: true,
        });

    if (error) {
      console.error(
        "Get recruiter interviews error:",
        error,
      );

      throw new Error(error.message);
    }

    return interviews ?? [];
  };
