import { getSupabase } from "../../config/supabase.js";
//To create a question
export const createQuestion = async (assessmentId, recruiterId, payload, token) => {
    const supabase = getSupabase(token);
    // Verify recruiter owns assessment
    const { data: assessment, error: assessmentError } = await supabase
        .from("assessments")
        .select("id")
        .eq("id", assessmentId)
        .eq("recruiter_id", recruiterId)
        .single();
    if (assessmentError || !assessment) {
        return {
            data: null,
            error: {
                message: "Assessment not found or unauthorized",
            },
        };
    }
    const result = await supabase
        .from("questions")
        .insert([
        {
            assessment_id: assessmentId,
            ...payload,
        },
    ])
        .select()
        .single();
    return result;
};
//to get all assements questions
export const getQuestionsByAssessment = async (assessmentId, recruiterId, token) => {
    const supabase = getSupabase(token);
    // Verify recruiter owns assessment
    const { data: assessment, error: assessmentError } = await supabase
        .from("assessments")
        .select("id")
        .eq("id", assessmentId)
        .eq("recruiter_id", recruiterId)
        .single();
    if (assessmentError || !assessment) {
        return {
            data: null,
            error: {
                message: "Assessment not found or unauthorized",
            },
        };
    }
    return supabase
        .from("questions")
        .select("*")
        .eq("assessment_id", assessmentId)
        .order("created_at", { ascending: true });
};
export const updateQuestion = async (questionId, recruiterId, payload, token) => {
    const supabase = getSupabase(token);
    // Verify recruiter owns the assessment
    const { data: question, error: questionError } = await supabase
        .from("questions")
        .select(`
      id,
      assessment_id,
      assessments!inner (
        recruiter_id
      )
    `)
        .eq("id", questionId)
        .eq("assessments.recruiter_id", recruiterId)
        .single();
    if (questionError || !question) {
        return {
            data: null,
            error: {
                message: "Question not found or unauthorized",
            },
        };
    }
    return supabase
        .from("questions")
        .update(payload)
        .eq("id", questionId)
        .select()
        .single();
};
export const deleteQuestion = async (questionId, recruiterId, token) => {
    const supabase = getSupabase(token);
    // Verify ownership
    const { data: question, error: questionError } = await supabase
        .from("questions")
        .select(`
      id,
      assessment_id,
      assessments!inner (
        recruiter_id
      )
    `)
        .eq("id", questionId)
        .eq("assessments.recruiter_id", recruiterId)
        .single();
    if (questionError || !question) {
        return {
            data: null,
            error: {
                message: "Question not found or unauthorized",
            },
        };
    }
    return supabase
        .from("questions")
        .delete()
        .eq("id", questionId)
        .select()
        .single();
};
//# sourceMappingURL=questions.services.js.map