import { protect } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/rbac.middleware.js";
import express from "express";
import {
  updateCandidateProfile,
  getCandidateProfile,
  fetchAllPostedJobs
} from "../controller/candiate.controller.js";

const candidateRoutes = express.Router();

candidateRoutes.post(
  "/profile",
  protect,
  allowRoles("ADMIN", "CANDIDATE"),
  updateCandidateProfile,
);

candidateRoutes.get(
  "/profile",
  protect,
  allowRoles("ADMIN", "CANDIDATE"),
  getCandidateProfile,
);


candidateRoutes.get(
  "/jobs",
  protect,
  allowRoles("ADMIN", "CANDIDATE"),
  fetchAllPostedJobs,
);

export default candidateRoutes;
