// src/announcement/announcement.socket.ts
import { getIO } from "../../socket/socket.js";
import { getSupabase } from "../../services/supabase.service.js";
export const emitNewAnnouncement = async (announcement, accessToken) => {
    const io = getIO();
    const supabase = getSupabase(accessToken);
    /*
     * Always send the event to the recruiter who created it.
     * This keeps multiple recruiter tabs synchronized.
     */
    io.to(`user:${announcement.recruiter_id}`).emit("announcement:new", announcement);
    /*
     * PUBLIC announcements can be handled differently later using job rooms.
     * For now, send them to candidates who applied as well.
     */
    let query = supabase
        .from("applications")
        .select("candidate_id, status")
        .eq("job_id", announcement.job_id);
    const { data: applications, error } = await query;
    if (error) {
        console.error("Failed to fetch announcement recipients:", error);
        return;
    }
    if (!applications?.length) {
        return;
    }
    const eligibleApplications = applications.filter((application) => {
        const status = application.status?.toUpperCase();
        switch (announcement.audience) {
            case "PUBLIC":
                return true;
            case "APPLICANTS":
                return true;
            case "SHORTLISTED":
                return (status === "SHORTLISTED" ||
                    status === "INTERVIEW" ||
                    status === "HIRED");
            case "INTERVIEW":
                return (status === "INTERVIEW" ||
                    status === "HIRED");
            default:
                return false;
        }
    });
    const uniqueCandidateIds = [
        ...new Set(eligibleApplications
            .map((application) => application.candidate_id)
            .filter(Boolean)),
    ];
    if (!uniqueCandidateIds.length) {
        return;
    }
    /*
     * Persist an unread notification for every eligible candidate so the
     * search-bar notification remains available after a refresh or reconnect.
     */
    const notificationRows = uniqueCandidateIds.map((candidateId) => ({
        user_id: candidateId,
        application_id: null,
        type: "GENERAL",
        title: announcement.title,
        message: announcement.content,
        data: {
            kind: "JOB_ANNOUNCEMENT",
            announcementId: announcement.id,
            jobId: announcement.job_id,
            audience: announcement.audience,
        },
        is_read: false,
    }));
    const { data: notifications, error: notificationError } = await supabase
        .from("notifications")
        .insert(notificationRows)
        .select("*");
    if (notificationError) {
        console.error("Failed to create announcement notifications:", notificationError);
        return;
    }
    const notificationByUserId = new Map((notifications ?? []).map((notification) => [
        notification.user_id,
        notification,
    ]));
    for (const candidateId of uniqueCandidateIds) {
        io.to(`user:${candidateId}`).emit("announcement:new", announcement);
        const notification = notificationByUserId.get(candidateId);
        if (notification) {
            io.to(`user:${candidateId}`).emit("notification:new", notification);
        }
    }
};
//# sourceMappingURL=announcement.socket.js.map