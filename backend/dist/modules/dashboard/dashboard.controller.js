import * as DashBoardServices from "./dashboard.services.js";
export const getRecruiterDashboardController = async (req, res) => {
    try {
        const recruiter_id = req.user.id;
        const token = req.accessToken;
        if (!token || !recruiter_id) {
            return res.status(400).json({ message: "Unauthorzed:" });
        }
        const stats = await DashBoardServices.getRecruiterDashboardStats(recruiter_id, token);
        return res.json(stats);
    }
    catch (error) {
        return res.status(400).json({
            error: error.message,
        });
    }
};
export const getCandidateDashboardController = async (req, res) => {
    try {
        const candidate_id = req.user.id;
        const token = req.accessToken;
        if (!token || !candidate_id) {
            return res.status(400).json({ message: "Unauthorzed:" });
        }
        const stats = await DashBoardServices.getCandidateDashboardStats(candidate_id, token);
        return res.json(stats);
    }
    catch (error) {
        return res.status(400).json({
            error: error.message,
        });
    }
};
//# sourceMappingURL=dashboard.controller.js.map