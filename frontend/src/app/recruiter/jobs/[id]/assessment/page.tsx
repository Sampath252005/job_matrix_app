"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import {
  createAssessment,
  getAssessmentByJob,
} from "@/services/assessment.services";

interface Assessment {
  id: string;
  title: string;
  description?: string;
  duration_minutes: number;
  passing_score: number;
}

export default function AssessmentPage() {
  const params = useParams();
  const router=useRouter();


  const jobId = params.id as string;

  const [loading, setLoading] = useState(true);

  const [assessment, setAssessment] =
    useState<Assessment | null>(null);

  const [title, setTitle] = useState("");

  const [description, setDescription] =
    useState("");

  const [durationMinutes, setDurationMinutes] =
    useState(30);

  const [passingScore, setPassingScore] =
    useState(10);

  useEffect(() => {
    fetchAssessment();
  }, []);

  const fetchAssessment = async () => {
    try {
      const res = await getAssessmentByJob(jobId);

      if (res?.data) {
        setAssessment(res.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAssessment = async () => {
    try {
      const res = await createAssessment({
        job_id: jobId,
        title,
        description,
        duration_minutes: durationMinutes,
        passing_score: passingScore,
      });

      setAssessment(res.data);

      alert("Assessment created successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to create assessment");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-8">

      <h1 className="text-3xl font-bold mb-6">
        Assessment Management
      </h1>

      {assessment ? (
        <div
          className="
          bg-white
          dark:bg-zinc-900
          border
          border-gray-200
          dark:border-zinc-800
          rounded-xl
          p-6
          shadow
          "
        >
          <h2 className="text-2xl font-semibold">
            {assessment.title}
          </h2>

          <p className="mt-3 text-gray-600 dark:text-gray-400">
            {assessment.description}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">
                Duration
              </p>

              <p className="font-semibold">
                {assessment.duration_minutes} mins
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Passing Score
              </p>

              <p className="font-semibold">
                {assessment.passing_score}
              </p>
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <button
              className="
              px-4
              py-2
              rounded-lg
              bg-yellow-500
              text-white
              "
            >
              Edit Assessment
            </button>

            <button
              className="
              px-4
              py-2
              rounded-lg
              bg-red-600
              text-white
              "
            >
              Delete Assessment
            </button>

            <button
             onClick={()=>{router.push(`assessment/${assessment.id}/questions`)}}
              className="
              px-4
              py-2
              rounded-lg
              bg-blue-600
              text-white
              "
            >
              Manage Questions
            </button>
          </div>
        </div>
      ) : (
        <div
          className="
          bg-white
          dark:bg-zinc-900
          border
          border-gray-200
          dark:border-zinc-800
          rounded-xl
          p-6
          shadow
          "
        >
          <h2 className="text-xl font-semibold mb-4">
            Create Assessment
          </h2>

          <div className="space-y-4">
            <input
              className="
              w-full
              border
              border-gray-300
              dark:border-zinc-700
              bg-white
              dark:bg-zinc-950
              rounded-lg
              p-3
              "
              placeholder="Assessment Title"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
            />

            <textarea
              className="
              w-full
              border
              border-gray-300
              dark:border-zinc-700
              bg-white
              dark:bg-zinc-950
              rounded-lg
              p-3
              "
              placeholder="Description"
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
            />

            <input
              type="number"
              className="
              w-full
              border
              border-gray-300
              dark:border-zinc-700
              bg-white
              dark:bg-zinc-950
              rounded-lg
              p-3
              "
              placeholder="Duration"
              value={durationMinutes}
              onChange={(e) =>
                setDurationMinutes(
                  Number(e.target.value)
                )
              }
            />

            <input
              type="number"
              className="
              w-full
              border
              border-gray-300
              dark:border-zinc-700
              bg-white
              dark:bg-zinc-950
              rounded-lg
              p-3
              "
              placeholder="Passing Score"
              value={passingScore}
              onChange={(e) =>
                setPassingScore(
                  Number(e.target.value)
                )
              }
            />

            <button
              onClick={handleCreateAssessment}
              className="
              bg-blue-600
              hover:bg-blue-700
              text-white
              px-5
              py-3
              rounded-lg
              "
            >
              Create Assessment
            </button>
          </div>
        </div>
      )}
    </div>
  );
}