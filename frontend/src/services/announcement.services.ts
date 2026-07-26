import { api } from "@/lib/axios";

export type AnnouncementAudience =
  | "PUBLIC"
  | "APPLICANTS"
  | "SHORTLISTED"
  | "INTERVIEW";

export interface JobAnnouncement {
  id: string;
  job_id: string;
  recruiter_id: string;
  title: string;
  content: string;
  audience: AnnouncementAudience;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
}

export interface AnnouncementInput {
  title: string;
  content: string;
  audience: AnnouncementAudience;
  is_pinned: boolean;
}

export const getJobAnnouncements = async (jobId: string) => {
  const response = await api.get<{
    success: boolean;
    data: JobAnnouncement[];
  }>(`/announcements/jobs/${jobId}`);
  return response.data.data;
};

export const createJobAnnouncement = async (
  jobId: string,
  input: AnnouncementInput,
) => {
  const response = await api.post<{ success: boolean; data: JobAnnouncement }>(
    `/announcements/jobs/${jobId}`,
    input,
  );
  return response.data.data;
};

export const updateJobAnnouncement = async (
  announcementId: string,
  input: AnnouncementInput,
) => {
  const response = await api.patch<{
    success: boolean;
    data: JobAnnouncement;
  }>(`/announcements/${announcementId}`, input);
  return response.data.data;
};

export const deleteJobAnnouncement = async (announcementId: string) => {
  await api.delete(`/announcements/${announcementId}`);
};
