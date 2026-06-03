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
    <div className="w-full min-h-screen p-4 md:p-8 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Company Profile</h1>
            <p className="text-sm text-gray-500">
              Manage your company information
            </p>
          </div>

          {!editMode ? (
            <button
              onClick={() => setEditMode(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              <Pencil size={16} />
              Edit Profile
            </button>
          ) : (
            <button
              disabled={saving}
              onClick={handleSave}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              <Save size={16} />
              {saving ? "Saving..." : "Save Profile"}
            </button>
          )}
        </div>

        {/* PROFILE CARD */}
        <div className="bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm overflow-hidden">
          {/* BANNER */}
          <div className="h-36 bg-gradient-to-r from-blue-500 to-indigo-600" />

          {/* LOGO + COMPANY NAME */}
          <div className="p-6 flex flex-col md:flex-row md:items-center gap-6">
            <div className="relative -mt-16">
              <div className="w-28 h-28 rounded-2xl bg-gray-200 dark:bg-gray-800 shadow flex items-center justify-center text-3xl font-bold border">
                {profile.company_name?.charAt(0) || "C"}
              </div>

              {editMode && (
                <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow">
                  <ImageIcon size={14} />
                </button>
              )}
            </div>

            <div className="flex-1 space-y-1">
              {editMode ? (
                <input
                  type="text"
                  name="company_name"
                  value={profile.company_name}
                  onChange={handleChange}
                  className="text-xl font-bold border rounded-lg p-2 w-full"
                />
              ) : (
                <h2 className="text-2xl font-bold">{profile.company_name}</h2>
              )}

              <p className="text-sm text-gray-500">Recruiter Organization</p>
            </div>
          </div>

          {/* FORM GRID */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* WEBSITE */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Website</label>

              {editMode ? (
                <input
                  type="text"
                  name="website"
                  value={profile.website}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2"
                />
              ) : (
                <div className="flex items-center gap-2 text-gray-700">
                  <Globe size={18} />
                  {profile.website}
                </div>
              )}
            </div>

            {/* INDUSTRY */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Industry</label>

              {editMode ? (
                <input
                  type="text"
                  name="industry"
                  value={profile.industry}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2"
                />
              ) : (
                <div className="flex items-center gap-2 text-gray-700">
                  <Briefcase size={18} />
                  {profile.industry}
                </div>
              )}
            </div>

            {/* COMPANY SIZE */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Company Size</label>

              {editMode ? (
                <input
                  type="number"
                  name="company_size"
                  value={profile.company_size}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2"
                />
              ) : (
                <div className="flex items-center gap-2 text-gray-700">
                  <Users size={18} />
                  {profile.company_size} Employees
                </div>
              )}
            </div>

            {/* LOGO URL */}
            {editMode && (
              <div className="space-y-1">
                <label className="text-sm font-medium">Logo URL</label>

                <input
                  type="text"
                  name="logo_url"
                  value={profile.logo_url}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2"
                />
              </div>
            )}
          </div>

          {/* DESCRIPTION */}
          <div className="p-6 pt-0 space-y-1">
            <label className="text-sm font-medium">Description</label>

            {editMode ? (
              <textarea
                rows={4}
                name="description"
                value={profile.description}
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
              />
            ) : (
              <p className="text-gray-600">{profile.description}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
