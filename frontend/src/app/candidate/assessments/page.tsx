"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCandidateAssessments } from "@/services/assessment.services";

interface Assessment {
  id: string;
  title: string;
  job_title: string;
  duration_minutes: number;
  total_questions: number;
  passing_score: number;
  start_time: string;
  end_time: string;
  attempt_status: string | null;
}

export default function CandidateAssessmentsPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [assessments, setAssessments] = useState<Assessment[]>([]);

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    try {
      const res = await getCandidateAssessments();
      console.log("res:",res);

      setAssessments(res.data||[]);
    //   console.log("assesments----",assessments);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        Loading Assessments...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Assessments
          </h1>

          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Complete assessments assigned by recruiters.
          </p>
        </div>

        {/* Empty State */}

        {assessments.length === 0 && (
          <div
            className="
              bg-white
              dark:bg-zinc-900
              border
              border-gray-200
              dark:border-zinc-800
              rounded-2xl
              p-12
              text-center
            "
          >
            <h2 className="text-xl font-semibold">
              No Assessments Available
            </h2>

            <p className="text-gray-500 mt-2">
              Recruiters haven't assigned any assessments yet.
            </p>
          </div>
        )}

        {/* Cards */}

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {assessments.map((assessment) => (
            <div
              key={assessment.id}
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
              <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {assessment.title}
                </h2>

                <p className="text-gray-500 mt-1">
                  {assessment.job_title}
                </p>
              </div>

              <div className="space-y-2 text-sm">
                <p>
                  ⏱ Duration:{" "}
                  <span className="font-semibold">
                    {assessment.duration_minutes} mins
                  </span>
                </p>

                <p>
                  ❓ Questions:{" "}
                  <span className="font-semibold">
                    {assessment.total_questions}
                  </span>
                </p>

                <p>
                  🎯 Passing Score:{" "}
                  <span className="font-semibold">
                    {assessment.passing_score}
                  </span>
                </p>

                <p>
                  📅 Ends:
                  <span className="font-semibold ml-1">
                    {new Date(
                      assessment.end_time
                    ).toLocaleString()}
                  </span>
                </p>
              </div>

              {/* Status */}

              <div className="mt-4">
                <span
                  className={`
                    px-3
                    py-1
                    rounded-full
                    text-xs
                    font-semibold

                    ${
                      assessment.attempt_status === "PASSED"
                        ? "bg-green-100 text-green-700"
                        : assessment.attempt_status === "FAILED"
                        ? "bg-red-100 text-red-700"
                        : assessment.attempt_status === "SUBMITTED"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-yellow-100 text-yellow-700"
                    }
                  `}
                >
                  {assessment.attempt_status || "AVAILABLE"}
                </span>
              </div>

              {/* Action */}

              <button
                onClick={() =>
                  router.push(
                    `/candidate/assessments/${assessment.id}`
                  )
                }
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
                {assessment.attempt_status === "STARTED"
                  ? "Continue Assessment"
                  : assessment.attempt_status === "SUBMITTED"
                  ? "View Result"
                  : "View Assessment"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}