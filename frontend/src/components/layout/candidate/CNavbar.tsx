"use client";

import React from "react";
import { useTheme } from "next-themes";
import Ntabs from "@/components/ui/Ntabs";

import {
  LayoutDashboard,
  Briefcase,
  ClipboardList,
  User,
  Moon,
  Sun,
  FileQuestion,
  BriefcaseBusiness,
  Video,
} from "lucide-react";

type CNavbarProps = {
  onClose?: () => void;
};

const navs = [
  {
    id: 1,
    name: "Dashboard",
    icon: LayoutDashboard,
    link: "/candidate/dashboard",
  },
  {
    id: 2,
    name: "Jobs",
    icon: Briefcase,
    link: "/candidate/jobs",
  },
  {
    id: 3,
    name: "Applications",
    icon: ClipboardList,
    link: "/candidate/applications",
  },
  {
    id: 4,
    name: "Interviews",
    icon: Video,
    link: "/candidate/interviews",
  },
  {
    id: 5,
    name: "Assessments",
    icon: FileQuestion,
    link: "/candidate/assessments",
  },
  {
    id: 6,
    name: "Profile",
    icon: User,
    link: "/candidate/profile",
  },
];

export default function CNavbar({ onClose }: CNavbarProps) {
  const { theme, setTheme } = useTheme();

  return (
    <aside className=" h-full w-full flex flex-col justify-between bg-white/90  dark:bg-slate-950/95 backdrop-blur-xl px-5 py-5 ">
      {/* ================= TOP ================= */}

      <div>
        {/* Logo */}

        <div className="mb-10 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600  shadow-lg shadow-blue-600/20 ">
            <BriefcaseBusiness className="text-white" size={24} />
          </div>

          <div>
            <h2 className="text-lg font-black tracking-tight text-slate-950 dark:text-white">
              Job Matrix
            </h2>

            <p className="text-sm text-slate-500 dark:text-slate-400">
              Candidate Portal
            </p>
          </div>
        </div>

        {/* Navigation */}

        <nav className="space-y-2">
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

      <div className="space-y-5">
        {/* Theme */}

        <div className="rounded-2xl border border-slate-200/80 bg-slate-100/80 p-1.5 shadow-inner shadow-white/70 dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-none">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setTheme("light")}
              className={`
              rounded-xl py-2 flex justify-center items-center  gap-2 transition
              ${
                theme === "light"
                  ? "bg-white shadow-sm shadow-slate-200/80 text-slate-950"
                  : "text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800"
              }
              `}
            >
              <Sun size={17} />
              Light
            </button>

            <button
              onClick={() => setTheme("dark")}
              className={`rounded-xl py-2 flex justify-center items-center gap-2 transition
              ${
                theme === "dark"
                  ? "bg-blue-600 text-white shadow"
                  : "text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800"
              }
              `}
            >
              <Moon size={17} />
              Dark
            </button>
          </div>
        </div>

        {/* Profile Card */}

        <div
          className="
          rounded-xl
          border
          border-blue-100/80
          bg-gradient-to-br
          from-blue-50
          via-white
          to-cyan-50
          shadow-sm
          shadow-blue-100/70
          p-4
          dark:border-blue-950/70
          dark:from-slate-900
          dark:via-slate-900
          dark:to-blue-950/40
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
              h-11
              w-11
              rounded-full
              bg-gradient-to-r
              from-blue-600
              to-indigo-600
              flex
              items-center
              justify-center
              text-white
              font-bold
              "
            >
              C
            </div>

            <div>
              <h3 className="font-semibold text-slate-950 dark:text-white">
                Candidate
              </h3>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                Ready to get hired
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}

        <div className="border-t border-slate-200 pt-4 dark:border-slate-800">
          <p className="text-center text-xs text-slate-500">
            © {new Date().getFullYear()} Job Matrix
          </p>

          <p className="mt-1 text-center text-xs text-slate-400">
            Built with Next.js
          </p>
        </div>
      </div>
    </aside>
  );
}
