"use client";

import { useEffect, useState } from "react";
import { Briefcase, Loader2, MapPin, Search, SlidersHorizontal } from "lucide-react";

import CandidateJobCard from "@/components/jobs/CandidateJobCard";
import { applyJob } from "@/services/jobs.services";
import { toast } from "react-hot-toast";
import { toastApiWarning } from "@/lib/toast";

import {
  getAllJobs,
  searchJobs,
  getJobDetails,
} from "@/services/jobs.services";

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

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setselectedJob] = useState<JobDetails | null>(null);
  const [applying, setApplying] = useState(false);

  const [openModal, setOpenModal] = useState(false);

  const [loading, setLoading] = useState(true);

  const [location, setLocation] = useState("");

  const [type, setType] = useState("");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await getAllJobs();

      setJobs(res.data || []);
    } catch (error) {
      console.error(error);
      toastApiWarning(error, "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (jobId: string) => {
    try {
      const data = await getJobDetails(jobId);

      setselectedJob(data.data);

      setOpenModal(true);
    } catch (error) {
      console.error(error);
      toastApiWarning(error, "Failed to load job details");
    }
  };

  const handleSearch = async () => {
    try {
      const data = await searchJobs({
        location,
        type,
      });

      setJobs(data);
    } catch (error) {
      console.error(error);
      toastApiWarning(error, "Failed to search jobs");
    }
  };

  const handleApply = async (jobId: string) => {
    try {
      setApplying(true);

      const res = await applyJob(jobId);

      toast.success(res.message || "Application submitted");
    } catch (error: unknown) {
      const apiError = error as ApiError;
      toastApiWarning(error, apiError.response?.data?.message || "Failed to apply");
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[55vh] items-center justify-center">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
          <Loader2 className="animate-spin text-blue-600" size={20} />
          Loading jobs...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-900 p-5 text-white shadow-xl shadow-blue-600/20 dark:border-blue-950 sm:p-7">
        <div className="absolute -right-12 -top-16 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-32 w-64 rounded-full bg-cyan-300/10 blur-3xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-semibold text-blue-50 ring-1 ring-white/20">
              <Briefcase size={15} />
              Candidate Jobs
            </span>

            <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
              Find Your Next Job
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-50/90 sm:text-base">
              Browse open roles, compare company details, and apply from a
              cleaner job workspace.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:min-w-72">
            <div className="rounded-xl bg-white/10 p-4 ring-1 ring-white/20">
              <p className="text-2xl font-black">{jobs.length}</p>
              <p className="text-xs font-medium text-blue-50/80">
                Open roles
              </p>
            </div>
            <div className="rounded-xl bg-white/10 p-4 ring-1 ring-white/20">
              <p className="text-2xl font-black">
                {type || "All"}
              </p>
              <p className="text-xs font-medium text-blue-50/80">
                Current type
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}

      <div
        className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm shadow-slate-200/50 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80 dark:shadow-none sm:p-5"
      >
        <div className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
          <SlidersHorizontal size={17} className="text-blue-600" />
          Filters
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_220px_auto]">
          <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 transition focus-within:border-blue-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100 dark:border-slate-800 dark:bg-slate-900/70 dark:focus-within:border-blue-900 dark:focus-within:bg-slate-950 dark:focus-within:ring-blue-950/60">
            <MapPin size={18} className="text-slate-400" />
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Search by location"
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </label>

          <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/70">
            <Briefcase size={18} className="text-slate-400" />
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full bg-transparent text-sm outline-none"
            >
              <option value="">All Types</option>

              <option value="Full-time">Full-time</option>

              <option value="Part-time">Part-time</option>

              <option value="Remote">Remote</option>
            </select>
          </label>

          <button
            onClick={handleSearch}
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
            text-sm
            font-bold
            text-white
            shadow-lg
            shadow-blue-600/20
            transition
            hover:-translate-y-0.5
            hover:shadow-xl
            "
          >
            <Search size={18} />
            Search
          </button>
        </div>
      </div>

      {/* Jobs */}

      {jobs.length === 0 ? (
        <div
          className="
          text-center
          py-16
          rounded-2xl
          border
          border-dashed
          border-slate-300
          bg-white/70
          dark:border-slate-700
          dark:bg-slate-950/60
          "
        >
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/50">
            <Search size={24} />
          </div>

          <h2 className="text-2xl font-semibold">No Jobs Found</h2>

          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Try changing your filters or clearing the location field.
          </p>
        </div>
      ) : (
        <>
          <div
            className="
          grid
          grid-cols-1
          xl:grid-cols-2
          gap-4
          sm:gap-5
          "
          >
            {jobs.map((job) => (
              <CandidateJobCard
                key={job.id}
                job={job}
                onView={handleViewDetails}
              />
            ))}
          </div>
          {openModal && selectedJob && (
            <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
              <div className=" relative w-full max-w-6xl max-h-[95vh] overflow-hidden rounded-3xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-2xl flex flex-col  ">
                {/* Header */}
                <div className=" sticky top-0 z-20  bg-white/95 dark:bg-zinc-900/95 backdrop-blur border-b border-gray-200 dark:border-zinc-800 px-5 sm:px-8 py-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                        {selectedJob?.title}
                      </h1>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className=" px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium">
                          📍 {selectedJob?.location}
                        </span>

                        <span className=" px-3 py-1  rounded-full bg-green-100 dark:bg-green-900/30 text-green-700  dark:text-green-300  text-sm font-medium">
                          💼 {selectedJob?.type}
                        </span>

                        <span className=" px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700  dark:text-purple-300  text-sm font-medium">
                          💰 {selectedJob?.salary}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => setOpenModal(false)}
                      className="
            h-10
            w-10
            rounded-full
            bg-red-100
            dark:bg-red-900/30
            text-red-600
            dark:text-red-400
            hover:scale-110
            transition
            flex
            items-center
            justify-center
            text-xl
          "
                    >
                      ✕
                    </button>
                  </div>
                </div>
                {/* Scrollable Body */}
                <div
                  className="
        flex-1
        overflow-y-auto
        px-5
        sm:px-8
        py-6
      "
                >
                  <div className="grid lg:grid-cols-3 gap-8">
                    {/* Job Details */}
                    {/* Job Details */}

                    <div
                      className="
  lg:col-span-2
  space-y-6
"
                    >
                      {/* Quick Info */}

                      <div
                        className="
    grid
    grid-cols-2
    md:grid-cols-4
    gap-4
  "
                      >
                        <div
                          className="
      rounded-2xl
      border
      border-gray-200
      dark:border-zinc-800
      bg-gray-50
      dark:bg-zinc-800/40
      p-5
    "
                        >
                          <p className="text-xs uppercase tracking-wide text-gray-500">
                            Location
                          </p>

                          <p className="mt-2 font-semibold text-gray-900 dark:text-white">
                            {selectedJob?.location}
                          </p>
                        </div>

                        <div
                          className="
      rounded-2xl
      border
      border-gray-200
      dark:border-zinc-800
      bg-gray-50
      dark:bg-zinc-800/40
      p-5
    "
                        >
                          <p className="text-xs uppercase tracking-wide text-gray-500">
                            Job Type
                          </p>

                          <p className="mt-2 font-semibold text-gray-900 dark:text-white">
                            {selectedJob?.type}
                          </p>
                        </div>

                        <div
                          className="
      rounded-2xl
      border
      border-gray-200
      dark:border-zinc-800
      bg-gray-50
      dark:bg-zinc-800/40
      p-5
    "
                        >
                          <p className="text-xs uppercase tracking-wide text-gray-500">
                            Salary
                          </p>

                          <p className="mt-2 font-semibold text-gray-900 dark:text-white">
                            {selectedJob?.salary}
                          </p>
                        </div>

                        <div
                          className="
      rounded-2xl
      border
      border-gray-200
      dark:border-zinc-800
      bg-gray-50
      dark:bg-zinc-800/40
      p-5
    "
                        >
                          <p className="text-xs uppercase tracking-wide text-gray-500">
                            Experience
                          </p>

                          <p className="mt-2 font-semibold text-gray-900 dark:text-white">
                            {selectedJob?.experience}
                          </p>
                        </div>
                      </div>

                      {/* Description */}

                      <div
                        className="
    rounded-3xl
    border
    border-gray-200
    dark:border-zinc-800
    bg-white
    dark:bg-zinc-900
    p-6
  "
                      >
                        <h2 className="text-2xl font-bold mb-5">
                          About this role
                        </h2>

                        <p
                          className="
      leading-8
      text-gray-600
      dark:text-gray-300
      whitespace-pre-line
    "
                        >
                          {selectedJob?.description}
                        </p>
                      </div>

                      {/* Requirements */}

                      <div
                        className="
    rounded-3xl
    border
    border-gray-200
    dark:border-zinc-800
    bg-white
    dark:bg-zinc-900
    p-6
  "
                      >
                        <h2 className="text-2xl font-bold mb-5">
                          What we&apos;re looking for
                        </h2>

                        <ul
                          className="
      list-disc
      pl-6
      space-y-3
      text-gray-600
      dark:text-gray-300
    "
                        >
                          <li>{selectedJob?.experience} experience</li>
                          <li>Strong communication skills</li>
                          <li>Problem-solving mindset</li>
                          <li>Ability to collaborate with teams</li>
                          <li>Passion for continuous learning</li>
                        </ul>
                      </div>
                    </div>

                    {/* Company Details */}

                    <div
                      className="
  h-fit
  sticky
  top-6
  rounded-3xl
  border
  border-gray-200
  dark:border-zinc-800
  bg-white
  dark:bg-zinc-900
  shadow-sm
  overflow-hidden
"
                    >
                      {/* Company Header */}

                      <div
                        className="
    bg-gradient-to-r
    from-blue-600
    via-indigo-600
    to-purple-600
    h-24
  "
                      />

                      <div className="px-6 pb-6 -mt-10">
                        <div
                          className="
      h-20
      w-20
      rounded-2xl
      bg-white
      dark:bg-zinc-800
      shadow-lg
      flex
      items-center
      justify-center
      text-3xl
      font-bold
      text-blue-600
      border-4
      border-white
      dark:border-zinc-900
    "
                        >
                          {selectedJob?.users.company_profiles.company_name
                            ?.charAt(0)
                            ?.toUpperCase()}
                        </div>

                        <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
                          {selectedJob?.users.company_profiles.company_name}
                        </h2>

                        <p className="text-gray-500 dark:text-gray-400">
                          {selectedJob?.users.company_profiles.industry}
                        </p>

                        {/* Info */}

                        <div className="mt-8 space-y-5">
                          <div>
                            <p className="text-xs uppercase tracking-wider text-gray-500">
                              Recruiter
                            </p>

                            <p className="mt-1 font-medium text-gray-900 dark:text-white">
                              {selectedJob?.users.name}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs uppercase tracking-wider text-gray-500">
                              Company Size
                            </p>

                            <p className="mt-1 font-medium text-gray-900 dark:text-white">
                              {selectedJob?.users.company_profiles.company_size}{" "}
                              Employees
                            </p>
                          </div>

                          <div>
                            <p className="text-xs uppercase tracking-wider text-gray-500">
                              Website
                            </p>

                            <a
                              href={selectedJob?.users.company_profiles.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="
          mt-1
          inline-flex
          items-center
          gap-2
          text-blue-600
          dark:text-blue-400
          hover:underline
          break-all
        "
                            >
                              🌐 Visit Website
                            </a>
                          </div>
                        </div>

                        {/* About */}

                        <div
                          className="
      mt-8
      rounded-2xl
      bg-gray-50
      dark:bg-zinc-800/50
      p-5
    "
                        >
                          <h3 className="font-semibold text-lg mb-3">
                            About Company
                          </h3>

                          <p
                            className="
        text-sm
        leading-7
        text-gray-600
        dark:text-gray-300
      "
                          >
                            {selectedJob?.users.company_profiles.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Sticky Footer */}
                <div
                  className="
  sticky
  bottom-0
  z-20
  border-t
  border-gray-200
  dark:border-zinc-800
  bg-white/95
  dark:bg-zinc-900/95
  backdrop-blur-md
  px-5
  sm:px-8
  py-4
"
                >
                  <div
                    className="
    flex
    flex-col
    sm:flex-row
    items-center
    justify-between
    gap-4
  "
                  >
                    {/* Left Side */}
                    <div className="text-center sm:text-left">
                      <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                        {selectedJob?.title}
                      </h3>

                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        📍 {selectedJob?.location} • 💼 {selectedJob?.type}
                      </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex w-full sm:w-auto gap-3">
                      <button
                        onClick={() => setOpenModal(false)}
                        className="
        flex-1
        sm:flex-none
        px-6
        py-3
        rounded-xl
        border
        border-gray-300
        dark:border-zinc-700
        hover:bg-gray-100
        dark:hover:bg-zinc-800
        transition
      "
                      >
                        Close
                      </button>

                      <button
                        disabled={applying}
                        onClick={() => handleApply(selectedJob.id)}
                        className="
        flex-1
        sm:flex-none
        px-8
        py-3
        rounded-xl
        bg-gradient-to-r
        from-blue-600
        to-indigo-600
        hover:from-blue-700
        hover:to-indigo-700
        disabled:opacity-60
        disabled:cursor-not-allowed
        text-white
        font-semibold
        shadow-lg
        transition-all
        duration-300
        hover:shadow-xl
        hover:-translate-y-0.5
      "
                      >
                        {applying ? (
                          <span className="flex items-center justify-center gap-2">
                            <svg
                              className="h-5 w-5 animate-spin"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <circle
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="3"
                                opacity="0.25"
                              />
                              <path
                                d="M22 12a10 10 0 0 1-10-10"
                                stroke="currentColor"
                                strokeWidth="3"
                              />
                            </svg>
                            Applying...
                          </span>
                        ) : (
                          "🚀 Apply Now"
                        )}
                      </button>
                    </div>
                  </div>{" "}
                  {/* Footer */}
                </div>{" "}
                {/* Modal Card */}
              </div>{" "}
              {/* Overlay */}
            </div>
          )}
        </>
      )}
    </div>
  );
}
