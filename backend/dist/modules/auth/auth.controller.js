import * as authServices from "./auth.services.js";
// for register------------------------------------------------------------
export const register = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        // Runtime validation (still required even if TS types say "required")
        if (!email || !password || !role) {
            return res
                .status(400)
                .json({ message: "Email, password and role are required" });
        }
        const normalizedEmail = email.trim().toLowerCase();
        const { data, error } = await authServices.signupUser(normalizedEmail, password);
        if (error) {
            return res.status(400).json({ error: error.message });
        }
        if (!data.user) {
            return res
                .status(400)
                .json({ error: "User not created. Please verify your email." });
        }
        const userId = data.user.id;
        const { error: dbError } = await authServices.insertUserRole(userId, normalizedEmail, role);
        if (dbError) {
            return res.status(400).json({ message: dbError.message });
        }
        return res.status(201).json({
            message: "User registered successfully",
            user: {
                id: userId,
                email: normalizedEmail,
                role,
            },
        });
    }
    catch (err) {
        console.error("Register error:", err);
        return res.status(500).json({ error: err.message });
    }
};
//login user--------------------------------------------------------------------
export const login = async (req, res) => {
    try {
        const email = req.body?.email?.trim().toLowerCase();
        const password = req.body?.password;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password required" });
        }
        const { data, error } = await authServices.loginUser(email, password);
        if (error)
            return res.status(401).json({ error: error.message });
        const userId = data.user.id;
        const { data: userData, error: userError } = await authServices.getUserById(userId);
        if (userError)
            return res.status(400).json({ error: userError.message });
        console.log("Logged User", userData);
        return res
            .cookie("access_token", data.session.access_token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
        })
            .cookie("refresh_token", data.session.refresh_token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
        })
            .status(200)
            .json({
            message: "Login successful",
            token: data.session.access_token,
            user: userData,
        });
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
};
//# sourceMappingURL=auth.controller.js.map