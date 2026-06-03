"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Briefcase, FileText, MapPin, IndianRupee } from "lucide-react";

interface JobFormProps {
  initialData: any;
  onSubmit: (data: any) => Promise<void>;
  isLoading?: boolean;
}

export default function UpdateJobForm({
  initialData,
  onSubmit,
  isLoading,
}: JobFormProps) {
  const [form, setForm] = useState({
    title:initialData.title||"",
    company:initialData.company|| "",
    location:initialData.location|| "",
    salary:initialData.salary|| "",
    description:initialData.description||"",
  });



  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    await onSubmit(form);
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4 bg-gray-100 dark:bg-gray-900 transition-colors">
      <Card className="w-full max-w-2xl shadow-xl rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <CardContent className="p-6 space-y-6">
          
          {/* Heading */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <Briefcase size={22} />
              Update Job
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Edit job details below
            </p>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Job Title
            </label>
            <div className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600">
              <Briefcase className="text-gray-400" size={18} />
              <Input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter job title"
                className="border-none focus:ring-0 bg-transparent text-gray-800 dark:text-white"
              />
            </div>
          </div>

          {/* Company */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Company
            </label>
            <div className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600">
              <FileText className="text-gray-400" size={18} />
              <Input
                name="company"
                value={form.company}
                onChange={handleChange}
                placeholder="Company name"
                className="border-none focus:ring-0 bg-transparent text-gray-800 dark:text-white"
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Location
            </label>
            <div className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600">
              <MapPin className="text-gray-400" size={18} />
              <Input
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Job location"
                className="border-none focus:ring-0 bg-transparent text-gray-800 dark:text-white"
              />
            </div>
          </div>

          {/* Salary */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Salary
            </label>
            <div className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600">
              <IndianRupee className="text-gray-400" size={18} />
              <Input
                name="salary"
                value={form.salary}
                onChange={handleChange}
                placeholder="Salary range"
                className="border-none focus:ring-0 bg-transparent text-gray-800 dark:text-white"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Job Description
            </label>
            <Textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Enter job description..."
              className="min-h-[120px] bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white"
            />
          </div>

          {/* Button */}
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full py-2 text-base font-semibold rounded-lg bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 transition"
          >
            {isLoading ? "Updating..." : "Update Job"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}