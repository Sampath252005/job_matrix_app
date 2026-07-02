"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";

type NtabsProps = {
  icon: React.ReactNode;
  name: string;
  link: string;
};

export default function Ntabs({
  icon,
  name,
  link,
}: NtabsProps) {
  const router = useRouter();
  const pathname = usePathname();

  const active =
    pathname === link ||
    pathname.startsWith(`${link}/`);

  return (
    <button
      onClick={() => router.push(link)}
      className={`
        group
        relative
        w-full
        flex
        items-center
        justify-between
        rounded-2xl
        px-4
        py-3
        transition-all
        duration-300
        ${
          active
            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
            : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
        }
      `}
    >
      {/* Left Section */}

      <div className="flex items-center gap-4">

        <div
          className={`
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-xl
            transition
            ${
              active
                ? "bg-white/20"
                : "bg-gray-100 dark:bg-gray-800 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30"
            }
          `}
        >
          {icon}
        </div>

        <span className="font-medium">
          {name}
        </span>

      </div>

      <ChevronRight
        size={18}
        className={`
          transition-all
          duration-300
          ${
            active
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
          }
        `}
      />

      {/* Active Indicator */}

      {active && (
        <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-white" />
      )}
    </button>
  );
} 