import { getSupabase } from "../../config/supabase.js";
import { getIO } from "../../socket/socket.js";
import { createInterviewService, generateInterviewTokenService, } from "./interview.service.js";
export const createInterview = async (req, res) => {
    const recruiterId = req.user?.id;
    const role = req.user?.role;
    const token = req.accessToken;
    if (!recruiterId || !role || !token) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
    }
    if (role.toUpperCase() !== "RECRUITER") {
        return res.status(403).json({
            success: false,
            message: "Only recruiters can schedule interviews",
        });
    }
    const { application_id, scheduled_at, duration_minutes, interview_type, round_type, title, notes, location, meeting_link, } = req.body;
    if (!application_id) {
        return res.status(400).json({
            success: false,
            message: "Application ID is required",
        });
    }
    if (!scheduled_at) {
        return res.status(400).json({
            success: false,
            message: "Interview date and time are required",
        });
    }
    try {
        const interview = await createInterviewService(recruiterId, token, {
            application_id,
            scheduled_at,
            duration_minutes,
            interview_type,
            round_type,
            title,
            notes,
            location,
            meeting_link,
        });
        const io = getIO();
        io.to(`user:${interview.candidate_id}`).emit("interview:scheduled", interview);
        const { data: notification, error: notificationError } = await getSupabase(token)
            .from("notifications")
            .insert({
            user_id: interview.candidate_id,
            type: "INTERVIEW_SCHEDULED",
            title: "Interview scheduled",
            message: `${interview.title} has been scheduled.`,
            data: {
                interviewId: interview.id,
                jobId: interview.job_id,
                scheduledAt: interview.scheduled_at,
                roundType: interview.round_type,
            },
        })
            .select()
            .single();
        if (notificationError) {
            console.error("Interview notification creation failed:", notificationError);
        }
        else if (notification) {
            io.to(`user:${interview.candidate_id}`).emit("notification:new", notification);
        }
        return res.status(201).json({
            success: true,
            message: "Interview scheduled successfully",
            data: interview,
        });
    }
    catch (error) {
        const message = error instanceof Error
            ? error.message
            : "Unable to schedule interview";
        if (message === "Application not found" ||
            message === "Job not found") {
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
        if (message.includes("Invalid") ||
            message.includes("required") ||
            message.includes("future time") ||
            message.includes("duration") ||
            message.includes("already exists") ||
            message.includes("already has") ||
            message.includes("shortlisted") ||
            message.includes("cannot exceed") ||
            message.includes("must be")) {
            return res.status(400).json({
                success: false,
                message,
            });
        }
        console.error("Create interview controller error:", error);
        return res.status(500).json({
            success: false,
            message,
        });
    }
};
export const getInterviewToken = async (req, res) => {
    const { interviewId } = req.params;
    const userId = req.user?.id;
    const userEmail = req.user?.email;
    const token = req.accessToken;
    if (!userId || !userEmail || !token) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
    }
    if (!interviewId) {
        return res.status(400).json({
            success: false,
            message: "Interview ID is required",
        });
    }
    try {
        const result = await generateInterviewTokenService(interviewId, userId, userEmail, token);
        return res.status(200).json({
            success: true,
            message: "Interview token generated successfully",
            data: {
                server_url: result.serverUrl,
                participant_token: result.participantToken,
                room_name: result.roomName,
                participant_identity: result.participantIdentity,
                participant_role: result.participantRole,
                interview: result.interview,
            },
        });
    }
    catch (error) {
        const message = error instanceof Error
            ? error.message
            : "Unable to generate interview token";
        if (message === "Interview not found") {
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
        if (message.includes("Invalid")) {
            return res.status(400).json({
                success: false,
                message,
            });
        }
        if (message.includes("offline") ||
            message.includes("cancelled") ||
            message.includes("completed") ||
            message.includes("not available") ||
            message.includes("not configured")) {
            return res.status(400).json({
                success: false,
                message,
            });
        }
        console.error("Generate LiveKit token error:", error);
        return res.status(500).json({
            success: false,
            message,
        });
    }
};
import { getInterviewByIdService, getMyInterviewsService, getRecruiterInterviewsService, updateInterviewService, updateInterviewStatusService, } from "./interview.service.js";
const getErrorMessage = (error, fallback) => error instanceof Error
    ? error.message
    : fallback;
