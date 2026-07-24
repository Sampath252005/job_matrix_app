"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import WarningModal from "@/components/assessments/WarningModal";

import Timer from "@/components/assessments/Timer";
import QuestionPalette from "@/components/assessments/QuestionPalette";

import {
  getAttemptById,
  saveAnswer,
  submitAssessment,
} from "@/services/assessment.services";

import { toast } from "react-hot-toast";
import { toastApiWarning } from "@/lib/toast";

export default function AttemptPage() {
  const params = useParams();
  const router = useRouter();

  const attemptId = params.attemptId as string;

  const [loading, setLoading] = useState(true);

  const [attempt, setAttempt] = useState<any>(null);

  const [questions, setQuestions] = useState<any[]>([]);

  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showFullscreenWarning, setShowFullscreenWarning] = useState(false);

  const [tabWarnings, setTabWarnings] = useState(0);

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setShowFullscreenWarning(true);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        setTabWarnings((prev) => prev + 1);
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  useEffect(() => {
    if (tabWarnings >= 3) {
      toast.error("Assessment submitted because of repeated tab switching.");

      handleSubmitAssessment();
    }
  }, [tabWarnings]);

  useEffect(() => {
    const prevent = (e: Event) => {
      e.preventDefault();
    };

    document.addEventListener("copy", prevent);
    document.addEventListener("cut", prevent);
    document.addEventListener("paste", prevent);
    document.addEventListener("contextmenu", prevent);

    return () => {
      document.removeEventListener("copy", prevent);
      document.removeEventListener("cut", prevent);
      document.removeEventListener("paste", prevent);
      document.removeEventListener("contextmenu", prevent);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      if (
        (e.ctrlKey && ["c", "v", "x", "a", "r", "p"].includes(key)) ||
        (e.ctrlKey && e.shiftKey && ["i", "j", "c"].includes(key)) ||
        key === "f12" ||
        key === "f5"
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const prevent = (e: DragEvent) => {
      e.preventDefault();
    };

    document.addEventListener("dragstart", prevent);

    return () => {
      document.removeEventListener("dragstart", prevent);
    };
  }, []);

  useEffect(() => {
    fetchAttempt();
  }, []);

  const fetchAttempt = async () => {
    try {
      const res = await getAttemptById(attemptId);

      setAttempt(res.data.attempt);

      setQuestions(res.data.questions);

      const answerMap: Record<string, string> = {};

      res.data.answers.forEach((answer: any) => {
        answerMap[answer.question_id] = answer.selected_answer;
      });

      setAnswers(answerMap);
    } catch (error) {
      console.error(error);
      toastApiWarning(error, "Failed to load assessment");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAnswer = async () => {
    const question = questions[currentQuestion];

    const selected = answers[question.id];

    if (!selected) {
      toast.error("Please select an answer");
      return;
    }

    try {
      await saveAnswer(attemptId, {
        question_id: question.id,
        selected_answer: selected as "A" | "B" | "C" | "D",
      });

      toast.success("Answer saved");
      console.log("Answer submitted");
    } catch (error: any) {
      console.error(error);

      toastApiWarning(error, "Failed to save answer");
    }
  };

  const handleSubmitAssessment = async () => {
    try {
      await submitAssessment(attemptId);

      toast.success("Assessment submitted");

      router.push("/candidate/assessments");
    } catch (error) {
      console.error(error);

      toastApiWarning(error, "Failed to submit assessment");
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading Assessment...{" "}
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <>
      <div className="bg-transparent dark:bg-black select-none">
        <div
          className="
    z-50
    bg-white
    dark:bg-zinc-900
    border-b
    dark:border-zinc-800
    px-6
    py-4
  "
        >
          <div className="max-w-7xl mx-auto flex justify-between    items-center">
            <div>
              <h1 className="font-bold text-xl">{attempt.assessments.title}</h1>

              <p className="text-sm text-gray-500">
                Questions: {attempt.assessments.total_questions}
              </p>
            </div>

            <Timer
              durationMinutes={attempt.assessments.duration_minutes}
              onExpire={handleSubmitAssessment}
            />
          </div>
        </div>

        <div
          className="
    max-w-7xl
    mx-auto
    p-6
    flex
    items-center
    gap-10
  "
        >
          <div
            className="
      bg-white
      dark:bg-zinc-900
      rounded-2xl
      border
      dark:border-zinc-800
      p-8
    "
          >
            <div className="mb-6">
              <p className="text-sm text-gray-500">
                Question {currentQuestion + 1} of {questions.length}
              </p>

              <h2 className="text-2xl font-bold mt-3">{question.question}</h2>
            </div>

            <div className="space-y-4">
              {["A", "B", "C", "D"].map((option) => (
                <label
                  key={option}
                  className="
              flex
              items-center
              gap-4
              p-4
              border
              dark:border-zinc-700
              rounded-xl
              cursor-pointer
              hover:bg-gray-50
              dark:hover:bg-zinc-800
            "
                >
                  <input
                    type="radio"
                    name="answer"
                    checked={answers[question.id] === option}
                    onChange={() =>
                      setAnswers({
                        ...answers,
                        [question.id]: option,
                      })
                    }
                  />

                  <span>{question[`option_${option.toLowerCase()}`]}</span>
                </label>
              ))}
            </div>

            <div
              className="
        mt-10
        flex
        flex-wrap
        gap-3
      "
            >
              <button
                disabled={currentQuestion === 0}
                onClick={() => setCurrentQuestion(currentQuestion - 1)}
                className="
            px-5
            py-2
            rounded-lg
            border
          "
              >
                Previous
              </button>

              <button
                onClick={handleSaveAnswer}
                className="
            px-5
            py-2
            rounded-lg
            bg-green-600
            text-white
          "
              >
                Save Answer
              </button>

              <button
                disabled={currentQuestion === questions.length - 1}
                onClick={() => setCurrentQuestion(currentQuestion + 1)}
                className="
            px-5
            py-2
            rounded-lg
            bg-blue-600
            text-white
          "
              >
                Next
              </button>

              <button
                onClick={handleSubmitAssessment}
                className="
            ml-auto
            px-5
            py-2
            rounded-lg
            bg-red-600
            text-white
          "
              >
                Submit Assessment
              </button>
            </div>
          </div>

          <div
            className="
      bg-white
      dark:bg-zinc-900
      rounded-2xl
      border
      dark:border-zinc-800
      p-6
      h-fit
    "
          >
            <h3 className="font-bold mb-4">Question Palette</h3>

            <QuestionPalette
              questions={questions}
              currentQuestion={currentQuestion}
              answers={answers}
              onSelect={(index: any) => setCurrentQuestion(index)}
            />

            <div className="mt-6 text-sm space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-600 rounded" />
                Current
              </div>

              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-600 rounded" />
                Answered
              </div>

              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-300 rounded" />
                Unanswered
              </div>
            </div>
          </div>
        </div>
      </div>
      <WarningModal
        open={showFullscreenWarning}
        onReturn={async () => {
          await document.documentElement.requestFullscreen();
          setShowFullscreenWarning(false);
        }}
        onSubmit={handleSubmitAssessment}
      />
    </>
  );
}
