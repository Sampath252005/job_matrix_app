import { Router } from "express";

import { protect } from "../../middlewares/auth.middleware.js";

import {
  closeQuestion,
  createQuestion,
  createQuestionReply,
  getJobQuestions,
  getQuestionReplies,
} from "./question.controller.js";

const router = Router();

/*
 * Candidate posts a question for a job.
 */
router.post(
  "/jobs/:jobId",
  protect,
  createQuestion,
);

/*
 * Fetch visible questions for a job.
 */
router.get(
  "/jobs/:jobId",
  protect,
  getJobQuestions,
);

/*
 * Candidate or recruiter posts a reply.
 */
router.post(
  "/:questionId/replies",
  protect,
  createQuestionReply,
);

/*
 * Fetch replies for one question.
 */
router.get(
  "/:questionId/replies",
  protect,
  getQuestionReplies,
);

/*
 * Recruiter closes a question.
 */
router.patch(
  "/:questionId/close",
  protect,
  closeQuestion,
);

export default router;