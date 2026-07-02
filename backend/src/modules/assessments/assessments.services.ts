import { getSupabase } from "../../config/supabase.js";

interface UpdateAssessmentPayload {
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
        message: "Job not found or you are not authorized",
      },
    };
  }

  const { data: existingAssessment } = await supabase
    .from("assessments")
    .select("id")
    .eq("job_id", payload.job_id)
    .maybeSingle();

  if (existingAssessment) {
    return {
      data: null,
      error: {
        message: "Assessment already exists for this job",
      },
    };
  }

  return supabase.from("assessments").insert([payload]).select().single();
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
  payload: UpdateAssessmentPayload,
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



  // 1. Check assessment exists
  const { data: assessment, error: assessmentError } = await supabase
    .from("assessments")
    .select("*")
    .eq("id", assessmentId)
    .single();

  if (assessmentError || !assessment) {
    return {
      data: null,
      error: {
        message: "Assessment not found",
      },
    };
  }

  // 2. Check assessment active
  if (assessment.status !== "ACTIVE") {
    return {
      data: null,
      error: {
        message: "Assessment is not active",
      },
    };
  }

  // 3. Check published
  if (!assessment.is_published) {
    return {
      data: null,
      error: {
        message: "Assessment is not published",
      },
    };
  }

  // 4. Check assessment window
  const now = new Date();

  if (assessment.start_time && now < new Date(assessment.start_time)) {
    return {
      data: null,
      error: {
        message: "Assessment has not started yet",
      },
    };
  }

  if (assessment.end_time && now >= new Date(assessment.end_time)) {
    return {
      data: null,
      error: {
        message: "Assessment deadline has passed",
      },
    };
  }

  // 5. Check application
  const { data: application } = await supabase
    .from("applications")
    .select("id,status")
    .eq("job_id", assessment.job_id)
    .eq("candidate_id", candidateId)
    .single();

  if (!application) {
    return {
      data: null,
      error: {
        message: "You must apply for this job before starting assessment",
      },
    };
  }

  // 6. Only shortlisted candidates
  if (application.status !== "SHORTLISTED") {
    return {
      data: null,
      error: {
        message: "You are not shortlisted for this assessment",
      },
    };
  }

  // 7. Check existing attempt
  const { data: existingAttempt } = await supabase
    .from("assessment_attempts")
    .select("*")
    .eq("assessment_id", assessmentId)
    .eq("candidate_id", candidateId)
    .single();

  if (existingAttempt) {
    return {
      data: existingAttempt,
      error: null,
    };
  }

  // 8. Create attempt
  const { data, error } = await supabase
    .from("assessment_attempts")
    .insert({
      assessment_id: assessmentId,
      candidate_id: candidateId,
      application_id: application.id,
      status: "STARTED",
    })
    .select()
    .single();

  if (error) {
    return {
      data: null,
      error,
    };
  }

  return {
    data,
    error: null,
  };
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

  // Existing answer

  const { data: existingAnswer } = await supabase
    .from("candidate_answers")
    .select("id")
    .eq("attempt_id", attemptId)
    .eq("question_id", questionId)
    .maybeSingle();

  let result;

  if (existingAnswer) {
    result = await supabase
      .from("candidate_answers")
      .update({
        selected_answer: selectedAnswer,
      })
      .eq("id", existingAnswer.id)
      .select()
      .single();
  } else {
    result = await supabase
      .from("candidate_answers")
      .insert({
        attempt_id: attemptId,
        question_id: questionId,
        selected_answer: selectedAnswer,
      })
      .select()
      .single();
  }

  if (result.error) {
    return {
      data: null,
      error: {
        message: result.error.message,
      },
    };
  }

  return {
    data: result.data,
    error: null,
  };
};
export const submitAssessment = async (
  attemptId: string,
  candidateId: string,
  token: string,
) => {
  const supabase = getSupabase(token);

  // Verify attempt

  const { data: attempt, error: attemptError } = await supabase
    .from("assessment_attempts")
    .select("*")
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

  // Get answers

  const { data: answers, error: answersError } = await supabase
    .from("candidate_answers")
    .select(
      `
      question_id,
      selected_answer
    `,
    )
    .eq("attempt_id", attemptId);

  if (answersError) {
    return {
      data: null,
      error: answersError,
    };
  }

  // Get questions

  const { data: questions, error: questionsError } = await supabase
    .from("questions")
    .select(
      `
      id,
      correct_answer,
      marks
    `,
    )
    .eq("assessment_id", attempt.assessment_id);

  if (questionsError) {
    return {
      data: null,
      error: questionsError,
    };
  }

  // Calculate score

  let score = 0;

  for (const question of questions) {
    const answer = answers?.find((a) => a.question_id === question.id);

    if (answer && answer.selected_answer === question.correct_answer) {
      score += question.marks;
    }
  }

  // Update attempt

  const { data, error } = await supabase
    .from("assessment_attempts")
    .update({
      score,
      submitted_at: new Date().toISOString(),
      status: "SUBMITTED",
    })
    .eq("id", attemptId)
    .select()
    .single();

  if (error) {
    return {
      data: null,
      error,
    };
  }

  return {
    data,
    error: null,
  };
};

