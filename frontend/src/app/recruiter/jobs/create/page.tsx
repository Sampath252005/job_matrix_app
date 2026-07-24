// app/recruiter/jobs/create/page.tsx
"use client";

import { createJob } from "@/services/jobs.services";
import JobForm from "@/components/jobs/JobForm";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { toastApiWarning } from "@/lib/toast";

export default function CreateJobPage() {
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    try {
      await createJob(data);
      toast.success("Job created successfully");
      router.push("/recruiter/jobs");
    } catch (error) {
      console.error(error);
      toastApiWarning(error, "Failed to create job");
    }
  };

  return (
    <div className="mx-auto max-w-5xl p-1 sm:p-4">
      <h1 className="text-xl font-bold mb-4">Create Job</h1>
      <JobForm onSubmit={handleSubmit} />
    </div>
  );
}
