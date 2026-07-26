import { closeQuestionService, createQuestionReplyService, createQuestionService, getJobQuestionsService, getQuestionRepliesService, } from "./question.service.js";
export const createQuestion = async (req, res) => {
    try {
        const { jobId } = req.params;
        const { question, visibility, } = req.body;
        if (!req.user || !req.accessToken) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        if (req.user.role?.toLowerCase() !== "candidate") {
            return res.status(403).json({
                success: false,
                message: "Only candidates can post questions",
            });
        }
        if (!jobId) {
            return res.status(400).json({
                success: false,
                message: "Job ID is required",
            });
        }
        if (typeof question !== "string" ||
            !question.trim()) {
            return res.status(400).json({
                success: false,
                message: "Question is required",
            });
        }
        if (question.trim().length > 1000) {
            return res.status(400).json({
                success: false,
                message: "Question cannot exceed 1000 characters",
            });
        }
        if (visibility &&
            !["PUBLIC", "PRIVATE"].includes(visibility)) {
            return res.status(400).json({
                success: false,
                message: "Visibility must be PUBLIC or PRIVATE",
            });
        }
        const savedQuestion = await createQuestionService(jobId, req.user.id, req.accessToken, {
            question,
            visibility,
        });
        return res.status(201).json({
            success: true,
            message: "Question posted successfully",
            data: savedQuestion,
        });
    }
    catch (error) {
        const message = error instanceof Error
            ? error.message
            : "Unable to post question";
        if (message === "Job not found") {
            return res.status(404).json({
                success: false,
                message,
            });
        }
        if (message.includes("cannot") ||
            message.includes("not authorized")) {
            return res.status(403).json({
                success: false,
                message,
            });
        }
        return res.status(500).json({
            success: false,
            message,
        });
    }
};
export const getJobQuestions = async (req, res) => {
    try {
        const { jobId } = req.params;
        if (!req.user || !req.accessToken || !req.user.role) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        const questions = await getJobQuestionsService(jobId, req.user.id, req.user.role, req.accessToken);
        return res.status(200).json({
            success: true,
            count: questions.length,
            data: questions,
        });
    }
    catch (error) {
        const message = error instanceof Error
            ? error.message
            : "Unable to fetch questions";
        return res.status(message === "Job not found" ? 404 : 500).json({
            success: false,
            message,
        });
    }
};
export const createQuestionReply = async (req, res) => {
    try {
        const { questionId } = req.params;
        const { message } = req.body;
        if (!req.user || !req.accessToken || !req.user.role) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        if (typeof message !== "string" ||
            !message.trim()) {
            return res.status(400).json({
                success: false,
                message: "Reply message is required",
            });
        }
        if (message.trim().length > 1000) {
            return res.status(400).json({
                success: false,
                message: "Reply cannot exceed 1000 characters",
            });
        }
        const reply = await createQuestionReplyService(questionId, req.user.id, req.user.role, req.accessToken, {
            message,
        });
        return res.status(201).json({
            success: true,
            message: "Reply posted successfully",
            data: reply,
        });
    }
    catch (error) {
        const message = error instanceof Error
            ? error.message
            : "Unable to post reply";
        if (message === "Question not found") {
            return res.status(404).json({
                success: false,
                message,
            });
        }
        if (message.includes("not authorized") ||
            message.includes("closed")) {
            return res.status(403).json({
                success: false,
                message,
            });
        }
        return res.status(500).json({
            success: false,
            message,
        });
    }
};
export const getQuestionReplies = async (req, res) => {
    try {
        const { questionId } = req.params;
        if (!req.user || !req.accessToken || !req.user.role) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        const replies = await getQuestionRepliesService(questionId, req.user.id, req.user.role, req.accessToken);
        return res.status(200).json({
            success: true,
            count: replies.length,
            data: replies,
        });
    }
    catch (error) {
        const message = error instanceof Error
            ? error.message
            : "Unable to fetch replies";
        if (message === "Question not found") {
            return res.status(404).json({
                success: false,
                message,
            });
        }
        if (message.includes("not authorized")) {
            return res.status(403).json({
                success: false,
                message,
            });
        }
        return res.status(500).json({
            success: false,
            message,
        });
    }
};
export const closeQuestion = async (req, res) => {
    try {
        const { questionId } = req.params;
        if (!req.user || !req.accessToken) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        if (req.user.role?.toLowerCase() !== "recruiter") {
            return res.status(403).json({
                success: false,
                message: "Only recruiters can close questions",
            });
        }
        const updatedQuestion = await closeQuestionService(questionId, req.user.id, req.accessToken);
        return res.status(200).json({
            success: true,
            message: "Question closed successfully",
            data: updatedQuestion,
        });
    }
    catch (error) {
        const message = error instanceof Error
            ? error.message
            : "Unable to close question";
        if (message === "Question not found") {
            return res.status(404).json({
                success: false,
                message,
            });
        }
        if (message.includes("not authorized")) {
            return res.status(403).json({
                success: false,
                message,
            });
        }
        return res.status(500).json({
            success: false,
            message,
        });
    }
};
//# sourceMappingURL=question.controller.js.map