import { Request, Response } from "express";
import * as recruiterServices from "../services/recruiter.services.js";
interface RegisterBody {
  company_name?: string;
  website?: string;
  description?: string;
  company_size?: number;
  logo_url?: string;
  industry?: string;
}

interface CreateJobBody {
  title: string;
  description: string;
  location: string;
  type: string;
  salary: number;
  experience: string;
}
//for update and inserting recruiter profile

export const updateRecruiterProfile = async (
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
      company_name,
      website,
      company_size,
      description,
      logo_url,
      industry,
    } = req.body;

    // Validate required fields
    if (!company_name || !website) {
      return res.status(400).json({
        message: "Company name and website are required",
      });
    }

    // Call service with token (VERY IMPORTANT)
    const { data, error } = await recruiterServices.upsertProfileDetails(
      {
        user_id: userId,
        company_name,
        website,
        company_size: company_size ?? null,
        description: description ?? "not mentioned",
        logo_url: logo_url ?? null,
        industry: industry ?? "not mentioned",
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

//for fetch recruiter profile from the recruiter profile table

export const getRecruiterProfile = async (
  req: Request<{}, {}, {}>,
  res: Response,
) => {
  try {
    console.log("get REcruiter prmfsmfls");
    const token = req.accessToken;
    if (!req.user || !token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { data, error } = await recruiterServices.getRecruiterProfile(token);
    if (error) {
      return res
        .status(401)
        .json({ error: "error from getProfile" + error.message });
    }
    return res.status(200).json({
      message: "Profile fetched successfully",
      data,
    });
  } catch (error) {
    console.error("Fetch profile error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//job related api

export const postJob = async (
  req: Request<{}, {}, CreateJobBody>,
  res: Response,
) => {
  try {
    const token = req.accessToken;
    const user = req.user;
    if (!user || !token) {
      console.warn("Unauthorized request");
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { title, description, location, type, salary, experience } = req.body;
    if (!title || !description || !location || !type) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const { data, error: dbError } = await recruiterServices.createJob(
      {
        recruiter_id: user.id,
        title,
        description,
        location,
        type,
        salary,
        experience,
      },
      token,
    );
    if (dbError) {
      return res
        .status(400)
        .json({ error: "error while post a job:" + dbError.message });
    }

    return res.status(201).json({
      message: "Job created successfully",
      data,
    });
  } catch (error) {
    console.error("Create job error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//Get all jobs
export const getAllMyJob = async (req: Request<{}, {}, {}>, res: Response) => {
  try {
    const token = req.accessToken;
    const user = req.user;
    if (!user || !token) {
      console.warn("Unauthorized request");
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { data, error } = await recruiterServices.getMyJobs(user.id, token);
    if (error) {
      return res.status(400).json({ error: "while getJobd" + error.message });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Fetch jobs error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateJobById = async (
  req: Request<{ id: string }, {}, CreateJobBody>,
  res: Response,
) => {
  try {
    const jobId = req.params.id;
    const recruiter_id = req.user!.id;
    const token = req.accessToken;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { title, description, location, type, salary, experience } = req.body;

    const { data, error } = await recruiterServices.updateJob(
      jobId,
      recruiter_id,
      {
        title,
        description,
        location,
        type,
        salary,
        experience,
      },
      token,
    );

    if (error) {
      return res
        .status(400)
        .json({ error: "error while job updation:" + error.message });
    }

    return res.status(200).json({
      message: "Job updated",
      data,
    });
  } catch (error) {
    console.error("Update job error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteJobById = async (
  req: Request<{ id: string }, {}, CreateJobBody>,
  res: Response,
) => {
  try {
    const jobId = req.params.id;
    const recruiter_id = req.user!.id;
    const token = req.accessToken;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { data, error } = await recruiterServices.deleteJob(
      jobId,
      recruiter_id,
      token,
    );
    if (error) {
      return res
        .status(400)
        .json({ error: "error while job delecting:" + error.message });
    }

    return res.status(200).json({
      message: "Job Deleted succesfully",
    });
  } catch (error) {
    console.error("deleting a job error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
