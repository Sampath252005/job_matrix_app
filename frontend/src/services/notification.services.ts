import { api } from "@/lib/axios";

export type CandidateNotificationType =
  | "APPLICATION_SUBMITTED"
  | "APPLICATION_SHORTLISTED"
  | "APPLICATION_REJECTED"
  | "INTERVIEW_SCHEDULED"
  | "APPLICATION_SELECTED"
  | "GENERAL";

export interface CandidateNotification {
  id: string;
  user_id: string;
  application_id: string | null;
  type: CandidateNotificationType;
  title: string;
  message: string;
  data: {
    kind?: "JOB_ANNOUNCEMENT";
    announcementId?: string;
    applicationId?: string;
    audience?: string;
    jobId?: string;
    jobTitle?: string;
    status?: string;
  } | null;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
  updated_at: string;
}

export const getCandidateNotifications = async () => {
  const response = await api.get<{
    success: boolean;
    data: CandidateNotification[];
  }>("/notifications");

  return response.data.data;
};

export const markCandidateNotificationAsRead = async (
  notificationId: string,
) => {
  const response = await api.patch<{
    success: boolean;
    data: CandidateNotification;
  }>(`/notifications/${notificationId}/read`);

  return response.data.data;
};
