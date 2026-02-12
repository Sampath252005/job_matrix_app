import { Request, Response, NextFunction } from "express";

export const allowRoles = (...roles: string[]) => {
  console.log("RBAC middleware configured for roles:", roles);
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: "Unauthorized" });
    }
console.log("user role:",req.user.role);
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden from allowROles" });
    }

    next();
  };
};
