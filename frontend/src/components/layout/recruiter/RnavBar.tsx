"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
} from "lucide-react";

type RNavbarProps = {
  onClose?: () => void;
};

/* NAVIGATION CONFIG */

const navs = [
  { id: 1, name: "Dashboard", icon: LayoutDashboard ,link:"/recruiter/dashboard" },
  { id: 2, name: "Interview", icon: ClipboardList ,link:"/recruiter/IterView" },
  { id: 3, name: "Job Board", icon: Briefcase,link:"/recruiter/jobBoard"  },
  { id: 4, name: "Jobs", icon: Layers ,link:"/recruiter/jobs" },
  { id: 5, name: "Assesments", icon: FileQuestion,link:"/recruiter/assesments"  },
  { id: 6, name: "Interview Designer", icon: ClipboardList ,link:"/recruiter/dashboard" },
  { id: 7, name: "Categories", icon: Layers ,link:"/recruiter/dashboard" },
  { id: 8, name: "Shortlisted Candidates", icon: UserCheck,link:"/recruiter/dashboard"  },
  { id: 9, name: "Candidates", icon: Users ,link:"/recruiter/candidates" },
];

export default function RNavbar({ onClose }: RNavbarProps) {
  const router=useRouter();
  const { theme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);

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
      {/* TOP SECTION */}

      <div>
        {/* LOGO */}

        <div className="flex items-center gap-3 mb-10 px-2">
          <div
            className="
            w-9 h-9
            flex items-center justify-center
            rounded-lg
            bg-gradient-to-r from-blue-600 to-indigo-600
            text-white font-bold
            "
          >
            JM
          </div>

          <span className="text-lg font-semibold">
            Job Matrix
          </span>
        </div>

        {/* NAVIGATION */}

        <nav className="flex flex-col gap-1 overflow-y-auto">
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

      {/* BOTTOM SECTION */}

      <div className="space-y-4">
        {/* THEME SWITCH */}

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
              flex items-center gap-2 px-3 py-1 rounded-md text-sm
              transition
              ${
                theme === "light"
                  ? "bg-white shadow text-gray-900"
                  : "text-gray-500 hover:text-gray-800 dark:hover:text-white"
              }
            `}
          >
            <Sun size={16} />
            Light
          </button>

          <button
            onClick={() => setTheme("dark")}
            className={`
              flex items-center gap-2 px-3 py-1 rounded-md text-sm
              transition
              ${
                theme === "dark"
                  ? "bg-gray-700 text-white"
                  : "text-gray-500 hover:text-gray-800 dark:hover:text-white"
              }
            `}
          >
            <Moon size={16} />
            Dark
          </button>
        </div>

        {/* FOOTER */}

        <div className="text-xs text-gray-400 text-center">
          © {new Date().getFullYear()} Job Matrix
        </div>
      </div>
    </aside>
  );
}