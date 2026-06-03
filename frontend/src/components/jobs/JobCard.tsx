// components/jobs/JobCard.tsx
"use client";

import JobActions from "./JobActions";

export default function JobCard({ job, refresh }: any) {
  return (
    <div className="p-5 rounded-2xl shadow-md bg-gray-100 dark:bg-gray-900 hover:shadow-xl transition">
      
      <h2 className="text-lg font-semibold">{job.title}</h2>
      <p className="text-sm opacity-70 mt-1 line-clamp-2">
        {job.description}
      </p>

      <div className="flex justify-between items-center mt-4">
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            job.status === "open"
              ? "bg-green-500"
              : "bg-red-500"
          }`}
        >
          {job.status}
        </span>

        <JobActions job={job} refresh={refresh} />
      </div>
    </div>
  );
}