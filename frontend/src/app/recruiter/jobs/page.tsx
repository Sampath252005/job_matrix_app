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
    <div className="p-6 min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">My Jobs</h1>

        <button
          onClick={() => router.push("/recruiter/jobs/create")}
          className="bg-blue-600 px-4 py-2 rounded-lg text-white"
        >
          + Create Job
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job: any) => (
          <JobCard key={job.id} job={job} refresh={fetchJobs} />
        ))}
      </div>
    </div>
  );
}
