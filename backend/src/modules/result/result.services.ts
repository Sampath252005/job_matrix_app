import { getSupabase } from "../../config/supabase.js";

export const getAssessmentResults = async (
  assessmentId: string,
  token: string,
) => {
  const supabase = getSupabase(token);

 const { data, error } = await supabase
    .from("assessment_attempts")
    .select(`
      id,
      score,
      status,
      submitted_at,
      candidate_id,
      assessments(
        total_marks,
        passing_score,
      ),
      users(
        id,
        name,
        email,
        phone
      )
    `)
    .eq("assessment_id", assessmentId)
    .order("submitted_at", {
      ascending: false,
    });


  if (error) throw error;

  return data;
};


export const getJobAssessmentResults = async (
  jobId: string,
  token: string,
) => {
  const supabase = getSupabase(token);

  // Step 1: Find assessment for this job
  const {
    data: assessment,
    error: assessmentError,
  } = await supabase
    .from("assessments")
    .select("id, title, total_marks, passing_score")
    .eq("job_id", jobId)
    .single();

  if (assessmentError || !assessment) {
    throw new Error("Assessment not found");
  }

  // Step 2: Fetch all attempts
  const {
    data: attempts,
    error: attemptsError,
  } = await supabase
    .from("assessment_attempts")
    .select(`
      id,
      score,
      status,
      submitted_at,
      candidate_id,
      users(
        id,
        name,
        email,
        phone
      )
    `)
    .eq("assessment_id", assessment.id)
    .order("submitted_at", {
      ascending: false,
    });

  if (attemptsError) {
    throw attemptsError;
  }

  return {
    assessment,
    attempts,
  };
};