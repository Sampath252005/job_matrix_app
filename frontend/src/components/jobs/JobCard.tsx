"use client";

import {
  Briefcase,
  CalendarDays,
  Megaphone,
  MapPin,
  MessageCircleQuestion,
} from "lucide-react";
import JobActions from "./JobActions";

interface RecruiterJobCardData {
  id: string;
  title: string;
  description?: string;
  location?: string;
  createdAt?: string;
  status: string;
}

interface JobCardProps {
  job: RecruiterJobCardData;
  refresh: () => void | Promise<void>;
  onAnnouncements?: (job: RecruiterJobCardData) => void;
  onQuestions?: (job: RecruiterJobCardData) => void;
}

export default function JobCard({
  job,
  refresh,
  onAnnouncements,
  onQuestions,
}: JobCardProps) {
  return (
    <div
      className="
      group
      rounded-2xl
      border
      border-slate-200/80
      dark:border-gray-800
      bg-white/90
      dark:bg-gray-900
      p-4
      sm:p-6
      shadow-sm shadow-slate-200/70
      hover:shadow-xl hover:shadow-blue-100/70
      dark:shadow-none dark:hover:shadow-none
      hover:-translate-y-1
      transition-all
      duration-300
      "
    >
      {/* Header */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

        <div className="flex min-w-0 gap-4">

          <div
            className="
            h-12
            w-12
            shrink-0
            sm:h-14
            sm:w-14
            rounded-2xl
            bg-gradient-to-br
            from-blue-600
            to-indigo-600
            flex
            items-center
            justify-center
            shadow-md
            "
          >
            <Briefcase
              className="text-white"
              size={24}
            />
          </div>

          <div className="min-w-0">

            <h2
              className="
              text-lg
              sm:text-xl
              font-bold
              text-gray-900
              dark:text-white
              truncate
              "
            >
              {job.title}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Job Opening
            </p>

          </div>

        </div>

        <JobActions
          job={job}
          refresh={refresh}
        />

      </div>

      {/* Description */}

      <p
        className="
        mt-5
        text-gray-600
        dark:text-gray-400
        leading-7
        line-clamp-3
        "
      >
        {job.description}
      </p>

      {/* Details */}

      <div className="mt-6 flex flex-wrap gap-3">

        {job.location && (
          <div
            className="
            flex
            items-center
            gap-2
            rounded-full
            bg-slate-100/80
            dark:bg-gray-800
            px-3
            py-2
            text-sm
            "
          >
            <MapPin size={15} />
            {job.location}
          </div>
        )}

        {job.createdAt && (
          <div
            className="
            flex
            items-center
            gap-2
            rounded-full
            bg-slate-100/80
            dark:bg-gray-800
            px-3
            py-2
            text-sm
            "
          >
            <CalendarDays size={15} />
            {new Date(job.createdAt).toLocaleDateString()}
          </div>
        )}

      </div>

      {/* Footer */}

      <div className="mt-6 flex flex-col gap-3">

        <span
          className={`
          rounded-full
          px-4
          py-1.5
          text-sm
          font-medium
          ${
            job.status === "OPEN"
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
          }
          `}
        >
          {job.status === "OPEN"
            ? "🟢 Open"
            : "🔴 Closed"}
        </span>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onAnnouncements?.(job)}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700 transition hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300"
          >
            <Megaphone size={15} />
            Announcements
          </button>
          <button
            type="button"
            onClick={() => onQuestions?.(job)}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-bold text-indigo-700 transition hover:bg-indigo-100 dark:border-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-300"
          >
            <MessageCircleQuestion size={15} />
            Q&amp;A
          </button>
        </div>

      </div>

    </div>
  );
}
