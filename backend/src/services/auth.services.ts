
// import { getSupabase } from "./supabase.service.js";


// export const signupUser = async (email: string, password: string) => {
//   const supabase = getSupabase();
//   return supabase.auth.signUp({ email, password });
// };

// export const loginUser = async (email: string, password: string) => {
//   const supabase = getSupabase();
//   return supabase.auth.signInWithPassword({ email, password });
// };

// export const insertUserRole = async (id: string, email: string, role: string) => {
//   const supabase = getSupabase();
//   return supabase.from("users").insert({ id, email, role });
// };

// export const getUserById = async (id: string) => {
//   const supabase = getSupabase();
//   return supabase.from("users").select("id,email,role").eq("id", id).single();
// };
