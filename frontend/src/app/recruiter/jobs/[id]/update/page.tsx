// app/recruiter/jobs/[id]/edit/page.tsx
"use client";

import { updateJob, getJobById } from "@/services/jobs.services";
import JobForm from "@/components/jobs/JobForm";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { toastApiWarning } from "@/lib/toast";

export default function EditJobPage() {
  const [job, setJob] = useState(null);
  const { id } = useParams() as { id: string };
  const router = useRouter();
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const data = await getJobById(id);
        // console.log("data",data.data[0]);
        setJob(data.data[0]);
      } catch (err) {
        console.error(err);
        toastApiWarning(err, "Failed to load job details");
      }
    };



    fetchJob();
  }, [id]);

  if (!job) {
    return (
      <div className="h-screen flex items-center justify-center dark:text-white">
        Loading job details...
      </div>
    );
  }

  const handleSubmit = async (data: any) => {
    try {
      await updateJob(id as string, data);
      toast.success("Job updated successfully");
      router.push("/recruiter/jobs");
    } catch (error) {
      console.error(error);
      toastApiWarning(error, "Failed to update job");
    }
  };

  return (
    <div className="mx-auto max-w-5xl p-1 sm:p-4">
      <h1 className="text-xl font-bold mb-4">Update Job</h1>
      <JobForm onSubmit={handleSubmit} initialData={job} />
    </div>
  );
}
