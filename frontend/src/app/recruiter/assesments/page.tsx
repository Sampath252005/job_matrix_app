"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMyJobs } from "@/services/jobs.services";

interface Job {
  id: string;
  title: string;
  location: string;
  type: string;
  status: string;
}

export default function QuizDesignerPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const data = await getMyJobs();
      setJobs(data);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
          Loading Jobs...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white">
      <div className="p-4 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Assesments
          </h1>

          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Create and manage aptitude tests for your job openings.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow rounded-xl p-5">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm">
              Total Jobs
            </h3>

            <p className="text-3xl font-bold mt-2">{jobs.length}</p>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow rounded-xl p-5">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm">
              Active Jobs
            </h3>

            <p className="text-3xl font-bold mt-2">
              {jobs.filter((job) => job.status === "OPEN").length}
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow rounded-xl p-5">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm">
              Quiz Management
            </h3>

            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Design assessments for hiring and evaluate candidates efficiently.
            </p>
          </div>
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="
                bg-white
                dark:bg-zinc-900
                border
                border-gray-200
                dark:border-zinc-800
                rounded-2xl
                shadow-sm
                hover:shadow-lg
                transition-all
                duration-300
              "
            >
              <div className="p-6">
                {/* Status */}
                <div className="flex justify-between items-center mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      job.status === "OPEN"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    }`}
                  >
                    {job.status}
                  </span>
                </div>

                {/* Job Title */}
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {job.title}
                </h2>

                {/* Job Info */}
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-5">
                  <p>📍 {job.location}</p>
                  <p>💼 {job.type}</p>
                </div>

                {/* Button */}
                <div className="space-y-3 mt-6">
                  <button
                    onClick={() =>
                      router.push(`/recruiter/jobs/${job.id}/assessment`)
                    }
                    className="
      w-full
      bg-blue-600
      hover:bg-blue-700
      text-white
      py-2
      rounded-lg
      transition
    "
                  >
                    Manage Assessment
                  </button>

                  <button
                    onClick={() =>
                      router.push(
                        `/recruiter/jobs/${job.id}/assessment/results`,
                      )
                    }
                    className="
      w-full
      border
      border-gray-300
      dark:border-zinc-700
      hover:bg-gray-100
      dark:hover:bg-zinc-800
      py-2
      rounded-lg
      transition
    "
                  >
                    View Results
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {jobs.length === 0 && (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              No Jobs Found
            </h2>

            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Create a job posting first before designing quizzes.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
