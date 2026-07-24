"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Dcards from "@/components/ui/Dcards";
import { DashboardRecruiterService } from "@/services/dashboard.services";
import { toastApiWarning } from "@/lib/toast";

import {
  Briefcase,
  ClipboardList,
  Users,
  UserCheck,
  UserPlus,
  CalendarCheck,
} from "lucide-react";

interface DashboardStats {
  totalJobs: number;
  openJobs: number;
  totalApplications: number;
  shortlisted: number;
  hired: number;
  interviews: number;
}

const cardConfig = [
  { key: "totalJobs", title: "Total Jobs", icon: <Briefcase size={22} /> },
  { key: "openJobs", title: "Open Jobs", icon: <ClipboardList size={22} /> },
  {
    key: "totalApplications",
    title: "Applications",
    icon: <Users size={22} />,
  },
  { key: "shortlisted", title: "Shortlisted", icon: <UserCheck size={22} /> },
  { key: "hired", title: "Hired", icon: <UserPlus size={22} /> },
  { key: "interviews", title: "Interviews", icon: <CalendarCheck size={22} /> },
];

export default function Page() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await DashboardRecruiterService();
        setStats(data);
      } catch (error) {
        toastApiWarning(error, "Please login to view recruiter dashboard");
        router.push("/auth/login");
      }
    };

    fetchDashboard();
  }, [router]);

  if (!stats) return <div>Loading...</div>;

  return (
    <div className="space-y-6 p-1 sm:p-3 lg:p-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Recruiter Dashboard</h1>
        <p className="text-gray-500">Overview of your hiring activities</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {cardConfig.map((card) => (
          <Dcards
            key={card.key}
            count={stats[card.key as keyof DashboardStats]}
            title={card.title}
            icon={card.icon}
          />
        ))}
      </div>
    </div>
  );
}
