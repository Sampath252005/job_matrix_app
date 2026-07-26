"use client";

import { Megaphone, Pin } from "lucide-react";
import { useEffect, useState } from "react";
import {
  getJobAnnouncements,
  type JobAnnouncement,
} from "@/services/announcement.services";

export default function CandidateJobAnnouncementBadge({
  jobId,
}: {
  jobId: string;
}) {
  const [announcements, setAnnouncements] = useState<JobAnnouncement[]>([]);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const data = await getJobAnnouncements(jobId);
        if (active) setAnnouncements(data);
      } catch {
        // The job card remains usable when announcements are unavailable.
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, [jobId]);

  if (!announcements.length) return null;

  const latest = announcements[0];

  return (
    <div className="mt-4 flex items-start gap-3 rounded-xl border border-amber-200/80 bg-amber-50/80 px-3.5 py-3 text-left dark:border-amber-900/60 dark:bg-amber-950/25">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300">
        <Megaphone size={16} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-amber-700 dark:text-amber-300">
          {latest.is_pinned && <Pin size={12} />}
          Hiring update
        </span>
        <span className="mt-0.5 block truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
          {latest.title}
        </span>
      </span>

      {announcements.length > 1 && (
        <span className="shrink-0 rounded-full bg-amber-200/70 px-2 py-1 text-[10px] font-black text-amber-800 dark:bg-amber-900/70 dark:text-amber-200">
          +{announcements.length - 1}
        </span>
      )}
    </div>
  );
}
