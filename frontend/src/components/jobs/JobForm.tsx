"use client";

import { useState } from "react";
import { Briefcase, MapPin, IndianRupee, Clock, FileText } from "lucide-react";
import toast from "react-hot-toast";
import { JobPayload, validateJob } from "@/lib/validation";

type JobFormValues = Omit<JobPayload, "salary"> & { salary: string | number };

interface JobFormProps {
  initialData?: Partial<JobFormValues>;
  onSubmit: (data: JobPayload) => Promise<void>;
}

export default function JobForm({ initialData, onSubmit }: JobFormProps) {
  // console.log("Intial Data",initialData.title);

  const [form, setForm] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    location: initialData?.location || "",
    type: initialData?.type || "",
    salary: initialData?.salary ?? "",
    experience: initialData?.experience || "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = validateJob(form);
    if (!result.valid) {
      toast.error(result.message);
      return;
    }
    setLoading(true);
    try {
      await onSubmit(result.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent px-0 py-4 dark:bg-gray-950 sm:px-4 sm:py-8 lg:py-10">
      <div className="max-w-5xl mx-auto">
        {/* Page Header */}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            Create New Job
          </h1>

          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Fill in the details below to publish a new job opening.
          </p>
        </div>

        {/* Card */}

        <div
          className="
      rounded-3xl
      border
      border-slate-200/80
      dark:border-gray-800
      bg-white/90
      dark:bg-gray-900
      shadow-xl
      shadow-slate-200/70
      dark:shadow-none
      p-4
      sm:p-6
      lg:p-8
      "
        >
          <form onSubmit={handleSubmit} noValidate className="space-y-8">
            {/* ================= BASIC INFORMATION ================= */}

            <div>
              <h2 className="text-xl font-semibold mb-6">Basic Information</h2>

              <div className="grid gap-5 md:grid-cols-2 lg:gap-6">
                {/* Title */}

                <div>
                  <label className="block mb-2 font-medium">Job Title</label>

                  <div className="flex items-center rounded-xl border border-slate-200 bg-white/80 px-4 shadow-sm shadow-slate-200/50 dark:border-gray-700 dark:bg-gray-800 dark:shadow-none">
                    <Briefcase size={18} className="text-blue-500" />

                    <input
                      type="text"
                      required
                      maxLength={100}
                      placeholder="Frontend Developer"
                      value={form.title}
                      onChange={(e) => handleChange("title", e.target.value)}
                      className="w-full bg-transparent py-3 px-3 outline-none"
                    />
                  </div>
                </div>

                {/* Location */}

                <div>
                  <label className="block mb-2 font-medium">Location</label>

                  <div className="flex items-center rounded-xl border border-slate-200 bg-white/80 px-4 shadow-sm shadow-slate-200/50 dark:border-gray-700 dark:bg-gray-800 dark:shadow-none">
                    <MapPin size={18} className="text-blue-500" />

                    <input
                      type="text"
                      required
                      maxLength={100}
                      placeholder="Bangalore"
                      value={form.location}
                      onChange={(e) => handleChange("location", e.target.value)}
                      className="w-full bg-transparent py-3 px-3 outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ================= DESCRIPTION ================= */}

            <div>
              <h2 className="text-xl font-semibold mb-6">Description</h2>

              <div className="flex rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm shadow-slate-200/50 dark:border-gray-700 dark:bg-gray-800 dark:shadow-none">
                <FileText className="text-blue-500 mt-1" size={18} />

                <textarea
                  required
                  minLength={20}
                  maxLength={5000}
                  placeholder="Describe the role, responsibilities, requirements..."
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  className="
              w-full
              ml-3
              bg-transparent
              outline-none
              min-h-[180px]
              resize-none
              "
                />
              </div>
            </div>

            {/* ================= JOB DETAILS ================= */}

            <div>
              <h2 className="text-xl font-semibold mb-6">Job Details</h2>

              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3 lg:gap-6">
                {/* Type */}

                <div>
                  <label className="block mb-2 font-medium">Job Type</label>

                  <select
                    value={form.type}
                    onChange={(e) => handleChange("type", e.target.value)}
                    className="
                w-full
                rounded-xl
                border
                border-slate-200
                dark:border-gray-700
                bg-white/80
                dark:bg-gray-800
                shadow-sm
                shadow-slate-200/50
                dark:shadow-none
                py-3
                px-4
                outline-none
                "
                  >
                    <option value="">Select Type</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Remote">Remote</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>

                {/* Salary */}

                <div>
                  <label className="block mb-2 font-medium">Salary</label>

                  <div className="flex items-center rounded-xl border border-slate-200 bg-white/80 px-4 shadow-sm shadow-slate-200/50 dark:border-gray-700 dark:bg-gray-800 dark:shadow-none">
                    <IndianRupee size={18} className="text-blue-500" />

                    <input
                      type="number"
                      min="0"
                      step="1"
                      placeholder="800000"
                      value={form.salary}
                      onChange={(e) => handleChange("salary", e.target.value)}
                      className="w-full bg-transparent py-3 px-3 outline-none"
                    />
                  </div>
                </div>

                {/* Experience */}

                <div>
                  <label className="block mb-2 font-medium">Experience</label>

                  <div className="flex items-center rounded-xl border border-slate-200 bg-white/80 px-4 shadow-sm shadow-slate-200/50 dark:border-gray-700 dark:bg-gray-800 dark:shadow-none">
                    <Clock size={18} className="text-blue-500" />

                    <input
                      placeholder="2+ Years"
                      value={form.experience}
                      onChange={(e) =>
                        handleChange("experience", e.target.value)
                      }
                      className="w-full bg-transparent py-3 px-3 outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ================= ACTION BUTTONS ================= */}

            <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-end sm:gap-4">
              <button
                type="button"
                className="
            rounded-xl
            border
            border-gray-300
            dark:border-gray-700
            px-6
            py-3
            hover:bg-gray-100
            dark:hover:bg-gray-800
            transition
            w-full
            sm:w-auto
            "
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="
            rounded-xl
            bg-gradient-to-r
            from-blue-600
            to-indigo-600
            px-8
            py-3
            text-white
            font-semibold
            shadow-lg
            hover:scale-105
            transition
            disabled:opacity-50
            w-full
            sm:w-auto
            "
              >
                {loading ? "Publishing..." : "Publish Job"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
