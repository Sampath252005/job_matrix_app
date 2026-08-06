import { api } from "@/lib/axios";

export type InterviewType = "ONLINE" | "OFFLINE";
export type InterviewStatus = "SCHEDULED" | "LIVE" | "COMPLETED" | "CANCELLED";
export type InterviewRound = "APTITUDE" | "TECHNICAL" | "MANAGERIAL" | "HR" | "FINAL" | "OTHER";

export interface Interview {
  id: string; application_id: string; job_id: string; candidate_id: string; recruiter_id: string;
  scheduled_at: string; duration_minutes: number; interview_type: InterviewType;
  round_type: InterviewRound; title: string; meeting_link?: string | null; location?: string | null;
  notes?: string | null; status: InterviewStatus;
  jobs?: { id: string; title: string; location?: string | null } | null;
  candidate?: { id: string; name: string; email: string } | null;
  recruiter?: { id: string; name: string; email: string } | null;
}

export interface InterviewInput {
  application_id?: string; scheduled_at: string; duration_minutes: number;
  interview_type: InterviewType; round_type: InterviewRound; title: string;
  notes?: string | null; location?: string | null; meeting_link?: string | null;
}

const unwrapList = (data: { data?: unknown }) => Array.isArray(data?.data) ? data.data as Interview[] : [];
export const getCandidateInterviews = async () => unwrapList((await api.get("/interviews/me")).data);
export const getRecruiterInterviews = async () => unwrapList((await api.get("/interviews/recruiter")).data);
export const getInterview = async (id: string): Promise<Interview> => (await api.get(`/interviews/${id}`)).data.data;
export const createInterview = async (input: InterviewInput) => (await api.post("/interviews", input)).data.data as Interview;
export const updateInterview = async (id: string, input: Omit<InterviewInput, "application_id">) => (await api.patch(`/interviews/${id}`, input)).data.data as Interview;
export const updateInterviewStatus = async (id: string, status: InterviewStatus) => (await api.patch(`/interviews/${id}/status`, { status })).data.data as Interview;
export const getInterviewToken = async (id: string): Promise<{
  server_url: string;
  participant_token: string;
  room_name: string;
  participant_identity: string;
  participant_role: "RECRUITER" | "CANDIDATE";
  interview: Interview;
}> => (await api.get(`/interviews/${id}/token`)).data.data;
