import express from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import { allowRoles } from "../../middlewares/rbac.middleware.js";
import {
  getApplicationsByJob,
  updateApplicationStatus,
  applyToJob,
  getMyApplications,
  getApplicationById,
  deleteApplication
} from "./applications.controller.js";

const router = express.Router();
//------------------------------------------recruiter side routes--------------------------------------
// Get all applications for a job
router.get(
  "/job/:jobId",
  protect,
  allowRoles("ADMIN", "RECRUITER"),
  getApplicationsByJob,
);

// Update application status
router.patch(
  "/:applicationId/status",
  protect,
  allowRoles("ADMIN", "RECRUITER"),
  updateApplicationStatus,
);

//-----------------------------------------candidate side routes-------------------------------
router.post(
  "/:jobId/apply",
  protect,
  allowRoles("ADMIN", "CANDIDATE"),
  applyToJob,
);
router.get("/my", protect, allowRoles("ADMIN", "CANDIDATE"), getMyApplications);
router.get(
  "/:applicationId",
  protect,
  allowRoles("ADMIN", "CANDIDATE"),
  getApplicationById,
);
router.delete(
  "/:applicationId",
  protect,
  allowRoles("ADMIN", "CANDIDATE"),
  deleteApplication
);

export default router;
