"use client";

import { BarChart3, PieChart, Target } from "lucide-react";

export interface DashboardAnalytics {
  monthlyApplications: Array<{ label: string; count: number }>;
  statusDistribution: Array<{ status: string; count: number }>;
  assessmentPerformance: {
    submitted: number;
    averageScore: number;
  };
}

const statusColors: Record<string, string> = {
  PENDING: "#f59e0b",
  SHORTLISTED: "#3b82f6",
  INTERVIEW: "#8b5cf6",
  HIRED: "#10b981",
  REJECTED: "#f43f5e",
};

export default function AnalyticsCharts({
  analytics,
}: {
  analytics: DashboardAnalytics;
}) {
  const maxMonthly = Math.max(
    1,
    ...analytics.monthlyApplications.map((month) => month.count),
  );
  const totalStatuses = analytics.statusDistribution.reduce(
    (total, item) => total + item.count,
    0,
  );

  const donutSegments = analytics.statusDistribution
    .filter((item) => item.count > 0)
    .reduce<{ segments: string[]; end: number }>(
      (result, item) => {
        const end =
          result.end + (item.count / Math.max(totalStatuses, 1)) * 100;
        return {
          end,
          segments: [
            ...result.segments,
            `${statusColors[item.status] ?? "#64748b"} ${result.end}% ${end}%`,
          ],
        };
      },
      { segments: [], end: 0 },
    ).segments;

  return (
    <section className="grid gap-4 xl:grid-cols-[1.4fr_1fr_0.8fr]">
      <article className="rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950/80">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-300">
            <BarChart3 size={19} />
          </span>
          <div>
            <h2 className="font-bold text-slate-950 dark:text-white">
              Application trend
            </h2>
            <p className="text-xs text-slate-500">Last six months</p>
          </div>
        </div>

        <div className="mt-7 flex h-52 items-end gap-3 border-b border-slate-200 px-1 dark:border-slate-800">
          {analytics.monthlyApplications.map((month) => (
            <div
              key={month.label}
              className="group flex h-full min-w-0 flex-1 flex-col items-center justify-end"
            >
              <span className="mb-2 text-xs font-bold text-slate-600 opacity-0 transition group-hover:opacity-100 dark:text-slate-300">
                {month.count}
              </span>
              <div
                className="w-full max-w-12 rounded-t-xl bg-gradient-to-t from-blue-700 to-cyan-400 transition-all duration-700 hover:from-indigo-700 hover:to-blue-400"
                style={{
                  height: `${Math.max(5, (month.count / maxMonthly) * 100)}%`,
                }}
                title={`${month.label}: ${month.count} applications`}
              />
              <span className="mt-2 text-xs font-semibold text-slate-500">
                {month.label}
              </span>
            </div>
          ))}
        </div>
      </article>

      <article className="rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950/80">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-300">
            <PieChart size={19} />
          </span>
          <div>
            <h2 className="font-bold text-slate-950 dark:text-white">
              Hiring pipeline
            </h2>
            <p className="text-xs text-slate-500">Current status mix</p>
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center gap-5 sm:flex-row xl:flex-col">
          <div
            className="grid h-36 w-36 shrink-0 place-items-center rounded-full"
            style={{
              background:
                donutSegments.length > 0
                  ? `conic-gradient(${donutSegments.join(",")})`
                  : "#e2e8f0",
            }}
          >
            <div className="grid h-24 w-24 place-items-center rounded-full bg-white text-center dark:bg-slate-950">
              <div>
                <strong className="block text-2xl text-slate-950 dark:text-white">
                  {totalStatuses}
                </strong>
                <span className="text-[10px] uppercase text-slate-500">
                  Total
                </span>
              </div>
            </div>
          </div>
          <div className="grid w-full grid-cols-2 gap-2">
            {analytics.statusDistribution.map((item) => (
              <div key={item.status} className="flex items-center gap-2 text-xs">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: statusColors[item.status] }}
                />
                <span className="truncate text-slate-500">
                  {item.status.toLowerCase()}
                </span>
                <strong className="ml-auto text-slate-800 dark:text-slate-200">
                  {item.count}
                </strong>
              </div>
            ))}
          </div>
        </div>
      </article>

      <article className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-indigo-600 to-violet-700 p-5 text-white shadow-lg shadow-indigo-600/20">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/15">
          <Target size={20} />
        </span>
        <p className="mt-5 text-sm font-semibold text-indigo-100">
          Assessment performance
        </p>
        <p className="mt-2 text-4xl font-black">
          {analytics.assessmentPerformance.averageScore}
        </p>
        <p className="text-xs text-indigo-100">Average score</p>
        <div className="my-5 h-px bg-white/20" />
        <p className="text-2xl font-black">
          {analytics.assessmentPerformance.submitted}
        </p>
        <p className="text-xs text-indigo-100">Completed assessments</p>
      </article>
    </section>
  );
}
