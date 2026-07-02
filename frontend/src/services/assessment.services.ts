import { api } from "@/lib/axios";
// ==========================
// Assessment APIs
// ==========================

export const createAssessment = async (data: {
  job_id: string;
  title: string;
  description?: string;
  duration_minutes: number;
  passing_score: number;
}) => {
  const res = await api.post("/assessments", data);
  return res.data;
};

export const getAssessmentByJob = async (jobId: string) => {
  const res = await api.get(`/assessments/job/${jobId}`);

  return res.data;
};

export const getAssessmentById = async (assessmentId: string) => {
  const res = await api.get(`/assessments/${assessmentId}`);

  return res.data;
};

export const updateAssessment = async (
  assessmentId: string,
  data: {
    title: string;
    description: string;
    duration_minutes: number;
    passing_score: number;
    start_time?: string;
    end_time?: string;
    status?: string;
  },
) => {
  const response = await api.put(`/assessments/${assessmentId}`, data);

  return response.data;
};
export const deleteAssessment = async (assessmentId: string) => {
  const res = await api.delete(`/assessments/${assessmentId}`);

  return res.data;
};

// ==========================
// Question APIs
// ==========================

export const createQuestion = async (
  assessmentId: string,
  data: {
    question: string;
    option_a: string;
    option_b: string;
    option_c: string;
    option_d: string;
    correct_answer: string;
    marks: number;
    category?: string;
    difficulty?: string;
  },
) => {
  const res = await api.post(`/assessments/${assessmentId}/questions`, data);

  return res.data;
};

export const getQuestions = async (assessmentId: string) => {
  const res = await api.get(`/assessments/${assessmentId}/questions`);

  return res.data;
};

export const updateQuestion = async (questionId: string, data: any) => {
  const res = await api.put(`/questions/${questionId}`, data);

  return res.data;
};

export const deleteQuestion = async (questionId: string) => {
  const res = await api.delete(`/questions/${questionId}`);

  return res.data;
};

// ==========================
// Candidate Assessment APIs
// ==========================

export const startAssessment = async (assessmentId: string) => {
  const res = await api.post(`/assessments/${assessmentId}/start`);

  return res.data;
};

export const saveAnswer = async (
  attemptId: string,
  data: {
    question_id: string;
    selected_answer: "A" | "B" | "C" | "D";
  },
) => {
  const res = await api.post(`/assessments/attempts/${attemptId}/answer`, data);

  return res.data;
};

export const submitAssessment = async (attemptId: string) => {
  const res = await api.post(`/assessments/attempts/${attemptId}/submit`);

  return res.data;
};

export const getAssessmentResult = async (attemptId: string) => {
  const res = await api.get(`/attempts/${attemptId}/result`);

  return res.data;
};

export const publishAssessment = async (assessmentId: string) => {
  const res = await api.patch(`/assessments/${assessmentId}/publish`);

  return res.data;
};

export const getCandidateAssessments = async () => {
  const res = await api.get("/assessments");
  return res.data;
};

export const getCandidateAssessmentById = async (assessmentId: string) => {
  const res = await api.get(`/assessments/candidate/${assessmentId}`);

  return res.data;
};

export const getAttemptById = async (attemptId: string) => {
  const res = await api.get(`/assessments/candidate/attempts/${attemptId}`);

  return res.data;
};

export const getJobAssessmentResults = async (jobId: string) => {
  const res = await api.get(`/recruiter/jobs/${jobId}/results`);

  return res.data;
};

export const getAttemptDetails = async (attemptId: string) => {
  const res = await api.get(`/recruiter/attempts/${attemptId}`);
  return res.data;
};
