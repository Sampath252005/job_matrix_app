import { getSupabase } from "../services/supabase.service.js";
export const protect = async (req, res, next) => {
    try {
        const supabase = getSupabase();
        const token = req.cookies.access_token;
        if (!token) {
            return res.status(401).json({ message: "No token in cookie" });
        }
        const { data: authData, error: authError } = await supabase.auth.getUser(token);
        if (authError || !authData.user)
            return res.status(401).json({ message: "Invalid token" });
        const userId = authData.user.id;
        // Fetch the actual role from your users table
        const { data: userData, error: userError } = await supabase
            .from("users")
            .select("id, role,email")
            .eq("id", userId)
            .single();
        if (userError || !userData)
            return res.status(401).json({ message: "User not found" });
        // Attach to request
        // console.log("user data",userData);
        req.user = userData;
        req.accessToken = token;
        // console.log("User attached to req:", req);
        // console.log(req.cookies);
        next();
    }
    catch (err) {
        console.error("Auth middleware error:", err);
        res.status(401).json({ message: "Unauthorized" });
    }
};
//# sourceMappingURL=auth.middleware.js.map