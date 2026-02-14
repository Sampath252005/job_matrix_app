import { protect } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/rbac.middleware.js";
// import { register, login } from "../controller/auth.controller.js";

import express from "express";
import {
  updateRecruiterProfile,
  getRecruiterProfile,
  postJob,
  getAllMyJob,
  updateJobById,
  deleteJobById
} from "../controller/recruiter.controller.js";
// import { protect } from "../middlewares/auth.middleware.js"; // uncomment when ready

const recruiterRoutes = express.Router();

console.log("Recruiter routes loaded");

recruiterRoutes.post(
  "/profile",
  protect,
  allowRoles("ADMIN", "RECRUITER"),
  updateRecruiterProfile,
); // ✅ safe
recruiterRoutes.get(
  "/profile",
  protect,
  allowRoles("ADMIN", "RECRUITER"),
  getRecruiterProfile,
);
recruiterRoutes.post(
  "/postJob",
  protect,
  allowRoles("ADMIN", "RECRUITER"),
  postJob,
);
recruiterRoutes.get(
  "/allPostedJobs",
  protect,
  allowRoles("ADMIN", "RECRUITER"),
  getAllMyJob,
);
recruiterRoutes.put(
  "/job/:id",
  protect,
  allowRoles("ADMIN", "RECRUITER"),
  updateJobById,
);
recruiterRoutes.delete(
  "/job/:id",
  protect,
  allowRoles("ADMIN", "RECRUITER"),
  deleteJobById,
);
export default recruiterRoutes;
