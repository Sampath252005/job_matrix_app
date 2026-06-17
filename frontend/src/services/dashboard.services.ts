import { api } from "@/lib/axios";

export const DashboardRecruiterService = async () => {
  const response = await api.get("/dashboard/recruiter");
  return response.data;
};

export const DasshboardCandidateService=async()=>{
  const response =await api.get("/dashboard/candidate");
  return response.data;
}