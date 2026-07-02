"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  fetchRecruiterProfile,
  updateRecruiterProfile,
} from "@/services/profile.services";

import { Globe, Users, Briefcase, Pencil, Save, ImageIcon } from "lucide-react";

export default function RecruiterProfilePage() {
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState<any>({
    company_name: "",
    website: "",
    company_size: "",
    description: "",
    logo_url: "",
    industry: "",
  });

  const [loading, setLoading] = useState(true);

  /* FETCH PROFILE */
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchRecruiterProfile();

        setProfile({
          company_name: data.data.company_name || "",
          website: data.data.website || "",
          company_size: data.data.company_size || "",
          description: data.data.description || "",
          logo_url: data.data.logo_url || "",
          industry: data.data.industry || "",
        });
        console.log("Profile data:", profile);
      } catch (error) {
        console.error("Error fetching profile", error);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  /* HANDLE INPUT CHANGE */
  const handleChange = (e: any) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  /* SAVE PROFILE */
  const handleSave = async () => {
    setSaving(true);
    try {
      const updatedProfile = await updateRecruiterProfile(profile);

      setProfile(updatedProfile.data);
      setEditMode(false);

      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile", error);
      toast.error("Error updating profile");
    } finally {
      setSaving(false);
    }
  };

  /* LOADING SCREEN */
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading profile...
      </div>
    );
  }

  return (
   <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-[#09090B] dark:via-[#0F172A] dark:to-[#020617] p-5 md:p-8">

  <div className="max-w-7xl mx-auto space-y-8">

    {/* ================= Header ================= */}

    <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-5">

      <div>

        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Company Profile
        </h1>

        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Manage your company branding, information and public profile.
        </p>

      </div>

      {!editMode ? (

        <button
          onClick={() => setEditMode(true)}
          className="
          inline-flex
          items-center
          gap-2
          rounded-xl
          bg-gradient-to-r
          from-blue-600
          to-indigo-600
          px-6
          py-3
          text-white
          font-semibold
          shadow-lg
          hover:scale-105
          transition-all
        "
        >
          <Pencil size={18} />
          Edit Profile
        </button>

      ) : (

        <button
          disabled={saving}
          onClick={handleSave}
          className="
          inline-flex
          items-center
          gap-2
          rounded-xl
          bg-gradient-to-r
          from-emerald-500
          to-green-600
          px-6
          py-3
          text-white
          font-semibold
          shadow-lg
          hover:scale-105
          disabled:opacity-60
          disabled:hover:scale-100
          transition-all
        "
        >
          <Save size={18} />
          {saving ? "Saving..." : "Save Profile"}
        </button>

      )}

    </div>

    {/* ================= Card ================= */}

    <div
      className="
      overflow-hidden
      rounded-3xl
      border
      border-gray-200
      dark:border-gray-800
      bg-white/80
      dark:bg-gray-900/70
      backdrop-blur-xl
      shadow-2xl
    "
    >

      {/* Banner */}

      <div
        className="
        relative
        h-48
        bg-gradient-to-r
        from-blue-600
        via-indigo-600
        to-purple-600
      "
      >

        <div className="absolute inset-0 bg-black/20" />

      </div>

      {/* Profile */}

      <div className="px-8 pb-8">

        <div className="flex flex-col lg:flex-row gap-8 -mt-16">

          {/* Logo */}

          <div className="relative">

            <div
              className="
              h-32
              w-32
              rounded-3xl
              border-4
              border-white
              dark:border-gray-900
              bg-gradient-to-br
              from-blue-500
              to-indigo-600
              shadow-xl
              flex
              items-center
              justify-center
              text-5xl
              font-bold
              text-white
            "
            >
              {profile.company_name?.charAt(0) || "C"}
            </div>

            {editMode && (

              <button
                className="
                absolute
                bottom-2
                right-2
                rounded-full
                bg-blue-600
                p-2
                text-white
                shadow-lg
                hover:bg-blue-700
              "
              >
                <ImageIcon size={16} />
              </button>

            )}

          </div>

          {/* Name */}

          <div className="flex-1 mt-4">

            {editMode ? (

              <input
                name="company_name"
                value={profile.company_name}
                onChange={handleChange}
                className="
                w-full
                rounded-xl
                border
                border-gray-300
                dark:border-gray-700
                bg-gray-50
                dark:bg-gray-800
                p-3
                text-3xl
                font-bold
                outline-none
                focus:ring-2
                focus:ring-blue-500
              "
              />

            ) : (

              <>

                <h2 className="text-4xl font-bold">
                  {profile.company_name}
                </h2>

                <p className="mt-2 text-gray-500 dark:text-gray-400">
                  Recruiter Organization
                </p>

              </>

            )}

          </div>

        </div>

        {/* ================= Information ================= */}

        <div className="grid lg:grid-cols-2 gap-6 mt-10">

          {/* Website */}

          <div className="space-y-2">

            <label className="font-semibold">
              Website
            </label>

            {editMode ? (

              <input
                name="website"
                value={profile.website}
                onChange={handleChange}
                className="
                w-full
                rounded-xl
                border
                border-gray-300
                dark:border-gray-700
                bg-gray-50
                dark:bg-gray-800
                p-3
                outline-none
                focus:ring-2
                focus:ring-blue-500
              "
              />

            ) : (

              <div className="flex items-center gap-3 rounded-xl bg-gray-100 dark:bg-gray-800 p-4">

                <Globe className="text-blue-500" size={20} />

                <span>{profile.website || "-"}</span>

              </div>

            )}

          </div>

          {/* Industry */}

          <div className="space-y-2">

            <label className="font-semibold">
              Industry
            </label>

            {editMode ? (

              <input
                name="industry"
                value={profile.industry}
                onChange={handleChange}
                className="
                w-full
                rounded-xl
                border
                border-gray-300
                dark:border-gray-700
                bg-gray-50
                dark:bg-gray-800
                p-3
                outline-none
                focus:ring-2
                focus:ring-blue-500
              "
              />

            ) : (

              <div className="flex items-center gap-3 rounded-xl bg-gray-100 dark:bg-gray-800 p-4">

                <Briefcase className="text-blue-500" size={20} />

                <span>{profile.industry || "-"}</span>

              </div>

            )}

          </div>

          {/* Company Size */}

          <div className="space-y-2">

            <label className="font-semibold">
              Company Size
            </label>

            {editMode ? (

              <input
                type="number"
                name="company_size"
                value={profile.company_size}
                onChange={handleChange}
                className="
                w-full
                rounded-xl
                border
                border-gray-300
                dark:border-gray-700
                bg-gray-50
                dark:bg-gray-800
                p-3
                outline-none
                focus:ring-2
                focus:ring-blue-500
              "
              />

            ) : (

              <div className="flex items-center gap-3 rounded-xl bg-gray-100 dark:bg-gray-800 p-4">

                <Users className="text-blue-500" size={20} />

                <span>{profile.company_size} Employees</span>

              </div>

            )}

          </div>

          {/* Logo */}

          {editMode && (

            <div className="space-y-2">

              <label className="font-semibold">
                Logo URL
              </label>

              <input
                name="logo_url"
                value={profile.logo_url}
                onChange={handleChange}
                className="
                w-full
                rounded-xl
                border
                border-gray-300
                dark:border-gray-700
                bg-gray-50
                dark:bg-gray-800
                p-3
                outline-none
                focus:ring-2
                focus:ring-blue-500
              "
              />

            </div>

          )}

        </div>

        {/* Description */}

        <div className="mt-8">

          <label className="font-semibold block mb-3">
            Company Description
          </label>

          {editMode ? (

            <textarea
              rows={6}
              name="description"
              value={profile.description}
              onChange={handleChange}
              className="
              w-full
              rounded-2xl
              border
              border-gray-300
              dark:border-gray-700
              bg-gray-50
              dark:bg-gray-800
              p-4
              outline-none
              focus:ring-2
              focus:ring-blue-500
            "
            />

          ) : (

            <div
              className="
              rounded-2xl
              bg-gray-100
              dark:bg-gray-800
              p-5
              leading-7
              text-gray-700
              dark:text-gray-300
            "
            >
              {profile.description || "No company description added."}
            </div>

          )}

        </div>

      </div>

    </div>

  </div>

</div>
  );
}
