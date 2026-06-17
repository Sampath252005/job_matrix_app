"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { getJobDetails, applyJob } from "@/services/jobs.services";

interface Job {
  id: string;
  title: string;
  location: string;
  type: string;
  salary: string;
  experience: string;
}
interface CompanyProfile {
  website: string;
  industry: string;
  logo_url: string;
  description: string;
  company_name: string;
  company_size: string;
}

interface Recruiter {
  id: string;
  name: string;
  company_profiles: CompanyProfile;
}

interface JobDetails {
  id: string;
  title: string;
  description: string;
  location: string;
  type: string;
  salary: string;
  experience: string;
  created_at: string;
  users: Recruiter;
}

export default function CandidateJobCard({ job }: { job: Job }) {
  const [modelOpen, setModelOpen] = useState(false);
  const [jobdescription, setjobdescription] = useState<JobDetails | null>(null);
  const [applying, setApplying] = useState(false);

  const fetchDetail = async (jobId: string) => {
    try {
      const data = await getJobDetails(jobId);
      setjobdescription(data.data);
      setModelOpen(true);
    } catch (error) {
      console.error("Internal error :", error);
    }
  };
  const handleApply = async (jobId: string) => {
    try {
      setApplying(true);

      const data = await applyJob(jobId);

      toast.success(data.message || "Application submitted");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to apply");
    } finally {
      setApplying(false);
    }
  };

  return (
    <div
      className="
      bg-white
      dark:bg-zinc-900
      border
      border-gray-200
      dark:border-zinc-800
      rounded-2xl
      p-6
      shadow-sm
      hover:shadow-lg
      transition
      "
    >
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold">{job.title}</h2>

          <p className="text-gray-500 mt-1">📍 {job.location}</p>
        </div>

        <span
          className="
          bg-green-100
          dark:bg-green-900/30
          text-green-700
          dark:text-green-400
          px-3 py-1
          rounded-full
          text-sm
          "
        >
          {job.type}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-5">
        <div>
          <p className="text-sm text-gray-500">Salary</p>

          <p className="font-medium">{job.salary}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Experience</p>

          <p className="font-medium">{job.experience}</p>
        </div>
      </div>

      <button
        onClick={() => fetchDetail(job.id)}
        className="
        mt-6
        w-full
        bg-blue-600
        hover:bg-blue-700
        text-white
        py-2
        rounded-lg
        "
      >
        View Details
      </button>
      {modelOpen && jobdescription && (
        <div
          className="
      fixed inset-0
      bg-black/50
      flex items-center justify-center
      z-50
      p-4
    "
        >
          <div
            className="
        bg-white
        dark:bg-zinc-900
        rounded-2xl
        w-full
        max-w-5xl
        max-h-[90vh]
        overflow-y-auto
        p-6
        shadow-xl
      "
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">{jobdescription.title}</h1>

              <button
                onClick={() => setModelOpen(false)}
                className="
            px-4 py-2
            bg-red-500
            hover:bg-red-600
            text-white
            rounded-lg
          "
              >
                Close
              </button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Job Details */}
              <div
                className="
            md:col-span-2
            bg-white
            dark:bg-zinc-900
            border
            dark:border-zinc-800
            rounded-2xl
            p-6
          "
              >
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">{jobdescription.location}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Job Type</p>
                    <p className="font-medium">{jobdescription.type}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Salary</p>
                    <p className="font-medium">{jobdescription.salary}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Experience</p>
                    <p className="font-medium">{jobdescription.experience}</p>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-semibold mb-2">
                    Job Description
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {jobdescription.description}
                  </p>
                </div>
              </div>

              {/* Company Details */}
              <div
                className="
            bg-white
            dark:bg-zinc-900
            border
            dark:border-zinc-800
            rounded-2xl
            p-6
          "
              >
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className="
                h-14 w-14
                rounded-xl
                bg-blue-600
                text-white
                flex items-center
                justify-center
                text-xl
                font-bold
              "
                  >
                    {jobdescription.users.company_profiles.company_name.charAt(
                      0,
                    )}
                  </div>

                  <div>
                    <h2 className="font-bold text-lg">
                      {jobdescription.users.company_profiles.company_name}
                    </h2>

                    <p className="text-sm text-gray-500">
                      {jobdescription.users.company_profiles.industry}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Recruiter</p>

                    <p>{jobdescription.users.name}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Company Size</p>

                    <p>
                      {jobdescription.users.company_profiles.company_size}{" "}
                      Employees
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Website</p>

                    <a
                      href={jobdescription.users.company_profiles.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Visit Website
                    </a>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-1">About Company</p>

                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {jobdescription.users.company_profiles.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 flex justify-end">
              <button
                disabled={applying}
                onClick={() => handleApply(job.id)}
                className="
  bg-blue-600
  hover:bg-blue-700
  disabled:bg-gray-400
  text-white
  px-6
  py-3
  rounded-xl
  "
              >
                {applying ? "Applying..." : "Apply Now"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
