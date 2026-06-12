import { Request, Response } from "express";
import * as AssessmentServices from "./assessments.services.js";

interface CreateAssessmentBody {
  job_id: string;
  title: string;
  description?: string;
  duration_minutes: number;
  passing_score: number;
}
interface UpdateAssessmentBody {
  title?: string;
  description?: string;
  duration_minutes?: number;
  passing_score?: number;
  status?: "ACTIVE" | "INACTIVE";
}


export const createAssessment = async (
  req: Request<{}, {}, CreateAssessmentBody>,
  res: Response,
) => {
  try {
    const token = req.accessToken;
    const user = req.user;

    if (!user || !token) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const {
      job_id,
      title,
      description,
      duration_minutes,
      passing_score,
    } = req.body;

    if (
      !job_id ||
      !title ||
      !duration_minutes ||
      !passing_score
    ) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const { data, error } =
      await AssessmentServices.createAssessment(
        {
          job_id,
          recruiter_id: user.id,
          title,
          description,
          duration_minutes,
          passing_score,
        },
        token,
      );

    if (error) {
      return res.status(400).json({
        error: error.message,
      });
    }

    return res.status(201).json({
      message: "Assessment created successfully",
      data,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getAssessmentByJobController = async (
  req: Request<{ jobId: string }, {}, {}>,
  res: Response,
) => {
  try {
    const token = req.accessToken;
    const user = req.user;

    if (!user || !token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const jobId = req.params.jobId;

    const { data, error } = await AssessmentServices.getAssessmentByJob(
      jobId,
      user.id,
      token,
    );

    if (error) {
      return res.status(400).json({
        error: "Error while fetching assessment: " + error.message,
      });
    }

    return res.status(200).json({
      message: data
        ? "Assessment fetched successfully"
        : "No assessment found for this job",
      data,
    });
  } catch (error) {
    console.error("Get assessment by job error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAssessmentByIdController = async (
  req: Request<{ assessmentId: string }, {}, {}>,
  res: Response,
) => {
  try {
    const token = req.accessToken;
    const user = req.user;

    if (!user || !token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const assessmentId = req.params.assessmentId;

    const { data, error } = await AssessmentServices.getAssessmentById(
      assessmentId,
      user.id,
      token,
    );

    if (error) {
      return res.status(404).json({
        error: "Assessment not found or unauthorized",
      });
    }

    return res.status(200).json({
      message: "Assessment fetched successfully",
      data,
    });
  } catch (error) {
    console.error("Get assessment by id error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateAssessmentController = async (
  req: Request<{ assessmentId: string }, {}, UpdateAssessmentBody>,
  res: Response,
) => {
  try {
    const token = req.accessToken;
    const user = req.user;

    if (!user || !token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const assessmentId = req.params.assessmentId;

    const allowedPayload: UpdateAssessmentBody = {
      title: req.body.title,
      description: req.body.description,
      duration_minutes: req.body.duration_minutes,
      passing_score: req.body.passing_score,
      status: req.body.status,
    };

    Object.keys(allowedPayload).forEach((key) => {
      if (allowedPayload[key as keyof UpdateAssessmentBody] === undefined) {
        delete allowedPayload[key as keyof UpdateAssessmentBody];
      }
    });

    if (Object.keys(allowedPayload).length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    const { data, error } = await AssessmentServices.updateAssessment(
      assessmentId,
      user.id,
      allowedPayload,
      token,
    );

    if (error) {
      return res.status(400).json({
        error: "Error while updating assessment: " + error.message,
      });
    }

    return res.status(200).json({
      message: "Assessment updated successfully",
      data,
    });
  } catch (error) {
    console.error("Update assessment error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteAssessmentController = async (
  req: Request<{ assessmentId: string }, {}, {}>,
  res: Response,
) => {
  try {
    const token = req.accessToken;
    const user = req.user;

    if (!user || !token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const assessmentId = req.params.assessmentId;

    const { data, error } = await AssessmentServices.deleteAssessment(
      assessmentId,
      user.id,
      token,
    );

    if(!data)
    {
       return res.status(400).json({
        error: "assement not found:" + data,
      });
    }

    if (error) {
      return res.status(400).json({
        error: "Error while deleting assessment: " + error.message,
      });
    }

    return res.status(200).json({
      message: "Assessment deleted successfully",
      data,
    });
  } catch (error) {
    console.error("Delete assessment error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


//candidate
export const startAssessmentController = async (
  req: Request<{ assessmentId: string }, {}, {}>,
  res: Response,
) => {
  try {
    const token = req.accessToken;
    const user = req.user;

    if (!user || !token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const assessmentId = req.params.assessmentId;

    const { data, error } =
      await AssessmentServices.startAssessment(
        assessmentId,
        user.id,
        token,
      );

    if (error) {
      return res.status(400).json(error);
    }

    return res.status(201).json({
      message: "Assessment started successfully",
      data,
    });
  } catch (error) {
    console.error("Start assessment error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


interface SaveAnswerBody {
  question_id: string;
  selected_answer: "A" | "B" | "C" | "D";
}

export const saveAnswerController = async (
  req: Request<{ attemptId: string }, {}, SaveAnswerBody>,
  res: Response,
) => {
  try {
    const token = req.accessToken;
    const user = req.user;

    if (!user || !token) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const attemptId = req.params.attemptId;

    const {
      question_id,
      selected_answer,
    } = req.body;

    if (
      !["A", "B", "C", "D"].includes(selected_answer)
    ) {
      return res.status(400).json({
        message:
          "Selected answer must be A, B, C or D",
      });
    }

    const { data, error } =
      await AssessmentServices.saveAnswer(
        attemptId,
        user.id,
        question_id,
        selected_answer,
        token,
      );

    if (error) {
      return res.status(400).json(error);
    }

    return res.status(200).json({
      message: "Answer saved successfully",
      data,
    });
  } catch (error) {
    console.error("Save answer error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};


export const submitAssessmentController = async (
  req: Request<{ attemptId: string }, {}, {}>,
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

    const attemptId = req.params.attemptId;

    const { data, error } =
      await AssessmentServices.submitAssessment(
        attemptId,
        user.id,
        token,
      );

    if (error) {
      return res.status(400).json(error);
    }

    return res.status(200).json({
      message: "Assessment submitted successfully",
      data,
    });
  } catch (error) {
    console.error("Submit assessment error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};



export const getAssessmentResultController = async (
  req: Request<{ attemptId: string }, {}, {}>,
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

    const attemptId = req.params.attemptId;

    const { data, error } =
      await AssessmentServices.getAssessmentResult(
        attemptId,
        user.id,
        token,
      );

    if (error) {
      return res.status(400).json(error);
    }

    return res.status(200).json({
      message: "Result fetched successfully",
      data,
    });
  } catch (error) {
    console.error("Get result error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};