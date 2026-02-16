import { Request, Response } from "express";
import * as candiaterServices from "../services/candidate.services.js";

interface RegisterBody {
  education?: string;
  college?: string;
  degree?: string;
  branch?: string;
  graduation_year?: string;
  experience_level?: string;
  skills?: string[];
  resume_url?: string;
  portfolio_url?: string;
  location?: string;
  job_type_preference?: string;
}

export const updateCandidateProfile = async (
  req: Request<{}, {}, RegisterBody>,
  res: Response,
) => {
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

    const {
      education,
      college,
      degree,
      branch,
      graduation_year,
      experience_level,
      skills,
      resume_url,
      portfolio_url,
      location,
      job_type_preference,
    } = req.body;

    // Validate required fields
    // if (!company_name || !website) {
    //   return res.status(400).json({
    //     message: "Company name and website are required",
    //   });
    // }

    // Call service with token (VERY IMPORTANT)
    const {data,error} = await candiaterServices.upsertProfileDetails(
      {
        user_id: userId,
        education: education ?? null,
        college: college ?? null,
        degree: degree ?? null,
        branch: branch ?? null,
        graduation_year: graduation_year ?? null,
        experience_level: experience_level ?? null,
        skills: skills ?? null,
        resume_url: resume_url ?? null,
        portfolio_url: portfolio_url ?? null,
        location: location ?? null,
        job_type_preference: job_type_preference ?? null,
      },
      token,
    );
    if (error) {
      console.warn("Insert error:", error.message);
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({
      message: "Profile saved successfully",
      data,
    });
  } catch (err) {
    console.error("Unexpected controller error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
