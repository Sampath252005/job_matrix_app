"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import {
  ArrowUpRight,
  Briefcase,
  CalendarDays,
  Check,
  Clock3,
  MapPin,
  MessageSquare,
  Send,
  Trophy,
  UserCheck,
  Wallet,
  X,
  XCircle,
} from "lucide-react";

import {
  getApplicationDetails,
  withdrawApplication,
} from "@/services/application.services";
import { toastApiWarning } from "@/lib/toast";

type ApplicationStatus =
  | "PENDING"
  | "SHORTLISTED"
  | "INTERVIEW"
  | "HIRED"
  | "REJECTED"
  | "ACCEPTED";

interface ApplicationJob {
  id?: string;
  title: string;
  location: string;
  salary: string;
  type: string;
  description?: string;
}

interface CandidateApplication {
  id: string;
  status: ApplicationStatus;
  applied_at: string;
  jobs: ApplicationJob;
}

interface Props {
  application: CandidateApplication;
  reload: () => void;
}

type ApplicationDetails = CandidateApplication & {
  jobs: CandidateApplication["jobs"] & {
    description?: string;
  };
};

export default function CandidateApplicationCard({
  application,
  reload,
}: Props) {
  const [showDetails, setShowDetails] = useState(false);
  const [details, setDetails] = useState<ApplicationDetails | null>(null);

  const handleViewDetails = async () => {
    try {
      const data = await getApplicationDetails(application.id);

      setDetails(data.data);
      setShowDetails(true);
    } catch (error) {
      console.error(error);
      toastApiWarning(error, "Failed to load application details");
    }
  };

  const handleWithdraw = async () => {
    try {
      await withdrawApplication(application.id);

      toast.success("Application withdrawn");
      reload();
    } catch (error) {
      toastApiWarning(error, "Failed to withdraw");
    }
  };

  const statusColor: Record<CandidateApplication["status"], string> = {
    PENDING:
      "bg-amber-50 text-amber-700 ring-amber-100 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-900/60",
    ACCEPTED:
      "bg-emerald-50 text-emerald-700 ring-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-900/60",
    SHORTLISTED:
      "bg-blue-50 text-blue-700 ring-blue-100 dark:bg-blue-950/40 dark:text-blue-300 dark:ring-blue-900/60",
    INTERVIEW:
      "bg-violet-50 text-violet-700 ring-violet-100 dark:bg-violet-950/40 dark:text-violet-300 dark:ring-violet-900/60",
    HIRED:
      "bg-emerald-50 text-emerald-700 ring-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-900/60",
    REJECTED:
      "bg-red-50 text-red-700 ring-red-100 dark:bg-red-950/40 dark:text-red-300 dark:ring-red-900/60",
  };

  const appliedDate = new Date(application.applied_at).toLocaleDateString(
    undefined,
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    },
  );

  return (
    <>
      <article
        className="
        group
        relative
        overflow-hidden
        rounded-2xl
        border
        border-slate-200
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

        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-lg font-bold text-white shadow-lg shadow-blue-600/20">
              {application.jobs.title.charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0">
              <h2 className="line-clamp-2 text-lg font-bold text-slate-950 dark:text-white sm:text-xl">
                {application.jobs.title}
              </h2>

              <p className="mt-2 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <MapPin size={16} className="shrink-0 text-blue-500" />
                <span className="truncate">
                  {application.jobs.location || "Location not specified"}
                </span>
              </p>
            </div>
          </div>

          <span
            className={`
              inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ring-1
              ${statusColor[application.status]}
            `}
          >
            <Clock3 size={14} />
            {application.status}
          </span>
        </div>

        <div className="my-5 border-t border-slate-100 dark:border-slate-800" />

        <ApplicationProgress status={application.status} />

        <div className="my-5 border-t border-slate-100 dark:border-slate-800" />

        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/70">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase text-slate-500">
              <Wallet size={14} className="text-emerald-500" />
              Salary
            </p>
            <p className="mt-2 font-bold text-emerald-600 dark:text-emerald-400">
              {application.jobs.salary || "Not disclosed"}
            </p>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/70">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase text-slate-500">
              <Briefcase size={14} className="text-indigo-500" />
              Job Type
            </p>
            <p className="mt-2 font-bold text-slate-900 dark:text-white">
              {application.jobs.type || "Not specified"}
            </p>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/70">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase text-slate-500">
              <CalendarDays size={14} className="text-blue-500" />
              Applied On
            </p>
            <p className="mt-2 font-bold text-slate-900 dark:text-white">
              {appliedDate}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          <button
            onClick={handleViewDetails}
            className="
            inline-flex
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
            <ArrowUpRight size={17} />
            View Details
          </button>

          <button
            onClick={handleWithdraw}
            className="
            inline-flex
            items-center
            justify-center
            rounded-xl
            border
            border-red-200
            px-5
            py-3
            text-sm
            font-bold
            text-red-600
            transition
            hover:bg-red-50
            dark:border-red-900/70
            dark:text-red-300
            dark:hover:bg-red-950/40
            "
          >
            Withdraw
          </button>
        </div>
      </article>

      {showDetails && details && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-sm sm:p-6">
          <div className="max-h-[92vh] w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 shadow-2xl shadow-slate-950/10 dark:border-slate-800 dark:bg-slate-950 dark:shadow-2xl">
            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-200 bg-white/95 px-5 py-5 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95 sm:px-6">
              <div>
                <span
                  className={`
                    inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ring-1
                    ${statusColor[details.status]}
                  `}
                >
                  <Clock3 size={14} />
                  {details.status}
                </span>

                <h2 className="mt-3 text-2xl font-black text-slate-950 dark:text-white">
                  {details.jobs.title}
                </h2>
              </div>

              <button
                onClick={() => setShowDetails(false)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                aria-label="Close application details"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5 overflow-y-auto px-5 py-6 sm:px-6">
              <ApplicationProgress status={details.status} />

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-900/70">
                  <p className="text-xs font-semibold uppercase text-slate-500">
                    Location
                  </p>
                  <p className="mt-2 font-bold">{details.jobs.location}</p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-900/70">
                  <p className="text-xs font-semibold uppercase text-slate-500">
                    Type
                  </p>
                  <p className="mt-2 font-bold">{details.jobs.type}</p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-900/70">
                  <p className="text-xs font-semibold uppercase text-slate-500">
                    Salary
                  </p>
                  <p className="mt-2 font-bold">{details.jobs.salary}</p>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 p-5 dark:border-slate-800">
                <h3 className="text-lg font-bold text-slate-950 dark:text-white">
                  Job Description
                </h3>

                <p className="mt-3 whitespace-pre-line leading-7 text-slate-600 dark:text-slate-300">
                  {details.jobs.description || "No description available."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const progressSteps = [
  { status: "PENDING", label: "Applied", icon: Send },
  { status: "SHORTLISTED", label: "Shortlisted", icon: UserCheck },
  { status: "INTERVIEW", label: "Interview", icon: MessageSquare },
  { status: "HIRED", label: "Hired", icon: Trophy },
] as const;

function ApplicationProgress({ status }: { status: ApplicationStatus }) {
  const normalizedStatus = status === "ACCEPTED" ? "SHORTLISTED" : status;
  const currentIndex = progressSteps.findIndex(
    (step) => step.status === normalizedStatus,
  );
  const isRejected = normalizedStatus === "REJECTED";

  return (
    <section
      aria-label="Application progress"
      className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/60 sm:p-5"
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Application progress
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Follow your hiring journey
          </p>
        </div>
        {isRejected && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-2.5 py-1 text-xs font-bold text-red-700 dark:bg-red-950/50 dark:text-red-300">
            <XCircle size={14} />
            Application closed
          </span>
        )}
      </div>

      <div className="grid grid-cols-4">
        {progressSteps.map((step, index) => {
          const Icon = step.icon;
          const isComplete = !isRejected && index < currentIndex;
          const isCurrent = !isRejected && index === currentIndex;
          const isReached = isComplete || isCurrent;

          return (
            <div key={step.status} className="relative flex flex-col items-center">
              {index < progressSteps.length - 1 && (
                <div className="absolute left-1/2 top-5 h-1 w-full bg-slate-200 dark:bg-slate-700">
                  <div
                    className={`h-full origin-left bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-700 ${
                      !isRejected && index < currentIndex
                        ? "scale-x-100"
                        : "scale-x-0"
                    }`}
                  />
                </div>
              )}

              <span
                className={`relative z-10 grid h-10 w-10 place-items-center rounded-full border-2 transition-all duration-500 ${
                  isComplete
                    ? "border-blue-600 bg-blue-600 text-white"
                    : isCurrent
                      ? "animate-pulse border-blue-500 bg-white text-blue-600 shadow-lg shadow-blue-500/30 dark:bg-slate-950 dark:text-blue-300"
                      : "border-slate-200 bg-white text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-500"
                }`}
              >
                {isComplete ? <Check size={17} strokeWidth={3} /> : <Icon size={17} />}
              </span>

              <span
                className={`mt-2 text-center text-[10px] font-bold sm:text-xs ${
                  isReached
                    ? "text-slate-900 dark:text-white"
                    : "text-slate-400 dark:text-slate-500"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {isRejected && (
        <p className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-center text-xs font-medium text-red-700 dark:bg-red-950/30 dark:text-red-300">
          This application will not move to the next hiring stage.
        </p>
      )}
    </section>
  );
}
