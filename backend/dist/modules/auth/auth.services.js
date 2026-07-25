import { getSupabase } from "../../config/supabase.js";
export const signupUser = async (email, password) => {
    const supabase = getSupabase();
    return supabase.auth.signUp({ email, password });
};
export const loginUser = async (email, password) => {
    const supabase = getSupabase();
    return supabase.auth.signInWithPassword({ email, password });
};
export const insertUserRole = async (id, email, role, name, phone) => {
    const supabase = getSupabase();
    return supabase.from("users").insert({ id, email, role });
};
export const getUserById = async (id) => {
    const supabase = getSupabase();
    return supabase.from("users").select("id,email,role").eq("id", id).single();
};
//# sourceMappingURL=auth.services.js.map