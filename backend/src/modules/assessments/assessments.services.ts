import { getSupabase } from "../../config/supabase.js"

  interface UpdateAssessmentPayload{
  title?: string;
  description?: string;
  duration_minutes?: number;
  passing_score?: number;
  status?: "ACTIVE" | "INACTIVE";
}

export const createAssessment = async (
  payload: {
    job_id: string;
    recruiter_id: string;
    title: string;
    description?: string;
    duration_minutes: number;
    passing_score: number;
  },
  token: string,
) => {
  const supabase = getSupabase(token);

  // Step 1: Verify job ownership

  const { data: job, error: jobError } = await supabase
    .from("jobs")
    .select("id")
    .eq("id", payload.job_id)
    .eq("recruiter_id", payload.recruiter_id)
    .single();

  if (jobError || !job) {
    return {
      data: null,
      error: {
        message:
          "Job not found or you are not authorized",
      },
    };
  }

  const { data: existingAssessment } =
  await supabase
    .from("assessments")
    .select("id")
    .eq("job_id", payload.job_id)
    .maybeSingle();

if (existingAssessment) {
  return {
    data: null,
    error: {
      message:
        "Assessment already exists for this job",
    },
  };
}

  return supabase
    .from("assessments")
    .insert([payload])
    .select()
    .single();
};


export const getAssessmentByJob = async (
  jobId: string,
  recruiterId: string,
  token: string,
) => {
  const supabase = getSupabase(token);

  return supabase
    .from("assessments")
    .select("*")
    .eq("job_id", jobId)
    .eq("recruiter_id", recruiterId)
    .maybeSingle();
};

export const getAssessmentById = async (
  assessmentId: string,
  recruiterId: string,
  token: string,
) => {
  const supabase = getSupabase(token);

  return supabase
    .from("assessments")
    .select("*")
    .eq("id", assessmentId)
    .eq("recruiter_id", recruiterId)
    .single();
};

export const updateAssessment = async (
  assessmentId: string,
  recruiterId: string,
  payload:UpdateAssessmentPayload,
  token: string,
) => {
  const supabase = getSupabase(token);

  return supabase
    .from("assessments")
    .update(payload)
    .eq("id", assessmentId)
    .eq("recruiter_id", recruiterId)
    .select()
    .single();
};

export const deleteAssessment = async (
  assessmentId: string,
  recruiterId: string,
  token: string,
) => {
  const supabase = getSupabase(token);

  return supabase
    .from("assessments")
    .delete()
    .eq("id", assessmentId)
    .eq("recruiter_id", recruiterId)
    .select()
    .single();
};

//candidate services
//*************to start a assements

export const startAssessment = async (
  assessmentId: string,
  candidateId: string,
  token: string,
) => {
  const supabase = getSupabase(token);

  // 1. Check assessment exists and get job_id
  const { data: assessment, error: assessmentError } = await supabase
    .from("assessments")
    .select("id, job_id, status")
    .eq("id", assessmentId)
    .single();

  if (assessmentError || !assessment) {
    return {
      data: null,
      error: { message: "Assessment not found" },
    };
  }

  if (assessment.status !== "ACTIVE") {
    return {
      data: null,
      error: { message: "Assessment is not active" },
    };
  }

  // 2. Check candidate applied for that job
  const { data: application, error: applicationError } = await supabase
    .from("applications")
    .select("id")
    .eq("job_id", assessment.job_id)
    .eq("candidate_id", candidateId)
    .single();

  if (applicationError || !application) {
    return {
      data: null,
      error: {
        message: "You must apply for this job before starting assessment",
      },
    };
  }

  // 3. Check existing attempt
  const { data: existingAttempt } = await supabase
    .from("assessment_attempts")
    .select("*")
    .eq("assessment_id", assessmentId)
    .eq("candidate_id", candidateId)
    .maybeSingle();

  if (existingAttempt) {
    return {
      data: existingAttempt,
      error: null,
    };
  }

  // 4. Create new attempt
  return supabase
    .from("assessment_attempts")
    .insert([
      {
        assessment_id: assessmentId,
        candidate_id: candidateId,
        application_id: application.id,
        status: "STARTED",
      },
    ])
    .select()
    .single();
};





