import { api } from "@/lib/axios";

type LoginPayload = {
  email: string;
  password: string;
};

export const loginService = async (data: LoginPayload) => {
  const response = await api.post("/auth/login", data);
  return response; // { user, token, ... }
};