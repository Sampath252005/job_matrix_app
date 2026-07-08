"use client";

import { ArrowUpRight, Briefcase, Clock3, MapPin, Wallet } from "lucide-react";

interface Job {
  id: string;
  title: string;
  location: string;
  type: string;
  salary: string;
  experience: string;
}

interface Props {
  job: Job;
  onView: (id: string) => void;
}

export default function CandidateJobCard({ job, onView }: Props) {
  const companyInitial = job.title.charAt(0).toUpperCase();

  return (
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
      hover:shadow-[0_18px_45px_rgba(37,99,235,0.14)]
      dark:border-slate-800
      dark:bg-slate-950/80
      dark:hover:border-blue-900/70
      sm:p-6
      "
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400" />
      <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl transition group-hover:bg-blue-500/20" />

      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <div
            className="
            flex
            h-14
            w-14
            shrink-0
            items-center
            justify-center
            rounded-2xl
            bg-gradient-to-br
            from-blue-600
            to-indigo-600
            text-lg
            font-bold
            text-white
            shadow-lg
            shadow-blue-600/20
            "
          >
            {companyInitial}
          </div>

          <div className="min-w-0">
            <h2 className="line-clamp-2 text-lg font-bold text-slate-950 dark:text-white sm:text-xl">
              {job.title}
            </h2>

            <p className="mt-2 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <MapPin size={16} className="shrink-0 text-blue-500" />
              <span className="truncate">{job.location || "Location not specified"}</span>
            </p>
          </div>
        </div>

        <span
          className="
          inline-flex
          w-fit
          shrink-0
          items-center
          gap-2
          rounded-full
          bg-blue-50
          px-4
          py-2
          text-xs
          font-semibold
          text-blue-700
          ring-1
          ring-blue-100
          dark:bg-blue-950/40
          dark:text-blue-300
          dark:ring-blue-900/60
          "
        >
          <Briefcase size={14} />
          {job.type}
        </span>
      </div>

      <div className="my-5 border-t border-slate-100 dark:border-slate-800" />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div
          className="
          rounded-xl
          border
          border-slate-100
          bg-slate-50
          p-4
          dark:border-slate-800
          dark:bg-slate-900/70
          "
        >
          <p className="flex items-center gap-2 text-xs font-semibold uppercase text-slate-500">
            <Wallet size={14} className="text-emerald-500" />
            Salary
          </p>

          <p className="mt-2 text-base font-bold text-emerald-600 dark:text-emerald-400">
            {job.salary || "Not disclosed"}
          </p>
        </div>

        <div
          className="
          rounded-xl
          border
          border-slate-100
          bg-slate-50
          p-4
          dark:border-slate-800
          dark:bg-slate-900/70
          "
        >
          <p className="flex items-center gap-2 text-xs font-semibold uppercase text-slate-500">
            <Clock3 size={14} className="text-indigo-500" />
            Experience
          </p>

          <p className="mt-2 text-base font-bold text-slate-900 dark:text-white">
            {job.experience || "Open to all"}
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-sm text-slate-500 dark:text-slate-400">
          Review role details and company profile
        </span>

        <button
          onClick={() => onView(job.id)}
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
          duration-300
          hover:-translate-y-0.5
          hover:shadow-xl
          sm:w-auto
          "
        >
          View Details
          <ArrowUpRight size={17} />
        </button>
      </div>
    </article>
  );
}
