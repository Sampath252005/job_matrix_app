// question/question.socket.ts

import { getIO } from "../../socket/socket.js";

export interface QuestionSocketData {
  id: string;
  job_id: string;
  candidate_id: string;
  question: string;
  visibility: "PUBLIC" | "PRIVATE";
  status: "OPEN" | "ANSWERED" | "CLOSED";
  created_at: string;
  updated_at: string;
}

export interface ReplySocketData {
  id: string;
  question_id: string;
  sender_id: string;
  message: string;
  created_at: string;
  updated_at: string;
}

/**
 * Sends a newly created question to:
 * - the candidate who created it
 * - the recruiter who owns the job
 */
export const emitNewQuestion = (
  question: QuestionSocketData,
  recruiterId: string,
) => {
  const io = getIO();

  io.to(`user:${question.candidate_id}`)
    .to(`user:${recruiterId}`)
    .emit("question:new", question);
};

/**
 * Sends a new reply to both participants.
 */
export const emitNewQuestionReply = (
  reply: ReplySocketData,
  candidateId: string,
  recruiterId: string,
) => {
  const io = getIO();

  io.to(`user:${candidateId}`)
    .to(`user:${recruiterId}`)
    .emit("question-reply:new", reply);
};

/**
 * Sends the updated closed question to both participants.
 */
export const emitQuestionClosed = (
  question: QuestionSocketData,
  candidateId: string,
  recruiterId: string,
) => {
  const io = getIO();

  io.to(`user:${candidateId}`)
    .to(`user:${recruiterId}`)
    .emit("question:closed", question);
};