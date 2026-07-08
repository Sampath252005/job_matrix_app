import * as profileServices from "./profile.service.js";
export const updateRecruiterProfile = async (req, res) => {
    try {
        console.log("Recruiter controller loaded");
        const token = req.accessToken;
        const user = req.user;
        if (!user || !token) {
            console.warn("Unauthorized request");
            return res.status(401).json({ message: "Unauthorized" });
        }
        const userId = user.id;
        console.log("User ID from token:", userId);
        const { company_name, website, company_size, description, logo_url, industry, } = req.body;
        // Validate required fields
        if (!company_name || !website) {
            return res.status(400).json({
                message: "Company name and website are required",
            });
        }
        // Call service with token (VERY IMPORTANT)
        const { data, error } = await profileServices.upsertRecruiterProfileDetails({
            user_id: userId,
            company_name,
            website,
            company_size: company_size ?? null,
            description: description ?? "not mentioned",
            logo_url: logo_url ?? null,
            industry: industry ?? "not mentioned",
        }, token);
        if (error) {
            console.warn("Insert error:", error.message);
            return res.status(400).json({ error: error.message });
        }
        return res.status(200).json({
            message: "Profile saved successfully",
            data,
        });
    }
    catch (err) {
        console.error("Unexpected controller error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};
export const getRecruiterProfile = async (req, res) => {
    try {
        const token = req.accessToken;
        if (!req.user || !token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const { data, error } = await profileServices.getRecruiterProfile(token);
        if (error) {
            return res
                .status(401)
                .json({ error: "error from getProfile" + error.message });
        }
        return res.status(200).json({
            message: "Profile fetched successfully",
            data,
        });
    }
    catch (error) {
        console.error("Fetch profile error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
//# sourceMappingURL=recruiterProfile.controller.js.map