"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  Loader2,
  MessageSquare,
  Search,
  Trophy,
  UserCheck,
  XCircle,
} from "lucide-react";
import {
  DasshboardCandidateService,
  getCandidateDashboardAnalytics,
} from "@/services/dashboard.services";
import { toastApiWarning } from "@/lib/toast";
import AnalyticsCharts, {
  DashboardAnalytics,
} from "@/components/dashboard/AnalyticsCharts";

interface DashboardData {
  totalApplications: number;
  pending: number;
  shortlisted: number;
  rejected: number;
  hired: number;
  interviews: number;
  submittedAssessments: number;
}

const statCards = [
  { key: "totalApplications", label: "Applications", icon: BriefcaseBusiness, tone: "blue" },
  { key: "pending", label: "Pending", icon: Clock3, tone: "amber" },
  { key: "shortlisted", label: "Shortlisted", icon: UserCheck, tone: "indigo" },
  { key: "interviews", label: "Interviews", icon: MessageSquare, tone: "violet" },
  { key: "hired", label: "Hired", icon: Trophy, tone: "emerald" },
  { key: "rejected", label: "Rejected", icon: XCircle, tone: "rose" },
] as const;

const tones = {
  blue: "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-300",
  amber: "bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-300",
  indigo: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-300",
  violet: "bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-300",
  emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300",
  rose: "bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-300",
};

export default function CandidateDashboardPage() {
  const router = useRouter();
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [dashboardData, analyticsData] = await Promise.all([
          DasshboardCandidateService(),
          getCandidateDashboardAnalytics(),
        ]);
        setDashboard(dashboardData);
        setAnalytics(analyticsData);
      } catch (error) {
        console.error(error);
        toastApiWarning(error, "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    void fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[55vh] items-center justify-center">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
          <Loader2 className="animate-spin text-blue-600" size={20} />
          Loading dashboard...
        </div>
      </div>
    );
  }

  const stats = dashboard ?? {
    totalApplications: 0,
    pending: 0,
    shortlisted: 0,
    rejected: 0,
    hired: 0,
    interviews: 0,
    submittedAssessments: 0,
  };

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-blue-800 to-indigo-600 p-6 text-white shadow-xl shadow-blue-600/20 sm:p-8">
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-semibold ring-1 ring-white/20">
              <CheckCircle2 size={15} />
              Career overview
            </span>
            <h1 className="mt-4 text-3xl font-black sm:text-4xl">
              Candidate Dashboard
            </h1>
            <p className="mt-2 max-w-2xl text-blue-100">
              Track applications, assessments, interviews, and hiring progress.
            </p>
          </div>
          <button
            onClick={() => router.push("/candidate/jobs")}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-blue-700 transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <Search size={17} />
            Find jobs
          </button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {statCards.map(({ key, label, icon: Icon, tone }) => (
          <article
            key={key}
            className="rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-950/80"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                  {label}
                </p>
                <p className="mt-2 text-3xl font-black text-slate-950 dark:text-white">
                  {stats[key]}
                </p>
              </div>
              <span className={`grid h-12 w-12 place-items-center rounded-2xl ${tones[tone]}`}>
                <Icon size={21} />
              </span>
            </div>
          </article>
        ))}
      </section>

      {analytics && <AnalyticsCharts analytics={analytics} />}

      <section className="grid gap-4 lg:grid-cols-2">
        <button
          onClick={() => router.push("/candidate/applications")}
          className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-blue-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-950"
        >
          <span className="flex items-center gap-4">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-300">
              <BriefcaseBusiness size={22} />
            </span>
            <span>
              <strong className="block text-slate-950 dark:text-white">Application timeline</strong>
              <small className="text-slate-500">{stats.totalApplications} applications to track</small>
            </span>
          </span>
          <ArrowRight className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-600" />
        </button>

        <button
          onClick={() => router.push("/candidate/assessments")}
          className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-indigo-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-950"
        >
          <span className="flex items-center gap-4">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-300">
              <ClipboardCheck size={22} />
            </span>
            <span>
              <strong className="block text-slate-950 dark:text-white">Assessment center</strong>
              <small className="text-slate-500">{stats.submittedAssessments} exams submitted</small>
            </span>
          </span>
          <ArrowRight className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-indigo-600" />
        </button>
      </section>
    </div>
  );
}
