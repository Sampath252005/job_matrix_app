"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Ntabs from "@/components/ui/Ntabs";

import {
  LayoutDashboard,
  Users,
  UserCheck,
  Briefcase,
  ClipboardList,
  FileQuestion,
  Layers,
  Moon,
  Sun,
  Building2,
} from "lucide-react";

type RNavbarProps = {
  onClose?: () => void;
};

const navs = [
  {
    id: 1,
    name: "Dashboard",
    icon: LayoutDashboard,
    link: "/recruiter/dashboard",
  },
  {
    id: 2,
    name: "Interviews",
    icon: ClipboardList,
    link: "/recruiter/IterView",
  },
  {
    id: 3,
    name: "Job Board",
    icon: Briefcase,
    link: "/recruiter/jobBoard",
  },
  {
    id: 4,
    name: "Jobs",
    icon: Layers,
    link: "/recruiter/jobs",
  },
  {
    id: 5,
    name: "Assessments",
    icon: FileQuestion,
    link: "/recruiter/assesments",
  },
  {
    id: 6,
    name: "Interview Designer",
    icon: ClipboardList,
    link: "/recruiter/dashboard",
  },
  {
    id: 7,
    name: "Categories",
    icon: Layers,
    link: "/recruiter/dashboard",
  },
  {
    id: 8,
    name: "Shortlisted",
    icon: UserCheck,
    link: "/recruiter/dashboard",
  },
  {
    id: 9,
    name: "Candidates",
    icon: Users,
    link: "/recruiter/candidates",
  },
];

export default function RNavbar({
  onClose,
}: RNavbarProps) {
  const { theme, setTheme } = useTheme();

  const [mounted, setMounted] =
    useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <aside
      className="
      w-72
      sticky
      top-0
      h-screen
      flex
      flex-col
      justify-between
      border-r
      border-gray-200
      dark:border-gray-800
      bg-white/90
      dark:bg-gray-950
      backdrop-blur-xl
      px-6
      py-6
      "
    >
      {/* ================= TOP ================= */}

      <div>

        {/* Logo */}

        <div className="flex items-center gap-4 mb-10">

          <div
            className="
            w-12
            h-12
            rounded-2xl
            bg-gradient-to-br
            from-indigo-600
            to-purple-600
            flex
            items-center
            justify-center
            shadow-lg
            "
          >
            <Building2
              className="text-white"
              size={24}
            />
          </div>

          <div>

            <h2 className="font-bold text-xl">
              Job Matrix
            </h2>

            <p className="text-sm text-gray-500">
              Recruiter Portal
            </p>

          </div>

        </div>

        {/* Navigation */}

        <nav className="space-y-2 overflow-y-auto">

          {navs.map((nav) => (

            <Ntabs
              key={nav.id}
              name={nav.name}
              icon={<nav.icon size={20} />}
              link={nav.link}
            />

          ))}

        </nav>

      </div>

      {/* ================= BOTTOM ================= */}

      <div className="space-y-6">

        {/* Theme */}

        <div
          className="
          rounded-2xl
          border
          border-gray-200
          dark:border-gray-800
          bg-gray-50
          dark:bg-gray-900
          p-2
          "
        >

          <div className="grid grid-cols-2 gap-2">

            <button
              onClick={() => setTheme("light")}
              className={`
              rounded-xl
              py-2
              flex
              items-center
              justify-center
              gap-2
              transition
              ${
                theme === "light"
                  ? "bg-white shadow text-gray-900"
                  : "text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800"
              }
              `}
            >
              <Sun size={16} />
              Light
            </button>

            <button
              onClick={() => setTheme("dark")}
              className={`
              rounded-xl
              py-2
              flex
              items-center
              justify-center
              gap-2
              transition
              ${
                theme === "dark"
                  ? "bg-indigo-600 text-white shadow"
                  : "text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800"
              }
              `}
            >
              <Moon size={16} />
              Dark
            </button>

          </div>

        </div>

        {/* Recruiter Card */}

        <div
          className="
          rounded-2xl
          border
          border-gray-200
          dark:border-gray-800
          bg-gradient-to-br
          from-indigo-50
          to-purple-50
          dark:from-gray-900
          dark:to-gray-800
          p-4
          "
        >

          <div className="flex items-center gap-3">

            <div
              className="
              w-12
              h-12
              rounded-full
              bg-gradient-to-r
              from-indigo-600
              to-purple-600
              flex
              items-center
              justify-center
              text-white
              font-bold
              "
            >
              HR
            </div>

            <div>

              <h3 className="font-semibold">
                Recruiter
              </h3>

              <p className="text-sm text-gray-500">
                Hiring made easy 🚀
              </p>

            </div>

          </div>

        </div>

        {/* Footer */}

        <div className="border-t border-gray-200 dark:border-gray-800 pt-5">

          <p className="text-center text-xs text-gray-500">
            © {new Date().getFullYear()} Job Matrix
          </p>

          <p className="mt-1 text-center text-xs text-gray-400">
            Recruiter Dashboard
          </p>

        </div>

      </div>

    </aside>
  );
}