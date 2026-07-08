"use client";

import { useEffect, useState } from "react";
import {
  ClipboardList,
  Clock3,
  FileSearch,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { getMyApplications } from "@/services/application.services";
import CandidateApplicationCard from "@/components/layout/candidate/CandidateApplicationCard";

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

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<CandidateApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const data = await getMyApplications();
      setApplications(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex min-h-[55vh] items-center justify-center">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
          <Loader2 className="animate-spin text-blue-600" size={20} />
          Loading applications...
        </div>
      </div>
    );

  const pendingCount = applications.filter(
    (application) => application.status === "PENDING",
  ).length;
  const acceptedCount = applications.filter(
    (application) => application.status === "ACCEPTED",
  ).length;

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-slate-950 via-blue-700 to-indigo-600 p-5 text-white shadow-xl shadow-blue-600/20 dark:border-blue-950 sm:p-7">
        <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 left-10 h-32 w-64 rounded-full bg-cyan-300/10 blur-3xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-semibold text-blue-50 ring-1 ring-white/20">
              <ClipboardList size={15} />
              Candidate Applications
            </span>

            <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
              My Applications
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-50/90 sm:text-base">
              Track every role you applied for, review job details, and manage
              applications from one clean workspace.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-white/10 p-4 ring-1 ring-white/20">
              <p className="text-2xl font-black">{applications.length}</p>
              <p className="text-xs font-medium text-blue-50/80">Total</p>
            </div>
            <div className="rounded-xl bg-white/10 p-4 ring-1 ring-white/20">
              <p className="text-2xl font-black">{pendingCount}</p>
              <p className="text-xs font-medium text-blue-50/80">Pending</p>
            </div>
            <div className="rounded-xl bg-white/10 p-4 ring-1 ring-white/20">
              <p className="text-2xl font-black">{acceptedCount}</p>
              <p className="text-xs font-medium text-blue-50/80">Accepted</p>
            </div>
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-950/80 dark:shadow-none sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-300">
            <Clock3 size={20} />
          </div>
          <div>
            <h2 className="font-bold text-slate-950 dark:text-white">
              Application Timeline
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Newest applications and status updates appear here.
            </p>
          </div>
        </div>

        <button
          onClick={loadApplications}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {applications.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-950/60">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/50">
            <FileSearch size={24} />
          </div>

          <h2 className="text-2xl font-semibold text-slate-950 dark:text-white">
            No applications found
          </h2>

          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Jobs you apply to will show up here with their latest status.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:gap-5">
          {applications.map((application) => (
            <CandidateApplicationCard
              key={application.id}
              application={application}
              reload={loadApplications}
            />
          ))}
        </div>
      )}
    </div>
  );
}
