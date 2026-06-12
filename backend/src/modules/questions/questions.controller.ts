import { Request, Response } from "express";
import * as QuestionServices from "./questions.services.js";

interface CreateQuestionBody {
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: "A" | "B" | "C" | "D";
  marks: number;
  category?: string;
  difficulty?: "EASY" | "MEDIUM" | "HARD";
}

export const createQuestionController = async (
  req: Request<{ assessmentId: string }, {}, CreateQuestionBody>,
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

    const assessmentId = req.params.assessmentId;

    const {
      question,
      option_a,
      option_b,
      option_c,
      option_d,
      correct_answer,
      marks,
      category,
      difficulty,
    } = req.body;

    if (
      !question ||
      !option_a ||
      !option_b ||
      !option_c ||
      !option_d ||
      !correct_answer
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (!["A", "B", "C", "D"].includes(correct_answer)) {
      return res.status(400).json({
        message: "Correct answer must be A, B, C or D",
      });
    }

    const { data, error } =
      await QuestionServices.createQuestion(
        assessmentId,
        user.id,
        {
          question,
          option_a,
          option_b,
          option_c,
          option_d,
          correct_answer,
          marks: marks || 1,
          category,
          difficulty,
        },
        token,
      );

    if (error) {
      return res.status(400).json(error);
    }

    return res.status(201).json({
      message: "Question added successfully",
      data,
    });
  } catch (error) {
    console.error("Create question error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getQuestionsByAssessmentController = async (
  req: Request<{ assessmentId: string }, {}, {}>,
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

    const assessmentId = req.params.assessmentId;

    const { data, error } =
      await QuestionServices.getQuestionsByAssessment(
        assessmentId,
        user.id,
        token,
      );

    if (error) {
      return res.status(400).json(error);
    }

    return res.status(200).json({
      message: "Questions fetched successfully",
      totalQuestions: data?.length || 0,
      data,
    });
  } catch (error) {
    console.error("Get questions error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};


interface UpdateQuestionBody {
  question?: string;
  option_a?: string;
  option_b?: string;
  option_c?: string;
  option_d?: string;
  correct_answer?: "A" | "B" | "C" | "D";
  marks?: number;
  category?: string;
  difficulty?: "EASY" | "MEDIUM" | "HARD";
}

export const updateQuestionController = async (
  req: Request<{ questionId: string }, {}, UpdateQuestionBody>,
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

    const questionId = req.params.questionId;

    if (
      req.body.correct_answer &&
      !["A", "B", "C", "D"].includes(req.body.correct_answer)
    ) {
      return res.status(400).json({
        message: "Correct answer must be A, B, C or D",
      });
    }

    const { data, error } =
      await QuestionServices.updateQuestion(
        questionId,
        user.id,
        req.body,
        token,
      );

    if (error) {
      return res.status(400).json(error);
    }

    return res.status(200).json({
      message: "Question updated successfully",
      data,
    });
  } catch (error) {
    console.error("Update question error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};


export const deleteQuestionController = async (
  req: Request<{ questionId: string }, {}, {}>,
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

    const questionId = req.params.questionId;

    const { data, error } =
      await QuestionServices.deleteQuestion(
        questionId,
        user.id,
        token,
      );

    if (error) {
      return res.status(400).json(error);
    }

    return res.status(200).json({
      message: "Question deleted successfully",
      data,
    });
  } catch (error) {
    console.error("Delete question error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};