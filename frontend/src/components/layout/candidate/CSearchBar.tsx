"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";

type CSearchBarProps = {
  onMenuClick?: () => void;
};

const name = "Sampath";

export default function CSearchBar({
  onMenuClick,
}: CSearchBarProps) {
  const [mounted, setMounted] =
    useState(false);

  const [openProfile, setOpenProfile] =
    useState(false);

  const router = useRouter();

  const dropdownRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (
      event: MouseEvent,
    ) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target as Node,
        )
      ) {
        setOpenProfile(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside,
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
  }, []);

  if (!mounted) return null;

  const hour = new Date().getHours();

  let greeting = "Hello";

  if (hour < 12)
    greeting = "Good Morning ☀️";
  else if (hour < 18)
    greeting = "Good Afternoon 🌤";
  else greeting = "Good Evening 🌙";

  const initial =
    name.charAt(0).toUpperCase();

  return (
    <header
      className="
      w-full
      flex
      justify-between
      items-center
      px-6
      py-4
      bg-white
      dark:bg-gray-900
      border-b
      border-gray-200
      dark:border-gray-800
      "
    >
      {/* Greeting */}

      <div className="flex flex-col">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {greeting}
        </h1>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          Explore jobs and track your
          applications.
        </p>
      </div>

      {/* Profile */}

      <div
        ref={dropdownRef}
        className="relative"
      >
        <button
          onClick={() =>
            setOpenProfile(
              !openProfile,
            )
          }
          className="
          flex items-center gap-3
          px-3 py-2
          rounded-full
          transition
          hover:bg-gray-100
          dark:hover:bg-gray-800
          "
        >
          <div
            className="
            w-9 h-9
            flex items-center justify-center
            rounded-full
            bg-gradient-to-r
            from-green-500
            to-emerald-600
            text-white
            font-semibold
            "
          >
            {initial}
          </div>

          <span className="hidden md:block font-medium text-gray-800 dark:text-gray-200">
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
          absolute right-0 mt-3 w-48
          bg-white dark:bg-gray-800
          border border-gray-200 dark:border-gray-700
          rounded-xl shadow-lg
          overflow-hidden
          transition-all
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
            px-4 py-2 text-sm
            hover:bg-gray-100
            dark:hover:bg-gray-700
            "
            onClick={() =>
              router.push(
                "/candidate/profile",
              )
            }
          >
            Open Profile
          </button>

          <button
            className="
            w-full text-left
            px-4 py-2 text-sm
            hover:bg-gray-100
            dark:hover:bg-gray-700
            "
          >
            Settings
          </button>

          <div className="border-t border-gray-200 dark:border-gray-700" />

          <button
            className="
            w-full text-left
            px-4 py-2 text-sm
            text-red-500
            hover:bg-red-50
            dark:hover:bg-red-900/40
            "
          >
            Log Out
          </button>
        </div>
      </div>
    </header>
  );
}