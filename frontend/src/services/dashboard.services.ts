import { api } from "@/lib/axios";

export const DashboardRecruiterService = async () => {
  const response = await api.get("/dashboard/recruiter");
  return response.data;
};