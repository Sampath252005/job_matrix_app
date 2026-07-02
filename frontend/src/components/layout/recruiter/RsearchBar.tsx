"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  Search,
  Bell,
  Settings,
  LogOut,
  UserCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";

type RsearchBarProps = {
  onMenuClick?: () => void;
};

const name = "Sampath";

export default function RsearchBar({ onMenuClick }: RsearchBarProps) {
  const [mounted, setMounted] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);

  const router = useRouter();

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  /* Close dropdown when clicking outside */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!mounted) return null;

  /* Dynamic greeting */
  const hour = new Date().getHours();
  let greeting = "Hello";

  if (hour < 12) greeting = "Good Morning ☀️";
  else if (hour < 18) greeting = "Good Afternoon 🌤";
  else greeting = "Good Evening 🌙";

  const initial = name.charAt(0).toUpperCase();

  return (
    <header
      className="
    sticky top-0 z-40
    flex items-center justify-between
    px-6 py-4
    border-b border-gray-200 dark:border-gray-800
    bg-white/80 dark:bg-gray-950/80
    backdrop-blur-xl
  "
    >
      {/* Left Section */}

      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {greeting}, {name} 👋
        </h1>

        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Here's what you need to focus on today.
        </p>
      </div>

      {/* Right Section */}

      <div className="flex items-center gap-4">
        {/* Search */}

        <div className="hidden lg:block relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search..."
            className="
          w-72
          rounded-xl
          border border-gray-200 dark:border-gray-700
          bg-gray-50 dark:bg-gray-900
          py-3 pl-11 pr-4
          focus:outline-none
          focus:ring-2
          focus:ring-blue-500
        "
          />
        </div>

        {/* Notification */}

        <button
          className="
        relative
        p-3
        rounded-xl
        border border-gray-200 dark:border-gray-700
        hover:bg-gray-100 dark:hover:bg-gray-800
        transition
      "
        >
          <Bell size={20} />

          <span
            className="
          absolute
          top-2
          right-2
          h-2
          w-2
          rounded-full
          bg-red-500
        "
          />
        </button>

        {/* Profile */}

        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setOpenProfile(!openProfile)}
            className="
          flex items-center gap-3
          rounded-2xl
          border border-gray-200 dark:border-gray-700
          bg-white dark:bg-gray-900
          px-3 py-2
          hover:shadow-lg
          transition
        "
          >
            {/* Avatar */}

            <div
              className="
            w-11 h-11
            rounded-full
            bg-gradient-to-r
            from-blue-600
            to-indigo-600
            flex items-center justify-center
            text-white font-bold
          "
            >
              {initial}
            </div>

            {/* User */}

            <div className="hidden md:block text-left">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {name}
              </h3>

              <p className="text-xs text-gray-500">Recruiter</p>
            </div>

            <ChevronDown
              size={18}
              className={`transition-transform ${
                openProfile ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown */}

          <div
            className={`
          absolute right-0 mt-4 w-64
          rounded-2xl
          border border-gray-200 dark:border-gray-700
          bg-white dark:bg-gray-900
          shadow-2xl
          overflow-hidden
          transition-all duration-300
          ${
            openProfile
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95 pointer-events-none"
          }
        `}
          >
            {/* Header */}

            <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {name}
              </h3>

              <p className="text-sm text-gray-500">Recruiter Account</p>
            </div>

            {/* Profile */}

            <button
              onClick={() => router.push("/recruiter/profile")}
              className="
            w-full
            flex items-center gap-3
            px-5 py-3
            hover:bg-gray-100 dark:hover:bg-gray-800
            transition
          "
            >
              <UserCircle size={18} />
              Open Profile
            </button>

            {/* Settings */}

            <button
              className="
            w-full
            flex items-center gap-3
            px-5 py-3
            hover:bg-gray-100 dark:hover:bg-gray-800
            transition
          "
            >
              <Settings size={18} />
              Settings
            </button>

            <div className="border-t border-gray-200 dark:border-gray-700" />

            {/* Logout */}

            <button
              className="
            w-full
            flex items-center gap-3
            px-5 py-3
            text-red-500
            hover:bg-red-50
            dark:hover:bg-red-900/20
            transition
          "
            >
              <LogOut size={18} />
              Log Out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
