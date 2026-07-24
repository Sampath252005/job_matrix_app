import { Request, Response } from "express";
import * as ApplicationServices from "./applications.services.js";
export const getApplicationsByJob = async (
  req: Request<{ jobId: string }>,
  res: Response,
) => {
  try {
    const { jobId } = req.params;
    const recruiter_id = req.user?.id;
    const token = req.accessToken;

    if (!recruiter_id || !token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { data: job, error: jobError } =
      await ApplicationServices.checkJobOwnership(jobId, recruiter_id, token);

    if (jobError || !job) {
      return res.status(403).json({ message: "Not authorized for this job" });
    }

    const { data, error } = await ApplicationServices.getApplicationsByJob(
      jobId,
      token,
    );

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Fetch applications error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const getAllShortlistedApplication = async (
  req: Request<{ jobId: string }>,
  res: Response,
) => {
  try {
    const { jobId } = req.params;
    const recruiter_id = req.user?.id;
    const token = req.accessToken;

    if (!recruiter_id || !token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { data: job, error: jobError } =
      await ApplicationServices.checkJobOwnership(jobId, recruiter_id, token);

    if (jobError || !job) {
      return res.status(403).json({ message: "Not authorized for this job" });
    }

    const { data, error } = await ApplicationServices.getShortListedApplication(
      jobId,
      token,
    );

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Fetch applications error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateApplicationStatus = async (
  req: Request<{ applicationId: string }, {}, { status: string }>,
  res: Response,
) => {
  const { applicationId } = req.params;
  const recruiter_id = req.user!.id;
  const { status } = req.body;
  const token = req.accessToken;

  if (!recruiter_id || !token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const result = await ApplicationServices.updateStatusService(
      applicationId,
      recruiter_id,
      status,
      token,
    );

    return res.json({
      message: "Application status updated",
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
};

//---------------------------------candidate side application controller----------------------------------------------------
export const applyToJob = async (
  req: Request<{ jobId: string }, {}, {}>,
  res: Response,
) => {
  try {
    const { jobId } = req.params;
    const candidateId = req.user!.id;
    const token = req.accessToken;

    if (!candidateId || !token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { data: application, error } =
      await ApplicationServices.applyToJobServices(jobId, candidateId, token);

    if (error) {
      res
        .status(400)
        .json({ error: error.message + "from applyToJob in candidate api " });
    }
    res
      .status(201)
      .json({ message: "application appled succefully", data: application });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getMyApplications = async (req: Request, res: Response) => {
  try {
    const candidateId = req.user!.id;
    const token = req.accessToken;
    if (!candidateId || !token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { data: applications, error } =
      await ApplicationServices.getMyApplicationsService(candidateId, token);
    if (error) {
      res.status(400).json({
        error: error.message + "from getMyApplications in candidate api ",
      });
    }
    res
      .status(201)
      .json({ message: "applied applications", data: applications });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getApplicationById = async (
  req: Request<{ applicationId: string }, {}, {}>,
  res: Response,
) => {
  try {
    const { applicationId } = req.params;
    const candidateId = req.user!.id;
    const token = req.accessToken;
    if (!candidateId || !token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { data: application, error } =
      await ApplicationServices.getApplicationByIdService(
        applicationId,
        candidateId,
        token,
      );

    res
      .status(201)
      .json({ message: "application details:", data: application });
  } catch (err: any) {
    res.status(404).json({ message: "Application not found" });
  }
};

export const deleteApplication = async (
  req: Request<{ applicationId: string }, {}, {}>,
  res: Response,
) => {
  try {
    const { applicationId } = req.params;
    const candidateId = req.user!.id;
    const token = req.accessToken;
    if (!candidateId || !token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

      await ApplicationServices.deleteApplcationService(applicationId, candidateId,token);

    res.json({ message: "Application withdrawn successfully" });
  } catch (err: any) {
    res.status(404).json({ message: err.message });
  }
};


