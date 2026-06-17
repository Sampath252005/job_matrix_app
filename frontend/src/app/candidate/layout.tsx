"use client";

import { useState } from "react";
import CNavbar from "@/components/layout/candidate/CNavbar";
import CSearchBar from "@/components/layout/candidate/CSearchBar";
import { Menu } from "lucide-react";

export default function CandidateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}

      <aside
        className={`fixed md:static z-50 inset-y-0 left-0 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"} `}
      >
        <CNavbar onClose={() => setMobileOpen(false)} />
      </aside>

      {/* Mobile Overlay */}

      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0  bg-black/40 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* Main Area */}

      <div className="flex flex-col flex-1">
        {/* Header */}

        <header
          className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-30"
        >
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Menu size={20} />
          </button>

          <div className="flex-1">
            <CSearchBar onMenuClick={() => setMobileOpen(true)} />
          </div>
        </header>

        {/* Content */}

        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
