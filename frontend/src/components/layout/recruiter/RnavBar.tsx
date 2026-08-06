"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Ntabs from "@/components/ui/Ntabs";

import {
  LayoutDashboard,
  Users,
  UserCheck,
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
    link: "/recruiter/interviews",
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
    id: 8,
    name: "Shortlisted",
    icon: UserCheck,
    link: "/recruiter/Shortlisted",
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
    const mountTimer = window.setTimeout(() => setMounted(true), 0);
    return () => window.clearTimeout(mountTimer);
  }, []);

  if (!mounted) return null;

  return (
    <aside
      className="
      w-full
      sticky
      top-0
      h-dvh
      min-w-0
      flex
      flex-col
      justify-between
      border-r
      border-gray-200
      dark:border-gray-800
      bg-white/90
      dark:bg-gray-950
      backdrop-blur-xl
      px-4
      py-5
      sm:px-6
      sm:py-6
      "
    >
      {/* ================= TOP ================= */}

      <div>

        {/* Logo */}

        <div className="mb-8 flex min-w-0 items-center gap-4 sm:mb-10">

          <div
            className="
            h-11
            w-11
            shrink-0
            sm:h-12
            sm:w-12
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

          <div className="min-w-0">

            <h2 className="truncate text-xl font-bold">
              Job Matrix
            </h2>

            <p className="truncate text-sm text-gray-500">
              Recruiter Portal
            </p>

          </div>

        </div>

        {/* Navigation */}

        <nav className="max-h-[calc(100dvh-320px)] space-y-2 overflow-y-auto pr-1">

          {navs.map((nav) => (

            <Ntabs
              key={nav.id}
              name={nav.name}
              icon={<nav.icon size={20} />}
              link={nav.link}
              onClick={onClose}
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
          bg-slate-100/80
          dark:bg-gray-900
          p-2
          shadow-inner
          shadow-white/70
          dark:shadow-none
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
                  ? "bg-white shadow shadow-slate-200/80 text-gray-900"
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
          from-blue-50
          to-purple-50
          shadow-sm
          shadow-blue-100/70
          dark:from-gray-900
          dark:to-gray-800
          p-4
          "
        >

          <div className="flex min-w-0 items-center gap-3">

            <div
              className="
              h-11
              w-11
              shrink-0
              sm:h-12
              sm:w-12
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

            <div className="min-w-0">

              <h3 className="truncate font-semibold">
                Recruiter
              </h3>

              <p className="truncate text-sm text-gray-500">
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
