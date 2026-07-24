"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  FileQuestion,
  Loader2,
  RefreshCw,
  Trophy,
  XCircle,
} from "lucide-react";
import { getCandidateAssessments } from "@/services/assessment.services";
import { toastApiWarning } from "@/lib/toast";

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

interface AssessmentStatus {
  id: string;
  assessment_id: string;
  candidate_id: string;
  status: string;
}

export default function CandidateAssessmentsPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [assessmentStatus, setAssessmentStatus] = useState<
    AssessmentStatus[]
  >([]);

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    try {
      const res = await getCandidateAssessments();

      setAssessments(res.data.assessments || []);
      setAssessmentStatus(res.data.assessmentStatus || []);
    } catch (error) {
      console.error(error);
      toastApiWarning(error, "Failed to load assessments");
    } finally {
      setLoading(false);
    }
  };

  const getAttempt = (assessmentId: string) =>
    assessmentStatus.find((item) => item.assessment_id === assessmentId);

  const getDisplayStatus = (assessment: Assessment) =>
    assessment.attempt_status ||
    getAttempt(assessment.id)?.status ||
    "AVAILABLE";

  const getStatusClass = (status: string) => {
    switch (status) {
      case "PASSED":
        return "bg-emerald-50 text-emerald-700 ring-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-900/60";
      case "FAILED":
        return "bg-red-50 text-red-700 ring-red-100 dark:bg-red-950/40 dark:text-red-300 dark:ring-red-900/60";
      case "SUBMITTED":
        return "bg-blue-50 text-blue-700 ring-blue-100 dark:bg-blue-950/40 dark:text-blue-300 dark:ring-blue-900/60";
      case "STARTED":
        return "bg-amber-50 text-amber-700 ring-amber-100 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-900/60";
      default:
        return "bg-slate-100 text-slate-700 ring-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-800";
    }
  };

  const getActionLabel = (assessment: Assessment) => {
    const status = getAttempt(assessment.id)?.status || assessment.attempt_status;

    if (status === "STARTED") return "Continue Assessment";
    if (status === "SUBMITTED" || status === "PASSED" || status === "FAILED") {
      return "View Result";
    }

    return "View Assessment";
  };

  const submittedCount = assessments.filter((assessment) =>
    ["SUBMITTED", "PASSED", "FAILED"].includes(getDisplayStatus(assessment)),
  ).length;
  const availableCount = assessments.filter(
    (assessment) => getDisplayStatus(assessment) === "AVAILABLE",
  ).length;
  const passedCount = assessments.filter(
    (assessment) => getDisplayStatus(assessment) === "PASSED",
  ).length;

  if (loading) {
    return (
      <div className="flex min-h-[55vh] items-center justify-center">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/90 px-5 py-4 text-slate-600 shadow-sm shadow-slate-200/70 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:shadow-none">
          <Loader2 className="animate-spin text-blue-600" size={20} />
          Loading assessments...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent p-3 dark:bg-black sm:p-5 lg:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-slate-950 via-blue-700 to-indigo-600 p-5 text-white shadow-xl shadow-blue-600/20 dark:border-blue-950 sm:p-7">
          <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 left-10 h-32 w-64 rounded-full bg-cyan-300/10 blur-3xl" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-semibold text-blue-50 ring-1 ring-white/20">
                <ClipboardCheck size={15} />
                Candidate Assessments
              </span>

              <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
                My Assessments
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-50/90 sm:text-base">
                Review assigned tests, continue active attempts, and track your
                results from one focused assessment workspace.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-white/10 p-4 ring-1 ring-white/20">
                <p className="text-2xl font-black">{assessments.length}</p>
                <p className="text-xs font-medium text-blue-50/80">Total</p>
              </div>

              <div className="rounded-xl bg-white/10 p-4 ring-1 ring-white/20">
                <p className="text-2xl font-black">{availableCount}</p>
                <p className="text-xs font-medium text-blue-50/80">
                  Available
                </p>
              </div>

              <div className="rounded-xl bg-white/10 p-4 ring-1 ring-white/20">
                <p className="text-2xl font-black">{submittedCount}</p>
                <p className="text-xs font-medium text-blue-50/80">
                  Submitted
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm shadow-slate-200/70 dark:border-slate-800 dark:bg-slate-950/80 dark:shadow-none">
            <p className="flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
              <FileQuestion size={17} className="text-blue-600" />
              Assigned
            </p>
            <p className="mt-3 text-3xl font-black text-slate-950 dark:text-white">
              {assessments.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm shadow-slate-200/70 dark:border-slate-800 dark:bg-slate-950/80 dark:shadow-none">
            <p className="flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
              <Clock3 size={17} className="text-amber-500" />
              Ready To Start
            </p>
            <p className="mt-3 text-3xl font-black text-amber-600 dark:text-amber-300">
              {availableCount}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm shadow-slate-200/70 dark:border-slate-800 dark:bg-slate-950/80 dark:shadow-none">
            <p className="flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
              <Trophy size={17} className="text-emerald-500" />
              Passed
            </p>
            <p className="mt-3 text-3xl font-black text-emerald-600 dark:text-emerald-300">
              {passedCount}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-sm shadow-slate-200/70 dark:border-slate-800 dark:bg-slate-950/80 dark:shadow-none sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-bold text-slate-950 dark:text-white">
              Assessment Timeline
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              New assessments and result updates appear here.
            </p>
          </div>

          <button
            onClick={fetchAssessments}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        {assessments.length === 0 && (
          <div
            className="
              bg-white/80
              dark:bg-slate-950/70
              border
              border-dashed
              border-slate-300
              dark:border-slate-700
              rounded-2xl
              px-6
              py-16
              text-center
              shadow-sm
              shadow-slate-200/70
              dark:shadow-none
            "
          >
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-300">
              <FileQuestion size={24} />
            </div>

            <h2 className="text-2xl font-semibold text-slate-950 dark:text-white">
              No Assessments Available
            </h2>

            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Recruiters have not assigned any assessments yet.
            </p>
          </div>
        )}

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {assessments.map((assessment) => {
            const status = getDisplayStatus(assessment);

            return (
              <article
                key={assessment.id}
                className="
                group
                relative
                overflow-hidden
                rounded-2xl
                border
                border-slate-200/80
                bg-white/90
                p-5
                shadow-[0_12px_32px_rgba(15,23,42,0.08)]
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-blue-200
                hover:shadow-[0_18px_45px_rgba(37,99,235,0.16)]
                dark:border-slate-800
                dark:bg-slate-950/80
                dark:hover:border-blue-900/70
                sm:p-6
              "
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400" />
                <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl transition group-hover:bg-blue-500/20" />

                <div className="relative flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/20">
                      <FileQuestion size={24} />
                    </div>

                    <div className="min-w-0">
                      <h2 className="line-clamp-2 text-lg font-bold text-slate-950 dark:text-white sm:text-xl">
                        {assessment.title}
                      </h2>
                      <p className="mt-2 line-clamp-1 text-sm text-slate-500 dark:text-slate-400">
                        {assessment.job_title}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="my-5 border-t border-slate-100 dark:border-slate-800" />

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/70">
                    <p className="flex items-center gap-2 text-xs font-semibold uppercase text-slate-500">
                      <Clock3 size={14} className="text-blue-500" />
                      Duration
                    </p>
                    <p className="mt-2 font-bold text-slate-900 dark:text-white">
                      {assessment.duration_minutes} mins
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/70">
                    <p className="flex items-center gap-2 text-xs font-semibold uppercase text-slate-500">
                      <FileQuestion size={14} className="text-indigo-500" />
                      Questions
                    </p>
                    <p className="mt-2 font-bold text-slate-900 dark:text-white">
                      {assessment.total_questions}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/70">
                    <p className="flex items-center gap-2 text-xs font-semibold uppercase text-slate-500">
                      <Trophy size={14} className="text-emerald-500" />
                      Passing
                    </p>
                    <p className="mt-2 font-bold text-emerald-600 dark:text-emerald-400">
                      {assessment.passing_score}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/70">
                    <p className="flex items-center gap-2 text-xs font-semibold uppercase text-slate-500">
                      <CalendarDays size={14} className="text-amber-500" />
                      Ends
                    </p>
                    <p className="mt-2 line-clamp-1 text-sm font-bold text-slate-900 dark:text-white">
                      {new Date(assessment.end_time).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between gap-3">
                  <span
                    className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ring-1 ${getStatusClass(
                      status,
                    )}`}
                  >
                    {status === "FAILED" ? (
                      <XCircle size={14} />
                    ) : (
                      <CheckCircle2 size={14} />
                    )}
                    {status}
                  </span>

                  <span className="text-xs font-medium text-slate-400">
                    {new Date(assessment.end_time).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                <button
                  onClick={() =>
                    router.push(`/candidate/assessments/${assessment.id}`)
                  }
                  className="
                  mt-6
                  inline-flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-gradient-to-r
                  from-blue-600
                  to-indigo-600
                  px-5
                  py-3
                  text-sm
                  font-bold
                  text-white
                  shadow-lg
                  shadow-blue-600/20
                  transition-all
                  hover:-translate-y-0.5
                  hover:shadow-xl
                "
                >
                  {getActionLabel(assessment)}
                  <ArrowUpRight size={17} />
                </button>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
