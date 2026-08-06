"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { CalendarDays, CheckCircle2, Clock3, Loader2, MapPin, Pencil, Plus, RefreshCw, Search, Video, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { getToastMessage } from "@/lib/toast";
import { getEligibleInterviewApplications } from "@/services/application.services";
import { getMyJobs } from "@/services/jobs.services";
import { createInterview, getCandidateInterviews, getRecruiterInterviews, type Interview, type InterviewInput, type InterviewRound, type InterviewStatus, type InterviewType, updateInterview, updateInterviewStatus } from "@/services/interview.services";

type Filter = "ALL" | InterviewStatus;
type RecruiterJob = { id: string; title: string; status?: string };
type EligibleApplication = {
  id: string;
  status: string;
  users: { id: string; name: string; email: string };
};
const rounds: InterviewRound[] = ["APTITUDE", "TECHNICAL", "MANAGERIAL", "HR", "FINAL", "OTHER"];
const statuses: Filter[] = ["ALL", "SCHEDULED", "LIVE", "COMPLETED", "CANCELLED"];
const blank: InterviewInput = { application_id: "", scheduled_at: "", duration_minutes: 30, interview_type: "ONLINE", round_type: "TECHNICAL", title: "", notes: "", location: "", meeting_link: "" };
const badge: Record<InterviewStatus, string> = {
  SCHEDULED: "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300",
  LIVE: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
  COMPLETED: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  CANCELLED: "bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300",
};
const dateInput = (value: string) => { const d = new Date(value); return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16); };
const validateInterviewForm = (form: InterviewInput, editing: boolean) => {
  if (!editing && !form.application_id?.trim()) return "Select an eligible candidate";
  if (!form.scheduled_at) return "Choose an interview date and time";
  const scheduledAt = new Date(form.scheduled_at);
  if (Number.isNaN(scheduledAt.getTime())) return "Enter a valid interview date and time";
  if (scheduledAt.getTime() <= Date.now()) return "Interview must be scheduled in the future";
  if (!Number.isInteger(form.duration_minutes) || form.duration_minutes < 5 || form.duration_minutes > 480) return "Duration must be a whole number between 5 and 480 minutes";
  if (form.title.trim().length > 150) return "Title cannot exceed 150 characters";
  if ((form.notes?.trim().length || 0) > 2000) return "Notes cannot exceed 2000 characters";
  if ((form.location?.trim().length || 0) > 250) return "Location cannot exceed 250 characters";
  if (form.interview_type === "OFFLINE" && !form.location?.trim()) return "Location is required for offline interviews";
  const link = form.meeting_link?.trim();
  if (link) {
    if (link.length > 2048) return "Meeting link is too long";
    try {
      const url = new URL(link);
      if (!["http:", "https:"].includes(url.protocol)) return "Meeting link must use HTTP or HTTPS";
    } catch { return "Enter a valid meeting link"; }
  }
  return null;
};

