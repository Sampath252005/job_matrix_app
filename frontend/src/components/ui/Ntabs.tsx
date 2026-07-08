"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";

type NtabsProps = {
  icon: React.ReactNode;
  name: string;
  link: string;
  onClick?: () => void;
};

export default function Ntabs({
  icon,
  name,
  link,
  onClick,
}: NtabsProps) {
  const router = useRouter();
  const pathname = usePathname();

  const active =
    pathname === link ||
    pathname.startsWith(`${link}/`);

  return (
    <button
      onClick={() => {
        router.push(link);
        onClick?.();
      }}
      className={`
        group
        relative
        w-full
        flex
        items-center
        justify-between
        rounded-xl
        px-4
        py-3
        transition-all
        duration-300
        ${
          active
            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/20"
            : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
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
            rounded-lg
            transition
            ${
              active
                ? "bg-white/20"
                : "bg-slate-100 dark:bg-slate-900 group-hover:bg-blue-100 dark:group-hover:bg-blue-950/60"
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
