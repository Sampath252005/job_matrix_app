// services/job.services.ts

import { api } from "@/lib/axios";

export const getMyJobs = async () => {
  const res = await api.get("/jobs/my");
  return res.data;
};
export const getJobById=async(id:string)=>{
  const res=await api.get(`/jobs/${id}`)
  return res.data
}

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