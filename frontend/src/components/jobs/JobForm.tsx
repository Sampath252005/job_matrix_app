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
    <div className="max-w-2xl mx-auto mt-10 px-4">
      <div className="bg-white dark:bg-gray-900 shadow-2xl rounded-2xl p-6 space-y-6 border border-gray-200 dark:border-gray-700">

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Job Title
            </label>
            <div className="flex items-center border rounded-lg px-3 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus-within:ring-2 focus-within:ring-blue-500">
              <Briefcase className="text-gray-400 mr-2" size={18} />
              <input
                type="text"
                placeholder="Frontend Developer"
                value={form.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className="w-full py-2 bg-transparent outline-none"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Description
            </label>
            <div className="flex border rounded-lg px-3 py-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus-within:ring-2 focus-within:ring-blue-500">
              <FileText className="text-gray-400 mr-2 mt-1" size={18} />
              <textarea
                placeholder="Describe the role..."
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className="w-full bg-transparent outline-none min-h-[100px]"
              />
            </div>
          </div>

          {/* Location + Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Location
              </label>
              <div className="flex items-center border rounded-lg px-3 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus-within:ring-2 focus-within:ring-blue-500">
                <MapPin className="text-gray-400 mr-2" size={18} />
                <input
                  type="text"
                  placeholder="Bangalore"
                  value={form.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                  className="w-full py-2 bg-transparent outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Job Type
              </label>
              <select
                value={form.type}
                onChange={(e) => handleChange("type", e.target.value)}
                className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Type</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Remote">Remote</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
          </div>

          {/* Salary + Experience */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Salary
              </label>
              <div className="flex items-center border rounded-lg px-3 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus-within:ring-2 focus-within:ring-blue-500">
                <IndianRupee className="text-gray-400 mr-2" size={18} />
                <input
                  type="text"
                  placeholder="6 LPA"
                  value={form.salary}
                  onChange={(e) => handleChange("salary", e.target.value)}
                  className="w-full py-2 bg-transparent outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Experience
              </label>
              <div className="flex items-center border rounded-lg px-3 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus-within:ring-2 focus-within:ring-blue-500">
                <Clock className="text-gray-400 mr-2" size={18} />
                <input
                  type="text"
                  placeholder="2+ years"
                  value={form.experience}
                  onChange={(e) => handleChange("experience", e.target.value)}
                  className="w-full py-2 bg-transparent outline-none"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-2 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Job"}
          </button>
        </form>
      </div>
    </div>
  );
}
