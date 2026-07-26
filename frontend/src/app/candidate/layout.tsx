"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import CNavbar from "@/components/layout/candidate/CNavbar";
import CSearchBar from "@/components/layout/candidate/CSearchBar";
import { Menu } from "lucide-react";
import CandidateRealtimeProvider from "@/components/socket/CandidateRealtimeProvider";

export default function CandidateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const isAttemptPage = pathname.startsWith("/candidate/attempts/");

  if (isAttemptPage) {
    return (
      <>
        <CandidateRealtimeProvider />
        <main className="min-h-screen bg-slate-950 text-slate-100">
          {children}
        </main>
      </>
    );
  }

  return (
    <>
      <CandidateRealtimeProvider />
      <div className="min-h-screen bg-slate-50/45 text-slate-950 dark:bg-slate-950 dark:text-slate-100">
        <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.12),transparent_32rem),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.10),transparent_28rem)] dark:bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.10),transparent_32rem),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.08),transparent_28rem)]" />

      {/* Sidebar */}
      <aside
        className={`
        fixed inset-y-0 left-0 z-50
        w-72
        bg-white/95 dark:bg-slate-950
        border-r border-slate-200/80 dark:border-slate-800
        shadow-xl shadow-slate-200/60 dark:shadow-none
        transition-transform duration-300 ease-in-out
        lg:translate-x-0
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <CNavbar onClose={() => setMobileOpen(false)} />
      </aside>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Main Section */}
      <div className="relative flex min-h-screen flex-1 flex-col lg:ml-72">
        {/* Header */}
        <header
          className="sticky top-0 z-30 flex items-center gap-4 border-b border-slate-200/70 bg-white/90 px-3 py-3 shadow-sm shadow-slate-200/50 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80 dark:shadow-none sm:px-5"
        >
          <button
            onClick={() => setMobileOpen(true)}
            className=" lg:hidden rounded-xl p-2 text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900 transition"
            aria-label="Open candidate menu"
          >
            <Menu size={22} />
          </button>

          <div className="flex-1">
            <CSearchBar />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
      </div>
    </>
  );
}