export const getAssessmentResult = async (
  attemptId: string,
  status: "PASSED" | "FAILED",
  token: string,
) => {
  const supabase = getSupabase(token);

  // Verify attempt exists

  const { data: attempt, error: attemptError } = await supabase
    .from("assessment_attempts")
    .select(
      `
      id,
      application_id,
      status
    `,
    )
    .eq("id", attemptId)
    .single();

  if (attemptError || !attempt) {
    return {
      data: null,
      error: {
        message: "Assessment attempt not found",
      },
    };
  }

  if (attempt.status !== "SUBMITTED") {
    return {
      data: null,
      error: {
        message: "Assessment has not been submitted yet",
      },
    };
  }

  // Update attempt status

  const { data, error } = await supabase
    .from("assessment_attempts")
    .update({
      status,
    })
    .eq("id", attemptId)
    .select()
    .single();

  if (error) {
    return {
      data: null,
      error,
    };
  }

  // Update application status

  await supabase
    .from("applications")
    .update({
      status: status === "PASSED" ? "INTERVIEW_ROUND" : "REJECTED",
    })
    .eq("id", attempt.application_id);

  return {
    data,
    error: null,
  };
};

export const publishAssessment = async (
  assessmentId: string,
  token: string,
) => {
  const supabase = getSupabase(token);

  const { data: assessment } = await supabase
    .from("assessments")
    .select("*")
    .eq("id", assessmentId)
    .single();

  if (assessment?.is_published) {
    throw new Error("Assessment already published");
  }

  if(assessment?.total_marks<=assessment?.passing_score)
  {
    throw new Error("passing score is less than total marks");
  }
  

  const { data, error } = await supabase
    .from("assessments")
    .update({
      is_published: true,
    })
    .eq("id", assessmentId)
    .select()
    .single();

  if (error) throw error;

  return data;


  
};

//to get all assments for the candidates
export const getCandidateAssessments = async (
  candidateId: string,
  token: string,
) => {
  const supabase = getSupabase(token);

  const { data: applications, error: appError } = await supabase
    .from("applications")
    .select("id, job_id")
    .eq("candidate_id", candidateId)
    .eq("status", "SHORTLISTED");

  if (appError) throw appError;

  if (!applications?.length) {
    return [];
  }

  const jobIds = applications.map((app) => app.job_id);

  const { data: assessments, error: assesmetError } = await supabase
    .from("assessments")
    .select("*")
    .in("job_id", jobIds)
    .eq("is_published", true);

  if (assesmetError) throw assesmetError;

  const assessmentIds = assessments.map((assessment) => assessment.id);

  const { data: assessmentStatus, error: attemptsError } = await supabase
    .from("assessment_attempts")
    .select("id,status,assessment_id,candidate_id")
    .in("assessment_id", assessmentIds)
    .eq("candidate_id", candidateId);

  if (attemptsError) throw attemptsError;

  return { assessments, assessmentStatus };
};

//to get assment details for the candidates
export const getCandidateAssessmentById = async (
  assessmentId: string,
  token: string,
) => {
  const supabase = getSupabase(token);

  const { data, error } = await supabase
    .from("assessments")
    .select(
      `
      id,
      title,
      description,
      duration_minutes,
      passing_score,
      total_marks,
      total_questions,
      start_time,
      end_time,
      is_published,
      jobs (
        id,
        title
      )
    `,
    )
    .eq("id", assessmentId)
    .single();

  if (error) {
    console.log("error--", error);
    throw error;
  }

  return data;
};

export const getAssessmentResults = async (
  assessmentId: string,
  recruiterId: string,
  token: string,
) => {
  const supabase = getSupabase(token);

  // Verify assessment belongs to recruiter

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
        message: "Assessment not found",
      },
    };
  }

  // Fetch candidate results
  const { data, error } = await supabase
    .from("assessment_attempts")
    .select(
      `
      id,
      score,
      status,
      submitted_at,

      users:candidate_id (
        id,
        name,
        email
      )
    `,
    )
    .eq("assessment_id", assessmentId)
    .order("submitted_at", {
      ascending: false,
    });

  if (error) {
    return {
      data: null,
      error,
    };
  }

  return {
    data,
    error: null,
  };
};

export const getAttempt = async (
  attemptId: string,
  candidateId: string,
  token: string,
) => {
  const supabase = getSupabase(token);

  const { data: attempt, error } = await supabase
    .from("assessment_attempts")
    .select(
      `
        id,
        status,
        started_at,

        assessments (
          id,
          title,
          duration_minutes,
          total_questions,
          total_marks
        )
      `,
    )
    .eq("id", attemptId)
    .eq("candidate_id", candidateId)
    .single();

  if (error) throw error;

  const assessmentId = (attempt.assessments as any).id;

  const { data: questions } = await supabase
    .from("questions")
    .select(
      `
        id,
        question,
        option_a,
        option_b,
        option_c,
        option_d,
        marks
      `,
    )
    .eq("assessment_id", assessmentId)
    .order("created_at");

  const { data: answers } = await supabase
    .from("candidate_answers")
    .select(
      `
        question_id,
        selected_answer
      `,
    )
    .eq("attempt_id", attemptId);

  return {
    attempt,
    questions,
    answers,
  };
};



