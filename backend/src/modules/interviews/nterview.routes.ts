import express from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import { allowRoles } from "../../middlewares/rbac.middleware.js";
import {
   createInterview,
  getInterviewById,
  getInterviewToken,
  getMyInterviews,
  getRecruiterInterviews,
  updateInterview,
  updateInterviewStatus,
} from "./interview.controller.js";

const router = express.Router();

router.post(
  "/",
  protect,
  allowRoles("ADMIN", "RECRUITER"),
  createInterview,
);

/*
 * Candidate's interviews.
 *
 * Keep this before /:interviewId.
 */
router.get(
  "/me",
  protect,
  allowRoles("CANDIDATE"),
  getMyInterviews,
);

/*
 * Recruiter's interviews.
 *
 * Keep this before /:interviewId.
 */
router.get(
  "/recruiter",
  protect,
  allowRoles("ADMIN", "RECRUITER"),
  getRecruiterInterviews,
);

/*
 * Generate LiveKit token.
 */
router.get(
  "/:interviewId/token",
  protect,
  allowRoles(
    "ADMIN",
    "RECRUITER",
    "CANDIDATE",
  ),
  getInterviewToken,
);

/*
 * Get one interview.
 */
router.get(
  "/:interviewId",
  protect,
  allowRoles(
    "ADMIN",
    "RECRUITER",
    "CANDIDATE",
  ),
  getInterviewById,
);

/*
 * Reschedule or edit an interview.
 */
router.patch(
  "/:interviewId",
  protect,
  allowRoles("ADMIN", "RECRUITER"),
  updateInterview,
);

/*
 * Change interview status.
 */
router.patch(
  "/:interviewId/status",
  protect,
  allowRoles("ADMIN", "RECRUITER"),
  updateInterviewStatus,
);

export default router;  