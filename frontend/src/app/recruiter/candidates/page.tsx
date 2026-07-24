"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  Eye,
  FileText,
  GraduationCap,
  Loader2,
  Mail,
  MapPin,
  Search,
  UserRound,
  UsersRound,
  X,
  XCircle,
} from "lucide-react";
import { getAllOpenJobs } from "@/services/jobs.services";
import {
  getapplcationByJob,
  updateApplicationStatus,
} from "@/services/application.services";
import { toastApiWarning } from "@/lib/toast";

type ApplicationStatus = "PENDING" | "SHORTLISTED" | "REJECTED";
type Filter = "ALL" | ApplicationStatus;

interface Job {
  id: string;
  title: string;
  location: string;
  type: string;
}

interface CandidateProfile {
  education?: string;
  degree?: string;
  branch?: string;
  college?: string;
  location?: string;
  skills?: string[];
  resume_url?: string;
  portfolio_url?: string;
}

interface Applicant {
  id: string;
  status: ApplicationStatus;
  users: {
    id: string;
    name: string;
    email: string;
    candidate_profiles: CandidateProfile;
  };
}

const filters: Array<{
  value: Filter;
  label: string;
  activeClass: string;
}> = [
  {
    value: "ALL",
    label: "All Applicants",
    activeClass: "bg-slate-900 text-white dark:bg-white dark:text-slate-900",
  },
  {
    value: "PENDING",
    label: "Pending",
    activeClass: "bg-amber-500 text-white",
  },
  {
    value: "SHORTLISTED",
    label: "Shortlisted",
    activeClass: "bg-emerald-600 text-white",
  },
  {
    value: "REJECTED",
    label: "Rejected",
    activeClass: "bg-rose-600 text-white",
  },
];

