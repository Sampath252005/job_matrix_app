"use client";

import { useEffect } from "react";
import toast from "react-hot-toast";
import { socket } from "@/lib/socket";
import type {
  JobQuestion,
  QuestionReply,
} from "@/services/job-question.services";

export const QUESTION_CREATED_EVENT = "job-question:new";
export const QUESTION_REPLY_EVENT = "job-question-reply:new";
export const QUESTION_CLOSED_EVENT = "job-question:closed";

function getStoredUser() {
  try {
    const value: unknown = JSON.parse(localStorage.getItem("User") ?? "null");
    if (!value || typeof value !== "object") return null;

    const id =
      "id" in value && typeof value.id === "string" ? value.id : null;
    const role =
      "role" in value && typeof value.role === "string"
        ? value.role.toUpperCase()
        : null;

    return id && role ? { id, role } : null;
  } catch {
    return null;
  }
}

export default function QuestionRealtimeProvider() {
  useEffect(() => {
    const user = getStoredUser();
    if (!user) return;

    if (!socket.connected) socket.connect();

    const handleNewQuestion = (question: JobQuestion) => {
      window.dispatchEvent(
        new CustomEvent<JobQuestion>(QUESTION_CREATED_EVENT, {
          detail: question,
        }),
      );

      if (user.role === "RECRUITER") {
        toast("A candidate asked a new job question", {
          icon: "💬",
          duration: 6000,
        });
      }
    };

    const handleNewReply = (reply: QuestionReply) => {
      window.dispatchEvent(
        new CustomEvent<QuestionReply>(QUESTION_REPLY_EVENT, {
          detail: reply,
        }),
      );

      if (reply.sender_id !== user.id) {
        toast(
          user.role === "CANDIDATE"
            ? "The hiring team replied to your question"
            : "A candidate replied to a job question",
          { icon: "↩️", duration: 6000 },
        );
      }
    };

    const handleQuestionClosed = (question: JobQuestion) => {
      window.dispatchEvent(
        new CustomEvent<JobQuestion>(QUESTION_CLOSED_EVENT, {
          detail: question,
        }),
      );

      if (user.role === "CANDIDATE") {
        toast("A job question conversation was closed", {
          icon: "✓",
          duration: 5000,
        });
      }
    };

    socket.on("question:new", handleNewQuestion);
    socket.on("question-reply:new", handleNewReply);
    socket.on("question:closed", handleQuestionClosed);

    return () => {
      socket.off("question:new", handleNewQuestion);
      socket.off("question-reply:new", handleNewReply);
      socket.off("question:closed", handleQuestionClosed);
    };
  }, []);

  return null;
}
