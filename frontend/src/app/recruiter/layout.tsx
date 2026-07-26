"use client";

import { useState } from "react";
import RNavabar from "@/components/layout/recruiter/RnavBar";
import RsearchBar from "@/components/layout/recruiter/RsearchBar";
import { Menu } from "lucide-react";
import QuestionRealtimeProvider from "@/components/socket/QuestionRealtimeProvider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed] = useState(false);

  return (
    <div className="flex h-dvh overflow-hidden bg-slate-50/45 dark:bg-slate-950">
      <QuestionRealtimeProvider />
      {/* ================= SIDEBAR ================= */}

      <aside
        className={`fixed inset-y-0 left-0 z-50 ${collapsed ? "w-20" : "w-72 max-w-[85vw]"} transform border-r border-slate-200/80 bg-white/95 shadow-xl shadow-slate-200/60 transition-all duration-300 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none lg:static lg:max-w-none ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} `}
      >
        <RNavabar onClose={() => setMobileOpen(false)} />
      </aside>

      {/* ================= MOBILE OVERLAY ================= */}

      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* ================= MAIN AREA ================= */}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* ================= HEADER ================= */}

        <header
          className="sticky top-0 z-30 flex items-center gap-3 border-b border-slate-200/70 bg-white/90 px-3 py-3 shadow-sm shadow-slate-200/50 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900 dark:shadow-none sm:px-4"
        >
          {/* Mobile Hamburger */}

          <button
            onClick={() => setMobileOpen(true)}
            className="shrink-0 rounded-md p-2 hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
            aria-label="Open recruiter navigation"
          >
            <Menu size={20} />
          </button>

          {/* Search / Greeting */}

          <div className="min-w-0 flex-1">
            <RsearchBar />
          </div>

          {/* Desktop Collapse Arrow */}

          {/* <button
            onClick={() => setCollapsed(!collapsed)}
            className="
            hidden md:flex
            ml-4 p-2
            rounded-md
            hover:bg-gray-100
            dark:hover:bg-gray-800
            "
          >
            {collapsed ? (
              <ArrowRightFromLine size={18} />
            ) : (
              <ArrowLeftFromLine size={18} />
            )}
          </button> */}
        </header>

        {/* ================= PAGE CONTENT ================= */}

        <main
          className="flex-1 overflow-y-auto p-3 sm:p-5 lg:p-6"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
