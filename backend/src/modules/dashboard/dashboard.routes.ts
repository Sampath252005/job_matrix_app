import express from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import { allowRoles } from "../../middlewares/rbac.middleware.js";
import {
  getCandidateDashboardAnalyticsController,
  getCandidateDashboardController,
  getRecruiterDashboardAnalyticsController,
  getRecruiterDashboardController,
} from "./dashboard.controller.js";

const router = express.Router();

router.get(
  "/recruiter/analytics",
  protect,
  allowRoles("ADMIN", "RECRUITER"),
  getRecruiterDashboardAnalyticsController,
);

router.get(
  "/recruiter",
  protect,
  allowRoles("ADMIN", "RECRUITER"),
  getRecruiterDashboardController,
);

router.get(
  "/candidate/analytics",
  protect,
  allowRoles("ADMIN", "CANDIDATE"),
  getCandidateDashboardAnalyticsController,
);

router.get(
  "/candidate",
  protect,
  allowRoles("ADMIN", "CANDIDATE"),
  getCandidateDashboardController
);


export default router;
