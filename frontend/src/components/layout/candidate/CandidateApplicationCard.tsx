"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import {
  ArrowUpRight,
  Briefcase,
  CalendarDays,
  Clock3,
  MapPin,
  Wallet,
  X,
} from "lucide-react";

import {
  getApplicationDetails,
  withdrawApplication,
} from "@/services/application.services";

type ApplicationStatus = "PENDING" | "ACCEPTED" | "REJECTED";

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
    }
  };

  const handleWithdraw = async () => {
    try {
      await withdrawApplication(application.id);

      toast.success("Application withdrawn");
      reload();
    } catch {
      toast.error("Failed to withdraw");
    }
  };

  const statusColor: Record<CandidateApplication["status"], string> = {
    PENDING:
      "bg-amber-50 text-amber-700 ring-amber-100 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-900/60",
    ACCEPTED:
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
        shadow-[0_1px_2px_rgba(15,23,42,0.06)]
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-blue-200
        hover:shadow-[0_18px_45px_rgba(37,99,235,0.12)]
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
          <div className="max-h-[92vh] w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950">
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
