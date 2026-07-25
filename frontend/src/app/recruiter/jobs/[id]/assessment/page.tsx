"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import {
  ClipboardList,
  FileText,
  Clock3,
  Trophy,
  PlusCircle,
  Settings2,
  CalendarDays,
  CheckCircle2,
  Save,
  Trash2,
  FileQuestion,
  Rocket,
} from "lucide-react";
import toast from "react-hot-toast";
import { toastApiWarning } from "@/lib/toast";
import { validateAssessment } from "@/lib/validation";
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
  is_published: boolean;
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
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    fetchAssessment();
  }, []);

  const handlePublish = async () => {
    if (!assessment || assessment.is_published || publishing) return;
    setPublishing(true);
    try {
      await publishAssessment(assessment.id);
      toast.success("Assessment published");
      await fetchAssessment();
    } catch (error: unknown) {
      const message =
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof error.response === "object" &&
        error.response !== null &&
        "data" in error.response &&
        typeof error.response.data === "object" &&
        error.response.data !== null &&
        "message" in error.response.data
          ? error.response.data.message
          : undefined;

      toast.error(
        typeof message === "string" && message
          ? message
          : "Failed to publish assessment",
      );

      console.error(error);
    } finally {
      setPublishing(false);
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
      toastApiWarning(error, "Failed to load assessment");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!assessment) return;
    const validation = validateAssessment({ title, description, durationMinutes, passingScore, startTime, endTime });
    if (!validation.valid) {
      toast.error(validation.message);
      return;
    }

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

      toast.success("Assessment updated successfully");

      fetchAssessment();
    } catch (error) {
      console.error(error);
      toastApiWarning(error, "Failed to update assessment");
    }
  };
  const handleCreateAssessment = async () => {
    const validation = validateAssessment({ title, description, durationMinutes, passingScore });
    if (!validation.valid) {
      toast.error(validation.message);
      return;
    }
    try {
      const res = await createAssessment({
        job_id: jobId,
        title,
        description,
        duration_minutes: durationMinutes,
        passing_score: passingScore,
      });

      setAssessment(res.data);

      toast.success("Assessment created successfully");
    } catch (error) {
      console.error(error);
      toastApiWarning(error, "Failed to create assessment");
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
    <div className="mx-auto max-w-5xl p-3 sm:p-5 lg:p-8">
      <h1 className="mb-6 text-2xl font-bold sm:text-3xl">Assessment Management</h1>

      {assessment ? (
        <div
          className="
    rounded-3xl
    border
    border-gray-200
    dark:border-gray-800
    bg-white
    dark:bg-gray-900
    shadow-xl
    overflow-hidden
  "
        >
          {/* Header */}

          <div className="border-b border-gray-200 p-4 dark:border-gray-800 sm:p-6 lg:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
              <div
                className="
          h-14
          w-14
          shrink-0
          sm:h-16
          sm:w-16
          rounded-2xl
          bg-gradient-to-br
          from-blue-600
          to-indigo-600
          flex
          items-center
          justify-center
          text-white
        "
              >
                <Settings2 size={30} />
              </div>

              <div>
                <h2 className="text-2xl font-bold sm:text-3xl">Assessment Settings</h2>

                <p className="text-gray-500 mt-1">
                  Configure assessment information, schedule, scoring and
                  publishing.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}

          <div className="space-y-8 p-4 sm:p-6 lg:p-8">
            {/* Basic Information */}

            <div>
              <h3 className="text-xl font-semibold mb-5">Basic Information</h3>

              <div className="space-y-6">
                <div>
                  <label className="block mb-2 font-medium">
                    Assessment Title
                  </label>

                  <div className="flex items-center rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4">
                    <ClipboardList className="text-blue-600" size={18} />

                    <input
                      required
                      maxLength={100}
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-transparent py-3 px-3 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 font-medium">Description</label>

                  <div className="flex rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-4">
                    <FileText className="text-blue-600 mt-1" size={18} />

                    <textarea
                      maxLength={2000}
                      rows={5}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full ml-3 bg-transparent outline-none resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Configuration */}

            <div>
              <h3 className="text-xl font-semibold mb-5">
                Assessment Configuration
              </h3>

              <div className="grid gap-5 lg:grid-cols-2 lg:gap-6">
                <div>
                  <label className="block mb-2 font-medium">Duration</label>

                  <div className="flex items-center rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4">
                    <Clock3 className="text-blue-600" size={18} />

                    <input
                      type="number"
                      min={1}
                      max={480}
                      step={1}
                      value={durationMinutes}
                      onChange={(e) =>
                        setDurationMinutes(Number(e.target.value))
                      }
                      className="w-full bg-transparent py-3 px-3 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 font-medium">
                    Passing Score (%)
                  </label>

                  <div className="flex items-center rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4">
                    <Trophy className="text-yellow-500" size={18} />

                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={passingScore}
                      onChange={(e) => setPassingScore(Number(e.target.value))}
                      className="w-full bg-transparent py-3 px-3 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 font-medium">Start Time</label>

                  <div className="flex items-center rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4">
                    <CalendarDays className="text-blue-600" size={18} />

                    <input
                      type="datetime-local"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full bg-transparent py-3 px-3 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 font-medium">End Time</label>

                  <div className="flex items-center rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4">
                    <CalendarDays className="text-blue-600" size={18} />

                    <input
                      type="datetime-local"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full bg-transparent py-3 px-3 outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Status */}

            <div>
              <label className="block mb-2 font-medium">
                Assessment Status
              </label>

              <div className="flex items-center rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4">
                <CheckCircle2 className="text-green-600" size={18} />

                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-transparent py-3 px-3 outline-none"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>
            </div>

            {/* Footer Buttons */}

            <div className="grid gap-3 border-t border-gray-200 pt-8 dark:border-gray-800 sm:grid-cols-2 lg:flex lg:flex-wrap lg:gap-4">
              <button
                onClick={handleSaveSettings}
                className="
          inline-flex
          items-center
          justify-center
          gap-2
          rounded-xl
          bg-gradient-to-r
          from-green-600
          to-emerald-600
          px-6
          py-3
          text-white
          font-semibold
          hover:scale-105
          transition
        "
              >
                <Save size={18} />
                Save Settings
              </button>

              <button
                onClick={() =>
                  router.push(`assessment/${assessment.id}/questions`)
                }
                className="
          inline-flex
          items-center
          justify-center
          gap-2
          rounded-xl
          bg-gradient-to-r
          from-blue-600
          to-indigo-600
          px-6
          py-3
          text-white
          font-semibold
          hover:scale-105
          transition
        "
              >
                <FileQuestion size={18} />
                Manage Questions
              </button>

              <button
                onClick={handlePublish}
                disabled={assessment.is_published || publishing}
                className="
          inline-flex
          items-center
          justify-center
          gap-2
          rounded-xl
          bg-gradient-to-r
          from-purple-600
          to-pink-600
          px-6
          py-3
          text-white
          font-semibold
          hover:scale-105
          disabled:cursor-not-allowed
          disabled:from-gray-400
          disabled:to-gray-500
          disabled:hover:scale-100
          transition
        "
              >
                <Rocket size={18} />
                {assessment.is_published
                  ? "Published"
                  : publishing
                    ? "Publishing..."
                    : "Publish"}
              </button>

              <button
                className="
          inline-flex
          items-center
          justify-center
          gap-2
          rounded-xl
          border
          border-red-300
          dark:border-red-700
          px-6
          py-3
          text-red-600
          hover:bg-red-50
          dark:hover:bg-red-900/20
          transition
        "
              >
                <Trash2 size={18} />
                Delete
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          className="
    rounded-3xl
    border
    border-gray-200
    dark:border-gray-800
    bg-white
    dark:bg-gray-900
    shadow-xl
    overflow-hidden
  "
        >
          {/* Header */}

          <div
            className="
      border-b
      border-gray-200
      dark:border-gray-800
      p-4
      sm:p-6
      lg:p-8
    "
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div
                className="
          h-14
          w-14
          rounded-2xl
          bg-gradient-to-br
          from-blue-600
          to-indigo-600
          flex
          items-center
          justify-center
          text-white
        "
              >
                <ClipboardList size={26} />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
                  Create Assessment
                </h2>

                <p className="mt-1 text-gray-500 dark:text-gray-400">
                  Design an assessment for candidates applying to this job.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}

          <div className="space-y-7 p-4 sm:p-6 lg:p-8">
            {/* Title */}

            <div>
              <label className="block mb-2 font-medium">Assessment Title</label>

              <div
                className="
          flex
          items-center
          rounded-xl
          border
          border-gray-300
          dark:border-gray-700
          bg-gray-50
          dark:bg-gray-800
          px-4
          focus-within:ring-2
          focus-within:ring-blue-500
        "
              >
                <ClipboardList size={18} className="text-blue-600" />

                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Frontend Developer Technical Test"
                  className="
            w-full
            bg-transparent
            px-3
            py-3
            outline-none
          "
                />
              </div>
            </div>

            {/* Description */}

            <div>
              <label className="block mb-2 font-medium">Description</label>

              <div
                className="
          flex
          rounded-xl
          border
          border-gray-300
          dark:border-gray-700
          bg-gray-50
          dark:bg-gray-800
          p-4
          focus-within:ring-2
          focus-within:ring-blue-500
        "
              >
                <FileText size={18} className="text-blue-600 mt-1" />

                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the purpose and instructions for this assessment..."
                  className="
            ml-3
            w-full
            bg-transparent
            outline-none
            resize-none
            min-h-[140px]
          "
                />
              </div>
            </div>

            {/* Duration + Passing Score */}

            <div className="grid gap-5 md:grid-cols-2 lg:gap-6">
              <div>
                <label className="block mb-2 font-medium">
                  Duration (Minutes)
                </label>

                <div
                  className="
            flex
            items-center
            rounded-xl
            border
            border-gray-300
            dark:border-gray-700
            bg-gray-50
            dark:bg-gray-800
            px-4
            focus-within:ring-2
            focus-within:ring-blue-500
          "
                >
                  <Clock3 size={18} className="text-blue-600" />

                  <input
                    type="number"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    placeholder="60"
                    className="
              w-full
              bg-transparent
              px-3
              py-3
              outline-none
            "
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Passing Score (%)
                </label>

                <div
                  className="
            flex
            items-center
            rounded-xl
            border
            border-gray-300
            dark:border-gray-700
            bg-gray-50
            dark:bg-gray-800
            px-4
            focus-within:ring-2
            focus-within:ring-blue-500
          "
                >
                  <Trophy size={18} className="text-yellow-500" />

                  <input
                    type="number"
                    value={passingScore}
                    onChange={(e) => setPassingScore(Number(e.target.value))}
                    placeholder="70"
                    className="
              w-full
              bg-transparent
              px-3
              py-3
              outline-none
            "
                  />
                </div>
              </div>
            </div>

            {/* Footer */}

            <div className="flex justify-end pt-4">
              <button
                onClick={handleCreateAssessment}
                className="
          inline-flex
          items-center
          gap-2
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
          transition-all
          duration-300
        "
              >
                <PlusCircle size={18} />
                Create Assessment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
