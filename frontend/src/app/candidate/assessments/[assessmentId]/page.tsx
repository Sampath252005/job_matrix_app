"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toastApiWarning } from "@/lib/toast";

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

  const assessmentId = params.assessmentId as string;

  const [assessment, setAssessment] = useState<Assessment | null>(null);

  const [loading, setLoading] = useState(true);
  const [agreed, setAgreed] = useState(false);
  const [starting, setStarting] = useState(false);
  

  useEffect(() => {
    fetchAssessment();
  }, []);

  const fetchAssessment = async () => {
    try {
      const res = await getCandidateAssessmentById(assessmentId);

      setAssessment(res.data);
    } catch (error) {
      console.error(error);
      toastApiWarning(error, "Failed to load assessment details");
    } finally {
      setLoading(false);
    }
  };

  const handleStartAssessment = async () => {
    try {
      setStarting(true);

      const res = await startAssessment(assessmentId);

      const attemptId = res.data.id;
      await document.documentElement.requestFullscreen();

      router.push(`/candidate/attempts/${attemptId}`);
    } catch (error:any) {
      console.error(error);
      toastApiWarning(error, "Failed to start assessment");
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
    return <div className="text-center mt-20">Assessment not found</div>;
  }

  return (
   <div className="min-h-screen bg-transparent dark:bg-black">
  <div className="max-w-5xl mx-auto px-4 py-8">

{/* Header */}

<div
  className="
  bg-gradient-to-r
  from-blue-600
  to-indigo-600
  rounded-3xl
  p-8
  text-white
  mb-8
"
>
  <h1 className="text-3xl md:text-4xl font-bold">
    {assessment.title}
  </h1>

  <p className="mt-3 text-blue-100 max-w-2xl">
    {assessment.description ||
      "Complete this assessment carefully. Your performance will be evaluated by the recruiter."}
  </p>
</div>

{/* Summary Cards */}

<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

  <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-5">
    <p className="text-sm text-gray-500">
      Questions
    </p>

    <p className="text-2xl font-bold mt-1">
      {assessment.total_questions}
    </p>
  </div>

  <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-5">
    <p className="text-sm text-gray-500">
      Total Marks
    </p>

    <p className="text-2xl font-bold mt-1">
      {assessment.total_marks}
    </p>
  </div>

  <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-5">
    <p className="text-sm text-gray-500">
      Passing Score
    </p>

    <p className="text-2xl font-bold mt-1">
      {assessment.passing_score}
    </p>
  </div>

  <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-5">
    <p className="text-sm text-gray-500">
      Duration
    </p>

    <p className="text-2xl font-bold mt-1">
      {assessment.duration_minutes}m
    </p>
  </div>

</div>

{/* Instructions */}

<div
  className="
  bg-white
  dark:bg-zinc-900
  border
  border-gray-200
  dark:border-zinc-800
  rounded-3xl
  p-8
  mb-6
"
>
  <h2 className="text-2xl font-bold mb-6">
    Assessment Instructions
  </h2>

  <div className="space-y-4">

    <div className="flex gap-3">
      <span>✅</span>
      <p>Read every question carefully before answering.</p>
    </div>

    <div className="flex gap-3">
      <span>✅</span>
      <p>Click Save Answer before moving to the next question.</p>
    </div>

    <div className="flex gap-3">
      <span>✅</span>
      <p>You may revisit questions before final submission.</p>
    </div>

    <div className="flex gap-3">
      <span>✅</span>
      <p>The timer starts immediately after beginning the assessment.</p>
    </div>

    <div className="flex gap-3">
      <span>✅</span>
      <p>Ensure you have a stable internet connection.</p>
    </div>

  </div>
</div>

{/* Warning Box */}

<div
  className="
  bg-amber-50
  dark:bg-amber-950/20
  border
  border-amber-200
  dark:border-amber-900
  rounded-3xl
  p-6
  mb-8
"
>
  <h3 className="font-bold text-amber-700 dark:text-amber-400 mb-3">
    Important Rules
  </h3>

  <ul className="space-y-2 text-sm">
    <li>
      ⚠️ Do not refresh the page during the assessment.
    </li>

    <li>
      ⚠️ Tab switching may be tracked and reported.
    </li>

    <li>
      ⚠️ Once submitted, answers cannot be changed.
    </li>

    <li>
      ⚠️ If time expires, the assessment will be submitted automatically.
    </li>
  </ul>
</div>

{/* Declaration */}

<div
  className="
  bg-white
  dark:bg-zinc-900
  border
  border-gray-200
  dark:border-zinc-800
  rounded-3xl
  p-6
"
>
  <label className="flex items-start gap-3 cursor-pointer">
    <input
      type="checkbox"
      checked={agreed}
      onChange={(e) => setAgreed(e.target.checked)}
      className="mt-1 h-4 w-4"
    />

    <span>
      I have read and understood all instructions and agree to follow the assessment rules.
    </span>
  </label>

  <button
    onClick={handleStartAssessment}
    disabled={!agreed || starting}
    className="
    mt-6
    w-full
    md:w-auto
    bg-green-600
    hover:bg-green-700
    disabled:bg-gray-400
    text-white
    px-8
    py-3
    rounded-xl
    font-semibold
    transition
  "
  >
    {starting
      ? "Starting Assessment..."
      : "Start Assessment"}
  </button>
</div>
  </div>
</div>

  );
}
