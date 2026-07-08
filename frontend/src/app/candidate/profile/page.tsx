"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  fetchCandidateProfile,
  updateCandidateProfile,
} from "@/services/profile.services";

import {
  GraduationCap,
  School,
  Briefcase,
  MapPin,
  Pencil,
  Save,
  FileText,
  Globe,
} from "lucide-react";

interface CandidateProfile {
  education: string;
  college: string;
  degree: string;
  branch: string;
  graduation_year: number;
  experience_level: string;
  skills: string[];
  resume_url: string;
  portfolio_url: string;
  location: string;
  job_type_preference: string;
}

export default function CandidateProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [profile, setProfile] = useState<CandidateProfile>({
    education: "",
    college: "",
    degree: "",
    branch: "",
    graduation_year: new Date().getFullYear(),
    experience_level: "",
    skills: [],
    resume_url: "",
    portfolio_url: "",
    location: "",
    job_type_preference: "",
  });

  const [skillsInput, setSkillsInput] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await fetchCandidateProfile();

      setProfile(res.data);
      console.log("profilr", profile);

      setSkillsInput(res.data.skills?.join(", ") || "");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const payload = {
        ...profile,
        skills: skillsInput
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
      };

      await updateCandidateProfile(payload);

      toast.success("Profile Updated");

      setEditMode(false);

      loadProfile();
    } catch (error) {
      toast.error("Failed to update profile");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading Profile...
      </div>
    );
  }

  return (
    <div
      className="
  bg-white
  dark:bg-zinc-900
  border
  border-gray-200
  dark:border-zinc-800
  rounded-3xl
  shadow-lg
  overflow-hidden
"
    >
      {/* Banner */}

      <div
        className="
    h-32
    sm:h-40
    md:h-48
    bg-gradient-to-r
    from-blue-600
    via-indigo-600
    to-purple-600
  "
      />

      {/* Header */}

      <div className="px-4 sm:px-6 lg:px-8 pb-8">
        <div
          className="
      flex
      flex-col
      lg:flex-row
      lg:items-end
      gap-6
      -mt-14
      sm:-mt-16
    "
        >
          {/* Avatar */}

          <div
            className="
        h-24
        w-24
        sm:h-32
        sm:w-32
        rounded-full
        border-4
        border-white
        dark:border-zinc-900
        bg-gradient-to-r
        from-blue-500
        to-indigo-600
        text-white
        flex
        items-center
        justify-center
        text-3xl
        sm:text-5xl
        font-bold
        shadow-xl
        mx-auto
        lg:mx-0
      "
          >
            {profile.degree?.charAt(0)?.toUpperCase() || "C"}
          </div>

          {/* Candidate Info */}

          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Candidate Profile
            </h2>

            <p className="mt-2 text-gray-500 dark:text-gray-400">
              {profile.degree} • {profile.branch}
            </p>

            <p className="text-gray-500 dark:text-gray-400">
              {profile.location}
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-2 mt-4">
              <span
                className="
            px-4
            py-1.5
            rounded-full
            bg-blue-100
            dark:bg-blue-900/30
            text-blue-700
            dark:text-blue-300
            text-sm
            font-medium
          "
              >
                {profile.experience_level}
              </span>

              <span
                className="
            px-4
            py-1.5
            rounded-full
            bg-green-100
            dark:bg-green-900/30
            text-green-700
            dark:text-green-300
            text-sm
            font-medium
          "
              >
                {profile.job_type_preference}
              </span>
            </div>
          </div>

          {/* Action Button */}

          <div className="w-full lg:w-auto">
            {!editMode ? (
              <button
                onClick={() => setEditMode(true)}
                className="
            w-full
            lg:w-auto
            flex
            items-center
            justify-center
            gap-2
            px-6
            py-3
            rounded-xl
            bg-blue-600
            hover:bg-blue-700
            text-white
            transition
            shadow-md
          "
              >
                <Pencil size={18} />
                Edit Profile
              </button>
            ) : (
              <button
                onClick={handleSave}
                disabled={saving}
                className="
            w-full
            lg:w-auto
            flex
            items-center
            justify-center
            gap-2
            px-6
            py-3
            rounded-xl
            bg-green-600
            hover:bg-green-700
            text-white
            transition
            shadow-md
            disabled:opacity-50
          "
              >
                <Save size={18} />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            )}
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 dark:border-zinc-800 pt-8">
          {/* Information Grid */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProfileField
              icon={<GraduationCap size={18} />}
              label="Education"
              value={profile.education}
              name="education"
              editMode={editMode}
              onChange={handleChange}
            />

            <ProfileField
              icon={<School size={18} />}
              label="College"
              value={profile.college}
              name="college"
              editMode={editMode}
              onChange={handleChange}
            />

            <ProfileField
              icon={<GraduationCap size={18} />}
              label="Degree"
              value={profile.degree}
              name="degree"
              editMode={editMode}
              onChange={handleChange}
            />

            <ProfileField
              icon={<GraduationCap size={18} />}
              label="Branch"
              value={profile.branch}
              name="branch"
              editMode={editMode}
              onChange={handleChange}
            />

            <ProfileField
              icon={<Briefcase size={18} />}
              label="Experience Level"
              value={profile.experience_level}
              name="experience_level"
              editMode={editMode}
              onChange={handleChange}
            />

            <ProfileField
              icon={<MapPin size={18} />}
              label="Location"
              value={profile.location}
              name="location"
              editMode={editMode}
              onChange={handleChange}
            />

            <ProfileField
              icon={<Briefcase size={18} />}
              label="Job Preference"
              value={profile.job_type_preference}
              name="job_type_preference"
              editMode={editMode}
              onChange={handleChange}
            />

            <ProfileField
              icon={<GraduationCap size={18} />}
              label="Graduation Year"
              value={String(profile.graduation_year)}
              name="graduation_year"
              editMode={editMode}
              onChange={handleChange}
            />
          </div>

          {/* Skills */}

          <div className="mt-10">
            <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Skills
            </label>

            {editMode ? (
              <input
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
                placeholder="React, Next.js, Node.js, TypeScript..."
                className="
          w-full
          rounded-xl
          border
          border-gray-300
          dark:border-zinc-700
          bg-white
          dark:bg-zinc-800
          px-4
          py-3
          outline-none
          focus:ring-2
          focus:ring-blue-500
          transition
        "
              />
            ) : (
              <div className="flex flex-wrap gap-3">
                {profile.skills.map((skill: string) => (
                  <span
                    key={skill}
                    className="
              px-4
              py-2
              rounded-full
              bg-blue-100
              dark:bg-blue-900/30
              text-blue-700
              dark:text-blue-300
              text-sm
              font-medium
            "
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Resume & Portfolio */}

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Resume */}

            <div
              className="
        rounded-2xl
        border
        border-gray-200
        dark:border-zinc-800
        p-5
        bg-gray-50
        dark:bg-zinc-800/40
      "
            >
              <label className="block text-lg font-semibold mb-4">Resume</label>

              {editMode ? (
                <input
                  name="resume_url"
                  value={profile.resume_url}
                  onChange={handleChange}
                  className="
            w-full
            rounded-xl
            border
            border-gray-300
            dark:border-zinc-700
            bg-white
            dark:bg-zinc-900
            px-4
            py-3
            outline-none
            focus:ring-2
            focus:ring-blue-500
          "
                />
              ) : (
                <a
                  href={profile.resume_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
            inline-flex
            items-center
            gap-2
            text-blue-600
            hover:text-blue-700
            dark:text-blue-400
            font-medium
          "
                >
                  <FileText size={18} />
                  View Resume
                </a>
              )}
            </div>

            {/* Portfolio */}

            <div
              className="
        rounded-2xl
        border
        border-gray-200
        dark:border-zinc-800
        p-5
        bg-gray-50
        dark:bg-zinc-800/40
      "
            >
              <label className="block text-lg font-semibold mb-4">
                Portfolio
              </label>

              {editMode ? (
                <input
                  name="portfolio_url"
                  value={profile.portfolio_url}
                  onChange={handleChange}
                  className="
            w-full
            rounded-xl
            border
            border-gray-300
            dark:border-zinc-700
            bg-white
            dark:bg-zinc-900
            px-4
            py-3
            outline-none
            focus:ring-2
            focus:ring-blue-500
          "
                />
              ) : (
                <a
                  href={profile.portfolio_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
            inline-flex
            items-center
            gap-2
            text-blue-600
            hover:text-blue-700
            dark:text-blue-400
            font-medium
          "
                >
                  <Globe size={18} />
                  Visit Portfolio
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileField({
  label,
  value,
  name,
  icon,
  editMode,
  onChange,
}: any) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-gray-200
        dark:border-zinc-800
        bg-gray-50
        dark:bg-zinc-800/40
        p-5
        transition-all
        hover:shadow-md
      "
    >
      {/* Label */}

      <label
        className="
          mb-3
          flex
          items-center
          gap-2
          text-sm
          font-semibold
          text-gray-600
          dark:text-gray-400
        "
      >
        <span className="text-blue-600 dark:text-blue-400">
          {icon}
        </span>

        {label}
      </label>

      {/* Edit Mode */}

      {editMode ? (
        <input
          name={name}
          value={value ?? ""}
          onChange={onChange}
          className="
            w-full
            rounded-xl
            border
            border-gray-300
            dark:border-zinc-700
            bg-white
            dark:bg-zinc-900
            text-gray-900
            dark:text-white
            px-4
            py-3
            outline-none
            transition
            focus:ring-2
            focus:ring-blue-500
            focus:border-blue-500
          "
        />
      ) : (
        <div
          className="
            flex
            items-center
            gap-3
            text-gray-900
            dark:text-white
            text-base
            font-medium
            break-words
          "
        >
          {value ? (
            value
          ) : (
            <span className="text-gray-400 italic">
              Not provided
            </span>
          )}
        </div>
      )}
    </div>
  );
}

