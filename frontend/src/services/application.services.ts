import { api } from "@/lib/axios";

export const getMyApplications = async () => {
  const res = await api.get("/applications/my");
  return res.data;
};

export const getApplicationDetails = async (applicationId: string) => {
  const res = await api.get(`/applications/${applicationId}`);
  return res.data;
};

export const withdrawApplication = async (applicationId: string) => {
  const res = await api.delete(`/applications/${applicationId}`);
  return res.data;
};