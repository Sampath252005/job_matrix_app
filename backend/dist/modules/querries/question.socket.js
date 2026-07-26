// question/question.socket.ts
import { getIO } from "../../socket/socket.js";
/**
 * Sends a newly created question to:
 * - the candidate who created it
 * - the recruiter who owns the job
 */
export const emitNewQuestion = (question, recruiterId) => {
    const io = getIO();
    io.to(`user:${question.candidate_id}`)
        .to(`user:${recruiterId}`)
        .emit("question:new", question);
};
/**
 * Sends a new reply to both participants.
 */
export const emitNewQuestionReply = (reply, candidateId, recruiterId) => {
    const io = getIO();
    io.to(`user:${candidateId}`)
        .to(`user:${recruiterId}`)
        .emit("question-reply:new", reply);
};
/**
 * Sends the updated closed question to both participants.
 */
export const emitQuestionClosed = (question, candidateId, recruiterId) => {
    const io = getIO();
    io.to(`user:${candidateId}`)
        .to(`user:${recruiterId}`)
        .emit("question:closed", question);
};
//# sourceMappingURL=question.socket.js.map