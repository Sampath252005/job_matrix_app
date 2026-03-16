"use client";

import { useState } from "react";
import RNavabar from "@/components/layout/recruiter/RnavBar";
import RsearchBar from "@/components/layout/recruiter/RsearchBar";
import { Menu, ArrowLeftFromLine, ArrowRightFromLine } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      {/* ================= SIDEBAR ================= */}

      <aside
        className={`fixed md:static z-50 inset-y-0 left-0 ${collapsed ? "w-20" : "w-64"} bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-all duration-30 ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"} `}
      >
        <RNavabar onClose={() => setMobileOpen(false)} />
      </aside>

      {/* ================= MOBILE OVERLAY ================= */}

      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* ================= MAIN AREA ================= */}

      <div className="flex flex-col flex-1 md:ml-0">
        {/* ================= HEADER ================= */}

        <header
          className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-30"
        >
          {/* Mobile Hamburger */}

          <button
            onClick={() => setMobileOpen(true)}
            className="md:hiddenp-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Menu size={20} />
          </button>

          {/* Search / Greeting */}

          <div className="flex-1">
            <RsearchBar onMenuClick={() => setMobileOpen(true)} />
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
          className="flex-1 overflow-y-auto p-6"
        >
          {children}
        </main>
      </div>
    </div>
  );
}