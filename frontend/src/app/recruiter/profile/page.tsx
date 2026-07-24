"use client";

import { ChangeEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Building2,
  CheckCircle2,
  Globe2,
  ImageIcon,
  Loader2,
  Pencil,
  Save,
  Users,
  X,
} from "lucide-react";
import {
  fetchRecruiterProfile,
  updateRecruiterProfile,
} from "@/services/profile.services";
import { toastApiWarning } from "@/lib/toast";

interface RecruiterProfile {
  company_name: string;
  website: string;
  company_size: string;
  description: string;
  logo_url: string;
  industry: string;
}

const emptyProfile: RecruiterProfile = {
  company_name: "",
  website: "",
  company_size: "",
  description: "",
  logo_url: "",
  industry: "",
};

export default function RecruiterProfilePage() {
  const [profile, setProfile] = useState<RecruiterProfile>(emptyProfile);
  const [savedProfile, setSavedProfile] =
    useState<RecruiterProfile>(emptyProfile);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetchRecruiterProfile();
        const data = response.data ?? {};
        const nextProfile = {
          company_name: data.company_name || "",
          website: data.website || "",
          company_size: String(data.company_size || ""),
          description: data.description || "",
          logo_url: data.logo_url || "",
          industry: data.industry || "",
        };
        setProfile(nextProfile);
        setSavedProfile(nextProfile);
      } catch (error) {
        console.error("Error fetching profile", error);
        toastApiWarning(error, "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    void loadProfile();
  }, []);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setProfile((current) => ({ ...current, [name]: value }));
  };

  const handleCancel = () => {
    setProfile(savedProfile);
    setEditMode(false);
  };

  const handleSave = async () => {
    if (!profile.company_name.trim()) {
      toast.error("Company name is required");
      return;
    }

    setSaving(true);
    try {
      const response = await updateRecruiterProfile(profile);
      const data = response.data ?? profile;
      const updated = {
        company_name: data.company_name || "",
        website: data.website || "",
        company_size: String(data.company_size || ""),
        description: data.description || "",
        logo_url: data.logo_url || "",
        industry: data.industry || "",
      };
      setProfile(updated);
      setSavedProfile(updated);
      setEditMode(false);
      window.dispatchEvent(
        new CustomEvent("recruiter-profile-updated", {
          detail: { companyName: updated.company_name },
        }),
      );
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile", error);
      toastApiWarning(error, "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="grid min-h-[calc(100dvh-120px)] place-items-center">
        <div className="flex items-center gap-3 text-sm font-medium text-slate-500 dark:text-slate-400">
          <Loader2 className="animate-spin text-blue-600" size={22} />
          Loading company profile
        </div>
      </div>
    );
  }

  const displayWebsite = profile.website
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "");

  return (
    <div className="mx-auto min-h-full max-w-6xl">
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-sm font-semibold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400">
            Organization
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
            Company profile
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-500 dark:text-slate-400 sm:text-base">
            Keep your public company information accurate and up to date.
          </p>
        </div>

        {!editMode ? (
          <button
            type="button"
            onClick={() => setEditMode(true)}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 sm:w-auto"
          >
            <Pencil size={17} />
            Edit profile
          </button>
        ) : (
          <div className="grid grid-cols-2 gap-2 sm:flex">
            <button
              type="button"
              disabled={saving}
              onClick={handleCancel}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <X size={17} />
              Cancel
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={() => void handleSave()}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <Loader2 className="animate-spin" size={17} />
              ) : (
                <Save size={17} />
              )}
              {saving ? "Saving" : "Save changes"}
            </button>
          </div>
        )}
      </header>

      <main className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="relative h-32 overflow-hidden bg-gradient-to-r from-blue-700 via-indigo-600 to-violet-600 sm:h-44">
          <div className="absolute -right-12 -top-24 h-64 w-64 rounded-full border-[40px] border-white/10" />
          <div className="absolute -bottom-20 left-1/4 h-48 w-48 rounded-full bg-cyan-300/10 blur-2xl" />
          {!editMode && (
            <div className="absolute right-4 top-4 flex items-center gap-2 rounded-full bg-black/15 px-3 py-1.5 text-xs font-medium text-white backdrop-blur sm:right-6 sm:top-6">
              <CheckCircle2 size={14} />
              Public company profile
            </div>
          )}
        </div>

        <div className="px-4 pb-6 sm:px-7 sm:pb-8 lg:px-9">
          <div className="-mt-12 flex flex-col gap-4 sm:-mt-14 sm:flex-row sm:items-end">
            <CompanyLogo
              logoUrl={profile.logo_url}
              companyName={profile.company_name}
            />

            <div className="min-w-0 flex-1 pb-1 sm:pl-1">
              {editMode ? (
                <Field
                  label="Company name"
                  name="company_name"
                  value={profile.company_name}
                  onChange={handleChange}
                  placeholder="Your company name"
                  required
                  large
                />
              ) : (
                <>
                  <h2 className="break-words text-2xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
                    {profile.company_name || "Your company"}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {profile.industry || "Industry not added"}
                  </p>
                </>
              )}
            </div>
          </div>

          {editMode ? (
            <div className="mt-8">
              <div className="mb-5">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Company details
                </h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  This information will be visible to candidates.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <Field
                  label="Industry"
                  name="industry"
                  value={profile.industry}
                  onChange={handleChange}
                  placeholder="e.g. Information Technology"
                />
                <Field
                  label="Company size"
                  name="company_size"
                  value={profile.company_size}
                  onChange={handleChange}
                  placeholder="e.g. 100"
                  type="number"
                  min="1"
                />
                <Field
                  label="Website"
                  name="website"
                  value={profile.website}
                  onChange={handleChange}
                  placeholder="https://company.com"
                  type="url"
                />
                <Field
                  label="Logo URL"
                  name="logo_url"
                  value={profile.logo_url}
                  onChange={handleChange}
                  placeholder="https://company.com/logo.png"
                  type="url"
                />
                <div className="md:col-span-2">
                  <label
                    htmlFor="description"
                    className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200"
                  >
                    Company description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={6}
                    value={profile.description}
                    onChange={handleChange}
                    placeholder="Tell candidates about your company, culture, and mission..."
                    className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/15 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-blue-500 dark:focus:bg-slate-900"
                  />
                  <p className="mt-1.5 text-right text-xs text-slate-400">
                    {profile.description.length} characters
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <InfoCard
                  icon={<Building2 size={20} />}
                  label="Industry"
                  value={profile.industry || "Not added"}
                  tone="blue"
                />
                <InfoCard
                  icon={<Users size={20} />}
                  label="Company size"
                  value={
                    profile.company_size
                      ? `${profile.company_size} employees`
                      : "Not added"
                  }
                  tone="violet"
                />
                <InfoCard
                  icon={<Globe2 size={20} />}
                  label="Website"
                  value={displayWebsite || "Not added"}
                  href={profile.website}
                  tone="cyan"
                  wide
                />
              </div>

              <section className="mt-7 border-t border-slate-200 pt-7 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    <Building2 size={18} />
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    About the company
                  </h3>
                </div>
                <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
                  {profile.description ||
                    "No company description has been added yet. Edit your profile to tell candidates about your organization."}
                </p>
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

function CompanyLogo({
  logoUrl,
  companyName,
}: {
  logoUrl: string;
  companyName: string;
}) {
  return (
    <div className="relative grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-2xl border-4 border-white bg-gradient-to-br from-blue-600 to-indigo-700 text-3xl font-bold text-white shadow-lg dark:border-slate-900 sm:h-28 sm:w-28">
      {logoUrl ? (
        <div
          role="img"
          aria-label={`${companyName || "Company"} logo`}
          className="h-full w-full bg-white bg-contain bg-center bg-no-repeat"
          style={{ backgroundImage: `url("${logoUrl.replace(/"/g, '\\"')}")` }}
        />
      ) : companyName ? (
        companyName.charAt(0).toUpperCase()
      ) : (
        <ImageIcon size={30} />
      )}
    </div>
  );
}

function Field({
  label,
  large = false,
  required = false,
  ...inputProps
}: {
  label: string;
  large?: boolean;
  required?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label
        htmlFor={inputProps.name}
        className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200"
      >
        {label}
        {required && <span className="ml-1 text-rose-500">*</span>}
      </label>
      <input
        id={inputProps.name}
        required={required}
        {...inputProps}
        className={`w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/15 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-blue-500 dark:focus:bg-slate-900 ${
          large ? "h-12 text-lg font-bold sm:text-xl" : "h-11 text-sm"
        }`}
      />
    </div>
  );
}

function InfoCard({
  icon,
  label,
  value,
  href,
  tone,
  wide = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
  tone: "blue" | "violet" | "cyan";
  wide?: boolean;
}) {
  const iconStyle = {
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-300",
    violet:
      "bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-300",
    cyan: "bg-cyan-50 text-cyan-600 dark:bg-cyan-950/50 dark:text-cyan-300",
  }[tone];

  const content = (
    <>
      <span
        className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${iconStyle}`}
      >
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-xs font-medium uppercase tracking-wide text-slate-400">
          {label}
        </span>
        <span className="mt-1 block truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
          {value}
        </span>
      </span>
    </>
  );

  const className = `flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/40 ${
    wide ? "sm:col-span-2 lg:col-span-1" : ""
  }`;

  return href ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${className} transition hover:border-blue-300 hover:bg-blue-50/40 dark:hover:border-blue-900`}
    >
      {content}
    </a>
  ) : (
    <div className={className}>{content}</div>
  );
}
