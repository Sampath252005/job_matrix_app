import React from "react";
import { AlarmClock, ArrowRight } from "lucide-react";

const Dcards = ({ count = 17, title = "All Jobs" }) => {
  return (
    <div className="w-64 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
      {/* Top Section */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
        <div className="flex flex-col">
          <span className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            {count}
          </span>
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {title}
          </span>
        </div>

        <div className=" p-3 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
          <AlarmClock size={24} />
        </div>
      </div>

      {/* Bottom Action */}
      <div className="mt-4 flex items-center justify-between text-sm font-semibold">
        <span className="text-slate-600 dark:text-slate-300">View more</span>
        <ArrowRight
          size={18}
          className="text-blue-600 dark:text-blue-400 transition-transform group-hover:translate-x-1"
        />
      </div>
    </div>
  );
};

export default Dcards;
