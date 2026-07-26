"use client";

import {
  Bell,
  BellRing,
  CalendarClock,
  Check,
  CheckCheck,
  Loader2,
  Megaphone,
  Trophy,
  UserCheck,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  getCandidateNotifications,
  markCandidateNotificationAsRead,
  type CandidateNotification,
} from "@/services/notification.services";
import { CANDIDATE_NOTIFICATION_EVENT } from "@/components/socket/CandidateSocketListener";

function formatNotificationTime(createdAt: string) {
  const created = new Date(createdAt);
  const elapsedSeconds = Math.max(
    0,
    Math.floor((Date.now() - created.getTime()) / 1000),
  );

  if (elapsedSeconds < 60) return "Just now";
  if (elapsedSeconds < 3600) {
    return `${Math.floor(elapsedSeconds / 60)}m ago`;
  }
  if (elapsedSeconds < 86400) {
    return `${Math.floor(elapsedSeconds / 3600)}h ago`;
  }
  if (elapsedSeconds < 604800) {
    return `${Math.floor(elapsedSeconds / 86400)}d ago`;
  }

  return created.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

function NotificationIcon({
  notification,
}: {
  notification: CandidateNotification;
}) {
  const iconClass = "h-5 w-5";

  if (notification.data?.kind === "JOB_ANNOUNCEMENT") {
    return <Megaphone className={iconClass} />;
  }

  switch (notification.type) {
    case "APPLICATION_SHORTLISTED":
      return <UserCheck className={iconClass} />;
    case "APPLICATION_REJECTED":
      return <XCircle className={iconClass} />;
    case "INTERVIEW_SCHEDULED":
      return <CalendarClock className={iconClass} />;
    case "APPLICATION_SELECTED":
      return <Trophy className={iconClass} />;
    default:
      return <BellRing className={iconClass} />;
  }
}

function notificationIconStyle(notification: CandidateNotification) {
  if (notification.data?.kind === "JOB_ANNOUNCEMENT") {
    return "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300";
  }

  switch (notification.type) {
    case "APPLICATION_SHORTLISTED":
      return "bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-300";
    case "APPLICATION_REJECTED":
      return "bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-300";
    case "INTERVIEW_SCHEDULED":
      return "bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-300";
    case "APPLICATION_SELECTED":
      return "bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300";
    default:
      return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300";
  }
}

export default function CandidateNotifications() {
  const [notifications, setNotifications] = useState<CandidateNotification[]>(
    [],
  );
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.is_read).length,
    [notifications],
  );

  useEffect(() => {
    let active = true;

    const loadNotifications = async () => {
      try {
        const data = await getCandidateNotifications();
        if (!active) return;

        setNotifications((current) => {
          const liveNotifications = current.filter(
            (notification) =>
              !data.some((saved) => saved.id === notification.id),
          );
          return [...liveNotifications, ...data];
        });
      } catch (error) {
        console.error("Failed to load notifications:", error);
        if (active) toast.error("Unable to load notifications");
      } finally {
        if (active) setLoading(false);
      }
    };

    const handleRealtimeNotification = (event: Event) => {
      const notification = (
        event as CustomEvent<CandidateNotification>
      ).detail;

      if (!notification?.id) return;

      setNotifications((current) => [
        notification,
        ...current.filter((item) => item.id !== notification.id),
      ]);
    };

    void loadNotifications();
    window.addEventListener(
      CANDIDATE_NOTIFICATION_EVENT,
      handleRealtimeNotification,
    );

    return () => {
      active = false;
      window.removeEventListener(
        CANDIDATE_NOTIFICATION_EVENT,
        handleRealtimeNotification,
      );
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAsRead = async (notification: CandidateNotification) => {
    if (notification.is_read) return;

    setNotifications((current) =>
      current.map((item) =>
        item.id === notification.id ? { ...item, is_read: true } : item,
      ),
    );

    try {
      const updated = await markCandidateNotificationAsRead(notification.id);
      setNotifications((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
      setNotifications((current) =>
        current.map((item) =>
          item.id === notification.id ? notification : item,
        ),
      );
      toast.error("Unable to mark notification as read");
    }
  };

  const markAllAsRead = async () => {
    const unread = notifications.filter((notification) => !notification.is_read);
    if (!unread.length || markingAll) return;

    setMarkingAll(true);
    try {
      const updated = await Promise.all(
        unread.map((notification) =>
          markCandidateNotificationAsRead(notification.id),
        ),
      );
      const updatedById = new Map(
        updated.map((notification) => [notification.id, notification]),
      );
      setNotifications((current) =>
        current.map(
          (notification) =>
            updatedById.get(notification.id) ?? notification,
        ),
      );
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
      toast.error("Some notifications could not be updated");
      try {
        setNotifications(await getCandidateNotifications());
      } catch {
        // Keep the current list if refreshing also fails.
      }
    } finally {
      setMarkingAll(false);
    }
  };

  return (
    <div ref={panelRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="relative inline-flex rounded-full border border-slate-200/80 bg-white/80 p-2.5 text-slate-600 shadow-sm shadow-slate-200/60 transition hover:-translate-y-0.5 hover:bg-white hover:text-blue-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:shadow-none dark:hover:bg-slate-800 dark:hover:text-blue-400"
        aria-label={
          unreadCount
            ? `Notifications, ${unreadCount} unread`
            : "Notifications"
        }
        aria-expanded={open}
      >
        <Bell size={19} />
        {unreadCount > 0 && (
          <span className="absolute -right-1.5 -top-1.5 flex min-h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-red-500 px-1 text-[10px] font-bold leading-none text-white shadow-sm dark:border-slate-900">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      <div
        className={`absolute right-0 z-50 mt-3 w-[min(24rem,calc(100vw-1.5rem))] origin-top-right overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 shadow-2xl shadow-slate-300/50 backdrop-blur-xl transition duration-200 dark:border-slate-800 dark:bg-slate-950/95 dark:shadow-black/40 ${
          open
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none -translate-y-2 scale-95 opacity-0"
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-200/70 px-5 py-4 dark:border-slate-800">
          <div>
            <h2 className="font-bold text-slate-950 dark:text-white">
              Notifications
            </h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              {unreadCount
                ? `${unreadCount} unread update${unreadCount === 1 ? "" : "s"}`
                : "You’re all caught up"}
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={() => void markAllAsRead()}
              disabled={markingAll}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-blue-600 transition hover:bg-blue-50 disabled:opacity-50 dark:text-blue-400 dark:hover:bg-blue-950/50"
            >
              {markingAll ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <CheckCheck size={14} />
              )}
              Mark all read
            </button>
          )}
        </div>

        <div className="max-h-[min(30rem,70vh)] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center gap-2 px-5 py-14 text-sm text-slate-500">
              <Loader2 size={18} className="animate-spin text-blue-500" />
              Loading notifications…
            </div>
          ) : notifications.length === 0 ? (
            <div className="px-6 py-14 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                <Bell size={22} />
              </div>
              <p className="mt-4 font-semibold text-slate-800 dark:text-slate-200">
                No notifications yet
              </p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Application updates will appear here.
              </p>
            </div>
          ) : (
            notifications.map((notification) => (
              <button
                key={notification.id}
                type="button"
                onClick={() => void markAsRead(notification)}
                className={`group relative flex w-full gap-3 border-b border-slate-100 px-4 py-4 text-left transition last:border-b-0 hover:bg-slate-50 dark:border-slate-800/80 dark:hover:bg-slate-900/80 ${
                  notification.is_read
                    ? "bg-white/40 dark:bg-slate-950/30"
                    : "bg-blue-50/65 dark:bg-blue-950/20"
                }`}
              >
                {!notification.is_read && (
                  <span className="absolute left-1.5 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-blue-500" />
                )}

                <span
                  className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${notificationIconStyle(notification)}`}
                >
                  <NotificationIcon notification={notification} />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="flex items-start justify-between gap-3">
                    <span
                      className={`line-clamp-1 text-sm text-slate-900 dark:text-slate-100 ${
                        notification.is_read ? "font-medium" : "font-bold"
                      }`}
                    >
                      {notification.title}
                    </span>
                    <span className="shrink-0 text-[11px] font-medium text-slate-400">
                      {formatNotificationTime(notification.created_at)}
                    </span>
                  </span>
                  <span className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                    {notification.message}
                  </span>
                </span>

                {!notification.is_read && (
                  <Check
                    size={15}
                    className="mt-6 shrink-0 text-slate-300 opacity-0 transition group-hover:opacity-100 dark:text-slate-600"
                  />
                )}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
