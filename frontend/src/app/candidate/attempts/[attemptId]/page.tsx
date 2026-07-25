"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Save,
  Send,
  ShieldCheck,
} from "lucide-react";
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

interface Attempt {
  id: string;
  status: string;
  assessments: {
    id: string;
    title: string;
    duration_minutes: number;
    total_questions: number;
    total_marks: number;
  };
}

interface Question {
  id: string;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  marks: number;
}

interface SavedAnswer {
  question_id: string;
  selected_answer: string;
}

export default function AttemptPage() {
  const params = useParams();
  const router = useRouter();

  const attemptId = params.attemptId as string;

  const [loading, setLoading] = useState(true);

  const [attempt, setAttempt] = useState<Attempt | null>(null);

  const [questions, setQuestions] = useState<Question[]>([]);

  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showFullscreenWarning, setShowFullscreenWarning] = useState(false);

  const [tabWarnings, setTabWarnings] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const submittingRef = useRef(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && !submittingRef.current) {
        setShowFullscreenWarning(true);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden && !submittingRef.current) {
        setTabWarnings((previous) => {
          const next = previous + 1;
          if (next < 3) {
            toast.error(
              `Tab switch detected. ${3 - next} warning${3 - next === 1 ? "" : "s"} remaining.`,
            );
          }
          return next;
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  useEffect(() => {
    if (tabWarnings >= 3) {
      toast.error("Assessment submitted because of repeated tab switching.");

      void handleSubmitAssessment();
    }
  }, [tabWarnings]);

  useEffect(() => {
    const warnBeforeLeaving = (event: BeforeUnloadEvent) => {
      if (submittingRef.current) return;
      event.preventDefault();
    };

    window.addEventListener("beforeunload", warnBeforeLeaving);
    return () => window.removeEventListener("beforeunload", warnBeforeLeaving);
  }, []);

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
        ((e.ctrlKey || e.metaKey) &&
          ["c", "v", "x", "a", "r", "p", "s", "u"].includes(key)) ||
        ((e.ctrlKey || e.metaKey) &&
          e.shiftKey &&
          ["i", "j", "c"].includes(key)) ||
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

      res.data.answers.forEach((answer: SavedAnswer) => {
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
    } catch (error: unknown) {
      console.error(error);

      toastApiWarning(error, "Failed to save answer");
    }
  };

  const handleSubmitAssessment = async () => {
    if (submittingRef.current) return;
    submittingRef.current = true;
    setSubmitting(true);

    try {
      await submitAssessment(attemptId);

      sessionStorage.setItem("assessment-submitted", "true");
      toast.success("Exam submitted successfully");

      if (document.fullscreenElement) {
        await document.exitFullscreen().catch(() => undefined);
      }
      router.push("/candidate/assessments");
    } catch (error) {
      console.error(error);

      toastApiWarning(error, "Failed to submit assessment");
      submittingRef.current = false;
      setSubmitting(false);
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

  if (!attempt || !question) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-center text-white">
        <div>
          <AlertTriangle className="mx-auto mb-4 text-amber-400" size={36} />
          <h1 className="text-xl font-bold">Assessment is unavailable</h1>
          <p className="mt-2 text-sm text-slate-400">
            No questions were found for this assessment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen select-none bg-slate-950 text-slate-100">
        <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/95 px-4 py-3 backdrop-blur-xl sm:px-6">
          <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/25">
                <ShieldCheck size={21} />
              </span>
              <div className="min-w-0">
                <h1 className="truncate font-bold text-white sm:text-lg">
                  {attempt.assessments.title}
                </h1>
                <p className="text-xs text-slate-400">
                  Secure assessment session
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <div
                className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold ${
                  tabWarnings > 0
                    ? "border-amber-500/40 bg-amber-500/10 text-amber-300"
                    : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                }`}
              >
                {tabWarnings > 0 ? (
                  <AlertTriangle size={15} />
                ) : (
                  <CheckCircle2 size={15} />
                )}
                Tab switches: {tabWarnings}/3
              </div>
              <div className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-bold text-rose-300">
                <Timer
                  durationMinutes={attempt.assessments.duration_minutes}
                  onExpire={handleSubmitAssessment}
                />
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto grid max-w-[1500px] gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          <section className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl shadow-black/20">
            <div className="border-b border-slate-800 px-5 py-5 sm:px-8">
              <div className="mb-3 flex items-center justify-between gap-4 text-sm">
                <span className="font-semibold text-blue-400">
                  Question {currentQuestion + 1} of {questions.length}
                </span>
                <span className="text-slate-400">
                  {Object.keys(answers).length} answered
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all"
                  style={{
                    width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            <div className="p-5 sm:p-8">
              <h2 className="text-xl font-bold leading-relaxed text-white sm:text-2xl">
                {question.question}
              </h2>

              <div className="mt-7 grid gap-3">
                {["A", "B", "C", "D"].map((option) => {
                  const selected = answers[question.id] === option;
                  return (
                    <label
                      key={option}
                      className={`flex cursor-pointer items-center gap-4 rounded-2xl border p-4 transition sm:p-5 ${
                        selected
                          ? "border-blue-500 bg-blue-500/10 ring-2 ring-blue-500/20"
                          : "border-slate-700 bg-slate-950/40 hover:border-slate-600 hover:bg-slate-800/70"
                      }`}
                    >
                      <input
                        type="radio"
                        name="answer"
                        className="sr-only"
                        checked={selected}
                        onChange={() =>
                          setAnswers((current) => ({
                            ...current,
                            [question.id]: option,
                          }))
                        }
                      />
                      <span
                        className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl font-bold ${
                          selected
                            ? "bg-blue-600 text-white"
                            : "bg-slate-800 text-slate-300"
                        }`}
                      >
                        {option}
                      </span>
                      <span className="leading-6 text-slate-200">
                        {
                          question[
                            `option_${option.toLowerCase()}` as
                              | "option_a"
                              | "option_b"
                              | "option_c"
                              | "option_d"
                          ]
                        }
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            <footer className="flex flex-wrap gap-3 border-t border-slate-800 bg-slate-950/30 p-4 sm:px-8 sm:py-5">
              <button
                disabled={currentQuestion === 0}
                onClick={() => setCurrentQuestion((current) => current - 1)}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-2.5 font-semibold text-slate-200 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={18} />
                Previous
              </button>
              <button
                onClick={handleSaveAnswer}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 font-semibold text-white transition hover:bg-emerald-500"
              >
                <Save size={17} />
                Save
              </button>
              <button
                disabled={currentQuestion === questions.length - 1}
                onClick={() => setCurrentQuestion((current) => current + 1)}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ChevronRight size={18} />
              </button>
              <button
                onClick={() => void handleSubmitAssessment()}
                disabled={submitting}
                className="ml-auto inline-flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 font-semibold text-white transition hover:bg-rose-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <Send size={18} />
                )}
                {submitting ? "Submitting..." : "Submit assessment"}
              </button>
            </footer>
          </section>

          <aside className="h-fit rounded-3xl border border-slate-800 bg-slate-900 p-5 lg:sticky lg:top-24">
            <h3 className="font-bold text-white">Question navigator</h3>
            <p className="mt-1 text-xs text-slate-400">
              Select a number to review a question.
            </p>
            <div className="mt-5">
              <QuestionPalette
                questions={questions}
                currentQuestion={currentQuestion}
                answers={answers}
                onSelect={(index: number) => setCurrentQuestion(index)}
              />
            </div>
            <div className="mt-6 grid gap-2 border-t border-slate-800 pt-5 text-xs text-slate-400">
              <span className="flex items-center gap-2">
                <i className="h-3 w-3 rounded bg-blue-600" /> Current
              </span>
              <span className="flex items-center gap-2">
                <i className="h-3 w-3 rounded bg-green-600" /> Answered
              </span>
              <span className="flex items-center gap-2">
                <i className="h-3 w-3 rounded bg-slate-700" /> Unanswered
              </span>
            </div>
            <div className="mt-5 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-xs leading-5 text-amber-200">
              Leaving fullscreen or switching tabs is monitored. Three tab
              switches will submit the assessment automatically.
            </div>
          </aside>
        </main>
      </div>
      <WarningModal
        open={showFullscreenWarning}
        onReturn={async () => {
          try {
            await document.documentElement.requestFullscreen();
            setShowFullscreenWarning(false);
          } catch {
            toast.error("Fullscreen permission is required to continue.");
          }
        }}
        onSubmit={handleSubmitAssessment}
      />
    </>
  );
}