export default function InterviewsPage({ role }: { role: "candidate" | "recruiter" }) {
  const router = useRouter();
  const isRecruiter = role === "recruiter";
  const [items, setItems] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("ALL");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Interview | null>(null);
  const [form, setForm] = useState<InterviewInput>(blank);
  const [saving, setSaving] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setFailed(false);
    try { setItems(await (isRecruiter ? getRecruiterInterviews() : getCandidateInterviews())); }
    catch (error) { setItems([]); setFailed(true); toast.error(getToastMessage(error, "Unable to load interviews")); }
    finally { setLoading(false); }
  }, [isRecruiter]);
  useEffect(() => { void load(); }, [load]);

  const counts = useMemo(() => ({ scheduled: items.filter(i => i.status === "SCHEDULED").length, live: items.filter(i => i.status === "LIVE").length, completed: items.filter(i => i.status === "COMPLETED").length }), [items]);
  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter(i => {
      const person = isRecruiter ? i.candidate : i.recruiter;
      const text = [i.title, i.jobs?.title, person?.name, person?.email, i.round_type].join(" ").toLowerCase();
      return (filter === "ALL" || i.status === filter) && (!q || text.includes(q));
    });
  }, [filter, isRecruiter, items, search]);

  const openCreate = () => { setEditing(null); setForm(blank); setFormOpen(true); };
  const openEdit = (i: Interview) => { setEditing(i); setForm({ scheduled_at: dateInput(i.scheduled_at), duration_minutes: i.duration_minutes, interview_type: i.interview_type, round_type: i.round_type, title: i.title, notes: i.notes || "", location: i.location || "", meeting_link: i.meeting_link || "" }); setFormOpen(true); };
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const validationError = validateInterviewForm(form, Boolean(editing));
    if (validationError) return toast.error(validationError);
    setSaving(true);
    try {
      const payload = { ...form, scheduled_at: new Date(form.scheduled_at).toISOString(), title: form.title.trim() || `${form.round_type} Interview` };
      if (editing) { const { application_id, ...update } = payload; void application_id; await updateInterview(editing.id, update); toast.success("Interview updated"); }
      else { await createInterview(payload); toast.success("Interview scheduled"); }
      setFormOpen(false); await load();
    } catch (error) { toast.error(getToastMessage(error, "Unable to save interview")); }
    finally { setSaving(false); }
  };
  const changeStatus = async (i: Interview, status: InterviewStatus) => {
    setBusy(i.id);
    try { await updateInterviewStatus(i.id, status); toast.success(`Interview marked ${status.toLowerCase()}`); await load(); return true; }
    catch (error) { toast.error(getToastMessage(error, "Unable to update interview")); return false; }
    finally { setBusy(null); }
  };
  const startInterview = async (i: Interview) => {
    if (await changeStatus(i, "LIVE")) {
      router.push(`/interviews/${encodeURIComponent(i.id)}`);
    }
  };

  return <div className="mx-auto min-h-full max-w-[1600px] space-y-6">
    <header className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-blue-900 to-indigo-700 p-6 text-white shadow-xl shadow-blue-950/15 sm:p-8">
      <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl"/><div className="absolute -bottom-24 left-1/3 h-52 w-80 rounded-full bg-indigo-300/15 blur-3xl"/>
      <div className="relative flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between"><div><span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] ring-1 ring-white/15"><Video size={14}/>Interview center</span><h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">{isRecruiter ? "Upcoming Interviews" : "My Interviews"}</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-blue-100 sm:text-base">{isRecruiter ? "Schedule candidate conversations, manage every round, and keep your hiring process moving." : "Everything you need for your upcoming conversations, from schedule to secure video room."}</p></div>{isRecruiter && <button onClick={openCreate} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-bold text-blue-800 shadow-lg shadow-slate-950/20 transition hover:-translate-y-0.5 hover:bg-blue-50"><Plus size={18}/> Schedule interview</button>}</div>
    </header>
    <section aria-label="Interview overview" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><Stat icon={<CalendarDays/>} label="All interviews" value={items.length} color="blue"/><Stat icon={<Clock3/>} label="Scheduled" value={counts.scheduled} color="indigo"/><Stat icon={<Video/>} label="Live now" value={counts.live} color="emerald"/><Stat icon={<CheckCircle2/>} label="Completed" value={counts.completed} color="slate"/></section>
    <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 shadow-sm dark:border-slate-800 dark:bg-slate-900/90"><div className="flex flex-col gap-4 border-b border-slate-200/80 p-4 dark:border-slate-800 sm:p-5 xl:flex-row xl:items-center xl:justify-between"><div><h2 className="font-bold text-slate-950 dark:text-white">Interview schedule</h2><p className="mt-1 text-sm text-slate-500">{visible.length} {visible.length === 1 ? "interview" : "interviews"} shown</p></div><div className="flex flex-col gap-3 sm:flex-row"><div className="relative min-w-0 sm:w-72"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search candidate, role or round" className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800"/></div><div className="flex gap-2"><select value={filter} onChange={e => setFilter(e.target.value as Filter)} className="h-11 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold dark:border-slate-700 dark:bg-slate-800">{statuses.map(s => <option key={s} value={s}>{s === "ALL" ? "All statuses" : s}</option>)}</select><button onClick={() => void load()} className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 dark:border-slate-700 dark:hover:bg-blue-950/30" aria-label="Refresh"><RefreshCw size={17}/></button></div></div></div>
      <div className="p-4 sm:p-5">{loading ? <Empty><Loader2 className="animate-spin text-blue-600"/> Loading interviews...</Empty> : failed ? <Empty>Unable to load interviews. <button onClick={() => void load()} className="font-bold text-blue-600">Try again</button></Empty> : !visible.length ? <Empty>{items.length ? "No interviews match your filters." : "No interviews have been scheduled yet."}</Empty> : <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">{visible.map(i => <Card key={i.id} item={i} recruiter={isRecruiter} busy={busy === i.id} detail={() => router.push(`/interviews/${encodeURIComponent(i.id)}`)} edit={() => openEdit(i)} status={s => void changeStatus(i, s)} start={() => void startInterview(i)}/>)}</div>}</div>
    </section>
    {formOpen && <InterviewForm form={form} setForm={setForm} editing={!!editing} saving={saving} close={() => setFormOpen(false)} submit={submit}/>} 
  </div>;
}

