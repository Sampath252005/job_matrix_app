"use client";

import {
  useEffect,
  useState,
} from "react";

import CandidateJobCard from "@/components/jobs/CandidateJobCard";

import {
  getAllJobs,
  searchJobs,
} from "@/services/jobs.services";

interface Job {
  id: string;
  title: string;
  location: string;
  type: string;
  salary: string;
  experience: string;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>(
    [],
  );

  const [loading, setLoading] =
    useState(true);

  const [location, setLocation] =
    useState("");

  const [type, setType] =
    useState("");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res =
        await getAllJobs();

      setJobs(res.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch =
    async () => {
      try {
        const data =
          await searchJobs({
            location,
            type,
          });

        setJobs(data);
      } catch (error) {
        console.error(error);
      }
    };

  if (loading) {
    return (
      <div className="p-6">
        Loading Jobs...
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold">
          Find Your Next Job
        </h1>

        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Browse and apply for
          opportunities.
        </p>
      </div>

      {/* Filters */}

      <div
        className="
        bg-white
        dark:bg-zinc-900
        border
        border-gray-200
        dark:border-zinc-800
        rounded-2xl
        p-5
        "
      >
        <div
          className="
          grid
          grid-cols-1
          md:grid-cols-3
          gap-4
          "
        >
          <input
            value={location}
            onChange={(e) =>
              setLocation(
                e.target.value,
              )
            }
            placeholder="Location"
            className="
            border
            dark:border-zinc-700
            rounded-lg
            p-3
            bg-transparent
            "
          />

          <select
            value={type}
            onChange={(e) =>
              setType(
                e.target.value,
              )
            }
            className="
            border
            dark:border-zinc-700
            rounded-lg
            p-3
            bg-transparent
            "
          >
            <option value="">
              All Types
            </option>

            <option value="Full-time">
              Full-time
            </option>

            <option value="Part-time">
              Part-time
            </option>

            <option value="Remote">
              Remote
            </option>
          </select>

          <button
            onClick={
              handleSearch
            }
            className="
            bg-blue-600
            hover:bg-blue-700
            text-white
            rounded-lg
            px-4
            "
          >
            Search
          </button>
        </div>
      </div>

      {/* Jobs */}

      {jobs.length === 0 ? (
        <div
          className="
          text-center
          py-20
          "
        >
          <h2 className="text-2xl font-semibold">
            No Jobs Found
          </h2>

          <p className="text-gray-500 mt-2">
            Try changing your
            filters.
          </p>
        </div>
      ) : (
        <div
          className="
          grid
          grid-cols-1
          lg:grid-cols-2
          gap-6
          "
        >
          {jobs.map((job) => (
            <CandidateJobCard
              key={job.id}
              job={job}
            />
          ))}
        </div>
      )}

    </div>
  );
}