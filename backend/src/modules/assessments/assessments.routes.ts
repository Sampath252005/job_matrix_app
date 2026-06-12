import express from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import { allowRoles } from "../../middlewares/rbac.middleware.js";

import {
  createAssessment,
  getAssessmentByJobController,
  getAssessmentByIdController,
  updateAssessmentController,
  deleteAssessmentController,
 startAssessmentController,
 saveAnswerController,
 submitAssessmentController,
 getAssessmentResultController
} from "./assessments.controller.js";

const router = express.Router();

router.post(
  "/",
  protect,
  allowRoles("ADMIN", "RECRUITER"),
  createAssessment,
);

router.get(
  "/job/:jobId",
  protect,
  allowRoles("ADMIN", "RECRUITER"),
  getAssessmentByJobController,
);

router.get(
  "/:assessmentId",
  protect,
  allowRoles("ADMIN", "RECRUITER"),
  getAssessmentByIdController,
);

router.put(
  "/:assessmentId",
  protect,
  allowRoles("ADMIN", "RECRUITER"),
  updateAssessmentController,
);

router.delete(
  "/:assessmentId",
  protect,
  allowRoles("ADMIN", "RECRUITER"),
  deleteAssessmentController,
);

router.post(
  "/:assessmentId/start",
  protect,
  allowRoles("ADMIN", "CANDIDATE"),
  startAssessmentController,
);

router.post(
  "/attempts/:attemptId/answer",
  protect,
  allowRoles("ADMIN", "CANDIDATE"),
  saveAnswerController,
);


router.post(
  "/attempts/:attemptId/submit",
  protect,
  allowRoles("ADMIN", "CANDIDATE"),
  submitAssessmentController,
);

router.get(
  "/attempts/:attemptId/result",
  protect,
  allowRoles("ADMIN", "CANDIDATE"),
  getAssessmentResultController,
);
export default router;