import  * as resultSerivces from "./result.services.js"
import { Request,Response } from "express";
export const getAssessmentResultsController = async (
  req: Request<{ assessmentId: string }>,
  res: Response
) => {
  try {
    const token = req.accessToken;
    const user = req.user;

    if (!token || !user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const { assessmentId } = req.params;

    const results =
      await resultSerivces.getAssessmentResults(
        assessmentId,
        token
      );

    return res.status(200).json({
      data: results,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};


export const getJobAssessmentResultsController = async (
  req: Request<{ jobId: string }>,
  res: Response,
) => {
  try {
    const token = req.accessToken;
    const user = req.user;

    if (!token || !user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const { jobId } = req.params;

    const results =
      await resultSerivces.getJobAssessmentResults(
        jobId,
        token,
      );

    return res.status(200).json({
      data: results,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};