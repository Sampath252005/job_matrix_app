"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getAllOpenJobs } from "@/services/jobs.services";
import {
  X,
  Mail,
  MapPin,
  GraduationCap,
  Building2,
  FileText,
  Globe,
  CheckCircle,
  XCircle,
  Eye,
  Briefcase             
} from "lucide-react";
import {
  getapplcationByJob,
  updateApplicationStatus,
} from "@/services/application.services";

interface Job {
  id: string;
  title: string;
  location: string;
  type: string;
}

interface Applicant {
  id: string;
  status: string;

  users: {
    id: string;
    name: string;
    email: string;

    candidate_profiles: {
      education: string;
      degree: string;
      branch: string;
      college: string;
      location: string;
      skills: string[];
      resume_url: string;
      portfolio_url: string;
    };
  };
}

export default function CandidatesPage() {
  const [selectedCandidate, setSelectedCandidate] = useState<Applicant | null>(
    null,
  );

  const [profileOpen, setProfileOpen] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const [applicants, setApplicants] = useState<Applicant[]>([]);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const res = await getAllOpenJobs();

      setJobs(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleStatusChange = async (applicationId: string, status: string) => {
    try {
      await updateApplicationStatus(applicationId, status);

      toast.success(`Candidate ${status}`);

      setApplicants((prev) =>
        prev.map((app) =>
          app.id === applicationId ? { ...app, status } : app,
        ),
      );
    } catch (error) {
      toast.error("Failed to update status");
      console.error(error);
    }
  };

  const handleJobClick = async (job: Job) => {
    try {
      setSelectedJob(job);

      const res = await getapplcationByJob(job.id);

      setApplicants(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 p-6">
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Jobs Sidebar */}
        <div
          className="
    lg:col-span-3
    rounded-3xl
    border
    border-gray-200
    dark:border-gray-800
    bg-white/80
    dark:bg-gray-900/80
    backdrop-blur-xl
    shadow-xl
    p-6
    h-fit
    sticky
    top-6
  "
        >
          {/* Header */}

          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Your Jobs
              </h2>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                {jobs.length} Job{jobs.length !== 1 && "s"}
              </p>
            </div>

            <div
              className="
        h-10
        w-10
        rounded-xl
        bg-gradient-to-r
        from-blue-600
        to-indigo-600
        flex
        items-center
        justify-center
        text-white
        font-bold
      "
            >
              {jobs.length}
            </div>
          </div>

          {/* Jobs List */}

          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
            {jobs.map((job) => {
              const active = selectedJob?.id === job.id;

              return (
                <button
                  key={job.id}
                  onClick={() => handleJobClick(job)}
                  className={`
            group
            relative
            w-full
            rounded-2xl
            border
            p-5
            text-left
            transition-all
            duration-300

            ${
              active
                ? `
                  bg-gradient-to-r
                  from-blue-600
                  to-indigo-600
                  border-blue-600
                  text-white
                  shadow-lg
                  scale-[1.02]
                `
                : `
                  bg-gray-50
                  dark:bg-gray-800
                  border-gray-200
                  dark:border-gray-700
                  hover:border-blue-500
                  hover:shadow-lg
                  hover:-translate-y-1
                `
            }
          `}
                >
                  {/* Active Indicator */}

                  {active && (
                    <div
                      className="
                absolute
                left-0
                top-0
                h-full
                w-1.5
                rounded-l-2xl
                bg-white
              "
                    />
                  )}

                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-base line-clamp-2">
                        {job.title}
                      </h3>

                      <p
                        className={`
                  mt-3
                  text-sm
                  ${
                    active
                      ? "text-blue-100"
                      : "text-gray-500 dark:text-gray-400"
                  }
                `}
                      >
                        📍 {job.location}
                      </p>
                    </div>

                    <div
                      className={`
                h-3
                w-3
                rounded-full
                ${active ? "bg-white" : "bg-green-500"}
              `}
                    />
                  </div>
                </button>
              );
            })}

            {jobs.length === 0 && (
              <div
                className="
          rounded-2xl
          border-2
          border-dashed
          border-gray-300
          dark:border-gray-700
          p-8
          text-center
        "
              >
                <p className="text-gray-500 dark:text-gray-400">
                  No jobs available.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-9">
          {selectedJob ? (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedJob.title}
                </h2>

                <p className="text-gray-500">Applicants for this position</p>
              </div>

              <div className="grid gap-4">
                {applicants.map((candidate) => (
<div
  key={candidate.id}
  className="
    group
    bg-white
    dark:bg-zinc-900
    border
    border-gray-200
    dark:border-zinc-800
    rounded-3xl
    p-6
    shadow-sm
    hover:shadow-xl
    hover:-translate-y-1
    transition-all
    duration-300
  "
>
  {/* Top */}
  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
    <div className="flex items-center gap-4">
      <div
        className="
          h-14
          w-14
          rounded-2xl
          bg-gradient-to-r
          from-blue-600
          to-indigo-600
          text-white
          flex
          items-center
          justify-center
          text-lg
          font-bold
          shadow-md
        "
      >
        {candidate.users.name.charAt(0)}
      </div>

      <div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          {candidate.users.name}
        </h3>

        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
          <Mail size={15} />
          {candidate.users.email}
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
          <MapPin size={15} />
          {candidate.users.candidate_profiles.location}
        </div>
      </div>
    </div>

    <span
      className={`px-4 py-2 rounded-full text-xs font-semibold ${
        candidate.status === "SHORTLISTED"
          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
          : candidate.status === "REJECTED"
          ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
      }`}
    >
      {candidate.status}
    </span>
  </div>

  {/* Education */}
  <div className="mt-6 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
    <Briefcase size={16} />

    <span>
      {candidate.users.candidate_profiles.degree}
      {" • "}
      {candidate.users.candidate_profiles.branch}
    </span>
  </div>

  {/* Skills */}
  <div className="mt-5 flex flex-wrap gap-2">
    {candidate.users.candidate_profiles.skills
      .slice(0, 6)
      .map((skill: string) => (
        <span
          key={skill}
          className="
            px-3
            py-1.5
            rounded-full
            bg-blue-50
            dark:bg-blue-500/10
            text-blue-700
            dark:text-blue-300
            text-xs
            font-medium
          "
        >
          {skill}
        </span>
      ))}

    {candidate.users.candidate_profiles.skills.length > 6 && (
      <span
        className="
          px-3
          py-1.5
          rounded-full
          bg-gray-100
          dark:bg-zinc-800
          text-xs
        "
      >
        +{candidate.users.candidate_profiles.skills.length - 6}
      </span>
    )}
  </div>

  {/* Divider */}
  <div className="my-6 border-t border-gray-200 dark:border-zinc-800" />

  {/* Actions */}
  <div className="flex flex-wrap gap-3">
    <a
      href={candidate.users.candidate_profiles.resume_url}
      target="_blank"
      rel="noopener noreferrer"
      className="
        flex
        items-center
        gap-2
        px-4
        py-2.5
        rounded-xl
        bg-blue-600
        hover:bg-blue-700
        text-white
        transition
      "
    >
      <FileText size={16} />
      Resume
    </a>

    <button
      onClick={() => {
        setSelectedCandidate(candidate);
        setProfileOpen(true);
      }}
      className="
        flex
        items-center
        gap-2
        px-4
        py-2.5
        rounded-xl
        bg-indigo-600
        hover:bg-indigo-700
        text-white
        transition
      "
    >
      <Eye size={16} />
      Profile
    </button>

    <button
      onClick={() =>
        handleStatusChange(candidate.id, "SHORTLISTED")
      }
      className="
        flex
        items-center
        gap-2
        px-4
        py-2.5
        rounded-xl
        bg-green-600
        hover:bg-green-700
        text-white
        transition
      "
    >
      <CheckCircle size={16} />
      Shortlist
    </button>

    <button
      onClick={() =>
        handleStatusChange(candidate.id, "REJECTED")
      }
      className="
        flex
        items-center
        gap-2
        px-4
        py-2.5
        rounded-xl
        bg-red-600
        hover:bg-red-700
        text-white
        transition
      "
    >
      <XCircle size={16} />
      Reject
    </button>
  </div>
</div>
                ))}
              </div>
            </>
          ) : (
            <div
              className="
      h-[500px]
      flex
      items-center
      justify-center
      bg-white
      dark:bg-zinc-900
      border
      border-gray-200
      dark:border-zinc-800
      rounded-2xl
      "
            >
              <p className="text-gray-500">Select a job to view applicants</p>
            </div>
          )}
        </div>
      </div>
      {profileOpen && selectedCandidate && (
       <>
  {/* Overlay */}
  <div
    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
    onClick={() => setProfileOpen(false)}
  />

  {/* Drawer */}
  <div
    className="
      fixed
      top-0
      right-0
      h-screen
      w-full
      md:w-[540px]
      bg-white
      dark:bg-zinc-950
      border-l
      border-gray-200
      dark:border-zinc-800
      shadow-2xl
      z-50
      overflow-y-auto
    "
  >
    {/* Header */}
    <div
      className="
        sticky
        top-0
        z-10
        flex
        items-center
        justify-between
        px-6
        py-5
        bg-white/90
        dark:bg-zinc-950/90
        backdrop-blur-md
        border-b
        border-gray-200
        dark:border-zinc-800
      "
    >
      <div>
        <h2 className="text-2xl font-bold">
          Candidate Profile
        </h2>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          Applicant Details
        </p>
      </div>

      <button
        onClick={() => setProfileOpen(false)}
        className="
          p-2
          rounded-xl
          hover:bg-gray-100
          dark:hover:bg-zinc-800
          transition
        "
      >
        <X size={22} />
      </button>
    </div>

    <div className="p-6 space-y-7">
      {/* Profile */}
      <div
        className="
          rounded-3xl
          border
          border-gray-200
          dark:border-zinc-800
          bg-gradient-to-r
          from-blue-600
          to-indigo-700
          text-white
          p-6
        "
      >
        <div className="flex items-center gap-5">
          <div
            className="
              h-20
              w-20
              rounded-full
              bg-white/20
              flex
              items-center
              justify-center
              text-3xl
              font-bold
            "
          >
            {selectedCandidate.users.name.charAt(0)}
          </div>

          <div>
            <h2 className="text-2xl font-bold">
              {selectedCandidate.users.name}
            </h2>

            <div className="flex items-center gap-2 mt-2 opacity-90">
              <Mail size={16} />
              {selectedCandidate.users.email}
            </div>
          </div>
        </div>
      </div>

      {/* Education */}
      <div className="rounded-2xl border border-gray-200 dark:border-zinc-800 p-5">
        <div className="flex items-center gap-2 mb-4">
          <GraduationCap className="text-blue-600" size={20} />
          <h3 className="font-semibold text-lg">
            Education
          </h3>
        </div>

        <div className="space-y-2 text-gray-600 dark:text-gray-300">
          <p>{selectedCandidate.users.candidate_profiles.education}</p>
          <p>{selectedCandidate.users.candidate_profiles.degree}</p>
          <p>{selectedCandidate.users.candidate_profiles.branch}</p>

          <div className="flex items-center gap-2 pt-2">
            <Building2 size={16} />
            {selectedCandidate.users.candidate_profiles.college}
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="rounded-2xl border border-gray-200 dark:border-zinc-800 p-5">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="text-red-500" size={20} />

          <h3 className="font-semibold text-lg">
            Location
          </h3>
        </div>

        <p className="text-gray-600 dark:text-gray-300">
          {selectedCandidate.users.candidate_profiles.location}
        </p>
      </div>

      {/* Skills */}
      <div className="rounded-2xl border border-gray-200 dark:border-zinc-800 p-5">
        <h3 className="font-semibold text-lg mb-4">
          Skills
        </h3>

        <div className="flex flex-wrap gap-2">
          {selectedCandidate.users.candidate_profiles.skills.map((skill) => (
            <span
              key={skill}
              className="
                px-4
                py-2
                rounded-full
                bg-blue-100
                dark:bg-blue-500/20
                text-blue-700
                dark:text-blue-300
                text-sm
                font-medium
              "
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Resume */}
      <div className="rounded-2xl border border-gray-200 dark:border-zinc-800 p-5">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="text-green-600" size={20} />
          <h3 className="font-semibold text-lg">
            Resume
          </h3>
        </div>

        <a
          href={selectedCandidate.users.candidate_profiles.resume_url}
          target="_blank"
          rel="noopener noreferrer"
          className="
            inline-flex
            items-center
            gap-2
            bg-blue-600
            hover:bg-blue-700
            text-white
            px-5
            py-3
            rounded-xl
            transition
          "
        >
          <FileText size={18} />
          View Resume
        </a>
      </div>

      {/* Portfolio */}
      <div className="rounded-2xl border border-gray-200 dark:border-zinc-800 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="text-indigo-600" size={20} />

          <h3 className="font-semibold text-lg">
            Portfolio
          </h3>
        </div>

        <a
          href={selectedCandidate.users.candidate_profiles.portfolio_url}
          target="_blank"
          rel="noopener noreferrer"
          className="
            text-blue-600
            dark:text-blue-400
            hover:underline
            break-all
          "
        >
          {selectedCandidate.users.candidate_profiles.portfolio_url}
        </a>
      </div>

      {/* Actions */}
      {selectedCandidate.status === "PENDING" && (
        <div className="grid grid-cols-2 gap-4 pt-2">
          <button
            onClick={() =>
              handleStatusChange(
                selectedCandidate.id,
                "SHORTLISTED"
              )
            }
            className="
              flex
              items-center
              justify-center
              gap-2
              py-3
              rounded-xl
              bg-green-600
              hover:bg-green-700
              text-white
              font-medium
              transition
            "
          >
            <CheckCircle size={18} />
            Shortlist
          </button>

          <button
            onClick={() =>
              handleStatusChange(
                selectedCandidate.id,
                "REJECTED"
              )
            }
            className="
              flex
              items-center
              justify-center
              gap-2
              py-3
              rounded-xl
              bg-red-600
              hover:bg-red-700
              text-white
              font-medium
              transition
            "
          >
            <XCircle size={18} />
            Reject
          </button>
        </div>
      )}
    </div>
  </div>
</>
      )}
    </div>
  );
}