const statusStyles: Record<ApplicationStatus, string> = {
  PENDING:
    "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300",
  SHORTLISTED:
    "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300",
  REJECTED:
    "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300",
};

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function CandidatesPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [activeFilter, setActiveFilter] = useState<Filter>("ALL");
  const [search, setSearch] = useState("");
  const [selectedCandidate, setSelectedCandidate] =
    useState<Applicant | null>(null);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [applicationsLoading, setApplicationsLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadApplications = useCallback(async (job: Job) => {
    setSelectedJob(job);
    setActiveFilter("ALL");
    setSearch("");
    setApplicationsLoading(true);

    try {
      const response = await getapplcationByJob(job.id);
      setApplicants(response.data ?? []);
    } catch (error) {
      console.error(error);
      setApplicants([]);
      toastApiWarning(error, "Failed to load applicants");
    } finally {
      setApplicationsLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadJobs = async () => {
      setJobsLoading(true);
      try {
        const response = await getAllOpenJobs();
        const openJobs: Job[] = response.data ?? [];
        setJobs(openJobs);
        if (openJobs.length > 0) await loadApplications(openJobs[0]);
      } catch (error) {
        console.error(error);
        toastApiWarning(error, "Failed to load jobs");
      } finally {
        setJobsLoading(false);
      }
    };

    void loadJobs();
  }, [loadApplications]);

  const counts = useMemo(
    () => ({
      ALL: applicants.length,
      PENDING: applicants.filter(({ status }) => status === "PENDING").length,
      SHORTLISTED: applicants.filter(
        ({ status }) => status === "SHORTLISTED",
      ).length,
      REJECTED: applicants.filter(({ status }) => status === "REJECTED")
        .length,
    }),
    [applicants],
  );

  const visibleApplicants = useMemo(() => {
    const query = search.trim().toLowerCase();
    return applicants.filter((applicant) => {
      const matchesFilter =
        activeFilter === "ALL" || applicant.status === activeFilter;
      const matchesSearch =
        !query ||
        applicant.users.name.toLowerCase().includes(query) ||
        applicant.users.email.toLowerCase().includes(query);
      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, applicants, search]);

  const handleStatusChange = async (
    applicationId: string,
    status: ApplicationStatus,
  ) => {
    setUpdatingId(applicationId);
    try {
      await updateApplicationStatus(applicationId, status);
      setApplicants((current) =>
        current.map((application) =>
          application.id === applicationId
            ? { ...application, status }
            : application,
        ),
      );
      setSelectedCandidate((current) =>
        current?.id === applicationId ? { ...current, status } : current,
      );
      toast.success(
        status === "SHORTLISTED"
          ? "Candidate shortlisted"
          : "Candidate rejected",
      );
    } catch (error) {
      console.error(error);
      toastApiWarning(error, "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="mx-auto min-h-full max-w-[1600px]">
      <header className="mb-6">
        <p className="mb-1 text-sm font-semibold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400">
          Recruitment
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
          Candidates
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 sm:text-base">
          Review applications and move the right people forward.
        </p>
      </header>

      <div className="grid items-start gap-5 xl:grid-cols-[310px_minmax(0,1fr)]">
        <aside className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 shadow-sm dark:border-slate-800 dark:bg-slate-900/90 xl:sticky xl:top-5">
          <div className="border-b border-slate-200/80 p-5 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-slate-900 dark:text-white">
                  Open jobs
                </h2>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Select a role to view applications
                </p>
              </div>
              <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-sm font-bold text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
                {jobs.length}
              </span>
            </div>
          </div>

          <div className="flex gap-3 overflow-x-auto p-3 xl:max-h-[calc(100vh-285px)] xl:flex-col xl:overflow-y-auto">
            {jobsLoading ? (
              <div className="flex w-full items-center justify-center gap-2 py-10 text-sm text-slate-500">
                <Loader2 className="animate-spin" size={18} />
                Loading jobs
              </div>
            ) : jobs.length > 0 ? (
              jobs.map((job) => {
                const active = selectedJob?.id === job.id;
                return (
                  <button
                    key={job.id}
                    type="button"
                    onClick={() => void loadApplications(job)}
                    className={`group min-w-[250px] rounded-xl border p-4 text-left transition xl:min-w-0 ${
                      active
                        ? "border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-200 dark:shadow-none"
                        : "border-transparent bg-slate-50 text-slate-900 hover:border-blue-200 hover:bg-blue-50 dark:bg-slate-800/70 dark:text-white dark:hover:border-blue-900 dark:hover:bg-blue-950/30"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={`mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg ${
                          active
                            ? "bg-white/15"
                            : "bg-white text-blue-600 shadow-sm dark:bg-slate-900"
                        }`}
                      >
                        <BriefcaseBusiness size={18} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-bold">
                          {job.title}
                        </span>
                        <span
                          className={`mt-1.5 flex items-center gap-1 text-xs ${
                            active
                              ? "text-blue-100"
                              : "text-slate-500 dark:text-slate-400"
                          }`}
                        >
                          <MapPin size={12} />
                          <span className="truncate">{job.location}</span>
                        </span>
                      </span>
                      <ChevronRight
                        className={
                          active
                            ? "text-white"
                            : "text-slate-300 group-hover:text-blue-500"
                        }
                        size={17}
                      />
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="w-full rounded-xl border border-dashed border-slate-300 px-4 py-10 text-center dark:border-slate-700">
                <BriefcaseBusiness
                  className="mx-auto text-slate-400"
                  size={24}
                />
                <p className="mt-2 text-sm text-slate-500">No open jobs</p>
              </div>
            )}
          </div>
        </aside>

        <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
          {selectedJob ? (
            <>
              <div className="border-b border-slate-200/80 p-5 dark:border-slate-800 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      Selected position
                    </p>
                    <h2 className="mt-1 text-xl font-bold text-slate-950 dark:text-white sm:text-2xl">
                      {selectedJob.title}
                    </h2>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                      <MapPin size={14} />
                      {selectedJob.location}
                      {selectedJob.type && (
                        <>
                          <span aria-hidden="true">•</span>
                          {selectedJob.type}
                        </>
                      )}
                    </p>
                  </div>
                  <div className="relative w-full sm:w-64">
                    <Search
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      size={16}
                    />
                    <input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search candidates"
                      className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 dark:border-slate-700 dark:bg-slate-800"
                    />
                  </div>
                </div>
              </div>

              <div className="border-b border-slate-200/80 px-3 pt-3 dark:border-slate-800 sm:px-5">
                <div
                  className="flex gap-2 overflow-x-auto pb-3"
                  role="tablist"
                  aria-label="Filter applications by status"
                >
                  {filters.map((filter) => {
                    const active = activeFilter === filter.value;
                    return (
                      <button
                        key={filter.value}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => setActiveFilter(filter.value)}
                        className={`flex shrink-0 items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-semibold transition ${
                          active
                            ? filter.activeClass
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                        }`}
                      >
                        {filter.label}
                        <span
                          className={`rounded-md px-1.5 py-0.5 text-xs ${
                            active
                              ? "bg-white/20"
                              : "bg-white dark:bg-slate-900"
                          }`}
                        >
                          {counts[filter.value]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-4 sm:p-6">
                {applicationsLoading ? (
                  <div className="flex min-h-72 items-center justify-center gap-2 text-slate-500">
                    <Loader2 className="animate-spin" size={20} />
                    Loading applications
                  </div>
                ) : visibleApplicants.length > 0 ? (
                  <div className="grid gap-4 2xl:grid-cols-2">
                    {visibleApplicants.map((candidate) => {
                      const profile = candidate.users.candidate_profiles ?? {};
                      const skills = profile.skills ?? [];
                      const updating = updatingId === candidate.id;
                      return (
                        <article
                          key={candidate.id}
                          className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-blue-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-950/40 dark:hover:border-blue-900 sm:p-5"
                        >
                          <div className="flex items-start gap-3">
                            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 font-bold text-white">
                              {initials(candidate.users.name)}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                <div className="min-w-0">
                                  <h3 className="truncate font-bold text-slate-950 dark:text-white">
                                    {candidate.users.name}
                                  </h3>
                                  <p className="mt-1 flex items-center gap-1.5 truncate text-sm text-slate-500 dark:text-slate-400">
                                    <Mail size={14} />
                                    <span className="truncate">
                                      {candidate.users.email}
                                    </span>
                                  </p>
                                </div>
                                <span
                                  className={`w-fit shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-bold ${statusStyles[candidate.status]}`}
                                >
                                  {candidate.status}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 grid gap-2 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-2">
                            <p className="flex items-center gap-2">
                              <GraduationCap
                                className="shrink-0 text-slate-400"
                                size={16}
                              />
                              <span className="truncate">
                                {[profile.degree, profile.branch]
                                  .filter(Boolean)
                                  .join(" • ") || "Education not added"}
                              </span>
                            </p>
                            <p className="flex items-center gap-2">
                              <MapPin
                                className="shrink-0 text-slate-400"
                                size={16}
                              />
                              <span className="truncate">
                                {profile.location || "Location not added"}
                              </span>
                            </p>
                          </div>

                          {skills.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-1.5">
                              {skills.slice(0, 4).map((skill) => (
                                <span
                                  key={skill}
                                  className="rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-950/50 dark:text-blue-300"
                                >
                                  {skill}
                                </span>
                              ))}
                              {skills.length > 4 && (
                                <span className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                                  +{skills.length - 4}
                                </span>
                              )}
                            </div>
                          )}

                          <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
                            <button
                              type="button"
                              onClick={() => setSelectedCandidate(candidate)}
                              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                            >
                              <Eye size={15} />
                              Profile
                            </button>
                            {profile.resume_url && (
                              <a
                                href={profile.resume_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                              >
                                <FileText size={15} />
                                Resume
                              </a>
                            )}
                            <div className="hidden flex-1 sm:block" />
                            {candidate.status !== "SHORTLISTED" && (
                              <button
                                type="button"
                                disabled={updating}
                                onClick={() =>
                                  void handleStatusChange(
                                    candidate.id,
                                    "SHORTLISTED",
                                  )
                                }
                                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-emerald-600 px-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
                              >
                                {updating ? (
                                  <Loader2
                                    className="animate-spin"
                                    size={15}
                                  />
                                ) : (
                                  <CheckCircle2 size={15} />
                                )}
                                Shortlist
                              </button>
                            )}
                            {candidate.status !== "REJECTED" && (
                              <button
                                type="button"
                                disabled={updating}
                                onClick={() =>
                                  void handleStatusChange(
                                    candidate.id,
                                    "REJECTED",
                                  )
                                }
                                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-rose-600 px-3 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:opacity-60"
                              >
                                {updating ? (
                                  <Loader2
                                    className="animate-spin"
                                    size={15}
                                  />
                                ) : (
                                  <XCircle size={15} />
                                )}
                                Reject
                              </button>
                            )}
                          </div>
                        </article>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex min-h-72 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 px-4 text-center dark:border-slate-700">
                    <span className="grid h-12 w-12 place-items-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800">
                      <UsersRound size={23} />
                    </span>
                    <h3 className="mt-4 font-bold text-slate-900 dark:text-white">
                      No applicants found
                    </h3>
                    <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
                      {search
                        ? "Try a different candidate name or email."
                        : `There are no ${activeFilter === "ALL" ? "" : activeFilter.toLowerCase()} applications for this job yet.`}
                    </p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex min-h-[500px] flex-col items-center justify-center p-6 text-center">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-300">
                <UserRound size={27} />
              </span>
              <h2 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
                Select a job
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Choose an open position to review its applicants.
              </p>
            </div>
          )}
        </section>
      </div>

      {selectedCandidate && (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Close candidate profile"
            onClick={() => setSelectedCandidate(null)}
            className="absolute inset-0 h-full w-full bg-slate-950/55 backdrop-blur-sm"
          />
          <aside className="absolute right-0 top-0 h-dvh w-full max-w-lg overflow-y-auto border-l border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/95 px-5 py-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
              <div>
                <h2 className="text-lg font-bold">Candidate profile</h2>
                <p className="text-xs text-slate-500">
                  Application for {selectedJob?.title}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCandidate(null)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5 p-5">
              <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white">
                <div className="grid h-16 w-16 place-items-center rounded-2xl bg-white/15 text-xl font-bold">
                  {initials(selectedCandidate.users.name)}
                </div>
                <h3 className="mt-4 text-2xl font-bold">
                  {selectedCandidate.users.name}
                </h3>
                <p className="mt-1 flex items-center gap-2 text-sm text-blue-100">
                  <Mail size={15} />
                  {selectedCandidate.users.email}
                </p>
              </div>

              <ProfileSection title="Education">
                <p>
                  {selectedCandidate.users.candidate_profiles?.education ||
                    "Not added"}
                </p>
                <p>
                  {[
                    selectedCandidate.users.candidate_profiles?.degree,
                    selectedCandidate.users.candidate_profiles?.branch,
                  ]
                    .filter(Boolean)
                    .join(" • ") || "Degree not added"}
                </p>
                {selectedCandidate.users.candidate_profiles?.college && (
                  <p>{selectedCandidate.users.candidate_profiles.college}</p>
                )}
              </ProfileSection>

              <ProfileSection title="Location">
                <p>
                  {selectedCandidate.users.candidate_profiles?.location ||
                    "Not added"}
                </p>
              </ProfileSection>

              <ProfileSection title="Skills">
                <div className="flex flex-wrap gap-2">
                  {(
                    selectedCandidate.users.candidate_profiles?.skills ?? []
                  ).length > 0 ? (
                    selectedCandidate.users.candidate_profiles.skills?.map(
                      (skill) => (
                        <span
                          key={skill}
                          className="rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 dark:bg-blue-950/50 dark:text-blue-300"
                        >
                          {skill}
                        </span>
                      ),
                    )
                  ) : (
                    <p>No skills added</p>
                  )}
                </div>
              </ProfileSection>

              <div className="grid gap-3 sm:grid-cols-2">
                {selectedCandidate.users.candidate_profiles?.resume_url && (
                  <a
                    href={
                      selectedCandidate.users.candidate_profiles.resume_url
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700"
                  >
                    <FileText size={17} />
                    View resume
                  </a>
                )}
                {selectedCandidate.users.candidate_profiles?.portfolio_url && (
                  <a
                    href={
                      selectedCandidate.users.candidate_profiles.portfolio_url
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 font-semibold hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                  >
                    View portfolio
                  </a>
                )}
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

function ProfileSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 p-5 dark:border-slate-800">
      <h4 className="mb-3 font-bold text-slate-900 dark:text-white">{title}</h4>
      <div className="space-y-1.5 text-sm text-slate-600 dark:text-slate-300">
        {children}
      </div>
    </section>
  );
}