function Card({ item, recruiter, busy, detail, edit, status, start }: { item: Interview; recruiter: boolean; busy: boolean; detail: () => void; edit: () => void; status: (s: InterviewStatus) => void; start: () => void }) {
  const person = recruiter ? item.candidate : item.recruiter;
  const date = new Date(item.scheduled_at);
  const initials = (person?.name || (recruiter ? "Candidate" : "Recruiter")).split(/\s+/).slice(0, 2).map(part => part[0]).join("").toUpperCase();
  return <article className="group relative flex min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-950/5 dark:border-slate-800 dark:bg-slate-950/50 dark:hover:border-blue-900">
    <div className={`absolute inset-x-0 top-0 h-1 ${item.status === "LIVE" ? "bg-emerald-500" : item.status === "CANCELLED" ? "bg-rose-400" : item.status === "COMPLETED" ? "bg-slate-400" : "bg-gradient-to-r from-blue-500 to-indigo-500"}`}/>
    <div className="flex flex-1 flex-col p-5"><div className="flex items-start justify-between gap-3"><div className="flex min-w-0 items-center gap-3"><div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-sm font-black text-white shadow-sm">{initials}</div><div className="min-w-0"><p className="truncate text-sm font-bold text-slate-900 dark:text-white">{person?.name || person?.email || (recruiter ? "Candidate" : "Recruiter")}</p><p className="mt-0.5 truncate text-xs text-slate-400">{recruiter ? "Candidate" : "Recruiter"}</p></div></div><span className={`h-fit shrink-0 rounded-full px-2.5 py-1 text-[10px] font-black tracking-wide ${badge[item.status]}`}>{item.status}</span></div>
      <div className="mt-5 flex gap-4"><div className="flex h-16 w-14 shrink-0 flex-col items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-center dark:border-blue-950 dark:bg-blue-950/40"><span className="text-[10px] font-black uppercase tracking-wider text-blue-500">{date.toLocaleDateString(undefined, { month: "short" })}</span><span className="text-xl font-black leading-6 text-blue-800 dark:text-blue-200">{date.getDate()}</span></div><div className="min-w-0"><h3 className="line-clamp-2 text-lg font-bold leading-6 text-slate-950 dark:text-white">{item.title}</h3><p className="mt-1 truncate text-sm font-medium text-slate-500">{item.jobs?.title || "Job interview"}</p></div></div>
      <div className="mt-5 grid grid-cols-2 gap-2"><Meta icon={<Clock3/>} value={date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}/><Meta icon={<Video/>} value={item.round_type}/><Meta icon={<CalendarDays/>} value={`${item.duration_minutes} minutes`}/><Meta icon={item.interview_type === "OFFLINE" ? <MapPin/> : <Video/>} value={item.interview_type === "OFFLINE" ? item.location || "Location pending" : "Online meeting"}/></div>
    </div><div className="flex flex-wrap gap-2 border-t border-slate-100 bg-slate-50/70 px-5 py-4 dark:border-slate-800 dark:bg-slate-900/40"><Small onClick={detail}>View details</Small>{!recruiter && item.interview_type === "ONLINE" && !["COMPLETED", "CANCELLED"].includes(item.status) && <Small onClick={detail} green>Join Interview</Small>}{recruiter && item.status === "SCHEDULED" && <><Small onClick={edit}><Pencil size={13}/> Edit</Small><Small disabled={busy} onClick={start} green>Start Interview</Small><Small disabled={busy} onClick={() => status("CANCELLED")} red>Cancel</Small></>}{recruiter && item.status === "LIVE" && <><Small onClick={detail} green>Join Interview</Small><Small disabled={busy} onClick={() => status("COMPLETED")}>Complete</Small></>}</div>
  </article>;
}

