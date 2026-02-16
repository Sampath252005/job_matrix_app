import { protect } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/rbac.middleware.js";
import express from "express";
import {updateCandidateProfile} from "../controller/candiate.controller.js";

const candidateRoutes = express.Router();

candidateRoutes.post(
  "/profile",
  protect,
  allowRoles("ADMIN", "CANDIDATE"),
  updateCandidateProfile,
); 

export default candidateRoutes;


