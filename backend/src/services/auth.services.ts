import { supabase } from "./supabase.service.js";

export const signupUser = async (email: string, password: string) => {
  return supabase.auth.signUp({ email, password });
};

export const loginUser = async (email: string, password: string) => {
  return supabase.auth.signInWithPassword({ email, password });
};

export const insertUserRole = async (id: string, email: string, role: string) => {
  return supabase.from("User").insert({ id, email, role });
};

export const getUserById = async (id: string) => {
  return supabase.from("User").select("id,email,role").eq("id", id).single();
};
