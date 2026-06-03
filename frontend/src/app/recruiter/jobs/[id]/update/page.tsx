// app/recruiter/jobs/[id]/edit/page.tsx
"use client";

import { updateJob, getJobById } from "@/services/jobs.services";
import JobForm from "@/components/jobs/JobForm";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

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
    await updateJob(id as string, data);
    router.push("/recruiter/jobs");
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Update Job</h1>
      <JobForm onSubmit={handleSubmit} initialData={job} />
    </div>
  );
}
