import express from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import { allowRoles } from "../../middlewares/rbac.middleware.js";
import { updateRecruiterProfile, getRecruiterProfile } from "./recruiterProfile.controller.js";
import { updateCandidateProfile, getCandidateProfile } from "./candidateProfile.controller.js";
const router = express.Router();
console.log("Recruiter routes loaded");
router.post("/recruiter", protect, allowRoles("ADMIN", "RECRUITER"), updateRecruiterProfile); // ✅ safe
router.get("/recruiter", protect, allowRoles("ADMIN", "RECRUITER"), getRecruiterProfile);
router.post("/candidate", protect, allowRoles("ADMIN", "CANDIDATE"), updateCandidateProfile); // ✅ safe
router.get("/candidate", protect, allowRoles("ADMIN", "CANDIDATE"), getCandidateProfile);
export default router;
//# sourceMappingURL=profile.routes.js.map