const getInterviewErrorStatus = (message) => {
    if (message === "Interview not found") {
        return 404;
    }
    if (message.includes("not authorized")) {
        return 403;
    }
    if (message.includes("Invalid") ||
        message.includes("required") ||
        message.includes("future") ||
        message.includes("duration") ||
        message.includes("already") ||
        message.includes("cannot") ||
        message.includes("Cannot") ||
        message.includes("Provide") ||
        message.includes("must be")) {
        return 400;
    }
    return 500;
};
/**
 * GET /api/interviews/:interviewId
 */
export const getInterviewById = async (req, res) => {
    const { interviewId } = req.params;
    const userId = req.user?.id;
    const token = req.accessToken;
    if (!userId || !token) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
    }
    try {
        const interview = await getInterviewByIdService(interviewId, userId, token);
        return res.status(200).json({
            success: true,
            message: "Interview fetched successfully",
            data: interview,
        });
    }
    catch (error) {
        const message = getErrorMessage(error, "Unable to fetch interview");
        return res
            .status(getInterviewErrorStatus(message))
            .json({
            success: false,
            message,
        });
    }
};
/**
 * PATCH /api/interviews/:interviewId
 */
export const updateInterview = async (req, res) => {
    const { interviewId } = req.params;
    const recruiterId = req.user?.id;
    const token = req.accessToken;
    if (!recruiterId || !token) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
    }
    try {
        const interview = await updateInterviewService(interviewId, recruiterId, token, req.body);
        getIO()
            .to(`user:${interview.candidate_id}`)
            .emit("interview:updated", interview);
        return res.status(200).json({
            success: true,
            message: "Interview updated successfully",
            data: interview,
        });
    }
    catch (error) {
        const message = getErrorMessage(error, "Unable to update interview");
        return res
            .status(getInterviewErrorStatus(message))
            .json({
            success: false,
            message,
        });
    }
};
/**
 * PATCH /api/interviews/:interviewId/status
 */
export const updateInterviewStatus = async (req, res) => {
    const { interviewId } = req.params;
    const { status } = req.body;
    const recruiterId = req.user?.id;
    const token = req.accessToken;
    if (!recruiterId || !token) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
    }
    if (!status) {
        return res.status(400).json({
            success: false,
            message: "Interview status is required",
        });
    }
    try {
        const interview = await updateInterviewStatusService(interviewId, recruiterId, token, status);
        const candidateRoom = `user:${interview.candidate_id}`;
        const io = getIO();
        io.to(candidateRoom).emit("interview:status-updated", interview);
        if (interview.status === "CANCELLED") {
            io.to(candidateRoom).emit("interview:cancelled", interview);
        }
        return res.status(200).json({
            success: true,
            message: "Interview status updated successfully",
            data: interview,
        });
    }
    catch (error) {
        const message = getErrorMessage(error, "Unable to update interview status");
        return res
            .status(getInterviewErrorStatus(message))
            .json({
            success: false,
            message,
        });
    }
};
/**
 * GET /api/interviews/me
 */
export const getMyInterviews = async (req, res) => {
    const candidateId = req.user?.id;
    const token = req.accessToken;
    if (!candidateId || !token) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
    }
    try {
        const interviews = await getMyInterviewsService(candidateId, token);
        return res.status(200).json({
            success: true,
            count: interviews.length,
            data: interviews,
        });
    }
    catch (error) {
        const message = getErrorMessage(error, "Unable to fetch interviews");
        return res.status(500).json({
            success: false,
            message,
        });
    }
};
/**
 * GET /api/interviews/recruiter
 */
export const getRecruiterInterviews = async (req, res) => {
    const recruiterId = req.user?.id;
    const token = req.accessToken;
    if (!recruiterId || !token) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
    }
    try {
        const interviews = await getRecruiterInterviewsService(recruiterId, token);
        return res.status(200).json({
            success: true,
            count: interviews.length,
            data: interviews,
        });
    }
    catch (error) {
        const message = getErrorMessage(error, "Unable to fetch recruiter interviews");
        return res.status(500).json({
            success: false,
            message,
        });
    }
};
//# sourceMappingURL=interview.controller.js.map