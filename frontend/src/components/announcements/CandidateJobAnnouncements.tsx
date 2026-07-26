"use client";

import { BellRing, Loader2, Megaphone, Pin } from "lucide-react";
import { useEffect, useState } from "react";
import {
  getJobAnnouncements,
  type JobAnnouncement,
} from "@/services/announcement.services";

export default function CandidateJobAnnouncements({ jobId }: { jobId: string }) {
  const [announcements, setAnnouncements] = useState<JobAnnouncement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      try {
        const data = await getJobAnnouncements(jobId);
        if (active) setAnnouncements(data);
      } catch (error) {
        console.error("Failed to load job announcements:", error);
        if (active) setAnnouncements([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, [jobId]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-500 dark:border-zinc-800 dark:bg-zinc-900">
        <Loader2 size={17} className="animate-spin text-blue-600" />
        Loading job announcements…
      </div>
    );
  }

  if (!announcements.length) return null;

  return (
    <section className="overflow-hidden rounded-3xl border border-amber-200/80 bg-amber-50/60 dark:border-amber-900/60 dark:bg-amber-950/20">
      <div className="flex items-center gap-3 border-b border-amber-200/70 px-5 py-4 dark:border-amber-900/50">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">
          <Megaphone size={20} />
        </span>
        <div>
          <h2 className="font-bold text-slate-950 dark:text-white">
            Updates from the hiring team
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Important news related to this role
          </p>
        </div>
      </div>

      <div className="divide-y divide-amber-200/60 dark:divide-amber-900/40">
        {announcements.map((announcement) => (
          <article key={announcement.id} className="px-5 py-4 sm:px-6">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100">
                  {announcement.is_pinned && (
                    <Pin size={14} className="shrink-0 text-amber-600" />
                  )}
                  {announcement.title}
                </h3>
                <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {announcement.content}
                </p>
              </div>
              <BellRing size={16} className="mt-1 shrink-0 text-amber-500" />
            </div>
            <p className="mt-3 text-xs font-medium text-slate-400">
              {new Date(announcement.created_at).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
