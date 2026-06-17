"use client";

import { useEffect, useState } from "react";
import { getMyApplications } from "@/services/application.services";
import CandidateApplicationCard from "@/components/layout/candidate/CandidateApplicationCard";

export default function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const data = await getMyApplications();
      setApplications(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center py-20">
        Loading Applications...
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">My Applications</h1>

      <p className="text-gray-500 mb-8">
        Track all jobs you've applied for
      </p>

      {applications.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-10 text-center">
          No applications found
        </div>
      ) : (
        <div className="grid gap-6">
          {applications.map((application: any) => (
            <CandidateApplicationCard
              key={application.id}
              application={application}
              reload={loadApplications}
            />
          ))}
        </div>
      )}
    </div>
  );
}