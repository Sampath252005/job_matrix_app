"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMyJobs } from "@/services/jobs.services";
import {
  Briefcase,
  MapPin,
  Clock3,
  ArrowRight,
  FileQuestion,
  BarChart3,
} from "lucide-react";

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
        {/* Dashboard Stats */}

        <div className="grid gap-6 md:grid-cols-3 mb-10">
          <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Jobs</p>

                <h2 className="mt-2 text-4xl font-bold">{jobs.length}</h2>
              </div>

              <div className="rounded-2xl bg-blue-100 dark:bg-blue-900/30 p-3">
                <Briefcase className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Jobs</p>

                <h2 className="mt-2 text-4xl font-bold text-green-600">
                  {jobs.filter((job) => job.status === "OPEN").length}
                </h2>
              </div>

              <div className="rounded-2xl bg-green-100 dark:bg-green-900/30 p-3">
                <FileQuestion className="text-green-600" />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Assessment Center</p>

                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Create quizzes and evaluate candidates easily.
                </p>
              </div>

              <div className="rounded-2xl bg-purple-100 dark:bg-purple-900/30 p-3">
                <BarChart3 className="text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="
    group
    overflow-hidden
    rounded-3xl
    border
    border-gray-200
    dark:border-gray-800
    bg-white
    dark:bg-gray-900
    shadow-sm
    hover:shadow-2xl
    hover:-translate-y-1
    transition-all
    duration-300
  "
            >
              <div className="p-6">
                {/* Header */}

                <div className="flex justify-between items-start">
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
            text-white
            shadow-lg
          "
                    >
                      <Briefcase size={24} />
                    </div>

                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        {job.title}
                      </h2>

                      <p className="text-sm text-gray-500 mt-1">
                        Hiring Position
                      </p>
                    </div>
                  </div>

                  <span
                    className={`
          px-3
          py-1
          rounded-full
          text-xs
          font-semibold
          ${
            job.status === "OPEN"
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
          }
        `}
                  >
                    {job.status}
                  </span>
                </div>

                {/* Divider */}

                <div className="my-6 border-t border-gray-200 dark:border-gray-800" />

                {/* Job Details */}

                <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-blue-500" />
                    {job.location}
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock3 size={16} className="text-blue-500" />
                    {job.type}
                  </div>
                </div>

                {/* Footer */}

                <div className="grid grid-cols-2 gap-3 mt-8">
                  <button
                    onClick={() =>
                      router.push(`/recruiter/jobs/${job.id}/assessment`)
                    }
                    className="
          flex
          items-center
          justify-center
          gap-2
          rounded-xl
          bg-gradient-to-r
          from-blue-600
          to-indigo-600
          py-3
          text-white
          font-medium
          hover:scale-[1.02]
          transition
        "
                  >
                    <FileQuestion size={18} />
                    Manage
                  </button>

                  <button
                    onClick={() =>
                      router.push(
                        `/recruiter/jobs/${job.id}/assessment/results`,
                      )
                    }
                    className="
          flex
          items-center
          justify-center
          gap-2
          rounded-xl
          border
          border-gray-300
          dark:border-gray-700
          py-3
          font-medium
          hover:bg-gray-100
          dark:hover:bg-gray-800
          transition
        "
                  >
                    <BarChart3 size={18} />
                    Results
                  </button>
                </div>

                {/* Bottom Link */}

                <button
                  onClick={() =>
                    router.push(`/recruiter/jobs/${job.id}/assessment`)
                  }
                  className="
        mt-6
        flex
        items-center
        gap-2
        text-blue-600
        font-medium
        group-hover:gap-3
        transition-all
      "
                >
                  Open Assessment
                  <ArrowRight size={17} />
                </button>
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
