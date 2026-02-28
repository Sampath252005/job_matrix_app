"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useForm, SubmitHandler } from "react-hook-form";
import { CircleArrowOutUpLeft, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

type RegisterForm = {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  companyName?: string;
  companyEmail?: string;
  jobTitle?: string;
  password: string;
  confirmPassword: string;
  userRole: "CANDIDATE" | "RECRUITER";
};

type FieldConfig = {
  id: number;
  name: keyof RegisterForm;
  label: string;
  placeholder: string;
  message: string;
  type?: string;
};

/* ================= PASSWORD RULES ================= */
const passwordRules = {
  minLength: {
    value: 8,
    message: "Password must be at least 8 characters",
  },
  pattern: {
    value:
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&.]+$/,
    message:
      "Password must include uppercase, lowercase, number, and special character",
  },
};

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
    setValue,
  } = useForm<RegisterForm>({
    defaultValues: { userRole: "CANDIDATE" },
  });

  const router = useRouter();
  const [selectRole, setSelectRole] =
    useState<RegisterForm["userRole"]>("CANDIDATE");
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const onSubmit: SubmitHandler<RegisterForm> = async (data) => {
    setLoading(true);
    setApiError("");
    console.log(data);

    const payload = {
      ...data,
      userRole: data.userRole.toUpperCase(), // IMPORTANT
    };

    console.log("payload",payload);

    try {
      const res = await fetch("http://localhost:2000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) {
        setApiError(result.message || "Registration failed");
        return;
      }

      alert("Registration successful 🎉");
      reset({ userRole: selectRole });
      router.push("/login");
    } catch {
      console.log("Error in login api")
      setApiError("somthing went wrong try after some time");
    } finally {
      setLoading(false);
    }
  };

  const CandidateFields: FieldConfig[] = [
    {
      id: 1,
      name: "fullName",
      label: "Full Name",
      placeholder: "Enter your name",
      message: "Name is required",
    },
    {
      id: 2,
      name: "phoneNumber",
      label: "Phone Number",
      placeholder: "Enter phone number",
      message: "Phone number is required",
    },
    {
      id: 3,
      name: "email",
      label: "Email",
      placeholder: "Enter email",
      message: "Email is required",
      type: "email",
    },
    {
      id: 4,
      name: "password",
      label: "Password",
      placeholder: "Enter password",
      message: "Password is required",
    },
    {
      id: 5,
      name: "confirmPassword",
      label: "Confirm Password",
      placeholder: "Re-enter password",
      message: "Confirm password is required",
    },
  ];

  const RecruiterFields: FieldConfig[] = [
    {
      id: 1,
      name: "companyName",
      label: "Company Name",
      placeholder: "Enter company name",
      message: "Company name is required",
    },
    {
      id: 2,
      name: "phoneNumber",
      label: "Phone Number",
      placeholder: "Enter phone number",
      message: "Phone number is required",
    },
    {
      id: 4,
      name: "companyEmail",
      label: "Company Email",
      placeholder: "Enter company email",
      message: "Company email is required",
      type: "email",
    },
    {
      id: 5,
      name: "password",
      label: "Password",
      placeholder: "Enter password",
      message: "Password is required",
    },
    {
      id: 6,
      name: "confirmPassword",
      label: "Confirm Password",
      placeholder: "Re-enter password",
      message: "Confirm password is required",
    },
  ];

  const fields = selectRole === "CANDIDATE" ? CandidateFields : RecruiterFields;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-blue-100 dark:bg-gray-900">
      <div className="w-full max-w-2xl p-6 space-y-6 rounded-xl shadow-lg bg-white dark:bg-gray-800 text-black dark:text-white">
        <button
          onClick={() => router.push("/auth/login")}
          className="flex items-center gap-2 px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white"
        >
          <CircleArrowOutUpLeft size={20} />
          Already have an account
        </button>

        <div className="hidden md:flex justify-center">
          <Image
            src="/loginPageBG.jpg"
            alt="Register"
            width={350}
            height={350}
            className="rounded-lg"
          />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <input type="hidden" {...register("userRole")} />

          <div className="flex rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-700">
            {(["CANDIDATE", "RECRUITER"] as const).map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => {
                  setSelectRole(role);
                  setValue("userRole", role);
                  reset({ ...getValues(), userRole: role });
                }}
                className={`flex-1 p-3 transition-all ${
                  selectRole === role
                    ? "bg-black text-white dark:bg-white dark:text-black font-semibold"
                    : "text-gray-600 dark:text-gray-300"
                }`}
              >
                {role}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {fields.map((field) => (
              <div key={field.id} className="relative flex flex-col gap-1">
                <label className="font-semibold">{field.label}</label>

                <div className="relative">
                  <input
                    type={
                      field.name === "password"
                        ? showPassword1
                          ? "text"
                          : "password"
                        : field.name === "confirmPassword"
                        ? showPassword2
                          ? "text"
                          : "password"
                        : field.type || "text"
                    }
                    placeholder={field.placeholder}
                    className="p-3 rounded-lg border w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-black dark:text-white"
                    {...register(field.name, {
                      required: field.message,
                      ...(field.name === "password" && passwordRules),
                      pattern:
                        field.name === "email" || field.name === "companyEmail"
                          ? {
                              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                              message: "Invalid email",
                            }
                          : field.name === "phoneNumber"
                          ? {
                              value: /^[6-9]\d{9}$/,
                              message: "Invalid phone number",
                            }
                          : undefined,
                      validate:
                        field.name === "confirmPassword"
                          ? (val) =>
                              val === getValues("password") ||
                              "Passwords do not match"
                          : undefined,
                    })}
                  />

                  {(field.name === "password" ||
                    field.name === "confirmPassword") && (
                    <button
                      type="button"
                      onClick={() =>
                        field.name === "password"
                          ? setShowPassword1((p) => !p)
                          : setShowPassword2((p) => !p)
                      }
                      className="absolute right-3 top-3"
                    >
                      {field.name === "password" ? (
                        showPassword1 ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )
                      ) : showPassword2 ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  )}
                </div>

                {errors[field.name] && (
                  <p className="text-sm text-red-500">
                    {errors[field.name]?.message as string}
                  </p>
                )}
              </div>
            ))}
          </div>

          {apiError && <p className="text-red-500 font-semibold">{apiError}</p>}

          <div className="flex justify-between">
            <button
              type="reset"
              onClick={() => reset({ userRole: selectRole })}
              className="px-6 py-2 rounded bg-red-500 text-white"
            >
              Reset
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded bg-green-600 text-white"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;