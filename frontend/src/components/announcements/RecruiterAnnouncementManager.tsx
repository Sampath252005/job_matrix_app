"use client";

import {
  Loader2,
  Megaphone,
  Pencil,
  Pin,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { toastApiWarning } from "@/lib/toast";
import {
  createJobAnnouncement,
  deleteJobAnnouncement,
  getJobAnnouncements,
  updateJobAnnouncement,
  type AnnouncementAudience,
  type AnnouncementInput,
  type JobAnnouncement,
} from "@/services/announcement.services";

const emptyForm: AnnouncementInput = {
  title: "",
  content: "",
  audience: "APPLICANTS",
  is_pinned: false,
};

const audienceLabels: Record<AnnouncementAudience, string> = {
  PUBLIC: "Everyone",
  APPLICANTS: "Applicants",
  SHORTLISTED: "Shortlisted",
  INTERVIEW: "Interview candidates",
};

interface Props {
  job: { id: string; title: string } | null;
  onClose: () => void;
}

export default function RecruiterAnnouncementManager({ job, onClose }: Props) {
  const [announcements, setAnnouncements] = useState<JobAnnouncement[]>([]);
  const [form, setForm] = useState<AnnouncementInput>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!job) return;
    let active = true;

    const load = async () => {
      setLoading(true);
      try {
        const data = await getJobAnnouncements(job.id);
        if (active) setAnnouncements(data);
      } catch (error) {
        toastApiWarning(error, "Failed to load announcements");
      } finally {
        if (active) setLoading(false);
      }
    };

    setEditingId(null);
    setForm(emptyForm);
    void load();
    return () => {
      active = false;
    };
  }, [job]);

  if (!job) return null;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.title.trim() || !form.content.trim() || saving) return;

    setSaving(true);
    try {
      if (editingId) {
        const updated = await updateJobAnnouncement(editingId, form);
        setAnnouncements((current) =>
          current.map((item) => (item.id === updated.id ? updated : item)),
        );
        toast.success("Announcement updated");
      } else {
        const created = await createJobAnnouncement(job.id, form);
        setAnnouncements((current) => [created, ...current]);
        toast.success("Announcement published");
      }
      setEditingId(null);
      setForm(emptyForm);
    } catch (error) {
      toastApiWarning(error, "Failed to save announcement");
    } finally {
      setSaving(false);
    }
  };

  const startEditing = (announcement: JobAnnouncement) => {
    setEditingId(announcement.id);
    setForm({
      title: announcement.title,
      content: announcement.content,
      audience: announcement.audience,
      is_pinned: announcement.is_pinned,
    });
  };

  const handleDelete = async (announcementId: string) => {
    if (!window.confirm("Delete this announcement?")) return;

    setDeletingId(announcementId);
    try {
      await deleteJobAnnouncement(announcementId);
      setAnnouncements((current) =>
        current.filter((item) => item.id !== announcementId),
      );
      if (editingId === announcementId) {
        setEditingId(null);
        setForm(emptyForm);
      }
      toast.success("Announcement deleted");
    } catch (error) {
      toastApiWarning(error, "Failed to delete announcement");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/65 p-3 backdrop-blur-sm sm:p-6">
      <div className="flex max-h-[95vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950">
        <header className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 dark:border-slate-800 sm:px-7">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              <Megaphone size={21} />
            </span>
            <div className="min-w-0">
              <h2 className="truncate text-lg font-bold sm:text-xl">
                Job announcements
              </h2>
              <p className="truncate text-sm text-slate-500">{job.title}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 dark:hover:bg-slate-900"
            aria-label="Close announcements"
          >
            <X size={21} />
          </button>
        </header>

        <div className="grid flex-1 overflow-y-auto lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <form
            onSubmit={handleSubmit}
            className="border-b border-slate-200 p-5 dark:border-slate-800 sm:p-7 lg:border-b-0 lg:border-r"
          >
            <h3 className="font-bold">
              {editingId ? "Edit announcement" : "Publish an update"}
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Share timelines, interview details, or hiring updates.
            </p>

            <div className="mt-6 space-y-4">
              <label className="block">
                <span className="text-sm font-semibold">Title</span>
                <input
                  value={form.title}
                  maxLength={150}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      title: event.target.value,
                    }))
                  }
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-900 dark:focus:ring-blue-950"
                  placeholder="Interview schedule updated"
                  required
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold">Message</span>
                <textarea
                  value={form.content}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      content: event.target.value,
                    }))
                  }
                  rows={6}
                  className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-900 dark:focus:ring-blue-950"
                  placeholder="Write a clear update for candidates…"
                  required
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold">Audience</span>
                <select
                  value={form.audience}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      audience: event.target.value as AnnouncementAudience,
                    }))
                  }
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none dark:border-slate-800 dark:bg-slate-900"
                >
                  {Object.entries(audienceLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-3 dark:border-slate-800">
                <input
                  type="checkbox"
                  checked={form.is_pinned}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      is_pinned: event.target.checked,
                    }))
                  }
                  className="h-4 w-4 accent-blue-600"
                />
                <Pin size={16} className="text-amber-500" />
                <span className="text-sm font-medium">Pin this announcement</span>
              </label>
            </div>

            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 font-semibold text-white shadow-lg shadow-blue-600/20 disabled:opacity-60"
              >
                {saving ? (
                  <Loader2 size={17} className="animate-spin" />
                ) : editingId ? (
                  <Pencil size={17} />
                ) : (
                  <Plus size={17} />
                )}
                {editingId ? "Save changes" : "Publish announcement"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setForm(emptyForm);
                  }}
                  className="rounded-xl border border-slate-200 px-5 py-3 font-semibold dark:border-slate-800"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          <section className="p-5 sm:p-7">
            <div className="flex items-center justify-between">
              <h3 className="font-bold">Published updates</h3>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                {announcements.length}
              </span>
            </div>

            {loading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="animate-spin text-blue-600" />
              </div>
            ) : announcements.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-dashed border-slate-300 px-5 py-12 text-center dark:border-slate-700">
                <Megaphone className="mx-auto text-slate-400" />
                <p className="mt-3 font-semibold">No announcements yet</p>
                <p className="mt-1 text-sm text-slate-500">
                  Your published updates will appear here.
                </p>
              </div>
            ) : (
              <div className="mt-5 space-y-3">
                {announcements.map((announcement) => (
                  <article
                    key={announcement.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900/60"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h4 className="flex items-center gap-2 font-bold">
                          {announcement.is_pinned && (
                            <Pin size={14} className="text-amber-500" />
                          )}
                          {announcement.title}
                        </h4>
                        <span className="mt-2 inline-flex rounded-full bg-blue-100 px-2.5 py-1 text-[11px] font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                          {audienceLabels[announcement.audience]}
                        </span>
                      </div>
                      <div className="flex shrink-0 gap-1">
                        <button
                          type="button"
                          onClick={() => startEditing(announcement)}
                          className="rounded-lg p-2 text-slate-500 hover:bg-white hover:text-blue-600 dark:hover:bg-slate-800"
                          aria-label="Edit announcement"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleDelete(announcement.id)}
                          disabled={deletingId === announcement.id}
                          className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-50 dark:hover:bg-red-950/40"
                          aria-label="Delete announcement"
                        >
                          {deletingId === announcement.id ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      </div>
                    </div>
                    <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-600 dark:text-slate-300">
                      {announcement.content}
                    </p>
                    <p className="mt-3 text-xs text-slate-400">
                      {new Date(announcement.created_at).toLocaleString()}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
