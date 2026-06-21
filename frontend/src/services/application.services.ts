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


//recruiter get application by job

export const getapplcationByJob = async (jobId: string) => {
  const res = await api.get(`/applications/job/${jobId}`);
  return res;
};

export const updateApplicationStatus = async (
  applicationId: string,
  status: string
) => {
  const res = await api.patch(
    `/applications/${applicationId}/status`,
    {
      status,
    }
  );

  return res.data;
};