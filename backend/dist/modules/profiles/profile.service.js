import { getSupabase } from "../../config/supabase.js";
//****************************************************recrutuiter profile api*******************************************************************//
//1.update a profile
export const upsertRecruiterProfileDetails = async (payload, token) => {
    const supabase = getSupabase(token); // ✅ PASS TOKEN HERE
    // const { data: roleCheck } = await supabase.rpc("get_role_test");
    // console.log("ROLE CHECK:", roleCheck);
    console.log("Recruiter service function called");
    return supabase
        .from("company_profiles")
        .upsert(payload, { onConflict: "user_id" })
        .select()
        .single();
};
//2.fetch a profile
export const getRecruiterProfile = async (token) => {
    const supabase = getSupabase(token);
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    return supabase
        .from("company_profiles")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();
};
//*********************************************************candidate profile api********************************************************** */
//to Update a user profile
export const upsertCandidateProfileDetails = async (payload, token) => {
    const supabase = getSupabase(token);
    return supabase
        .from("candidate_profiles") // ✅ correct table?
        .upsert(payload, { onConflict: "user_id" })
        .select()
        .single();
};
//To fectch candidate profile
export const getCandidateProfile = async (token) => {
    const supabase = getSupabase(token);
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    return supabase
        .from("candidate_profiles")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();
};
//# sourceMappingURL=profile.service.js.map