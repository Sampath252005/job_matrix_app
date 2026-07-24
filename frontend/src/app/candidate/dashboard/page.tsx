"use client";

import { useEffect, useState } from "react";
import { DasshboardCandidateService } from "@/services/dashboard.services";
import { toastApiWarning } from "@/lib/toast";

interface DashboardData {
  totalApplications: number;
  shortlisted: number;
  rejected: number;
  hired: number;
  interviews: number;
}

export default function CandidateDashboardPage() {
  const [dashboard, setDashboard] =
    useState<DashboardData | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const data = await DasshboardCandidateService();
      setDashboard(data);
    } catch (error) {
      console.error(error);
      toastApiWarning(error, "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="p-6">

      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Candidate Dashboard
        </h1>

        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Track your applications and hiring progress.
        </p>
      </div>

      <div className="
        grid
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-5
        gap-4
      ">

        <StatCard
          title="Applications"
          value={dashboard?.totalApplications || 0}
        />

        <StatCard
          title="Shortlisted"
          value={dashboard?.shortlisted || 0}
        />

        <StatCard
          title="Rejected"
          value={dashboard?.rejected || 0}
        />

        <StatCard
          title="Interviews"
          value={dashboard?.interviews || 0}
        />

        <StatCard
          title="Hired"
          value={dashboard?.hired || 0}
        />

      </div>

    </div>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div
      className="
      bg-white
      dark:bg-zinc-900
      border
      border-gray-200
      dark:border-zinc-800
      rounded-xl
      p-5
      shadow-sm
      "
    >
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {title}
      </p>

      <h2 className="text-3xl font-bold mt-2">
        {value}
      </h2>
    </div>
  );
}
