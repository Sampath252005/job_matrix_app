import { api } from "@/lib/axios";

export const DashboardRecruiterService = async () => {
  const response = await api.get("/dashboard/recruiter");
  return response.data;
};

export const DasshboardCandidateService=async()=>{
  const response =await api.get("/dashboard/candidate");
  return response.data;
}

export const getRecruiterDashboardAnalytics = async () => {
  const response = await api.get("/dashboard/recruiter/analytics");
  return response.data;
};

export const getCandidateDashboardAnalytics = async () => {
  const response = await api.get("/dashboard/candidate/analytics");
  return response.data;
};
