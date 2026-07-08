import express from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import { allowRoles } from "../../middlewares/rbac.middleware.js";
import { postJob, getAllMyJob, updateJobById, deleteJobById, closeJobController, fetchAllPostedJobs, getJobDetails, searchJobsController, getJobId, getAllOpenjobs } from "./jobs.controller.js";
const router = express.Router();
router.get("/search", protect, allowRoles("ADMIN", "CANDIDATE"), searchJobsController);
/* ===============================
   RECRUITER ROUTES
================================ */
// Create job
router.post("/", protect, allowRoles("ADMIN", "RECRUITER"), postJob);
// Get recruiter’s jobs
router.get("/my", protect, allowRoles("ADMIN", "RECRUITER"), getAllMyJob);
router.get("/my/open", protect, allowRoles("ADMIN", "RECRUITER"), getAllOpenjobs);
router.get("/:id", protect, allowRoles("ADMIN", "RECRUITER"), getJobId);
// Update job
router.put("/:id", protect, allowRoles("ADMIN", "RECRUITER"), updateJobById);
// Delete job
router.delete("/:id", protect, allowRoles("ADMIN", "RECRUITER"), deleteJobById);
// Close job
router.patch("/:id/close", protect, allowRoles("ADMIN", "RECRUITER"), closeJobController);
/* ===============================
   PUBLIC / CANDIDATE ROUTES
================================ */
// Get all open jobs
router.get("/", protect, allowRoles("ADMIN", "CANDIDATE"), fetchAllPostedJobs);
// Get single job details
router.get("/details/:jobId", protect, allowRoles("ADMIN", "CANDIDATE"), getJobDetails);
export default router;
//# sourceMappingURL=jobs.routes.js.map