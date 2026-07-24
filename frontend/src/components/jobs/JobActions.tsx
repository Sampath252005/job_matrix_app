// components/jobs/JobActions.tsx
"use client";

import { useRouter } from "next/navigation";
import { deleteJob, closeJob } from "@/services/jobs.services";
import toast from "react-hot-toast";
import { toastApiWarning } from "@/lib/toast";

export default function JobActions({ job, refresh }: any) {
  const router = useRouter();

  const handleDelete = async (job_id:string) => {
    try {
      await deleteJob(job_id);
      toast.success("Job deleted successfully");
      refresh();
    } catch (error) {
      console.error(error);
      toastApiWarning(error, "Failed to delete job");
    }
  };

  const handleClose = async (job_id:string) => {
    // console.log("closing job id:", job_id);

    try {
      const res = await closeJob(job_id);
      console.log("success:", res);
      toast.success("Job closed successfully");
      refresh();
    } catch (error: any) {
      console.log("status:", error.response?.status);
      console.log("backend error:", error.response?.data);
      console.log("url:", error.config?.url);
      toastApiWarning(error, "Failed to close job");
    }
  };

  return (
    <div className="flex flex-wrap gap-3 sm:justify-end">
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
