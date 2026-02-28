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
} from "lucide-react";

type RNavbarProps = {
  onClose: () => void;
};
/* ================= NAV CONFIG ================= */
const navs = [
  { id: 1, name: "Dashboard", icon: LayoutDashboard },
  { id: 2, name: "Interview", icon: ClipboardList },
  { id: 3, name: "Job Board", icon: Briefcase },
  { id: 4, name: "Jobs", icon: Layers },
  { id: 5, name: "Quiz Designer", icon: FileQuestion },
  { id: 6, name: "Interview Designer", icon: ClipboardList },
  { id: 7, name: "Categories", icon: Layers },
  { id: 8, name: "Shortlisted Candidates", icon: UserCheck },
  { id: 9, name: "Candidates", icon: Users },
];

const RNavbar = ({ onClose }: RNavbarProps) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return (
    <aside
      className="
      flex flex-col justify-between min-h-screen p-5 rounded-xl
      bg-white dark:bg-gray-900
      text-gray-800 dark:text-gray-100
      border border-gray-200 dark:border-gray-700
      shadow-md
    "
    >
      {/* LOGO */}
      <div>
        <div className="flex items-center gap-2 mb-8 text-xl font-bold">
          <div className="h-8 w-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
            JM
          </div>
          <span>Job Matrix</span>
        </div>

        {/* NAV */}
        <nav className="flex flex-col gap-1">
          {navs.map((nav) => (
            <Ntabs key={nav.id} name={nav.name} icon={<nav.icon size={18} />} />
          ))}
        </nav>
      </div>

      {/* THEME SWITCH */}
      <div className="bg-blue-100 dark:bg-gray-800 p-1 rounded-lg flex gap-1">
        <button
          onClick={() => setTheme("light")}
          className={`flex-1 p-2 rounded-md text-sm flex items-center justify-center gap-2
            ${
              theme === "light"
                ? "bg-blue-600 text-white"
                : "hover:bg-blue-200 dark:hover:bg-gray-700"
            }
          `}
        >
          <Sun size={16} /> Light
        </button>

        <button
          onClick={() => setTheme("dark")}
          className={`flex-1 p-2 rounded-md text-sm flex items-center justify-center gap-2
            ${
              theme === "dark"
                ? "bg-blue-600 text-white"
                : "hover:bg-blue-200 dark:hover:bg-gray-700"
            }
          `}
        >
          <Moon size={16} /> Dark
        </button>
      </div>
    </aside>
  );
};

export default RNavbar;
