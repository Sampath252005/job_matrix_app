"use client";

import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Loader2,
  Lock,
  MessageCircle,
  Send,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { toastApiWarning } from "@/lib/toast";
import {
  closeJobQuestion,
  getJobQuestions,
  getQuestionReplies,
  postJobQuestion,
  postQuestionReply,
  type JobQuestion,
  type QuestionReply,
  type QuestionVisibility,
} from "@/services/job-question.services";
import {
  QUESTION_CLOSED_EVENT,
  QUESTION_CREATED_EVENT,
  QUESTION_REPLY_EVENT,
} from "@/components/socket/QuestionRealtimeProvider";

function getStoredUserId() {
  if (typeof window === "undefined") return null;
  try {
    const user: unknown = JSON.parse(localStorage.getItem("User") ?? "null");
    return user &&
      typeof user === "object" &&
      "id" in user &&
      typeof user.id === "string"
      ? user.id
      : null;
  } catch {
    return null;
  }
}

interface Props {
  jobId: string;
  role: "candidate" | "recruiter";
}

export default function JobQuestionsPanel({ jobId, role }: Props) {
  const [questions, setQuestions] = useState<JobQuestion[]>([]);
  const [replies, setReplies] = useState<Record<string, QuestionReply[]>>({});
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingRepliesId, setLoadingRepliesId] = useState<string | null>(null);
  const [question, setQuestion] = useState("");
  const [visibility, setVisibility] =
    useState<QuestionVisibility>("PUBLIC");
  const [reply, setReply] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [closingId, setClosingId] = useState<string | null>(null);
  const [userId] = useState(getStoredUserId);
  const questionsRef = useRef<JobQuestion[]>([]);

  useEffect(() => {
    questionsRef.current = questions;
  }, [questions]);

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      try {
        const data = await getJobQuestions(jobId);
        if (active) setQuestions(data);
      } catch (error) {
        toastApiWarning(error, "Failed to load questions");
      } finally {
        if (active) setLoading(false);
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, [jobId]);

  useEffect(() => {
    const handleNewQuestion = (event: Event) => {
      const created = (event as CustomEvent<JobQuestion>).detail;
      if (!created || created.job_id !== jobId) return;

      setQuestions((current) => [
        created,
        ...current.filter((item) => item.id !== created.id),
      ]);
    };

    const handleNewReply = (event: Event) => {
      const created = (event as CustomEvent<QuestionReply>).detail;
      if (
        !created ||
        !questionsRef.current.some(
          (item) => item.id === created.question_id,
        )
      ) {
        return;
      }

      setReplies((current) => ({
        ...current,
        [created.question_id]: [
          ...(current[created.question_id] ?? []).filter(
            (item) => item.id !== created.id,
          ),
          created,
        ],
      }));

      const target = questionsRef.current.find(
        (item) => item.id === created.question_id,
      );
      if (target && created.sender_id !== target.candidate_id) {
        setQuestions((current) =>
          current.map((item) =>
            item.id === created.question_id && item.status === "OPEN"
              ? { ...item, status: "ANSWERED" }
              : item,
          ),
        );
      }
    };

    const handleClosedQuestion = (event: Event) => {
      const updated = (event as CustomEvent<JobQuestion>).detail;
      if (!updated || updated.job_id !== jobId) return;

      setQuestions((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      );
    };

    window.addEventListener(QUESTION_CREATED_EVENT, handleNewQuestion);
    window.addEventListener(QUESTION_REPLY_EVENT, handleNewReply);
    window.addEventListener(QUESTION_CLOSED_EVENT, handleClosedQuestion);

    return () => {
      window.removeEventListener(QUESTION_CREATED_EVENT, handleNewQuestion);
      window.removeEventListener(QUESTION_REPLY_EVENT, handleNewReply);
      window.removeEventListener(QUESTION_CLOSED_EVENT, handleClosedQuestion);
    };
  }, [jobId]);

  const toggleQuestion = async (questionId: string) => {
    if (expandedId === questionId) {
      setExpandedId(null);
      return;
    }

    setExpandedId(questionId);
    setReply("");
    if (replies[questionId]) return;

    setLoadingRepliesId(questionId);
    try {
      const data = await getQuestionReplies(questionId);
      setReplies((current) => ({ ...current, [questionId]: data }));
    } catch (error) {
      toastApiWarning(error, "Failed to load replies");
    } finally {
      setLoadingRepliesId(null);
    }
  };

  const submitQuestion = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!question.trim() || submitting) return;

    setSubmitting(true);
    try {
      const created = await postJobQuestion(jobId, question, visibility);
      setQuestions((current) => [
        created,
        ...current.filter((item) => item.id !== created.id),
      ]);
      setQuestion("");
      toast.success("Question posted");
    } catch (error) {
      toastApiWarning(error, "Failed to post question");
    } finally {
      setSubmitting(false);
    }
  };

  const submitReply = async (questionId: string) => {
    if (!reply.trim() || submitting) return;

    setSubmitting(true);
    try {
      const created = await postQuestionReply(questionId, reply);
      setReplies((current) => ({
        ...current,
        [questionId]: [
          ...(current[questionId] ?? []).filter(
            (item) => item.id !== created.id,
          ),
          created,
        ],
      }));
      setQuestions((current) =>
        current.map((item) =>
          item.id === questionId && role === "recruiter"
            ? { ...item, status: "ANSWERED" }
            : item,
        ),
      );
      setReply("");
      toast.success("Reply posted");
    } catch (error) {
      toastApiWarning(error, "Failed to post reply");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = async (questionId: string) => {
    setClosingId(questionId);
    try {
      const updated = await closeJobQuestion(questionId);
      setQuestions((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      );
      toast.success("Question closed");
    } catch (error) {
      toastApiWarning(error, "Failed to close question");
    } finally {
      setClosingId(null);
    }
  };

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <header className="flex items-center gap-3 border-b border-slate-200 px-5 py-4 dark:border-slate-800 sm:px-6">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
          <MessageCircle size={20} />
        </span>
        <div>
          <h2 className="font-bold text-slate-950 dark:text-white">
            Job questions & answers
          </h2>
          <p className="text-xs text-slate-500">
            {role === "candidate"
              ? "Ask the hiring team before you apply"
              : "Answer candidate questions about this role"}
          </p>
        </div>
      </header>

      {role === "candidate" && (
        <form
          onSubmit={submitQuestion}
          className="border-b border-slate-200 bg-slate-50/70 p-5 dark:border-slate-800 dark:bg-slate-900/40 sm:p-6"
        >
          <label className="text-sm font-bold">Ask a question</label>
          <textarea
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            maxLength={1000}
            rows={3}
            className="mt-2 w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-indigo-950"
            placeholder="What would you like to know about this role?"
            required
          />
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
              <Lock size={15} />
              <select
                value={visibility}
                onChange={(event) =>
                  setVisibility(event.target.value as QuestionVisibility)
                }
                className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 outline-none dark:border-slate-700 dark:bg-slate-900"
              >
                <option value="PUBLIC">Public question</option>
                <option value="PRIVATE">Private to hiring team</option>
              </select>
            </label>
            <button
              type="submit"
              disabled={submitting || !question.trim()}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 disabled:opacity-50"
            >
              {submitting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Send size={16} />
              )}
              Post question
            </button>
          </div>
        </form>
      )}

      <div className="p-4 sm:p-5">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-indigo-600" />
          </div>
        ) : questions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 px-5 py-10 text-center dark:border-slate-700">
            <HelpCircle className="mx-auto text-slate-400" />
            <p className="mt-3 font-semibold">No questions yet</p>
            <p className="mt-1 text-sm text-slate-500">
              {role === "candidate"
                ? "Be the first to ask about this opportunity."
                : "Candidate questions will appear here."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {questions.map((item) => {
              const canReply =
                item.status !== "CLOSED" &&
                (role === "recruiter" || item.candidate_id === userId);
              const isExpanded = expandedId === item.id;

              return (
                <article
                  key={item.id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-900/50"
                >
                  <button
                    type="button"
                    onClick={() => void toggleQuestion(item.id)}
                    className="flex w-full items-start gap-3 p-4 text-left sm:p-5"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-slate-500 shadow-sm dark:bg-slate-800">
                      <UserRound size={17} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold leading-6 text-slate-900 dark:text-slate-100">
                        {item.question}
                      </span>
                      <span className="mt-2 flex flex-wrap items-center gap-2 text-[11px] font-bold">
                        <span
                          className={`rounded-full px-2 py-1 ${
                            item.status === "CLOSED"
                              ? "bg-slate-200 text-slate-600 dark:bg-slate-800"
                              : item.status === "ANSWERED"
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                                : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                          }`}
                        >
                          {item.status}
                        </span>
                        {item.visibility === "PRIVATE" && (
                          <span className="inline-flex items-center gap-1 text-slate-500">
                            <Lock size={11} /> Private
                          </span>
                        )}
                        <span className="text-slate-400">
                          {new Date(item.created_at).toLocaleDateString()}
                        </span>
                      </span>
                    </span>
                    {isExpanded ? (
                      <ChevronUp size={18} className="mt-1 shrink-0" />
                    ) : (
                      <ChevronDown size={18} className="mt-1 shrink-0" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="border-t border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/60 sm:p-5">
                      {loadingRepliesId === item.id ? (
                        <Loader2
                          size={18}
                          className="mx-auto animate-spin text-indigo-600"
                        />
                      ) : (replies[item.id] ?? []).length ? (
                        <div className="space-y-3">
                          {(replies[item.id] ?? []).map((message) => {
                            const fromRecruiter =
                              message.sender_id !== item.candidate_id;
                            return (
                              <div
                                key={message.id}
                                className={`flex ${fromRecruiter ? "justify-start" : "justify-end"}`}
                              >
                                <div
                                  className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                                    fromRecruiter
                                      ? "bg-indigo-50 text-slate-700 dark:bg-indigo-950/50 dark:text-slate-200"
                                      : "bg-blue-600 text-white"
                                  }`}
                                >
                                  <p className="mb-1 flex items-center gap-1.5 text-[10px] font-bold uppercase opacity-70">
                                    {fromRecruiter && <ShieldCheck size={12} />}
                                    {fromRecruiter
                                      ? "Hiring team"
                                      : "Candidate"}
                                  </p>
                                  {message.message}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="py-2 text-center text-sm text-slate-500">
                          No replies yet.
                        </p>
                      )}

                      {canReply && (
                        <div className="mt-4 flex gap-2">
                          <input
                            value={reply}
                            onChange={(event) => setReply(event.target.value)}
                            onKeyDown={(event) => {
                              if (event.key === "Enter") {
                                event.preventDefault();
                                void submitReply(item.id);
                              }
                            }}
                            maxLength={1000}
                            className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-indigo-400 dark:border-slate-800 dark:bg-slate-900"
                            placeholder={
                              role === "recruiter"
                                ? "Reply as the hiring team…"
                                : "Continue the conversation…"
                            }
                          />
                          <button
                            type="button"
                            onClick={() => void submitReply(item.id)}
                            disabled={submitting || !reply.trim()}
                            className="rounded-xl bg-indigo-600 p-3 text-white disabled:opacity-50"
                            aria-label="Send reply"
                          >
                            {submitting ? (
                              <Loader2 size={17} className="animate-spin" />
                            ) : (
                              <Send size={17} />
                            )}
                          </button>
                        </div>
                      )}

                      {role === "recruiter" && item.status !== "CLOSED" && (
                        <button
                          type="button"
                          onClick={() => void handleClose(item.id)}
                          disabled={closingId === item.id}
                          className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-slate-500 transition hover:text-emerald-600"
                        >
                          {closingId === item.id ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <CheckCircle2 size={14} />
                          )}
                          Close conversation
                        </button>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
