"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  createAssessment,
  getAssessmentByJob,
  updateAssessment,
  publishAssessment,
} from "@/services/assessment.services";

interface Assessment {
  id: string;
  title: string;
  description?: string;
  duration_minutes: number;
  passing_score: number;

  start_time?: string;
  end_time?: string;
  status: string;
}

export default function AssessmentPage() {
  const params = useParams();
  const router = useRouter();

  const jobId = params.id as string;

  const [loading, setLoading] = useState(true);

  const [assessment, setAssessment] = useState<Assessment | null>(null);

  const [title, setTitle] = useState("");

  const [description, setDescription] = useState("");

  const [durationMinutes, setDurationMinutes] = useState(30);

  const [passingScore, setPassingScore] = useState(10);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [status, setStatus] = useState("ACTIVE");

  useEffect(() => {
    fetchAssessment();
  }, []);

  const handlePublish = async () => {
     if (!assessment) return;
    try {
      const res = await publishAssessment(assessment.id);
        toast.success("Assessment published");
      fetchAssessment();
    } catch (error: any) {
      const message = error?.response?.data?.message;

      if (message === "Assessment already published") {
        toast.error("Assessment already published");
      } else {
        toast.error("Failed to publish assessment");
      }

      console.error(error);
    }
  };
  const fetchAssessment = async () => {
    try {
      const res = await getAssessmentByJob(jobId);

      if (res?.data) {
        setAssessment(res.data);

        setTitle(res.data.title);
        setDescription(res.data.description || "");
        setDurationMinutes(res.data.duration_minutes);
        setPassingScore(res.data.passing_score);

        setStartTime(
          res.data.start_time ? res.data.start_time.slice(0, 16) : "",
        );

        setEndTime(res.data.end_time ? res.data.end_time.slice(0, 16) : "");

        setStatus(res.data.status);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!assessment) return;

    try {
      await updateAssessment(assessment.id, {
        title,
        description,
        duration_minutes: durationMinutes,
        passing_score: passingScore,
        start_time: startTime,
        end_time: endTime,
        status,
      });

      alert("Assessment updated successfully");

      fetchAssessment();
    } catch (error) {
      console.error(error);
      alert("Failed to update assessment");
    }
  };
  const handleCreateAssessment = async () => {
    try {
      const res = await createAssessment({
        job_id: jobId,
        title,
        description,
        duration_minutes: durationMinutes,
        passing_score: passingScore,
      });

      setAssessment(res.data);

      alert("Assessment created successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to create assessment");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Assessment Management</h1>

      {assessment ? (
        <div
          className="
      bg-white
      dark:bg-zinc-900
      border
      border-gray-200
      dark:border-zinc-800
      rounded-xl
      p-6
      shadow
    "
        >
          <h2 className="text-2xl font-bold mb-6">Assessment Settings</h2>

          <div className="space-y-4">
            <div>
              <label className="block mb-2 font-medium">Title</label>

              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="
            w-full
            border
            border-gray-300
            dark:border-zinc-700
            bg-white
            dark:bg-zinc-950
            rounded-lg
            p-3
          "
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Description</label>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="
            w-full
            border
            border-gray-300
            dark:border-zinc-700
            bg-white
            dark:bg-zinc-950
            rounded-lg
            p-3
          "
                rows={4}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 font-medium">
                  Duration (Minutes)
                </label>

                <input
                  type="number"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  className="
              w-full
              border
              border-gray-300
              dark:border-zinc-700
              bg-white
              dark:bg-zinc-950
              rounded-lg
              p-3
            "
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">Passing Score</label>

                <input
                  type="number"
                  value={passingScore}
                  onChange={(e) => setPassingScore(Number(e.target.value))}
                  className="
              w-full
              border
              border-gray-300
              dark:border-zinc-700
              bg-white
              dark:bg-zinc-950
              rounded-lg
              p-3
            "
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 font-medium">Start Time</label>

                <input
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="
              w-full
              border
              border-gray-300
              dark:border-zinc-700
              bg-white
              dark:bg-zinc-950
              rounded-lg
              p-3
            "
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">End Time</label>

                <input
                  type="datetime-local"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="
              w-full
              border
              border-gray-300
              dark:border-zinc-700
              bg-white
              dark:bg-zinc-950
              rounded-lg
              p-3
            "
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 font-medium">Status</label>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="
            w-full
            border
            border-gray-300
            dark:border-zinc-700
            bg-white
            dark:bg-zinc-950
            rounded-lg
            p-3
          "
              >
                <option value="ACTIVE">ACTIVE</option>

                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={handleSaveSettings}
              className="
          px-4
          py-2
          rounded-lg
          bg-green-600
          hover:bg-green-700
          text-white
        "
            >
              Save Settings
            </button>

            <button
              onClick={() =>
                router.push(`assessment/${assessment.id}/questions`)
              }
              className="
          px-4
          py-2
          rounded-lg
          bg-blue-600
          hover:bg-blue-700
          text-white
        "
            >
              Manage Questions
            </button>
            <button
              onClick={handlePublish}
              className="
    px-4
    py-2
    rounded-lg
    bg-green-600
    hover:bg-green-700
    text-white
  "
            >
              Publish Assessment
            </button>

            <button
              className="
          px-4
          py-2
          rounded-lg
          bg-red-600
          hover:bg-red-700
          text-white
        "
            >
              Delete Assessment
            </button>
          </div>
        </div>
      ) : (
        <div
          className="
          bg-white
          dark:bg-zinc-900
          border
          border-gray-200
          dark:border-zinc-800
          rounded-xl
          p-6
          shadow
          "
        >
          <h2 className="text-xl font-semibold mb-4">Create Assessment</h2>

          <div className="space-y-4">
            <input
              className="
              w-full
              border
              border-gray-300
              dark:border-zinc-700
              bg-white
              dark:bg-zinc-950
              rounded-lg
              p-3
              "
              placeholder="Assessment Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              className="
              w-full
              border
              border-gray-300
              dark:border-zinc-700
              bg-white
              dark:bg-zinc-950
              rounded-lg
              p-3
              "
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <input
              type="number"
              className="
              w-full
              border
              border-gray-300
              dark:border-zinc-700
              bg-white
              dark:bg-zinc-950
              rounded-lg
              p-3
              "
              placeholder="Duration"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
            />

            <input
              type="number"
              className="
              w-full
              border
              border-gray-300
              dark:border-zinc-700
              bg-white
              dark:bg-zinc-950
              rounded-lg
              p-3
              "
              placeholder="Passing Score"
              value={passingScore}
              onChange={(e) => setPassingScore(Number(e.target.value))}
            />

            <button
              onClick={handleCreateAssessment}
              className="
              bg-blue-600
              hover:bg-blue-700
              text-white
              px-5
              py-3
              rounded-lg
              "
            >
              Create Assessment
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
