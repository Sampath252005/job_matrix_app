import express from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import { allowRoles } from "../../middlewares/rbac.middleware.js";
import { getRecruiterDashboardController, getCandidateDashboardController } from "./dashboard.controller.js";
const router = express.Router();
router.get("/recruiter", protect, allowRoles("ADMIN", "RECRUITER"), getRecruiterDashboardController);
router.get("/candidate", protect, allowRoles("ADMIN", "CANDIDATE"), getCandidateDashboardController);
export default router;
//# sourceMappingURL=dashboard.routes.js.map