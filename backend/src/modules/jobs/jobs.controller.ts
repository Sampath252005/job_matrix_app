import { Request, Response } from "express";
import * as JobsServices from "./jobs.services.js";
//-------------------------------------------------recruiter jobs controllers-------------------------------------
interface CreateJobBody {
  title: string;
  description: string;
  location: string;
  type: string;
  salary: number;
  experience: string;
}

//post a job
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

    const { data, error: dbError } = await JobsServices.createJob(
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

//get all my job
export const getAllMyJob = async (req: Request<{}, {}, {}>, res: Response) => {
  try {
    const token = req.accessToken;
    const user = req.user;
    if (!user || !token) {
      console.warn("Unauthorized request");
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { data, error } = await JobsServices.getMyJobs(user.id, token);
    if (error) {
      return res.status(400).json({ error: "while getJobd" + error.message });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Fetch jobs error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//update a job details

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

    const { data, error } = await JobsServices.updateJob(
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

//delete a job
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
    const { data, error } = await JobsServices.deleteJob(
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

//close a job

export const closeJobController = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
) => {
  try {
    const jobId = req.params.id;
    const recruiter_id = req.user!.id;
    const token = req.headers.authorization!.split(" ")[1];

    const { data, error } = await JobsServices.closeJob(
      jobId,
      recruiter_id,
      token,
    );
    if (error) {
      return res
        .status(400)
        .json({ message: "Error in close controller:", error });
    }
    return res.json({
      message: "Job closed successfully",
      data,
    });
  } catch (error: any) {
    return res.status(400).json({
      error: error.message,
    });
  }
};

//-----------------------------------------------------------Candiate side jobs api----------------------------
export const fetchAllPostedJobs = async (
  req: Request<{}, {}, {}>,
  res: Response,
) => {
  try {
    const token = req.accessToken;
    if (!req.user || !token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { data, error } = await JobsServices.getAlljobs(token);
    if (error) {
      return res
        .status(401)
        .json({ error: "error from getJobs" + error.message });
    }
    return res.status(200).json({
      message: "All jobs fetched successfully",
      data,
    });
  } catch (error) {
    console.error("Fetch profile error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getJobDetails = async (
  req: Request<{ jobId: string }, {}, {}>,
  res: Response,
) => {
  try {
    const token = req.accessToken;
    if (!token) {
      return res.status(401).json({ message: "unauthorized" });
    }
    const jobId = req.params.jobId;
    const { data, error } = await JobsServices.GetJobDetailsFromDb(
      jobId,
      token,
    );
    if (error) {
      console.error(error);
      return res.status(404).json({ message: "Job not found or closed" });
    }

    return res.status(200).json({
      message: "Job details fetched successfully",
      data,
    });
  } catch (error) {
    console.error("error from get job detilas:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const searchJobsController = async (req: Request, res: Response) => {
  try {
    const { location, type, skill } = req.query;
    const token = req.accessToken;
    if (!token) {
      return res.status(401).json({ message: "unauthorized" });
    }
    const jobs = await JobsServices.searchJobsService(
      {
        location: location as string,
        type: type as string,
        skill: skill as string,
      },
      token,
    );

    res.json(jobs);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
