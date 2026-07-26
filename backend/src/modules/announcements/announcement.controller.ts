import { Request, Response } from "express";

import {
  createAnnouncementService,
  deleteAnnouncementService,
  getJobAnnouncementsService,
  updateAnnouncementService,
} from "./announcement.service.js";

interface CreateAnnouncementBody {
  title: string;
  content: string;
  audience?: "PUBLIC" | "APPLICANTS" | "SHORTLISTED" | "INTERVIEW";
  is_pinned?: boolean;
}


const allowedAudiences = [
  "PUBLIC",
  "APPLICANTS",
  "SHORTLISTED",
  "INTERVIEW",
];

export const createAnnouncement = async (
  req:Request<{jobId:string }, {}, CreateAnnouncementBody>,
  res: Response,
) => {
  try {
    const { jobId } = req.params;

    const {
      title,
      content,
      audience,
      is_pinned,
    } = req.body;

    if (!req.user || !req.accessToken) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (req.user.role?.toLowerCase() !== "recruiter") {
      return res.status(403).json({
        success: false,
        message:
          "Only recruiters can create announcements",
      });
    }

    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: "Job ID is required",
      });
    }

    if (
      typeof title !== "string" ||
      !title.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Announcement title is required",
      });
    }

    if (title.trim().length > 150) {
      return res.status(400).json({
        success: false,
        message:
          "Announcement title cannot exceed 150 characters",
      });
    }

    if (
      typeof content !== "string" ||
      !content.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Announcement content is required",
      });
    }

    if (
      audience &&
      !allowedAudiences.includes(audience)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid announcement audience",
      });
    }

    if (
      is_pinned !== undefined &&
      typeof is_pinned !== "boolean"
    ) {
      return res.status(400).json({
        success: false,
        message: "is_pinned must be a boolean",
      });
    }

    const announcement =
      await createAnnouncementService(
        jobId,
        req.user.id,
        req.accessToken,
        {
          title,
          content,
          audience,
          is_pinned,
        },
      );

    return res.status(201).json({
      success: true,
      message: "Announcement created successfully",
      data: announcement,
    });
  } catch (error) {
    console.error(
      "Create announcement controller error:",
      error,
    );

    const message =
      error instanceof Error
        ? error.message
        : "Unable to create announcement";

    if (message === "Job not found") {
      return res.status(404).json({
        success: false,
        message,
      });
    }

    if (message.includes("not authorized")) {
      return res.status(403).json({
        success: false,
        message,
      });
    }

    return res.status(500).json({
      success: false,
      message,
    });
  }
};

export const getJobAnnouncements = async (
  req: Request<{jobId:string }, {}, {}>,
  res: Response,
) => {
  try {
    const { jobId } = req.params;

    if (!req.user || !req.accessToken||!req.user.role) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: "Job ID is required",
      });
    }

    const announcements =
      await getJobAnnouncementsService(
        jobId,
        req.user.id,
        req.user.role,
        req.accessToken,
      );

    return res.status(200).json({
      success: true,
      count: announcements.length,
      data: announcements,
    });
  } catch (error) {
    console.error(
      "Get announcements controller error:",
      error,
    );

    const message =
      error instanceof Error
        ? error.message
        : "Unable to fetch announcements";

    if (message === "Job not found") {
      return res.status(404).json({
        success: false,
        message,
      });
    }

    return res.status(500).json({
      success: false,
      message,
    });
  }
};

export const updateAnnouncement = async (
  req: Request<{announcementId:string }, {}, CreateAnnouncementBody>,
  res: Response,
) => {
  try {
    const { announcementId } = req.params;

    const {
      title,
      content,
      audience,
      is_pinned,
    } = req.body;

    if (!req.user || !req.accessToken) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (req.user.role?.toLowerCase() !== "recruiter") {
      return res.status(403).json({
        success: false,
        message:
          "Only recruiters can update announcements",
      });
    }

    if (!announcementId) {
      return res.status(400).json({
        success: false,
        message: "Announcement ID is required",
      });
    }

    if (
      title === undefined &&
      content === undefined &&
      audience === undefined &&
      is_pinned === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Provide at least one field to update",
      });
    }

    if (
      title !== undefined &&
      (typeof title !== "string" || !title.trim())
    ) {
      return res.status(400).json({
        success: false,
        message: "Title cannot be empty",
      });
    }

    if (
      title !== undefined &&
      title.trim().length > 150
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Announcement title cannot exceed 150 characters",
      });
    }

    if (
      content !== undefined &&
      (typeof content !== "string" ||
        !content.trim())
    ) {
      return res.status(400).json({
        success: false,
        message: "Content cannot be empty",
      });
    }

    if (
      audience !== undefined &&
      !allowedAudiences.includes(audience)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid announcement audience",
      });
    }

    if (
      is_pinned !== undefined &&
      typeof is_pinned !== "boolean"
    ) {
      return res.status(400).json({
        success: false,
        message: "is_pinned must be a boolean",
      });
    }

    const announcement =
      await updateAnnouncementService(
        announcementId,
        req.user.id,
        req.accessToken,
        {
          title,
          content,
          audience,
          is_pinned,
        },
      );

    return res.status(200).json({
      success: true,
      message: "Announcement updated successfully",
      data: announcement,
    });
  } catch (error) {
    console.error(
      "Update announcement controller error:",
      error,
    );

    const message =
      error instanceof Error
        ? error.message
        : "Unable to update announcement";

    if (message === "Announcement not found") {
      return res.status(404).json({
        success: false,
        message,
      });
    }

    if (message.includes("not authorized")) {
      return res.status(403).json({
        success: false,
        message,
      });
    }

    return res.status(500).json({
      success: false,
      message,
    });
  }
};

export const deleteAnnouncement = async (
  req: Request<{announcementId:string }, {}, {}>,
  res: Response,
) => {
  try {
    const { announcementId } = req.params;

    if (!req.user || !req.accessToken) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (req.user.role?.toLowerCase() !== "recruiter") {
      return res.status(403).json({
        success: false,
        message:
          "Only recruiters can delete announcements",
      });
    }

    if (!announcementId) {
      return res.status(400).json({
        success: false,
        message: "Announcement ID is required",
      });
    }

    const result = await deleteAnnouncementService(
      announcementId,
      req.user.id,
      req.accessToken,
    );

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error(
      "Delete announcement controller error:",
      error,
    );

    const message =
      error instanceof Error
        ? error.message
        : "Unable to delete announcement";

    if (message === "Announcement not found") {
      return res.status(404).json({
        success: false,
        message,
      });
    }

    if (message.includes("not authorized")) {
      return res.status(403).json({
        success: false,
        message,
      });
    }

    return res.status(500).json({
      success: false,
      message,
    });
  }
};