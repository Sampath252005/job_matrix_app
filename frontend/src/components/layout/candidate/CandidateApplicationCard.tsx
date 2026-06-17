"use client";

import { useState } from "react";
import toast from "react-hot-toast";

import {
  getApplicationDetails,
  withdrawApplication,
} from "@/services/application.services";

interface Props {
  application: any;
  reload: () => void;
}

export default function CandidateApplicationCard({
  application,
  reload,
}: Props) {
  const [showDetails, setShowDetails] = useState(false);
  const [details, setDetails] = useState<any>(null);

  const handleViewDetails = async () => {
    try {
      const data = await getApplicationDetails(application.id);

      setDetails(data.data);
      setShowDetails(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleWithdraw = async () => {
    try {
      await withdrawApplication(application.id);

      toast.success("Application withdrawn");
      reload();
    } catch (error) {
      toast.error("Failed to withdraw");
    }
  };

  const statusColor = {
    PENDING:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300",
    ACCEPTED:
      "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300",
    REJECTED:
      "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300",
  };

  return (
    <>
      <div
        className="
        bg-white
        dark:bg-zinc-900
        border
        border-gray-200
        dark:border-zinc-800
        rounded-2xl
        p-6
        shadow-sm
        "
      >
        <div className="flex justify-between">
          <div>
            <h2 className="text-xl font-bold">
              {application.jobs.title}
            </h2>

            <p className="text-gray-500">
              📍 {application.jobs.location}
            </p>
          </div>

          <span
            className={`
              px-3 py-1 rounded-full text-sm
              ${statusColor[
                application.status as keyof typeof statusColor
              ]}
            `}
          >
            {application.status}
          </span>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mt-5">
          <div>
            <p className="text-sm text-gray-500">Salary</p>
            <p>{application.jobs.salary}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Job Type</p>
            <p>{application.jobs.type}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Applied On</p>
            <p>
              {new Date(
                application.applied_at
              ).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleViewDetails}
            className="
            px-4 py-2
            rounded-lg
            bg-blue-600
            text-white
            "
          >
            View Details
          </button>

          <button
            onClick={handleWithdraw}
            className="
            px-4 py-2
            rounded-lg
            bg-red-600
            text-white
            "
          >
            Withdraw
          </button>
        </div>
      </div>

      {showDetails && details && (
        <div
          className="
          fixed inset-0
          bg-black/50
          flex items-center justify-center
          z-50
          "
        >
          <div
            className="
            bg-white
            dark:bg-zinc-900
            p-8
            rounded-2xl
            max-w-2xl
            w-full
            mx-4
            "
          >
            <h2 className="text-2xl font-bold mb-4">
              {details.jobs.title}
            </h2>

            <div className="space-y-3">
              <p>
                <strong>Location:</strong>{" "}
                {details.jobs.location}
              </p>

              <p>
                <strong>Type:</strong>{" "}
                {details.jobs.type}
              </p>

              <p>
                <strong>Salary:</strong>{" "}
                {details.jobs.salary}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {details.status}
              </p>

              <div>
                <strong>Description:</strong>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  {details.jobs.description}
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowDetails(false)}
              className="
              mt-6
              px-4 py-2
              bg-gray-700
              text-white
              rounded-lg
              "
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}