"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  getCandidateAssessmentById,
  startAssessment,
} from "@/services/assessment.services";

interface Assessment {
  id: string;
  title: string;
  description: string;
  duration_minutes: number;
  total_questions: number;
  total_marks: number;
  passing_score: number;
  start_time?: string;
  end_time?: string;
  status: string;
}

export default function AssessmentDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const assessmentId =
    params.assessmentId as string;

  const [assessment, setAssessment] =
    useState<Assessment | null>(null);

  const [loading, setLoading] = useState(true);

  const [starting, setStarting] =
    useState(false);

  useEffect(() => {
    fetchAssessment();
  }, []);

  const fetchAssessment = async () => {
    try {
      const res =
        await getCandidateAssessmentById(
          assessmentId
        );

      setAssessment(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartAssessment = async () => {
    try {
      setStarting(true);

      const res = await startAssessment(
        assessmentId
      );

      const attemptId = res.data.id;

      router.push(
        `/candidate/attempts/${attemptId}`
      );
    } catch (error) {
      console.error(error);
      alert("Failed to start assessment");
    } finally {
      setStarting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading Assessment...
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="text-center mt-20">
        Assessment not found
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div
        className="
        bg-white
        dark:bg-zinc-900
        border
        border-gray-200
        dark:border-zinc-800
        rounded-2xl
        p-8
        shadow
      "
      >
        <h1 className="text-3xl font-bold mb-4">
          {assessment.title}
        </h1>

        <p className="text-gray-600 dark:text-gray-400 mb-8">
          {assessment.description}
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-500">
              Duration
            </p>

            <p className="font-semibold text-lg">
              {assessment.duration_minutes} Minutes
            </p>
          </div>

          <div>
            <p className="text-gray-500">
              Questions
            </p>

            <p className="font-semibold text-lg">
              {assessment.total_questions}
            </p>
          </div>

          <div>
            <p className="text-gray-500">
              Total Marks
            </p>

            <p className="font-semibold text-lg">
              {assessment.total_marks}
            </p>
          </div>

          <div>
            <p className="text-gray-500">
              Passing Score
            </p>

            <p className="font-semibold text-lg">
              {assessment.passing_score}
            </p>
          </div>

          <div>
            <p className="text-gray-500">
              Start Time
            </p>

            <p className="font-semibold">
              {assessment.start_time
                ? new Date(
                    assessment.start_time
                  ).toLocaleString()
                : "Not Set"}
            </p>
          </div>

          <div>
            <p className="text-gray-500">
              End Time
            </p>

            <p className="font-semibold">
              {assessment.end_time
                ? new Date(
                    assessment.end_time
                  ).toLocaleString()
                : "Not Set"}
            </p>
          </div>
        </div>

        <div className="mt-10">
          <button
            onClick={handleStartAssessment}
            disabled={starting}
            className="
              bg-blue-600
              hover:bg-blue-700
              text-white
              px-6
              py-3
              rounded-lg
              font-medium
            "
          >
            {starting
              ? "Starting..."
              : "Start Assessment"}
          </button>
        </div>
      </div>
    </div>
  );
}