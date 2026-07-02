"use client";

import {
  Briefcase,
  CalendarDays,
  MapPin,
} from "lucide-react";
import JobActions from "./JobActions";

export default function JobCard({
  job,
  refresh,
}: any) {
  return (
    <div
      className="
      group
      rounded-2xl
      border
      border-gray-200
      dark:border-gray-800
      bg-white
      dark:bg-gray-900
      p-6
      shadow-sm
      hover:shadow-xl
      hover:-translate-y-1
      transition-all
      duration-300
      "
    >
      {/* Header */}

      <div className="flex items-start justify-between">

        <div className="flex gap-4">

          <div
            className="
            h-14
            w-14
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

          <div>

            <h2
              className="
              text-xl
              font-bold
              text-gray-900
              dark:text-white
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
            bg-gray-100
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
            bg-gray-100
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

      <div className="mt-6 flex items-center justify-between">

        <span
          className={`
          rounded-full
          px-4
          py-1.5
          text-sm
          font-medium
          ${
            job.status === "open"
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
          }
          `}
        >
          {job.status === "open"
            ? "🟢 Open"
            : "🔴 Closed"}
        </span>

        <span className="text-sm text-gray-400">
          ID #{job.id}
        </span>

      </div>

    </div>
  );
}