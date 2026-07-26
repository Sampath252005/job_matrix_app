"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Loader2, LogOut, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { logoutService } from "@/services/auth.services";
import CandidateNotifications from "./CandidateNotifications";

function getStoredUserName() {
  try {
    const storedUser = localStorage.getItem("User");
    if (!storedUser) return "Candidate";

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

  return "Candidate";
}

export default function CSearchBar() {
  const [openProfile, setOpenProfile] = useState(false);
  const [name, setName] = useState("Candidate");
  const [loggingOut, setLoggingOut] = useState(false);

  const router = useRouter();

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setName(getStoredUserName());
  }, []);

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
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  }, []);

  const initial = name.charAt(0).toUpperCase();

  return (
    <div className="flex w-full items-center justify-between gap-3">
      <div className="min-w-0">
        <h1 className="truncate text-base font-bold text-slate-950 dark:text-white sm:text-lg">
          {greeting}
        </h1>

        <p className="hidden text-sm text-slate-500 dark:text-slate-400 sm:block">
          Explore jobs, assessments, and applications from one place.
        </p>
      </div>

      <div className="hidden min-w-0 flex-1 justify-center px-4 md:flex">
        <label className="flex w-full max-w-xl items-center gap-3 rounded-full border border-slate-200/80 bg-white/80 px-4 py-2.5 text-slate-500 shadow-sm shadow-slate-200/60 transition focus-within:border-blue-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none dark:focus-within:border-blue-900 dark:focus-within:bg-slate-950 dark:focus-within:ring-blue-950/60">
          <Search size={18} />
          <input
            placeholder="Search jobs, companies, applications"
            className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
          />
        </label>
      </div>

      <div className="flex items-center gap-2">
        <CandidateNotifications />

        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setOpenProfile(!openProfile)}
            className="
          flex items-center gap-3
          px-2 py-2 sm:px-3
          rounded-full
          transition
          border border-transparent
          hover:border-slate-200
          hover:bg-slate-50
          dark:hover:border-slate-800
          dark:hover:bg-slate-900
          "
          >
            <div
              className="
            w-9 h-9
            flex items-center justify-center
            rounded-full
            bg-gradient-to-r
            from-blue-600
            to-cyan-500
            text-white
            font-semibold
            "
            >
              {initial}
            </div>

            <span className="hidden font-medium text-slate-800 dark:text-slate-200 md:block">
              {name}
            </span>

            <ChevronDown
              size={18}
              className={`
              transition-transform
              ${
                openProfile
                  ? "rotate-180"
                  : ""
              }
            `}
            />
          </button>

          {/* Dropdown */}

          <div
            className={`
          absolute right-0 mt-3 w-52
          bg-white/95 dark:bg-slate-900
          border border-slate-200/80 dark:border-slate-800
          rounded-2xl shadow-xl shadow-slate-200/70 dark:shadow-none
          overflow-hidden
          transition-all
          origin-top-right
          ${
            openProfile
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95 pointer-events-none"
          }
          `}
          >
            <button
              className="
            w-full text-left
            px-4 py-3 text-sm
            hover:bg-slate-100
            dark:hover:bg-slate-800
            "
              onClick={() => router.push("/candidate/profile")}
            >
              Open Profile
            </button>

            <button
              className="
            w-full text-left
            px-4 py-3 text-sm
            hover:bg-slate-100
            dark:hover:bg-slate-800
            "
            >
              Settings
            </button>

            <div className="border-t border-slate-200 dark:border-slate-800" />

            <button
              type="button"
              onClick={() => void handleLogout()}
              disabled={loggingOut}
              className="
            flex w-full items-center gap-2 text-left
            px-4 py-3 text-sm
            text-red-500
            hover:bg-red-50
            dark:hover:bg-red-950/40
            disabled:cursor-not-allowed
            disabled:opacity-60
            "
            >
              {loggingOut ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <LogOut size={16} />
              )}
              {loggingOut ? "Signing out..." : "Log Out"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
