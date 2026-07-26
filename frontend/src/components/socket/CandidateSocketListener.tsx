"use client";

import { useEffect } from "react";
import toast from "react-hot-toast";
import { ArrowRight, Megaphone, X } from "lucide-react";
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

      if (notification.data?.kind === "JOB_ANNOUNCEMENT") {
        toast.custom(
          (toastInstance) => (
            <div
              className={`pointer-events-auto w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-amber-200 bg-white shadow-2xl shadow-amber-900/15 transition-all dark:border-amber-900/70 dark:bg-slate-950 ${
                toastInstance.visible
                  ? "translate-y-0 opacity-100"
                  : "-translate-y-2 opacity-0"
              }`}
            >
              <div className="h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500" />
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                    <Megaphone size={21} />
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold uppercase tracking-wide text-amber-600 dark:text-amber-400">
                      New job announcement
                    </p>
                    <h3 className="mt-1 line-clamp-2 font-bold text-slate-950 dark:text-white">
                      {notification.title}
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => toast.dismiss(toastInstance.id)}
                    className="rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-900 dark:hover:text-slate-200"
                    aria-label="Dismiss announcement"
                  >
                    <X size={16} />
                  </button>
                </div>

                <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {notification.message}
                </p>

                <button
                  type="button"
                  onClick={() => {
                    toast.dismiss(toastInstance.id);
                    window.location.assign("/candidate/jobs");
                  }}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-amber-500/20 transition hover:-translate-y-0.5"
                >
                  View job updates
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ),
          {
            duration: 9000,
            position: "top-right",
          },
        );
      } else if (
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
