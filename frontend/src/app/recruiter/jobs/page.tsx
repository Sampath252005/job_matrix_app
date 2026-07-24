// app/recruiter/jobs/page.tsx
"use client";

import { useEffect, useState } from "react";
import { getMyJobs } from "@/services/jobs.services";
import JobCard from "@/components/jobs/JobCard";
import { useRouter } from "next/navigation";
import { toastApiWarning } from "@/lib/toast";

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const router = useRouter();

  const fetchJobs = async () => {
    try {
      const data = await getMyJobs();
      setJobs(data);
    } catch (error) {
      console.error(error);
      toastApiWarning(error, "Failed to load jobs");
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="min-h-screen bg-transparent p-3 dark:bg-gray-950 sm:p-5 lg:p-8">
      {/* Header */}

      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            My Jobs
          </h1>

          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Manage all your job postings and monitor their status.
          </p>
        </div>

        <button
          onClick={() => router.push("/recruiter/jobs/create")}
          className=" inline-flex  w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 font-semibold  text-white shadow-lg hover:scale-105 transition sm:w-auto "
        >
          + Create Job
        </button>
      </div>

      {/* Stats */}

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm shadow-slate-200/70 dark:border-gray-800 dark:bg-gray-900 dark:shadow-none">
          <p className="text-gray-500">Total Jobs</p>

          <h2 className="mt-2 text-3xl font-bold">{jobs.length}</h2>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm shadow-slate-200/70 dark:border-gray-800 dark:bg-gray-900 dark:shadow-none">
          <p className="text-gray-500">Open Jobs</p>

          <h2 className="mt-2 text-3xl font-bold text-green-600">
            {jobs.filter((job: any) => job.status === "open").length}
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm shadow-slate-200/70 dark:border-gray-800 dark:bg-gray-900 dark:shadow-none sm:col-span-2 lg:col-span-1">
          <p className="text-gray-500">Closed Jobs</p>

          <h2 className="mt-2 text-3xl font-bold text-red-500">
            {jobs.filter((job: any) => job.status !== "open").length}
          </h2>
        </div>
      </div>

      {/* Job Grid */}

      {jobs.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {jobs.map((job: any) => (
            <JobCard key={job.id} job={job} refresh={fetchJobs} />
          ))}
        </div>
      ) : (
        <div
          className="rounded-3xl border border-dashed border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 py-20 text-center"
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
