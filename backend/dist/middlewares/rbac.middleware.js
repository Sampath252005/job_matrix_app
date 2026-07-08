export const allowRoles = (...roles) => {
    console.log("RBAC middleware configured for roles:", roles);
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        console.log("user role:", req.user.role);
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Forbidden from allowRoles" });
        }
        next();
    };
};
//# sourceMappingURL=rbac.middleware.js.map