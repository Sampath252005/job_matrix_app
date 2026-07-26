"use client";

import { MessageCircleQuestion, X } from "lucide-react";
import JobQuestionsPanel from "./JobQuestionsPanel";

interface Props {
  job: { id: string; title: string } | null;
  onClose: () => void;
}

export default function RecruiterQuestionsManager({ job, onClose }: Props) {
  if (!job) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/65 p-3 backdrop-blur-sm sm:p-6">
      <div className="flex max-h-[95vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <header className="flex items-start justify-between gap-4 border-b border-slate-200 bg-white px-5 py-4 dark:border-slate-800 dark:bg-slate-950 sm:px-7">
          <div className="flex min-w-0 items-center gap-3">
            <MessageCircleQuestion className="shrink-0 text-indigo-600" />
            <div className="min-w-0">
              <h2 className="font-bold">Candidate questions</h2>
              <p className="truncate text-sm text-slate-500">{job.title}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-900"
            aria-label="Close questions"
          >
            <X size={20} />
          </button>
        </header>
        <div className="overflow-y-auto p-3 sm:p-6">
          <JobQuestionsPanel jobId={job.id} role="recruiter" />
        </div>
      </div>
    </div>
  );
}
