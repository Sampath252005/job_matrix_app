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
      ),
      applications(
      id,
      status
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



export const getAttemptDetails = async (
  attemptId: string,
  token: string,
) => {
  const supabase = getSupabase(token);

  // Attempt Details

  const { data: attempt, error: attemptError } =
    await supabase
      .from("assessment_attempts")
      .select(`
        id,
        score,
        status,
        started_at,
        submitted_at,

        users(
          id,
          name,
          email,
          phone
        ),

        assessments(
          id,
          title,
          total_marks,
          passing_score
        ),
        applications(
        id,
        status
        )
      `)
      .eq("id", attemptId)
      .single();

  if (attemptError) {
    throw attemptError;
  }

  // Answers

  const { data: answers, error: answersError } =
    await supabase
      .from("candidate_answers")
      .select(`
        selected_answer,

        questions(
          id,
          question,
          option_a,
          option_b,
          option_c,
          option_d,
          correct_answer,
          marks
        )
      `)
      .eq("attempt_id", attemptId);

  if (answersError) {
    throw answersError;
  }

  return {
    attempt,
    questions: answers,
  };
};