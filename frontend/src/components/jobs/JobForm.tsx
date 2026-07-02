"use client";

import { useState } from "react";
import { Briefcase, MapPin, IndianRupee, Clock, FileText } from "lucide-react";

export default function JobForm({ initialData, onSubmit }: any) {
  // console.log("Intial Data",initialData.title);

  const [form, setForm] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    location: initialData?.location || "",
    type: initialData?.type || "",
    salary: initialData?.salary || "",
    experience: initialData?.experience || "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit(form);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Page Header */}

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
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
      border-gray-200
      dark:border-gray-800
      bg-white
      dark:bg-gray-900
      shadow-xl
      p-8
      "
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* ================= BASIC INFORMATION ================= */}

            <div>
              <h2 className="text-xl font-semibold mb-6">Basic Information</h2>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Title */}

                <div>
                  <label className="block mb-2 font-medium">Job Title</label>

                  <div className="flex items-center rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4">
                    <Briefcase size={18} className="text-blue-500" />

                    <input
                      type="text"
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

                  <div className="flex items-center rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4">
                    <MapPin size={18} className="text-blue-500" />

                    <input
                      type="text"
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

              <div className="flex rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-4">
                <FileText className="text-blue-500 mt-1" size={18} />

                <textarea
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

              <div className="grid md:grid-cols-3 gap-6">
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
                border-gray-300
                dark:border-gray-700
                bg-gray-50
                dark:bg-gray-800
                py-3
                px-4
                outline-none
                "
                  >
                    <option>Select Type</option>
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Remote</option>
                    <option>Internship</option>
                  </select>
                </div>

                {/* Salary */}

                <div>
                  <label className="block mb-2 font-medium">Salary</label>

                  <div className="flex items-center rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4">
                    <IndianRupee size={18} className="text-blue-500" />

                    <input
                      placeholder="8-12 LPA"
                      value={form.salary}
                      onChange={(e) => handleChange("salary", e.target.value)}
                      className="w-full bg-transparent py-3 px-3 outline-none"
                    />
                  </div>
                </div>

                {/* Experience */}

                <div>
                  <label className="block mb-2 font-medium">Experience</label>

                  <div className="flex items-center rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4">
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

            <div className="flex justify-end gap-4 pt-4">
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
