"use client";

import React, { useEffect, useState } from "react";
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
    name: "My Applications",
    icon: ClipboardList,
    link: "/candidate/applications",
  },
  {
    id: 4,
    name: "Assessments",
    icon: FileQuestion,
    link: "/candidate/assessments",
  },
  {
    id: 5,
    name: "Profile",
    icon: User,
    link: "/candidate/profile",
  },
];

export default function CNavbar({
  onClose,
}: CNavbarProps) {
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
      w-64
      flex flex-col justify-between
      min-h-screen
      px-4 py-6
      bg-white dark:bg-gray-900
      border-r border-gray-200 dark:border-gray-800
      "
    >
      {/* TOP */}

      <div>
        <div className="flex items-center gap-3 mb-10 px-2">
          <div
            className="
            w-9 h-9
            flex items-center justify-center
            rounded-lg
            bg-gradient-to-r
            from-green-600
            to-emerald-600
            text-white
            font-bold
            "
          >
            JM
          </div>

          <span className="text-lg font-semibold">
            Job Matrix
          </span>
        </div>

        <nav className="flex flex-col gap-1">
          {navs.map((nav) => (
            <Ntabs
              key={nav.id}
              name={nav.name}
              icon={<nav.icon size={18} />}
              link={nav.link}
            />
          ))}
        </nav>
      </div>

      {/* BOTTOM */}

      <div className="space-y-4">

        <div
          className="
          flex items-center justify-between
          px-3 py-2
          rounded-lg
          bg-gray-100 dark:bg-gray-800
          "
        >
          <button
            onClick={() => setTheme("light")}
            className={`
              flex items-center gap-2
              px-3 py-1
              rounded-md
              text-sm
              ${
                theme === "light"
                  ? "bg-white shadow text-gray-900"
                  : "text-gray-500"
              }
            `}
          >
            <Sun size={16} />
            Light
          </button>

          <button
            onClick={() => setTheme("dark")}
            className={`
              flex items-center gap-2
              px-3 py-1
              rounded-md
              text-sm
              ${
                theme === "dark"
                  ? "bg-gray-700 text-white"
                  : "text-gray-500"
              }
            `}
          >
            <Moon size={16} />
            Dark
          </button>
        </div>

        <div className="text-xs text-gray-400 text-center">
          © {new Date().getFullYear()} Job Matrix
        </div>

      </div>
    </aside>
  );
}