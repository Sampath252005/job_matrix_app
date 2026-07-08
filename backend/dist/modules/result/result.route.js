import express from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import { allowRoles } from "../../middlewares/rbac.middleware.js";
import { getAssessmentResultsController, getJobAssessmentResultsController, getAttemptDetailsController } from "./result.controller.js";
const router = express.Router();
router.get("/recruiter/assessments/:assessmentId/results", protect, allowRoles("ADMIN", "RECRUITER"), getAssessmentResultsController);
router.get("/recruiter/jobs/:jobId/results", protect, allowRoles("ADMIN", "RECRUITER"), getJobAssessmentResultsController);
router.get("/recruiter/attempts/:attemptId", protect, allowRoles("ADMIN", "RECRUITER"), getAttemptDetailsController);
export default router;
//# sourceMappingURL=result.route.js.map