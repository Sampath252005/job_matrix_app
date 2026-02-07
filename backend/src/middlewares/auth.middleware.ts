import { supabase } from "../services/supabase.service.js";
import { Request,Response,NextFunction } from "express";
export const protect = async (req:Request, res:Response, next:NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "No token" });

    const token = authHeader.split(" ")[1];

    const { data, error } = await supabase.auth.getUser(token);
    if (error) return res.status(401).json({ message: "Invalid token" });

    req.user = data.user; // attach user
    next();
  } catch (err) {
    res.status(401).json({ message: "Unauthorized" });
  }
};
