import { api } from "@/lib/axios";

/* FETCH PROFILE */
export const fetchRecruiterProfile = async () => {
  const res = await api.get("/profile/recruiter");
  return res.data;
};

/* UPDATE PROFILE */
export const updateRecruiterProfile = async (data: any) => {
  const res = await api.post("/profile/recruiter", data);

  // console.log("res",res);
  return res.data;
};


export const fetchCandidateProfile = async () => {
  const res = await api.get("/profile/candidate");
  return res.data;
};

export const updateCandidateProfile = async (data: any) => {
  const res = await api.post("/profile/candidate", data);
  return res.data;
};