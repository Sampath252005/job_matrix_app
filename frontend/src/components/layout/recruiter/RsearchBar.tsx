"use client";

import React, { useEffect, useState } from "react";
import { User, ChevronDown } from "lucide-react";

const name = "Sampath";

type RsearchBarProps = {
  onMenuClick: () => void;
};

const RsearchBar = ({ onMenuClick }: RsearchBarProps) => {
  const [mounted, setMounted] = useState(false);
  const [openProfile,setOpenProfile]=useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ⛔ prevent hydration mismatch
  if (!mounted) return null;

  return (
  
    <div
      className="flex w-full justify-between items-center p-2
      bg-white dark:bg-gray-900
      text-gray-800 dark:text-gray-100
      border border-gray-200 dark:border-gray-700
      shadow-md"
    >
      <div className="flex flex-col text-lg p-1">
        <span className="font-bold">Good Morning</span>
        <span className="text-sm font-bold">
          Here what you need to focus on today
        </span>
      </div>

      <div  className="relative p-2 flex gap-2 justify-center items-center bg-blue-600 text-white text-sm rounded-2xl hover:cursor-pointer">
        <span className="bg-blue-500 rounded-full p-2">
          <User />
        </span>
        <span className="hidden md:block font-bold text-md">{name}</span>
        <span onClick={()=>setOpenProfile(!openProfile)} className=" hidden md:block hover:bg-blue-500 rounded-full ">
          <ChevronDown />
        </span>
        <div className={ ` ${openProfile?"hidden md:flex ":"hidden"}  absolute  flex flex-col justify-center items-center gap-2 top-16 bg-blue-600 z-50 right-0 w-full p-2 rounded-xl font-semibold `}>
          <span className="border-b w-full text-center pb-2">Open Profile</span>
          <span>Log Out</span>  
        </div>
      </div>
    </div>
  );
};

export default RsearchBar;
