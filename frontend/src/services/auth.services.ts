import { api } from "@/lib/axios";

type LoginPayload = {
  email: string;
  password: string;
};

type RegisterPayload = LoginPayload & {
  name: string;
  phone: string;
  role: "CANDIDATE" | "RECRUITER";
};

export const registerService = async (data: RegisterPayload) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

export const loginService = async (data: LoginPayload) => {
  const response = await api.post("/auth/login", data);
  return response; // { user, token, ... }
};

export const logoutService = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};
