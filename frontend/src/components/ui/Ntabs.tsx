import React from "react";

type NtabsProps = {
  icon: React.ReactNode;
  name: string;
  active?: boolean;
};

const Ntabs = ({ icon, name, active = false }: NtabsProps) => {
  return (
    <div
      className={`
        flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer
        text-sm font-medium transition-all
        ${
          active
            ? "bg-blue-600 text-white"
            : "text-gray-600 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-gray-800 hover:text-blue-700 dark:hover:text-blue-400"
        }
      `}
    >
      <span className="shrink-0">{icon}</span>
      <span>{name}</span>
    </div>
  );
};

export default Ntabs;
