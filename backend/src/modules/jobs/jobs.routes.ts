import express from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import { allowRoles } from "../../middlewares/rbac.middleware.js";
import {
  postJob,
  getAllMyJob,
  updateJobById,
  deleteJobById,
  closeJobController,
  fetchAllPostedJobs,
  getJobDetails
} from "./jobs.controller.js";

const router = express.Router();

/* ===============================
   RECRUITER ROUTES
================================ */

// Create job
router.post(
  "/",
  protect,
  allowRoles("ADMIN", "RECRUITER"),
  postJob
);

// Get recruiter’s jobs
router.get(
  "/my",
  protect,
  allowRoles("ADMIN", "RECRUITER"),
  getAllMyJob
);

// Update job
router.put(
  "/:id",
  protect,
  allowRoles("ADMIN", "RECRUITER"),
  updateJobById
);

// Delete job
router.delete(
  "/:id",
  protect,
  allowRoles("ADMIN", "RECRUITER"),
  deleteJobById
);

// Close job
router.patch(
  "/:id/close",
  protect,
  allowRoles("ADMIN", "RECRUITER"),
  closeJobController
);


/* ===============================
   PUBLIC / CANDIDATE ROUTES
================================ */

// Get all open jobs
router.get(
  "/",
  protect,
  allowRoles("ADMIN", "CANDIDATE"),
  fetchAllPostedJobs
);

// Get single job details
router.get(
  "/:jobId",
  protect,
  allowRoles("ADMIN", "CANDIDATE"),
  getJobDetails
);

export default router;