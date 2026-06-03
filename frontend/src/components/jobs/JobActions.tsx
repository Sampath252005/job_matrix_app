// components/jobs/JobActions.tsx
"use client";

import { useRouter } from "next/navigation";
import { deleteJob, closeJob } from "@/services/jobs.services";

export default function JobActions({ job, refresh }: any) {
  const router = useRouter();

  const handleDelete = async (job_id:string) => {
    // console.log("job id", job.id);
    await deleteJob(job_id);
    refresh();
  };

  const handleClose = async (job_id:string) => {
    // console.log("closing job id:", job_id);

    try {
      const res = await closeJob(job_id);
      console.log("success:", res);
    } catch (error: any) {
      console.log("status:", error.response?.status);
      console.log("backend error:", error.response?.data);
      console.log("url:", error.config?.url);
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => router.push(`/recruiter/jobs/${job.id}/update`)}
        className="text-blue-500 text-sm"
      >
        Edit
      </button>

      <button onClick={()=>handleClose(job.id)} className="text-yellow-500 text-sm">
        Close
      </button>

      <button onClick={()=>handleDelete(job.id)} className="text-red-500 text-sm">
        Delete
      </button>
    </div>
  );
}
