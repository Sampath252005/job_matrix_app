"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { updateApplicationStatus } from "@/services/application.services";
import { getJobAssessmentResults } from "@/services/assessment.services";
import toast from "react-hot-toast";
import { toastApiWarning } from "@/lib/toast";

interface Assessment {
  id: string;
  title: string;
  total_marks: number;
  passing_score: number;
}

interface Applications {
  id: string;
  status: "PENDING" | "SHORTLISTED" | "REJECTED" | "INTERVIEW" | "HIRED";
}

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface Attempt {
  id: string;
  score: number;
  status: string;
  submitted_at: string;
  candidate_id: string;
  users: User;
  applications: Applications;
}

export default function AssessmentResultsPage() {
  const router = useRouter();

  const params = useParams();

  const jobId = params.id as string;

  const [loading, setLoading] = useState(true);

  const [assessment, setAssessment] = useState<Assessment | null>(null);

  const [attempts, setAttempts] = useState<Attempt[]>([]);

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState<"ALL" | "PASSED" | "FAILED">("ALL");

  const [sortBy, setSortBy] = useState("HIGH_SCORE");

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const res = await getJobAssessmentResults(jobId);

      setAssessment(res.data.assessment);

      setAttempts(res.data.attempts);
    } catch (error) {
      console.error(error);
      toastApiWarning(error, "Failed to load assessment results");
    } finally {
      setLoading(false);
    }
  };
  const handleStatusUpdate = async (applicationId: string, status: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to move candidate to ${status}?`,
    );

    if (!confirmed) return;

    try {
      await updateApplicationStatus(applicationId, status);

      toast.success(`Candidate moved to ${status}`);
      fetchResults();
    } catch (error) {
      console.error(error);

      toastApiWarning(error, "Failed to update status");
    }
  };

  const passedCount = useMemo(() => {
    if (!assessment) return 0;

    return attempts.filter((item) => item.score >= assessment.passing_score)
      .length;
  }, [attempts, assessment]);

  const failedCount = attempts.length - passedCount;

  const averageScore =
    attempts.length === 0
      ? 0
      : (
          attempts.reduce((sum, item) => sum + item.score, 0) / attempts.length
        ).toFixed(1);

  const filteredAttempts = useMemo(() => {
    if (!assessment) return [];

    return [...attempts]
      .filter((item) => {
        const passed = item.score >= assessment.passing_score;

        const matchesFilter =
          filter === "ALL" ? true : filter === "PASSED" ? passed : !passed;

        const matchesSearch =
          item.users.name.toLowerCase().includes(search.toLowerCase()) ||
          item.users.email.toLowerCase().includes(search.toLowerCase());

        return matchesFilter && matchesSearch;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "HIGH_SCORE":
            return b.score - a.score;

          case "LOW_SCORE":
            return a.score - b.score;

          case "NAME":
            return a.users.name.localeCompare(b.users.name);

          case "RECENT":
            return (
              new Date(b.submitted_at).getTime() -
              new Date(a.submitted_at).getTime()
            );

          default:
            return 0;
        }
      });
  }, [attempts, assessment, filter, search, sortBy]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading Results...
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="h-screen flex items-center justify-center">
        Assessment Not Found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent dark:bg-black">
      <div className="mx-auto max-w-7xl p-3 sm:p-5 lg:p-8">
        {/* Header */}

        <div className="mb-10">
          <h1 className="text-3xl font-bold sm:text-4xl">Assessment Results</h1>

          <p className="text-gray-500 mt-2">{assessment.title}</p>
        </div>

        {/* Search + Filter */}

        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:justify-between">
          <input
            placeholder="Search candidate..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
            w-full
            lg:w-96
            px-4
            py-3
            rounded-xl
            border
            dark:border-zinc-700
            bg-white
            dark:bg-zinc-900
          "
          />

          <div className="grid gap-3 sm:grid-cols-2 lg:flex">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="
              px-4
              py-3
              rounded-xl
              border
              dark:border-zinc-700
              bg-white
              dark:bg-zinc-900
            "
            >
              <option value="ALL">All</option>

              <option value="PASSED">Passed</option>

              <option value="FAILED">Failed</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="
              px-4
              py-3
              rounded-xl
              border
              dark:border-zinc-700
              bg-white
              dark:bg-zinc-900
            "
            >
              <option value="HIGH_SCORE">Highest Score</option>

              <option value="LOW_SCORE">Lowest Score</option>

              <option value="RECENT">Recently Submitted</option>

              <option value="NAME">Name A-Z</option>
            </select>
          </div>
        </div>

        {/* Statistics */}

        <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 xl:gap-5">
          <div className="rounded-xl border bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">
            <p className="text-gray-500">Candidates</p>

            <h2 className="text-3xl font-bold mt-3">{attempts.length}</h2>
          </div>

          <div className="rounded-xl border bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">
            <p className="text-gray-500">Passed</p>

            <h2 className="text-3xl font-bold text-green-600 mt-3">
              {passedCount}
            </h2>
          </div>

          <div className="rounded-xl border bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">
            <p className="text-gray-500">Failed</p>

            <h2 className="text-3xl font-bold text-red-600 mt-3">
              {failedCount}
            </h2>
          </div>

          <div className="rounded-xl border bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">
            <p className="text-gray-500">Average Score</p>

            <h2 className="text-3xl font-bold mt-3">{averageScore}</h2>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-[920px]">
              <thead className="bg-gray-100 dark:bg-zinc-800">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">
                    Candidate
                  </th>

                  <th className="px-6 py-4 text-left font-semibold">Score</th>

                  <th className="px-6 py-4 text-left font-semibold">Result</th>

                  <th className="px-6 py-4 text-left font-semibold">
                    Submitted
                  </th>

                  <th className="px-6 py-4 text-left font-semibold">
                    Application
                  </th>

                  <th className="px-6 py-4 text-center font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredAttempts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-gray-500">
                      No candidates found.
                    </td>
                  </tr>
                ) : (
                  filteredAttempts.map((attempt) => {
                    const isPassed = attempt.score >= assessment.passing_score;

                    return (
                      <tr
                        key={attempt.id}
                        className="
                  border-t
                  border-gray-200
                  dark:border-zinc-800
                  hover:bg-gray-50
                  dark:hover:bg-zinc-800/50
                  transition
                "
                      >
                        {/* Candidate */}

                        <td className="px-6 py-5">
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {attempt.users.name}
                            </h3>

                            <p className="text-sm text-gray-500">
                              {attempt.users.email}
                            </p>

                            <p className="text-sm text-gray-400">
                              {attempt.users.phone}
                            </p>
                          </div>
                        </td>

                        {/* Score */}

                        <td className="px-6 py-5">
                          <span className="text-lg font-bold">
                            {attempt.score}

                            <span className="text-gray-400">
                              {" "}
                              / {assessment.total_marks}
                            </span>
                          </span>
                        </td>

                        {/* Result */}

                        <td className="px-6 py-5">
                          <span
                            className={`
                      inline-flex
                      items-center
                      px-3
                      py-1
                      rounded-full
                      text-xs
                      font-semibold

                      ${
                        isPassed
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      }
                    `}
                          >
                            {isPassed ? "PASSED" : "FAILED"}
                          </span>
                        </td>

                        {/* Submitted */}

                        <td className="px-6 py-5 text-sm">
                          {new Date(attempt.submitted_at).toLocaleString()}
                        </td>

                        {/* Application Status */}

                        <td className="px-6 py-5">
                          <span
                            className="
                      inline-flex
                      px-3
                      py-1
                      rounded-full
                      bg-blue-100
                      text-blue-700
                      dark:bg-blue-900/30
                      dark:text-blue-400
                      text-xs
                      font-semibold
                    "
                          >
                            {attempt.applications.status}
                          </span>
                        </td>

                        {/* Actions */}

                        <td className="px-6 py-5">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() =>
                                router.push(`/recruiter/attempts/${attempt.id}`)
                              }
                              className="
                        px-4
                        py-2
                        rounded-lg
                        bg-blue-600
                        hover:bg-blue-700
                        text-white
                        text-sm
                        transition
                      "
                            >
                              View
                            </button>
                            <button
                              onClick={() =>
                                handleStatusUpdate(
                                  attempt.applications.id,
                                  "INTERVIEW",
                                )
                              }
                              className="
                                    px-4
                                                    py-2
                                        rounded-lg
                                    bg-green-600
                                hover:bg-green-700
                                    text-white
                                        text-sm
                                            transition
                                                "
                            >
                              Interview
                            </button>

                            <button
                              onClick={() =>
                                handleStatusUpdate(
                                  attempt.applications.id ,
                                  "REJECTED",
                                )
                              }
                              className="
px-4
py-2
rounded-lg
bg-red-600
hover:bg-red-700
text-white
text-sm
transition
"
                            >
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
