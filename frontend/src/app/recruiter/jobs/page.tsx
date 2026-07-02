// app/recruiter/jobs/page.tsx
"use client";

import { useEffect, useState } from "react";
import { getMyJobs } from "@/services/jobs.services";
import JobCard from "@/components/jobs/JobCard";
import { useRouter } from "next/navigation";

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const router = useRouter();

  const fetchJobs = async () => {
    const data = await getMyJobs();
    setJobs(data);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6 lg:p-8">
      {/* Header */}

      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            My Jobs
          </h1>

          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Manage all your job postings and monitor their status.
          </p>
        </div>

        <button
          onClick={() => router.push("/recruiter/jobs/create")}
          className="
      inline-flex
      items-center
      justify-center
      gap-2
      rounded-xl
      bg-gradient-to-r
      from-blue-600
      to-indigo-600
      px-6
      py-3
      font-semibold
      text-white
      shadow-lg
      hover:scale-105
      transition
      "
        >
          + Create Job
        </button>
      </div>

      {/* Stats */}

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
          <p className="text-gray-500">Total Jobs</p>

          <h2 className="mt-2 text-3xl font-bold">{jobs.length}</h2>
        </div>

        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
          <p className="text-gray-500">Open Jobs</p>

          <h2 className="mt-2 text-3xl font-bold text-green-600">
            {jobs.filter((job: any) => job.status === "open").length}
          </h2>
        </div>

        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
          <p className="text-gray-500">Closed Jobs</p>

          <h2 className="mt-2 text-3xl font-bold text-red-500">
            {jobs.filter((job: any) => job.status !== "open").length}
          </h2>
        </div>
      </div>

      {/* Job Grid */}

      {jobs.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {jobs.map((job: any) => (
            <JobCard key={job.id} job={job} refresh={fetchJobs} />
          ))}
        </div>
      ) : (
        <div
          className="
      rounded-3xl
      border
      border-dashed
      border-gray-300
      dark:border-gray-700
      bg-white
      dark:bg-gray-900
      py-20
      text-center
      "
        >
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
            <span className="text-4xl">💼</span>
          </div>

          <h2 className="mt-6 text-2xl font-bold">No Jobs Yet</h2>

          <p className="mt-3 text-gray-500">
            Create your first job posting to start hiring candidates.
          </p>

          <button
            onClick={() => router.push("/recruiter/jobs/create")}
            className="
        mt-8
        rounded-xl
        bg-blue-600
        px-6
        py-3
        font-semibold
        text-white
        hover:bg-blue-700
        transition
        "
          >
            Create Your First Job
          </button>
        </div>
      )}
    </div>
  );
}
