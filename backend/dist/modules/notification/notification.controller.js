import * as NotificationServices from "./notification.service.js";
export const getNotifications = async (req, res) => {
    const userId = req.user?.id;
    const token = req.accessToken;
    if (!userId || !token) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
    }
    try {
        const notifications = await NotificationServices.getNotificationsService(userId, token);
        return res.status(200).json({
            success: true,
            message: "Notifications fetched successfully",
            data: notifications,
        });
    }
    catch (error) {
        const message = error instanceof Error
            ? error.message
            : "Failed to fetch notifications";
        return res.status(500).json({
            success: false,
            message,
        });
    }
};
export const markNotificationAsRead = async (req, res) => {
    const { notificationId } = req.params;
    const userId = req.user?.id;
    const token = req.accessToken;
    if (!userId || !token) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
    }
    if (!notificationId) {
        return res.status(400).json({
            success: false,
            message: "Notification ID is required",
        });
    }
    try {
        const notification = await NotificationServices.markNotificationAsReadService(notificationId, userId, token);
        return res.status(200).json({
            success: true,
            message: "Notification marked as read",
            data: notification,
        });
    }
    catch (error) {
        const message = error instanceof Error
            ? error.message
            : "Failed to update notification";
        const statusCode = message === "Notification not found"
            ? 404
            : 500;
        return res.status(statusCode).json({
            success: false,
            message,
        });
    }
};
//# sourceMappingURL=notification.controller.js.map