"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { getAttemptDetails, } from "@/services/assessment.services";
import { updateApplicationStatus } from "@/services/application.services";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface Applications
{
    id:string;
    status: "PENDING" | "SHORTLISTED" | "REJECTED" | "INTERVIEW" | "HIRED";
}

interface Assessment {
  id: string;
  title: string;
  total_marks: number;
  passing_score: number;
}

interface Attempt {
  id: string;
  score: number;
  status: string;
  started_at: string;
  submitted_at: string;
  users: User;
  assessments: Assessment;
  applications:Applications
}

interface QuestionReview {
  selected_answer: string;
  questions: {
    id: string;
    question: string;
    option_a: string;
    option_b: string;
    option_c: string;
    option_d: string;
    correct_answer: string;
    marks: number;
  };
}

export default function RecruiterAttemptPage() {
  const params = useParams();

  const router = useRouter();
  const [updating, setUpdating] = useState(false);

  const attemptId = params.attemptId as string;

  const [loading, setLoading] = useState(true);

  const [attempt, setAttempt] = useState<Attempt | null>(null);

  const [questions, setQuestions] = useState<QuestionReview[]>([]);

  useEffect(() => {
    fetchAttempt();
  }, []);

  const fetchAttempt = async () => {
    try {
      const res = await getAttemptDetails(attemptId);

      setAttempt(res.data.attempt);

      setQuestions(res.data.questions);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpdateStatus = async (status: "INTERVIEW" | "REJECTED") => {
    const confirmed = window.confirm(
      `Are you sure you want to mark this candidate as ${status}?`,
    );

    if (!confirmed) return;

    try {
      setUpdating(true);

    await updateApplicationStatus(attempt!.applications.id, status);

      alert(`Candidate moved to ${status}`);

      router.back();
    } catch (error) {
      console.error(error);

      alert("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading Attempt...
      </div>
    );
  }

  if (!attempt) {
    return (
      <div className="h-screen flex items-center justify-center">
        Attempt Not Found
      </div>
    );
  }

  const passed = attempt.score >= attempt.assessments.passing_score;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <div className="max-w-7xl mx-auto p-8">
        {/* Back */}

        <button
          onClick={() => router.back()}
          className="mb-8 text-blue-600 font-semibold"
        >
          ← Back
        </button>

        {/* Heading */}

        <h1 className="text-4xl font-bold mb-8">Candidate Assessment Review</h1>

        {/* Top Cards */}

        <div className="grid lg:grid-cols-2 gap-6 mb-10">
          {/* Candidate */}

          <div
            className="
            bg-white
            dark:bg-zinc-900
            rounded-2xl
            border
            dark:border-zinc-800
            p-6
          "
          >
            <h2 className="text-2xl font-bold mb-6">Candidate</h2>

            <div className="space-y-4">
              <div>
                <p className="text-gray-500">Name</p>

                <p className="font-semibold">{attempt.users.name}</p>
              </div>

              <div>
                <p className="text-gray-500">Email</p>

                <p className="font-semibold">{attempt.users.email}</p>
              </div>

              <div>
                <p className="text-gray-500">Phone</p>

                <p className="font-semibold">{attempt.users.phone}</p>
              </div>
            </div>
          </div>

          {/* Assessment */}

          <div
            className="
            bg-white
            dark:bg-zinc-900
            rounded-2xl
            border
            dark:border-zinc-800
            p-6
          "
          >
            <h2 className="text-2xl font-bold mb-6">Assessment</h2>

            <div className="space-y-4">
              <div>
                <p className="text-gray-500">Assessment</p>

                <p className="font-semibold">{attempt.assessments.title}</p>
              </div>

              <div>
                <p className="text-gray-500">Score</p>

                <p className="text-3xl font-bold">
                  {attempt.score}

                  <span className="text-gray-400">
                    {" "}
                    / {attempt.assessments.total_marks}
                  </span>
                </p>
              </div>

              <div>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    passed
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  }`}
                >
                  {passed ? "PASSED" : "FAILED"}
                </span>
              </div>

              <div>
                <p className="text-gray-500">Started</p>

                <p>{new Date(attempt.started_at).toLocaleString()}</p>
              </div>

              <div>
                <p className="text-gray-500">Submitted</p>

                <p>{new Date(attempt.submitted_at).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Questions */}

        <div className="space-y-8">
          <h2 className="text-3xl font-bold">Question Review</h2>

          {questions.map((item, index) => {
            const question = item.questions;

            const isCorrect = item.selected_answer === question.correct_answer;

            const awardedMarks = isCorrect ? question.marks : 0;

            return (
              <div
                key={question.id}
                className="
          bg-white
          dark:bg-zinc-900
          border
          border-gray-200
          dark:border-zinc-800
          rounded-2xl
          shadow-sm
          p-8
        "
              >
                {/* Question */}

                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-xl font-bold">Question {index + 1}</h3>

                    <p className="mt-3 text-lg">{question.question}</p>
                  </div>

                  <div>
                    <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-2 rounded-lg font-semibold">
                      {question.marks} Mark
                    </span>
                  </div>
                </div>

                {/* Options */}

                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    {
                      key: "A",
                      value: question.option_a,
                    },

                    {
                      key: "B",
                      value: question.option_b,
                    },

                    {
                      key: "C",
                      value: question.option_c,
                    },

                    {
                      key: "D",
                      value: question.option_d,
                    },
                  ].map((option) => {
                    let classes = "border rounded-xl p-4";

                    if (option.key === question.correct_answer) {
                      classes +=
                        " border-green-500 bg-green-50 dark:bg-green-900/20";
                    }

                    if (option.key === item.selected_answer && !isCorrect) {
                      classes += " border-red-500 bg-red-50 dark:bg-red-900/20";
                    }

                    return (
                      <div key={option.key} className={classes}>
                        <p className="font-semibold">
                          {option.key}. {option.value}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Result */}

                <div className="mt-8 grid md:grid-cols-3 gap-6">
                  {/* Candidate */}

                  <div
                    className="
            rounded-xl
            border
            dark:border-zinc-700
            p-5
          "
                  >
                    <p className="text-gray-500">Candidate Answer</p>

                    <p
                      className={`mt-2 text-lg font-bold ${
                        isCorrect ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {isCorrect ? "✅" : "❌"} {item.selected_answer}
                    </p>
                  </div>

                  {/* Correct */}

                  <div
                    className="
            rounded-xl
            border
            dark:border-zinc-700
            p-5
          "
                  >
                    <p className="text-gray-500">Correct Answer</p>

                    <p className="mt-2 text-lg font-bold text-green-600">
                      ✅ {question.correct_answer}
                    </p>
                  </div>

                  {/* Marks */}

                  <div
                    className="
            rounded-xl
            border
            dark:border-zinc-700
            p-5
          "
                  >
                    <p className="text-gray-500">Marks Awarded</p>

                    <p className="mt-2 text-lg font-bold">
                      {awardedMarks}

                      {" / "}

                      {question.marks}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sticky Bottom Action Bar */}

        <div
          className="
    sticky
    bottom-0
    mt-10
    bg-white
    dark:bg-zinc-900
    border-t
    border-gray-200
    dark:border-zinc-800
    p-6
    rounded-t-2xl
    shadow-lg
  "
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h3 className="text-xl font-bold">Recruiter Decision</h3>

              <p className="text-gray-500 mt-1">
                Review the candidate's answers before taking the next action.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleUpdateStatus("REJECTED")}
                disabled={updating}
                className="
          px-6
          py-3
          rounded-xl
          bg-red-600
          hover:bg-red-700
          text-white
          font-semibold
          disabled:opacity-50
        "
              >
                Reject
              </button>

              <button
                onClick={() => handleUpdateStatus("INTERVIEW")}
                disabled={updating}
                className="
          px-6
          py-3
          rounded-xl
          bg-green-600
          hover:bg-green-700
          text-white
          font-semibold
          disabled:opacity-50
        "
              >
                Move To Interview
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
