"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  Search,
  Bell,
  Settings,
  LogOut,
  UserCircle,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { fetchRecruiterProfile } from "@/services/profile.services";
import { logoutService } from "@/services/auth.services";

const PROFILE_UPDATED_EVENT = "recruiter-profile-updated";

function getStoredUserName() {
  try {
    const storedUser = localStorage.getItem("User");
    if (!storedUser) return "Recruiter";

    const user: unknown = JSON.parse(storedUser);
    if (
      user &&
      typeof user === "object" &&
      "name" in user &&
      typeof user.name === "string" &&
      user.name.trim()
    ) {
      return user.name.trim();
    }
  } catch {
    // Invalid or unavailable local storage should not break the header.
  }

  return "Recruiter";
}

export default function RsearchBar() {
  const [mounted, setMounted] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [name, setName] = useState("Recruiter");
  const [loggingOut, setLoggingOut] = useState(false);

  const router = useRouter();

  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);
    try {
      await logoutService();
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      localStorage.removeItem("User");
      setOpenProfile(false);
      router.replace("/auth/login");
      router.refresh();
    }
  };

  useEffect(() => {
    const initializeHeader = window.setTimeout(() => {
      setMounted(true);
      setName(getStoredUserName());
    }, 0);

    const loadProfileName = async () => {
      try {
        const response = await fetchRecruiterProfile();
        const companyName = response.data?.company_name;
        if (typeof companyName === "string" && companyName.trim()) {
          setName(companyName.trim());
        }
      } catch {
        // Keep the authenticated user's name when a company profile is absent.
      }
    };

    const handleProfileUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<{ companyName?: string }>;
      const companyName = customEvent.detail?.companyName;
      if (typeof companyName === "string" && companyName.trim()) {
        setName(companyName.trim());
      }
    };

    void loadProfileName();
    window.addEventListener(PROFILE_UPDATED_EVENT, handleProfileUpdate);

    return () => {
      window.clearTimeout(initializeHeader);
      window.removeEventListener(PROFILE_UPDATED_EVENT, handleProfileUpdate);
    };
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
    <div
      className="
    flex min-w-0 items-center justify-between gap-3
    bg-transparent dark:bg-gray-950/80
  "
    >
      {/* Left Section */}

      <div className="min-w-0">
        <h1 className="truncate text-base font-bold text-gray-900 dark:text-white sm:text-xl lg:text-2xl">
          {greeting}, {name} 👋
        </h1>

        <p className="mt-1 hidden text-sm text-gray-500 dark:text-gray-400 sm:block">
          Here&apos;s what you need to focus on today.
        </p>
      </div>

      {/* Right Section */}

      <div className="flex shrink-0 items-center gap-2 sm:gap-3 lg:gap-4">
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
          border border-slate-200/80 dark:border-gray-700
          bg-white/80 dark:bg-gray-900
          shadow-sm shadow-slate-200/60 dark:shadow-none
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
          p-2.5
          sm:p-3
        rounded-xl
        border border-slate-200/80 bg-white/80 dark:border-gray-700 dark:bg-transparent
        shadow-sm shadow-slate-200/60 dark:shadow-none
        hover:bg-white dark:hover:bg-gray-800
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
          border border-slate-200/80 dark:border-gray-700
          bg-white/85 dark:bg-gray-900
          shadow-sm shadow-slate-200/60 dark:shadow-none
          px-3 py-2
          hover:shadow-lg
          transition
        "
          >
            {/* Avatar */}

            <div
              className="
            h-9 w-9
            sm:h-11 sm:w-11
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
              type="button"
              onClick={() => void handleLogout()}
              disabled={loggingOut}
              className="
            w-full
            flex items-center gap-3
            px-5 py-3
            text-red-500
            hover:bg-red-50
            dark:hover:bg-red-900/20
            disabled:cursor-not-allowed
            disabled:opacity-60
            transition
          "
            >
              {loggingOut ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <LogOut size={18} />
              )}
              {loggingOut ? "Signing out..." : "Log Out"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
