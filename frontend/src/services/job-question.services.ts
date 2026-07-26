import { api } from "@/lib/axios";

export type QuestionVisibility = "PUBLIC" | "PRIVATE";
export type QuestionStatus = "OPEN" | "ANSWERED" | "CLOSED";

export interface JobQuestion {
  id: string;
  job_id: string;
  candidate_id: string;
  question: string;
  visibility: QuestionVisibility;
  status: QuestionStatus;
  created_at: string;
  updated_at: string;
}

export interface QuestionReply {
  id: string;
  question_id: string;
  sender_id: string;
  message: string;
  created_at: string;
  updated_at?: string;
}

export const getJobQuestions = async (jobId: string) => {
  const response = await api.get<{ success: boolean; data: JobQuestion[] }>(
    `/questions/jobs/${jobId}`,
  );
  return response.data.data;
};

export const postJobQuestion = async (
  jobId: string,
  question: string,
  visibility: QuestionVisibility,
) => {
  const response = await api.post<{ success: boolean; data: JobQuestion }>(
    `/questions/jobs/${jobId}`,
    { question, visibility },
  );
  return response.data.data;
};

export const getQuestionReplies = async (questionId: string) => {
  const response = await api.get<{ success: boolean; data: QuestionReply[] }>(
    `/questions/${questionId}/replies`,
  );
  return response.data.data;
};

export const postQuestionReply = async (
  questionId: string,
  message: string,
) => {
  const response = await api.post<{ success: boolean; data: QuestionReply }>(
    `/questions/${questionId}/replies`,
    { message },
  );
  return response.data.data;
};

export const closeJobQuestion = async (questionId: string) => {
  const response = await api.patch<{ success: boolean; data: JobQuestion }>(
    `/questions/${questionId}/close`,
  );
  return response.data.data;
};
