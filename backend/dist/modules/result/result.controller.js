import * as resultSerivces from "./result.services.js";
export const getAssessmentResultsController = async (req, res) => {
    try {
        const token = req.accessToken;
        const user = req.user;
        if (!token || !user) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }
        const { assessmentId } = req.params;
        const results = await resultSerivces.getAssessmentResults(assessmentId, token);
        return res.status(200).json({
            data: results,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};
export const getJobAssessmentResultsController = async (req, res) => {
    try {
        const token = req.accessToken;
        const user = req.user;
        if (!token || !user) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }
        const { jobId } = req.params;
        console.log("job id", jobId);
        const results = await resultSerivces.getJobAssessmentResults(jobId, token);
        return res.status(200).json({
            data: results,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};
export const getAttemptDetailsController = async (req, res) => {
    try {
        const { attemptId } = req.params;
        const token = req.accessToken;
        if (!token) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }
        const data = await resultSerivces.getAttemptDetails(attemptId, token);
        return res.status(200).json({
            data,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};
//# sourceMappingURL=result.controller.js.map