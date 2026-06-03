// app/recruiter/jobs/create/page.tsx
"use client";

import { createJob } from "@/services/jobs.services";
import JobForm from "@/components/jobs/JobForm";
import { useRouter } from "next/navigation";

export default function CreateJobPage() {
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    await createJob(data);
    router.push("/recruiter/jobs");
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Create Job</h1>
      <JobForm onSubmit={handleSubmit} />
    </div>
  );
}