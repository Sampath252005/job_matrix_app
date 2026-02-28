"use client";
import RNavabar from "@/components/layout/recruiter/RnavBar";
import RsearchBar from "@/components/layout/recruiter/RsearchBar";
import { useState } from "react";
import {ArrowRightFromLine} from "lucide-react"
type NavbarProps = {
  onMenuClick: () => void;
};
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [navbarOpen, setNavbarOpen] = useState(true);
  return (
    <div className="relative md:static md:flex w-full h-screen overflow-hidden">
      <div
        onClick={() => setNavbarOpen(false)}
        className={`
          fixed inset-0 z-40
          bg-black/40 backdrop-blur-sm
          transition-opacity duration-300
          ${navbarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
      />

      <div
        className={`
          fixed top-0 left-0 z-50 h-full w-60
          bg-white dark:bg-gray-900
          transform transition-transform duration-300
          ${navbarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <RNavabar onClose={() => setNavbarOpen(false)} />
      </div>
      <div className=" relative md:static flex-1 p-2">
        {/* //when navabr close the navbar toggle should be visible  */}
        <span className={navbarOpen?"hidden":"absolute top-1/2 z-50 cursor-pointer bg-blue-600 text-white p-1 rounded-r-full"} onClick={()=>setNavbarOpen(true)}>
          <ArrowRightFromLine/>
        </span>
        <RsearchBar  onMenuClick={() => setNavbarOpen(true)} />
        <div>{children}</div>
      </div>
    </div>
  );
}
