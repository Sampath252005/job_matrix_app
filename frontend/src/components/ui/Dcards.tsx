import React from "react";
import { ArrowRight } from "lucide-react";

interface DCardProps {
  count: number;
  title: string;
  icon: React.ReactNode;
}

const Dcards = ({ count, title, icon }: DCardProps) => {
  return (
    <div
      className="
      group
      w-full
      p-5
      rounded-xl
      bg-white/90 dark:bg-gray-900
      border border-slate-200/80 dark:border-gray-800
      shadow-sm shadow-slate-200/70
      hover:shadow-lg hover:shadow-blue-100/70
      dark:shadow-none dark:hover:shadow-none
      transition-all duration-300
      hover:-translate-y-1
      cursor-pointer
      "
    >
      {/* Top Section */}

      <div className="flex items-start justify-between pb-4 border-b border-slate-200/80 dark:border-gray-800">
        <div className="flex flex-col gap-1">
          <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {count}
          </span>

          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {title}
          </span>
        </div>

        <div
          className="
          flex items-center justify-center
          w-11 h-11
          rounded-lg
          bg-blue-100 text-blue-600
          dark:bg-blue-500/20 dark:text-blue-400
          "
        >
          {icon}
        </div>
      </div>

      {/* Bottom Action */}

      <div className="mt-4 flex items-center justify-between text-sm font-semibold">
        <span className="text-gray-600 dark:text-gray-300">
          View details
        </span>

        <ArrowRight
          size={18}
          className="
          text-blue-600 dark:text-blue-400
          transition-transform
          group-hover:translate-x-1
          "
        />
      </div>
    </div>
  );
};

export default Dcards;
