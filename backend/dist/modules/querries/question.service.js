import { getSupabase } from "../../services/supabase.service.js";
import { emitNewQuestion, emitNewQuestionReply, emitQuestionClosed, } from "./question.socket.js";
export const createQuestionService = async (jobId, candidateId, accessToken, input) => {
    const supabase = getSupabase(accessToken);
    const { data: job, error: jobError } = await supabase
        .from("jobs")
        .select("id, recruiter_id")
        .eq("id", jobId)
        .single();
    if (jobError || !job) {
        throw new Error("Job not found");
    }
    if (job.recruiter_id === candidateId) {
        throw new Error("Recruiters cannot ask questions on their own job");
    }
    const { data: question, error } = await supabase
        .from("job_questions")
        .insert({
        job_id: jobId,
        candidate_id: candidateId,
        question: input.question.trim(),
        visibility: input.visibility ?? "PUBLIC",
        status: "OPEN",
    })
        .select("*")
        .single();
    if (error || !question) {
        console.error("Create question error:", error);
        throw new Error(error?.message ?? "Unable to create question");
    }
    try {
        emitNewQuestion(question, job.recruiter_id);
    }
    catch (socketError) {
        console.error("Question socket emission failed:", socketError);
    }
    return question;
};
export const getJobQuestionsService = async (jobId, userId, userRole, accessToken) => {
    const supabase = getSupabase(accessToken);
    const { data: job, error: jobError } = await supabase
        .from("jobs")
        .select("id, recruiter_id")
        .eq("id", jobId)
        .single();
    if (jobError || !job) {
        throw new Error("Job not found");
    }
    const isJobOwner = userRole?.toLowerCase() === "recruiter" &&
        job.recruiter_id === userId;
    let query = supabase
        .from("job_questions")
        .select(`
      id,
      job_id,
      candidate_id,
      question,
      visibility,
      status,
      created_at,
      updated_at
    `)
        .eq("job_id", jobId)
        .order("created_at", {
        ascending: false,
    });
    /*
     * Recruiter who owns the job can see all questions.
     *
     * Candidates can see:
     * 1. All PUBLIC questions
     * 2. Their own PRIVATE questions
     */
    if (!isJobOwner) {
        query = query.or(`visibility.eq.PUBLIC,and(visibility.eq.PRIVATE,candidate_id.eq.${userId})`);
    }
    const { data: questions, error } = await query;
    if (error) {
        console.error("Get questions error:", error);
        throw new Error(error.message);
    }
    return questions ?? [];
};
export const createQuestionReplyService = async (questionId, senderId, userRole, accessToken, input) => {
    const supabase = getSupabase(accessToken);
    const { data: question, error: questionError } = await supabase
        .from("job_questions")
        .select(`
        id,
        job_id,
        candidate_id,
        status,
        jobs (
          recruiter_id
        )
      `)
        .eq("id", questionId)
        .single();
    if (questionError || !question) {
        throw new Error("Question not found");
    }
    const jobData = Array.isArray(question.jobs)
        ? question.jobs[0]
        : question.jobs;
    const recruiterId = jobData?.recruiter_id;
    const isCandidate = question.candidate_id === senderId;
    const isRecruiter = userRole?.toLowerCase() === "recruiter" &&
        recruiterId === senderId;
    if (!isCandidate && !isRecruiter) {
        throw new Error("You are not authorized to reply to this question");
    }
    if (question.status === "CLOSED") {
        throw new Error("Replies are not allowed because this question is closed");
    }
    const { data: reply, error } = await supabase
        .from("job_question_replies")
        .insert({
        question_id: questionId,
        sender_id: senderId,
        message: input.message.trim(),
    })
        .select("*")
        .single();
    if (error || !reply) {
        console.error("Create reply error:", error);
        throw new Error(error?.message ?? "Unable to post reply");
    }
    /*
     * Mark the question as answered when recruiter replies.
     */
    if (isRecruiter && question.status === "OPEN") {
        await supabase
            .from("job_questions")
            .update({
            status: "ANSWERED",
            updated_at: new Date().toISOString(),
        })
            .eq("id", questionId);
    }
    try {
        emitNewQuestionReply(reply, question.candidate_id, recruiterId);
    }
    catch (socketError) {
        console.error("Question reply socket emission failed:", socketError);
    }
    return reply;
};
export const getQuestionRepliesService = async (questionId, userId, userRole, accessToken) => {
    const supabase = getSupabase(accessToken);
    const { data: question, error: questionError } = await supabase
        .from("job_questions")
        .select(`
        id,
        candidate_id,
        visibility,
        jobs (
          recruiter_id
        )
      `)
        .eq("id", questionId)
        .single();
    if (questionError || !question) {
        throw new Error("Question not found");
    }
    const jobData = Array.isArray(question.jobs)
        ? question.jobs[0]
        : question.jobs;
    const recruiterId = jobData?.recruiter_id;
    const isQuestionOwner = question.candidate_id === userId;
    const isRecruiter = userRole?.toLowerCase() === "recruiter" &&
        recruiterId === userId;
    const canView = question.visibility === "PUBLIC" ||
        isQuestionOwner ||
        isRecruiter;
    if (!canView) {
        throw new Error("You are not authorized to view these replies");
    }
    const { data: replies, error } = await supabase
        .from("job_question_replies")
        .select("*")
        .eq("question_id", questionId)
        .order("created_at", {
        ascending: true,
    });
    if (error) {
        throw new Error(error.message);
    }
    return replies ?? [];
};
export const closeQuestionService = async (questionId, recruiterId, accessToken) => {
    const supabase = getSupabase(accessToken);
    const { data: question, error: questionError } = await supabase
        .from("job_questions")
        .select(`
        id,
        status,
        candidate_id,
        jobs (
          recruiter_id
        )
      `)
        .eq("id", questionId)
        .single();
    if (questionError || !question) {
        throw new Error("Question not found");
    }
    const jobData = Array.isArray(question.jobs)
        ? question.jobs[0]
        : question.jobs;
    if (jobData?.recruiter_id !== recruiterId) {
        throw new Error("You are not authorized to close this question");
    }
    const { data: updatedQuestion, error } = await supabase
        .from("job_questions")
        .update({
        status: "CLOSED",
        updated_at: new Date().toISOString(),
    })
        .eq("id", questionId)
        .select("*")
        .single();
    if (error || !updatedQuestion) {
        throw new Error(error?.message ?? "Unable to close question");
    }
    try {
        emitQuestionClosed(updatedQuestion, question.candidate_id, recruiterId);
    }
    catch (socketError) {
        console.error("Question close socket emission failed:", socketError);
    }
    return updatedQuestion;
};
//# sourceMappingURL=question.service.js.map