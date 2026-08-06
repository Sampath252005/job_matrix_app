import { Router } from "express";
import { allowRoles } from "../../middlewares/rbac.middleware.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { createAnnouncement, deleteAnnouncement, getJobAnnouncements, updateAnnouncement, } from "./announcement.controller.js";
const router = Router();
/*
 * GET /api/announcements/jobs/:jobId
 * Candidate and recruiter can fetch permitted announcements.
 */
router.get("/jobs/:jobId", protect, allowRoles("ADMIN", "CANDIDATE", "RECRUITER"), getJobAnnouncements);
/*
 * POST /api/announcements/jobs/:jobId
 * Only the recruiter who owns the job can create.
 */
router.post("/jobs/:jobId", protect, allowRoles("ADMIN", "RECRUITER"), createAnnouncement);
/*
 * PATCH /api/announcements/:announcementId
 * Only the recruiter who owns the announcement can update.
 */
router.patch("/:announcementId", protect, allowRoles("ADMIN", "RECRUITER"), updateAnnouncement);
/*
 * DELETE /api/announcements/:announcementId
 * Only the recruiter who owns the announcement can delete.
 */
router.delete("/:announcementId", protect, allowRoles("ADMIN", "RECRUITER"), deleteAnnouncement);
export default router;
//# sourceMappingURL=%20announcement.routes.js.map