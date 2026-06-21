"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getAllOpenJobs } from "@/services/jobs.services";
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
  bg-white
  dark:bg-zinc-900
  border
  border-gray-200
  dark:border-zinc-800
  rounded-2xl
  p-4
  "
        >
          <h2 className="font-bold mb-4 text-gray-900 dark:text-white">
            Your Jobs
          </h2>

          <div className="space-y-3">
            {jobs.map((job) => (
              <button
                key={job.id}
                onClick={() => handleJobClick(job)}
                className={`
          w-full
          text-left
          p-4
          rounded-xl
          border
          transition

          ${
            selectedJob?.id === job.id
              ? "bg-blue-600 text-white border-blue-600"
              : `
                bg-gray-50
                dark:bg-zinc-800
                border-gray-200
                dark:border-zinc-700
                hover:bg-gray-100
                dark:hover:bg-zinc-700
              `
          }
        `}
              >
                <h3 className="font-semibold">{job.title}</h3>

                <p className="text-sm opacity-80">{job.location}</p>
              </button>
            ))}
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
               bg-white
               dark:bg-zinc-900
                   border
                 border-gray-200
                 dark:border-zinc-800
                  rounded-2xl
                  p-5
               shadow-sm
            "
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div
                          className="
                  h-12
                  w-12
                  rounded-full
                  bg-blue-600
                  text-white
                  flex
                  items-center
                  justify-center
                  font-bold
                  "
                        >
                          {candidate.users.name.charAt(0)}
                        </div>

                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {candidate.users.name}
                          </h3>

                          <p className="text-sm text-gray-500">
                            {candidate.users.email}
                          </p>
                        </div>
                      </div>

                      <span
                        className="
                px-3
                py-1
                rounded-full
                bg-yellow-100
                dark:bg-yellow-900/30
                text-yellow-700
                dark:text-yellow-300
                text-sm
                "
                      >
                        {candidate.status}
                      </span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {candidate.users.candidate_profiles.skills.map(
                        (skill: string) => (
                          <span
                            key={skill}
                            className="
                    px-3
                    py-1
                    rounded-full
                    bg-blue-100
                    dark:bg-blue-900/30
                    text-blue-700
                    dark:text-blue-300
                    text-xs
                    "
                          >
                            {skill}
                          </span>
                        ),
                      )}
                    </div>

                    <div className="mt-4 flex flex-wrap gap-3">
                      <a
                        href={candidate.users.candidate_profiles.resume_url}
                        target="_blank"
                        className="
                px-4
                py-2
                rounded-lg
                bg-blue-600
                text-white
                hover:bg-blue-700
                "
                      >
                        Resume
                      </a>
                      <button
                        onClick={() => {
                          setSelectedCandidate(candidate);
                          setProfileOpen(true);
                        }}
                        className="
  px-4
  py-2
  rounded-lg
  bg-green-600
  text-white
  hover:bg-green-700
  "
                      >
                        View Profile
                      </button>
                      <button
                        onClick={() =>
                          handleStatusChange(candidate.id, "SHORTLISTED")
                        }
                        className="
      px-4 py-2
      bg-green-600
      hover:bg-green-700
      text-white
      rounded-lg
      text-sm
    "
                      >
                        Shortlist
                      </button>

                      <button
                        onClick={() =>
                          handleStatusChange(candidate.id, "REJECTED")
                        }
                        className="
      px-4 py-2
      bg-red-600
      hover:bg-red-700
      text-white
      rounded-lg
      text-sm
    "
                      >
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
      className="
      fixed inset-0
      bg-black/50
      z-40
      "
      onClick={() => setProfileOpen(false)}
    />

    {/* Drawer */}

    <div
      className="
      fixed
      top-0
      right-0
      h-full
      w-full
      md:w-[500px]
      bg-white
      dark:bg-zinc-900
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
        flex
        justify-between
        items-center
        p-6
        border-b
        border-gray-200
        dark:border-zinc-800
        "
      >
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Candidate Profile
        </h2>

        <button
          onClick={() => setProfileOpen(false)}
          className="
          text-2xl
          text-gray-500
          hover:text-red-500
          "
        >
          ✕
        </button>
      </div>

      {/* Body */}

      <div className="p-6">
        {/* Avatar */}

        <div className="flex items-center gap-4 mb-6">
          <div
            className="
            h-16
            w-16
            rounded-full
            bg-blue-600
            text-white
            flex
            items-center
            justify-center
            text-xl
            font-bold
            "
          >
            {selectedCandidate.users.name.charAt(0)}
          </div>

          <div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">
              {selectedCandidate.users.name}
            </h3>

            <p className="text-gray-500">
              {selectedCandidate.users.email}
            </p>
          </div>
        </div>

        {/* Education */}

        <div className="mb-5">
          <h4 className="font-semibold mb-2">Education</h4>

          <p>
            {
              selectedCandidate.users.candidate_profiles
                .education
            }
          </p>

          <p>
            {
              selectedCandidate.users.candidate_profiles
                .degree
            }
          </p>

          <p>
            {
              selectedCandidate.users.candidate_profiles
                .branch
            }
          </p>

          <p>
            {
              selectedCandidate.users.candidate_profiles
                .college
            }
          </p>
        </div>

        {/* Location */}

        <div className="mb-5">
          <h4 className="font-semibold mb-2">Location</h4>

          <p>
            {
              selectedCandidate.users.candidate_profiles
                .location
            }
          </p>
        </div>

        {/* Skills */}

        <div className="mb-5">
          <h4 className="font-semibold mb-2">Skills</h4>

          <div className="flex flex-wrap gap-2">
            {selectedCandidate.users.candidate_profiles.skills.map(
              (skill) => (
                <span
                  key={skill}
                  className="
                  px-3
                  py-1
                  rounded-full
                  bg-blue-100
                  dark:bg-blue-900/30
                  text-blue-700
                  dark:text-blue-300
                  text-sm
                  "
                >
                  {skill}
                </span>
              ),
            )}
          </div>
        </div>

        {/* Resume */}

        <div className="mb-5">
          <h4 className="font-semibold mb-2">Resume</h4>

          <a
            href={
              selectedCandidate.users.candidate_profiles
                .resume_url
            }
            target="_blank"
            rel="noopener noreferrer"
            className="
            inline-block
            px-4
            py-2
            rounded-lg
            bg-blue-600
            text-white
            hover:bg-blue-700
            "
          >
            View Resume
          </a>
        </div>

        {/* Portfolio */}

        <div className="mb-8">
          <h4 className="font-semibold mb-2">Portfolio</h4>

          <a
            href={
              selectedCandidate.users.candidate_profiles
                .portfolio_url
            }
            target="_blank"
            rel="noopener noreferrer"
            className="
            text-blue-600
            dark:text-blue-400
            hover:underline
            "
          >
            Visit Portfolio
          </a>
        </div>

        {/* Actions */}

        {selectedCandidate.status === "PENDING" && (
          <div className="flex gap-3">
            <button
              onClick={() =>
                handleStatusChange(
                  selectedCandidate.id,
                  "SHORTLISTED"
                )
              }
              className="
              flex-1
              bg-green-600
              hover:bg-green-700
              text-white
              py-3
              rounded-xl
              "
            >
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
              flex-1
              bg-red-600
              hover:bg-red-700
              text-white
              py-3
              rounded-xl
              "
            >
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
