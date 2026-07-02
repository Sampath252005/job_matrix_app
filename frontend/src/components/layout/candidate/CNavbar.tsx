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
  BriefcaseBusiness,
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
      w-72
      min-h-screen
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

        <div className="flex items-center gap-4 mb-12">

          <div
            className="
            w-12
            h-12
            rounded-2xl
            bg-gradient-to-br
            from-blue-600
            to-indigo-600
            flex
            items-center
            justify-center
            shadow-lg
            "
          >
            <BriefcaseBusiness
              className="text-white"
              size={24}
            />
          </div>

          <div>

            <h2 className="font-bold text-xl">
              Job Matrix
            </h2>

            <p className="text-sm text-gray-500">
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
            />

          ))}

        </nav>

      </div>

      {/* ================= BOTTOM ================= */}

      <div className="space-y-6">

        {/* Theme */}

        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-2">

          <div className="grid grid-cols-2 gap-2">

            <button
              onClick={() => setTheme("light")}
              className={`
              rounded-xl
              py-2
              flex
              justify-center
              items-center
              gap-2
              transition
              ${
                theme === "light"
                  ? "bg-white shadow text-gray-900"
                  : "text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800"
              }
              `}
            >
              <Sun size={17} />
              Light
            </button>

            <button
              onClick={() => setTheme("dark")}
              className={`
              rounded-xl
              py-2
              flex
              justify-center
              items-center
              gap-2
              transition
              ${
                theme === "dark"
                  ? "bg-blue-600 text-white shadow"
                  : "text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800"
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
          rounded-2xl
          border
          border-gray-200
          dark:border-gray-800
          bg-gradient-to-br
          from-blue-50
          to-indigo-50
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

              <h3 className="font-semibold">
                Candidate
              </h3>

              <p className="text-sm text-gray-500">
                Ready to get hired 🚀
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
            Built with ❤️ using Next.js
          </p>

        </div>

      </div>

    </aside>
  );
}