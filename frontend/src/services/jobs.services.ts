// services/job.services.ts

import { api } from "@/lib/axios";

export const getMyJobs = async () => {
  const res = await api.get("/jobs/my");
  return res.data;
};

export const getAllOpenJobs = async () => {
  const res = await api.get("/jobs/my/open");
  console.log("jobs",res);
  return res;
};
export const getJobById = async (id: string) => {
  const res = await api.get(`/jobs/${id}`);
  return res.data;
};


export const createJob = async (data: any) => {
  const res = await api.post("/jobs", data);
  return res.data;
};

export const updateJob = async (id: string, data: any) => {
  const res = await api.put(`/jobs/${id}`, data);
  return res.data;
};

export const closeJob = async (id: string) => {
  const res = await api.patch(`/jobs/${id}/close`);
  return res.data;
};

export const deleteJob = async (id: string) => {
  const res = await api.delete(`/jobs/${id}`);
  return res.data;
};


//candidate services
export const getAllJobs = async () => {
  const res = await api.get("/jobs");
  return res.data;
};

export const getJobDetails = async (jobId: string) => {
  const res = await api.get(`/jobs/details/${jobId}`);
  return res.data;
};

export const searchJobs = async (params: {
  location?: string;
  type?: string;
  skill?: string;
}) => {
  const res = await api.get("/jobs/search", {
    params,
  });

  return res.data;
};


export const applyJob = async (jobId: string) => {
  const res = await api.post(`/applications/${jobId}/apply`);
  return res.data;
};
