"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  ClipboardCheck,
  FileQuestion,
  Loader2,
  MapPin,
  Plus,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Timer,
} from "lucide-react";
import { getMyJobs } from "@/services/jobs.services";
import { getAssessmentByJob } from "@/services/assessment.services";
import { toastApiWarning } from "@/lib/toast";

type JobStatus = "OPEN" | "CLOSED";
type StatusFilter = "ALL" | JobStatus;

interface Job {
  id: string;
  title: string;
  location: string;
  type: string;
  status: JobStatus;
  hasAssessment: boolean;
}

const statusFilters: Array<{ value: StatusFilter; label: string }> = [
  { value: "ALL", label: "All jobs" },
  { value: "OPEN", label: "Open" },
  { value: "CLOSED", label: "Closed" },
];

function isValidJob(value: unknown): value is Job {
  if (!value || typeof value !== "object") return false;
  const job = value as Record<string, unknown>;
  return (
    typeof job.id === "string" &&
    job.id.length > 0 &&
    typeof job.title === "string" &&
    job.title.trim().length > 0
  );
}

export default function AssessmentsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setLoadFailed(false);
    try {
      const response: unknown = await getMyJobs();
      const rawJobs = Array.isArray(response) ? response : [];
      const validJobs = rawJobs.filter(isValidJob);
      const jobsWithAssessmentStatus = await Promise.all(
        validJobs.map(async (job) => {
          const assessmentResponse = await getAssessmentByJob(job.id);

          return {
            ...job,
            location:
              typeof job.location === "string" && job.location.trim()
                ? job.location
                : "Location not specified",
            type:
              typeof job.type === "string" && job.type.trim()
                ? job.type
                : "Type not specified",
            status:
              String(job.status).toUpperCase() === "OPEN"
                ? ("OPEN" as const)
                : ("CLOSED" as const),
            hasAssessment: Boolean(assessmentResponse?.data),
          };
        }),
      );
      setJobs(jobsWithAssessmentStatus);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
      setJobs([]);
      setLoadFailed(true);
      toastApiWarning(error, "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchJobs();
  }, [fetchJobs]);

  const counts = useMemo(
    () => ({
      all: jobs.length,
      open: jobs.filter(({ status }) => status === "OPEN").length,
      closed: jobs.filter(({ status }) => status === "CLOSED").length,
    }),
    [jobs],
  );

  const filteredJobs = useMemo(() => {
    const query = search.trim().toLowerCase();
    return jobs.filter((job) => {
      const matchesStatus =
        statusFilter === "ALL" || job.status === statusFilter;
      const matchesSearch =
        !query ||
        job.title.toLowerCase().includes(query) ||
        job.location.toLowerCase().includes(query) ||
        job.type.toLowerCase().includes(query);
      return matchesStatus && matchesSearch;
    });
  }, [jobs, search, statusFilter]);

  const openAssessment = (jobId: string) => {
    if (!jobId.trim()) return;
    router.push(`/recruiter/jobs/${encodeURIComponent(jobId)}/assessment`);
  };

  const openResults = (jobId: string) => {
    if (!jobId.trim()) return;
    router.push(
      `/recruiter/jobs/${encodeURIComponent(jobId)}/assessment/results`,
    );
  };

  return (
    <div className="mx-auto min-h-full max-w-[1600px]">
      <header className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-sm font-semibold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400">
            Evaluation
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
            Assessments
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-500 dark:text-slate-400 sm:text-base">
            Create job assessments, manage questions, and review candidate
            performance.
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.push("/recruiter/jobs")}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 sm:w-auto"
        >
          <Plus size={18} />
          Create a job
        </button>
      </header>

      <section
        aria-label="Assessment overview"
        className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
      >
        <StatCard
          icon={<BriefcaseBusiness size={20} />}
          label="Total jobs"
          value={counts.all}
          tone="blue"
        />
        <StatCard
          icon={<ClipboardCheck size={20} />}
          label="Open jobs"
          value={counts.open}
          tone="emerald"
        />
        <StatCard
          icon={<Timer size={20} />}
          label="Closed jobs"
          value={counts.closed}
          tone="amber"
        />
        <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-indigo-600 to-violet-600 p-5 text-white shadow-sm dark:border-slate-800 sm:col-span-2 xl:col-span-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-indigo-100">
                Assessment center
              </p>
              <p className="mt-2 text-sm leading-5 text-white/90">
                Build tests and track results in one place.
              </p>
            </div>
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/15">
              <FileQuestion size={21} />
            </span>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
        <div className="flex flex-col gap-4 border-b border-slate-200/80 p-4 dark:border-slate-800 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-bold text-slate-900 dark:text-white">
              Jobs and assessments
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Choose a job to configure its assessment.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
            <div className="relative min-w-0 flex-1 lg:w-72">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={17}
              />
              <input
                type="search"
                value={search}
                maxLength={80}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search jobs..."
                aria-label="Search jobs"
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/15 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-blue-500 dark:focus:bg-slate-900"
              />
            </div>
            <div className="relative">
              <SlidersHorizontal
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />
              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value as StatusFilter)
                }
                aria-label="Filter jobs by status"
                className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-10 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 sm:w-36"
              >
                {statusFilters.map((filter) => (
                  <option key={filter.value} value={filter.value}>
                    {filter.label}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                ▼
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-5">
          {loading ? (
            <div className="flex min-h-80 items-center justify-center">
              <div className="flex items-center gap-3 text-sm font-medium text-slate-500 dark:text-slate-400">
                <Loader2 className="animate-spin text-blue-600" size={22} />
                Loading jobs
              </div>
            </div>
          ) : loadFailed ? (
            <EmptyState
              icon={<RefreshCw size={25} />}
              title="Unable to load jobs"
              description="We couldn't retrieve your jobs. Check your connection and try again."
              actionLabel="Try again"
              onAction={() => void fetchJobs()}
            />
          ) : filteredJobs.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
              {filteredJobs.map((job) => (
                <article
                  key={job.id}
                  className="group flex min-w-0 flex-col rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-950/40 dark:hover:border-blue-900 sm:p-5"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-300">
                      <BriefcaseBusiness size={20} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3
                          className="line-clamp-2 font-bold text-slate-950 dark:text-white"
                          title={job.title}
                        >
                          {job.title}
                        </h3>
                        <span
                          className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                            job.status === "OPEN"
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
                              : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                          }`}
                        >
                          {job.status}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-400">
                        Hiring position
                      </p>
                    </div>
                  </div>

                  <div className="my-4 border-t border-slate-100 dark:border-slate-800" />

                  <dl className="grid gap-3 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <MapPin
                        className="shrink-0 text-slate-400"
                        size={16}
                      />
                      <dd className="truncate" title={job.location}>
                        {job.location}
                      </dd>
                    </div>
                    <div className="flex min-w-0 items-center gap-2">
                      <Timer
                        className="shrink-0 text-slate-400"
                        size={16}
                      />
                      <dd className="truncate" title={job.type}>
                        {job.type}
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-auto grid grid-cols-1 gap-2 pt-5 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => openAssessment(job.id)}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-600 px-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
                    >
                      <FileQuestion size={16} />
                      {job.hasAssessment ? "Manage" : "Create assessment"}
                    </button>
                    <button
                      type="button"
                      onClick={() => openResults(job.id)}
                      disabled={!job.hasAssessment}
                      title={
                        job.hasAssessment
                          ? "View assessment results"
                          : "Create an assessment before viewing results"
                      }
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 disabled:hover:border-slate-200 disabled:hover:bg-slate-50 disabled:hover:text-slate-400 dark:border-slate-700 dark:text-slate-200 dark:hover:border-blue-900 dark:hover:bg-blue-950/30 dark:hover:text-blue-300 dark:disabled:bg-slate-900 dark:disabled:text-slate-600 dark:disabled:hover:border-slate-700 dark:disabled:hover:bg-slate-900 dark:disabled:hover:text-slate-600 dark:focus:ring-offset-slate-900"
                    >
                      <BarChart3 size={16} />
                      Results
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => openAssessment(job.id)}
                    className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold text-blue-600 transition hover:bg-blue-50 group-hover:gap-2 dark:text-blue-400 dark:hover:bg-blue-950/30"
                  >
                    {job.hasAssessment
                      ? "Open assessment"
                      : "Set up assessment"}
                    <ArrowRight size={14} />
                  </button>
                </article>
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <EmptyState
              icon={<FileQuestion size={26} />}
              title="No jobs yet"
              description="Create a job posting before building your first assessment."
              actionLabel="Create a job"
              onAction={() => router.push("/recruiter/jobs/create")}
            />
          ) : (
            <EmptyState
              icon={<Search size={25} />}
              title="No matching jobs"
              description="Try a different search term or status filter."
              actionLabel="Clear filters"
              onAction={() => {
                setSearch("");
                setStatusFilter("ALL");
              }}
            />
          )}
        </div>
      </section>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  tone: "blue" | "emerald" | "amber";
}) {
  const iconStyle = {
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-300",
    emerald:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300",
    amber:
      "bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-300",
  }[tone];

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {label}
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">
            {value}
          </p>
        </div>
        <span
          className={`grid h-11 w-11 place-items-center rounded-xl ${iconStyle}`}
        >
          {icon}
        </span>
      </div>
    </div>
  );
}

function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
}) {
  return (
    <div className="flex min-h-80 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 px-5 text-center dark:border-slate-700">
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-300">
        {icon}
      </span>
      <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
        {title}
      </h3>
      <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
        {description}
      </p>
      <button
        type="button"
        onClick={onAction}
        className="mt-5 inline-flex h-10 items-center justify-center rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700"
      >
        {actionLabel}
      </button>
    </div>
  );
}
