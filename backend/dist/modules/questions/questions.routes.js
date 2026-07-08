import express from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import { allowRoles } from "../../middlewares/rbac.middleware.js";
import { createQuestionController, getQuestionsByAssessmentController, updateQuestionController, deleteQuestionController } from "./questions.controller.js";
const router = express.Router();
router.post("/assessments/:assessmentId/questions", protect, allowRoles("ADMIN", "RECRUITER"), createQuestionController);
router.get("/assessments/:assessmentId/questions", protect, allowRoles("ADMIN", "RECRUITER"), getQuestionsByAssessmentController);
router.put("/questions/:questionId", protect, allowRoles("ADMIN", "RECRUITER"), updateQuestionController);
router.delete("/questions/:questionId", protect, allowRoles("ADMIN", "RECRUITER"), deleteQuestionController);
export default router;
//# sourceMappingURL=questions.routes.js.map