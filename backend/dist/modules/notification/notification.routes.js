import express from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import { allowRoles } from "../../middlewares/rbac.middleware.js";
import { getNotifications, markNotificationAsRead, } from "./notification.controller.js";
const router = express.Router();
router.get("/", protect, allowRoles("ADMIN", "CANDIDATE"), getNotifications);
router.patch("/:notificationId/read", protect, allowRoles("ADMIN", "CANDIDATE"), markNotificationAsRead);
export default router;
//# sourceMappingURL=notification.routes.js.map