function Meta({ icon, value }: { icon: React.ReactNode; value: string }) { return <div className="flex min-w-0 items-center gap-2 rounded-lg bg-slate-50 px-2.5 py-2 text-xs font-semibold text-slate-600 dark:bg-slate-900 dark:text-slate-300"><span className="shrink-0 text-slate-400 [&>svg]:h-3.5 [&>svg]:w-3.5">{icon}</span><span className="truncate" title={value}>{value}</span></div>; }

function InterviewForm({ form, setForm, editing, saving, close, submit }: { form: InterviewInput; setForm: (f: InterviewInput) => void; editing: boolean; saving: boolean; close: () => void; submit: (e: FormEvent) => void }) {
  const [jobs, setJobs] = useState<RecruiterJob[]>([]);
  const [jobId, setJobId] = useState("");
  const [applications, setApplications] = useState<EligibleApplication[]>([]);
  const [optionsLoading, setOptionsLoading] = useState(!editing);
  const set = <K extends keyof InterviewInput>(key: K, value: InterviewInput[K]) => setForm({ ...form, [key]: value });
  const input = "h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm dark:border-slate-700 dark:bg-slate-800";

  useEffect(() => {
    if (editing) return;
    const loadJobs = async () => {
      setOptionsLoading(true);
      try {
        const response = await getMyJobs();
        const availableJobs = (Array.isArray(response) ? response : []).filter(
          (job): job is RecruiterJob => Boolean(job && typeof job.id === "string" && typeof job.title === "string"),
        );
        setJobs(availableJobs);
      } catch (error) {
        toast.error(getToastMessage(error, "Unable to load jobs"));
      } finally { setOptionsLoading(false); }
    };
    void loadJobs();
  }, [editing]);

  const chooseJob = async (selectedJobId: string) => {
    setJobId(selectedJobId); setApplications([]); set("application_id", "");
    if (!selectedJobId) return;
    setOptionsLoading(true);
    try {
      const response = await getEligibleInterviewApplications(selectedJobId);
      setApplications(response.filter((application: unknown): application is EligibleApplication => {
        if (!application || typeof application !== "object") return false;
        const value = application as Partial<EligibleApplication>;
        return typeof value.id === "string" && Boolean(value.users) && typeof value.users?.name === "string";
      }));
    } catch (error) { toast.error(getToastMessage(error, "Unable to load eligible candidates")); }
    finally { setOptionsLoading(false); }
  };

  return <div className="fixed inset-0 z-[80] grid place-items-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm"><form onSubmit={submit} noValidate className="my-4 w-full max-w-2xl rounded-2xl bg-white shadow-2xl dark:bg-slate-900"><ModalHead title={editing ? "Edit interview" : "Schedule interview"} close={close}/><div className="grid gap-4 p-5 sm:grid-cols-2">{!editing && <><Field label="Job *"><select required value={jobId} disabled={optionsLoading && !jobs.length} onChange={e => void chooseJob(e.target.value)} className={input}><option value="">Select a job</option>{jobs.map(job => <option key={job.id} value={job.id}>{job.title}</option>)}</select></Field><Field label="Eligible candidate *"><select required value={form.application_id} disabled={!jobId || optionsLoading} onChange={e => set("application_id", e.target.value)} className={input}><option value="">{optionsLoading ? "Loading candidates..." : !jobId ? "Select a job first" : applications.length ? "Select a candidate" : "No eligible candidates"}</option>{applications.map(application => <option key={application.id} value={application.id}>{application.users.name} · {application.users.email}</option>)}</select></Field>{jobId && !optionsLoading && !applications.length && <p className="sm:col-span-2 -mt-2 text-sm text-amber-600 dark:text-amber-300">No shortlisted candidates are currently eligible for this job.</p>}</>}<Field label="Title" hint={`${form.title.length}/150`} wide><input maxLength={150} value={form.title} onChange={e => set("title", e.target.value)} placeholder={`${form.round_type} Interview`} className={input}/></Field><Field label="Date and time *"><input type="datetime-local" required min={dateInput(new Date().toISOString())} value={form.scheduled_at} onChange={e => set("scheduled_at", e.target.value)} className={input}/></Field><Field label="Duration (minutes)"><input type="number" min={5} max={480} step={1} required value={form.duration_minutes} onChange={e => set("duration_minutes", Number(e.target.value))} className={input}/></Field><Field label="Round"><select value={form.round_type} onChange={e => set("round_type", e.target.value as InterviewRound)} className={input}>{rounds.map(r => <option key={r}>{r}</option>)}</select></Field><Field label="Format"><select value={form.interview_type} onChange={e => set("interview_type", e.target.value as InterviewType)} className={input}><option value="ONLINE">Online</option><option value="OFFLINE">Offline</option></select></Field>{form.interview_type === "OFFLINE" ? <Field label="Location *" hint={`${form.location?.length || 0}/250`} wide><input required maxLength={250} value={form.location || ""} onChange={e => set("location", e.target.value)} className={input}/></Field> : <Field label="Meeting link" wide><input type="url" maxLength={2048} value={form.meeting_link || ""} onChange={e => set("meeting_link", e.target.value)} placeholder="https://..." className={input}/></Field>}<Field label="Notes" hint={`${form.notes?.length || 0}/2000`} wide><textarea rows={4} maxLength={2000} value={form.notes || ""} onChange={e => set("notes", e.target.value)} className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm dark:border-slate-700 dark:bg-slate-800"/></Field></div><div className="flex justify-end gap-3 border-t border-slate-200 p-5 dark:border-slate-800"><button type="button" onClick={close} className="rounded-xl border px-4 py-2.5 text-sm font-bold">Cancel</button><button disabled={saving || (!editing && optionsLoading)} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60">{saving && <Loader2 size={16} className="animate-spin"/>}{editing ? "Save changes" : "Schedule"}</button></div></form></div>;
}

