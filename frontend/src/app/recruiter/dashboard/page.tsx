"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Dcards from "@/components/ui/Dcards";
import {
  DashboardRecruiterService,
  getRecruiterDashboardAnalytics,
} from "@/services/dashboard.services";
import { toastApiWarning } from "@/lib/toast";
import AnalyticsCharts, {
  DashboardAnalytics,
} from "@/components/dashboard/AnalyticsCharts";

import {
  Briefcase,
  ClipboardList,
  Users,
  UserCheck,
  UserPlus,
  CalendarCheck,
  Clock3,
  XCircle,
  FileCheck2,
  ArrowRight,
  Plus,
  Loader2,
} from "lucide-react";

interface DashboardStats {
  totalJobs: number;
  openJobs: number;
  totalApplications: number;
  pending: number;
  shortlisted: number;
  rejected: number;
  hired: number;
  interviews: number;
  submittedAssessments: number;
}

const cardConfig = [
  { key: "totalJobs", title: "Total Jobs", icon: <Briefcase size={22} /> },
  { key: "openJobs", title: "Open Jobs", icon: <ClipboardList size={22} /> },
  {
    key: "totalApplications",
    title: "Applications",
    icon: <Users size={22} />,
  },
  { key: "pending", title: "Pending Review", icon: <Clock3 size={22} /> },
  { key: "shortlisted", title: "Shortlisted", icon: <UserCheck size={22} /> },
  { key: "interviews", title: "Interviews", icon: <CalendarCheck size={22} /> },
  {
    key: "submittedAssessments",
    title: "Exams Submitted",
    icon: <FileCheck2 size={22} />,
  },
  { key: "hired", title: "Hired", icon: <UserPlus size={22} /> },
  { key: "rejected", title: "Rejected", icon: <XCircle size={22} /> },
];

export default function Page() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [dashboardData, analyticsData] = await Promise.all([
          DashboardRecruiterService(),
          getRecruiterDashboardAnalytics(),
        ]);
        setStats(dashboardData);
        setAnalytics(analyticsData);
      } catch (error) {
        toastApiWarning(error, "Please login to view recruiter dashboard");
        router.push("/auth/login");
      }
    };

    fetchDashboard();
  }, [router]);

  if (!stats) {
    return (
      <div className="flex min-h-[55vh] items-center justify-center">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
          <Loader2 className="animate-spin text-blue-600" size={20} />
          Loading dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-1 sm:p-3 lg:p-6">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-indigo-800 to-blue-600 p-6 text-white shadow-xl shadow-blue-600/20 sm:p-8">
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-semibold ring-1 ring-white/20">
              <Briefcase size={15} />
              Hiring overview
            </span>
            <h1 className="mt-4 text-3xl font-black sm:text-4xl">
              Recruiter Dashboard
            </h1>
            <p className="mt-2 max-w-2xl text-blue-100">
              Monitor jobs, candidates, submitted exams, and hiring decisions.
            </p>
          </div>
          <button
            onClick={() => router.push("/recruiter/jobs/create")}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-blue-700 transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <Plus size={17} />
            Create job
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {cardConfig.map((card) => (
          <Dcards
            key={card.key}
            count={stats[card.key as keyof DashboardStats]}
            title={card.title}
            icon={card.icon}
          />
        ))}
      </div>

      {analytics && <AnalyticsCharts analytics={analytics} />}

      <section className="grid gap-4 lg:grid-cols-2">
        <button
          onClick={() => router.push("/recruiter/candidates")}
          className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-blue-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-950"
        >
          <span>
            <strong className="block text-slate-950 dark:text-white">
              Review candidates
            </strong>
            <small className="mt-1 block text-slate-500">
              {stats.pending} applications are waiting for review
            </small>
          </span>
          <ArrowRight className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-600" />
        </button>

        <button
          onClick={() => router.push("/recruiter/assesments")}
          className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-indigo-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-950"
        >
          <span>
            <strong className="block text-slate-950 dark:text-white">
              Assessment results
            </strong>
            <small className="mt-1 block text-slate-500">
              {stats.submittedAssessments} exams are ready to review
            </small>
          </span>
          <ArrowRight className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-indigo-600" />
        </button>
      </section>
    </div>
  );
}
