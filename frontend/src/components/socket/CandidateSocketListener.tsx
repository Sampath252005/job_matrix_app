"use client";

import { useEffect } from "react";
import toast from "react-hot-toast";
import { socket } from "@/lib/socket";
import type { CandidateNotification } from "@/services/notification.services";

export const CANDIDATE_NOTIFICATION_EVENT = "candidate-notification:new";

interface CandidateSocketListenerProps {
  userId: string;
  onNewNotification?: (notification: CandidateNotification) => void;
}

export default function CandidateSocketListener({
  userId,
  onNewNotification,
}: CandidateSocketListenerProps) {
  useEffect(() => {
    if (!userId) return;

    if (!socket.connected) {
      socket.connect();
    }

    const handleConnect = () => {
      console.log("Socket connected:", socket.id);
    };

    const handleNotification = (
      notification: CandidateNotification,
    ) => {
      console.log(
        "New notification received:",
        notification,
      );

      if (
        notification.type ===
          "APPLICATION_SHORTLISTED" ||
        notification.type ===
          "APPLICATION_SELECTED"
      ) {
        toast.success(notification.message, {
          duration: 6000,
        });
      } else if (
        notification.type ===
        "APPLICATION_REJECTED"
      ) {
        toast.error(notification.message, {
          duration: 6000,
        });
      } else {
        toast(notification.message, {
          duration: 6000,
        });
      }

      window.dispatchEvent(
        new CustomEvent<CandidateNotification>(
          CANDIDATE_NOTIFICATION_EVENT,
          { detail: notification },
        ),
      );
      onNewNotification?.(notification);
    };

    const handleConnectError = (error: Error) => {
      console.error("Socket connection error:", error.message);
    };

    socket.on("connect", handleConnect);
    socket.on(
      "notification:new",
      handleNotification,
    );
    socket.on(
      "connect_error",
      handleConnectError,
    );

    return () => {
      socket.off("connect", handleConnect);
      socket.off(
        "notification:new",
        handleNotification,
      );
      socket.off(
        "connect_error",
        handleConnectError,
      );
    };
  }, [userId, onNewNotification]);

  return null;
}