function ModalHead({ title, close }: { title: string; close: () => void }) { return <div className="flex items-start justify-between gap-3"><div><h2 className="text-xl font-bold">{title}</h2><p className="mt-1 text-sm text-slate-500">Interview details</p></div><button type="button" onClick={close} className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"><X size={20}/></button></div>; }
function Field({ label, hint, wide, children }: { label: string; hint?: string; wide?: boolean; children: React.ReactNode }) { return <label className={wide ? "sm:col-span-2" : ""}><span className="mb-1.5 flex justify-between gap-3 text-sm font-semibold"><span>{label}</span>{hint && <span className="font-normal text-slate-400">{hint}</span>}</span>{children}</label>; }
function Stat({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) { const c: Record<string, string> = { blue: "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-300", indigo: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-300", emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300", slate: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300" }; return <div className="group rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/90"><div className="flex items-center justify-between"><div><p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{label}</p><p className="mt-2 text-3xl font-black tracking-tight text-slate-950 dark:text-white">{value}</p></div><span className={`grid h-12 w-12 place-items-center rounded-2xl transition group-hover:scale-105 [&>svg]:h-5 [&>svg]:w-5 ${c[color]}`}>{icon}</span></div></div>; }
function Empty({ children }: { children: React.ReactNode }) { return <div className="flex min-h-72 items-center justify-center gap-2 text-center text-sm text-slate-500">{children}</div>; }
function Small({ children, onClick, disabled, green, red }: { children: React.ReactNode; onClick: () => void; disabled?: boolean; green?: boolean; red?: boolean }) { return <button disabled={disabled} onClick={onClick} className={`inline-flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-bold disabled:opacity-50 ${green ? "bg-emerald-600 text-white" : red ? "text-rose-600 hover:bg-rose-50" : "border border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"}`}>{children}</button>; }
