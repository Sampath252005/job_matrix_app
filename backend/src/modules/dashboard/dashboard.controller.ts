import { Request,Response } from "express";
import * as DashBoardServices from "./dashboard.services.js"
export const getRecruiterDashboardController = async (
  req: Request<{recruiter_id:string},{},{}>,
  res: Response
) => {
  try {
    const recruiter_id = req.user!.id;
    const token = req.accessToken!;
    if(!token||!recruiter_id)
    {
        return res.status(400).json({message:"Unauthorzed:"});
    }

    const stats = await DashBoardServices.getRecruiterDashboardStats(
      recruiter_id,
      token
    );

    return res.json(stats);
  } catch (error: any) {
    return res.status(400).json({
      error: error.message,
    });
  }
};


export const getCandidateDashboardController = async (
  req: Request<{recruiter_id:string},{},{}>,
  res: Response
) => {
  try {
    const candidate_id = req.user!.id;
    const token = req.accessToken!;
    if(!token||!candidate_id)
    {
        return res.status(400).json({message:"Unauthorzed:"});
    }

    const stats = await DashBoardServices.getCandidateDashboardStats(
      candidate_id,
      token
    );

    return res.json(stats);
  } catch (error: any) {
    return res.status(400).json({
      error: error.message,
    });
  }
};

export const getRecruiterDashboardAnalyticsController = async (
  req: Request,
  res: Response,
) => {
  try {
    const recruiterId = req.user!.id;
    const token = req.accessToken!;
    const analytics =
      await DashBoardServices.getRecruiterDashboardAnalytics(
        recruiterId,
        token,
      );
    return res.json(analytics);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
};

export const getCandidateDashboardAnalyticsController = async (
  req: Request,
  res: Response,
) => {
  try {
    const candidateId = req.user!.id;
    const token = req.accessToken!;
    const analytics =
      await DashBoardServices.getCandidateDashboardAnalytics(
        candidateId,
        token,
      );
    return res.json(analytics);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
};