export const saveAnswer = async (
  attemptId: string,
  candidateId: string,
  questionId: string,
  selectedAnswer: string,
  token: string,
) => {
  const supabase = getSupabase(token);

  // Verify attempt ownership

  const { data: attempt, error: attemptError } = await supabase
    .from("assessment_attempts")
    .select("id, assessment_id, status")
    .eq("id", attemptId)
    .eq("candidate_id", candidateId)
    .single();

  if (attemptError || !attempt) {
    return {
      data: null,
      error: {
        message: "Attempt not found or unauthorized",
      },
    };
  }

  if (attempt.status !== "STARTED") {
    return {
      data: null,
      error: {
        message: "Assessment already submitted",
      },
    };
  }

  // Verify question belongs to assessment

  const { data: question, error: questionError } = await supabase
    .from("questions")
    .select("id")
    .eq("id", questionId)
    .eq("assessment_id", attempt.assessment_id)
    .single();

  if (questionError || !question) {
    return {
      data: null,
      error: {
        message: "Question not found",
      },
    };
  }

  // Check existing answer

  const { data: existingAnswer } = await supabase
    .from("candidate_answers")
    .select("id")
    .eq("attempt_id", attemptId)
    .eq("question_id", questionId)
    .maybeSingle();

  if (existingAnswer) {
    // Update existing answer

    return supabase
      .from("candidate_answers")
      .update({
        selected_answer: selectedAnswer,
      })
      .eq("id", existingAnswer.id)
      .select()
      .single();
  }

  // Create new answer

  return supabase
    .from("candidate_answers")
    .insert([
      {
        attempt_id: attemptId,
        question_id: questionId,
        selected_answer: selectedAnswer,
      },
    ])
    .select()
    .single();
};


export const submitAssessment = async (
  attemptId: string,
  candidateId: string,
  token: string,
) => {
  const supabase = getSupabase(token);

  // Verify attempt ownership

  const { data: attempt, error: attemptError } = await supabase
    .from("assessment_attempts")
    .select(`
      id,
      assessment_id,
      status,
      assessments (
        passing_score
      )
    `)
    .eq("id", attemptId)
    .eq("candidate_id", candidateId)
    .single();

  if (attemptError || !attempt) {
    return {
      data: null,
      error: {
        message: "Attempt not found",
      },
    };
  }

  if (attempt.status !== "STARTED") {
    return {
      data: null,
      error: {
        message: "Assessment already submitted",
      },
    };
  }

  // Get all candidate answers

  const { data: answers } = await supabase
    .from("candidate_answers")
    .select(`
      selected_answer,
      question_id,
      questions (
        correct_answer,
        marks
      )
    `)
    .eq("attempt_id", attemptId);

  let score = 0;
  let correctAnswers = 0;
  let wrongAnswers = 0;

for (const answer of answers || []) {
  const question = Array.isArray(answer.questions)
    ? answer.questions[0]
    : answer.questions;

  if (
    question &&
    answer.selected_answer === question.correct_answer
  ) {
    score += question.marks;
    correctAnswers++;

    await supabase
      .from("candidate_answers")
      .update({
        is_correct: true,
        marks_awarded: question.marks,
      })
      .eq("attempt_id", attemptId)
      .eq("question_id", answer.question_id);
  } else {
    wrongAnswers++;

    await supabase
      .from("candidate_answers")
      .update({
        is_correct: false,
        marks_awarded: 0,
      })
      .eq("attempt_id", attemptId)
      .eq("question_id", answer.question_id);
  }
}

  const attemptAssessments = (attempt as any).assessments;
  const passingScore =
    Array.isArray(attemptAssessments)
      ? attemptAssessments[0]?.passing_score
      : attemptAssessments?.passing_score;

  const finalStatus =
    score >= passingScore
      ? "PASSED"
      : "FAILED";

  // Update attempt

  const { data: updatedAttempt, error: updateError } =
    await supabase
      .from("assessment_attempts")
      .update({
        score,
        status: finalStatus,
        submitted_at: new Date().toISOString(),
      })
      .eq("id", attemptId)
      .select()
      .single();

  if (updateError) {
    return {
      data: null,
      error: updateError,
    };
  }

  return {
    data: {
      attempt: updatedAttempt,
      score,
      correctAnswers,
      wrongAnswers,
      status: finalStatus,
    },
    error: null,
  };
};


export const getAssessmentResult = async (
  attemptId: string,
  candidateId: string,
  token: string,
) => {
  const supabase = getSupabase(token);

  // Verify attempt ownership

  const { data: attempt, error: attemptError } = await supabase
    .from("assessment_attempts")
    .select(`
      id,
      score,
      status,
      started_at,
      submitted_at,
      assessments (
        id,
        title,
        passing_score
      )
    `)
    .eq("id", attemptId)
    .eq("candidate_id", candidateId)
    .single();

  if (attemptError || !attempt) {
    return {
      data: null,
      error: {
        message: "Result not found",
      },
    };
  }

  // Get answers

  const { data: answers, error: answersError } =
    await supabase
      .from("candidate_answers")
      .select(`
        selected_answer,
        is_correct,
        questions (
          question,
          correct_answer,
          marks
        )
      `)
      .eq("attempt_id", attemptId);

  if (answersError) {
    return {
      data: null,
      error: answersError,
    };
  }

  let correctAnswers = 0;
  let wrongAnswers = 0;

  for (const answer of answers || []) {
    if (answer.is_correct) {
      correctAnswers++;
    } else {
      wrongAnswers++;
    }
  }

  return {
    data: {
      assessment: attempt.assessments,
      score: attempt.score,
      status: attempt.status,
      started_at: attempt.started_at,
      submitted_at: attempt.submitted_at,
      correctAnswers,
      wrongAnswers,
      answers,
    },
    error: null,
  };
};