"use client";

import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  BriefcaseBusiness,
  Check,
  Eye,
  EyeOff,
  Loader2,
  UserRound,
} from "lucide-react";
import { registerService } from "@/services/auth.services";
import { toastApiWarning } from "@/lib/toast";

type UserRole = "CANDIDATE" | "RECRUITER";

interface RegisterForm {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const phonePattern = /^[6-9]\d{9}$/;
const passwordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#])[A-Za-z\d@$!%*?&.#]{8,64}$/;

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    getValues,
    formState: { errors },
  } = useForm<RegisterForm>({
    mode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      role: "CANDIDATE",
    },
  });

  const selectedRole = watch("role");
  const password = watch("password");

  const selectRole = (role: UserRole) => {
    setValue("role", role, { shouldValidate: true });
    setApiError("");
  };

  const onSubmit: SubmitHandler<RegisterForm> = async (formData) => {
    if (loading) return;

    setLoading(true);
    setApiError("");

    try {
      await registerService({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        role: formData.role,
      });
      toast.success("Account created successfully. Please sign in.");
      reset();
      router.push("/auth/login");
    } catch (error: unknown) {
      const fallbackMessage = "Registration failed. Please try again.";
      setApiError(fallbackMessage);
      toastApiWarning(error, fallbackMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-dvh items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-100 px-4 py-8 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 sm:py-10">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900 lg:grid-cols-2">
        <section className="relative hidden overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-12 text-white lg:flex lg:flex-col lg:justify-center xl:p-14">
          <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-pink-400/20 blur-3xl" />

          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur">
              <BriefcaseBusiness size={17} />
              Job Matrix
            </span>
            <h1 className="mt-7 text-5xl font-black leading-tight">
              Start your journey with us
            </h1>
            <p className="mt-6 text-lg leading-8 text-blue-100">
              Create an account to discover opportunities, hire great talent,
              and manage every step from one place.
            </p>

            <div className="mt-10 space-y-5">
              {[
                "Discover relevant job opportunities",
                "Connect candidates with hiring teams",
                "Create and complete assessments",
                "Track applications and results",
              ].map((benefit) => (
                <div key={benefit} className="flex items-center gap-3">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-emerald-400 text-emerald-950">
                    <Check size={15} strokeWidth={3} />
                  </span>
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="p-5 sm:p-8 md:p-10 xl:p-12">
          <button
            type="button"
            onClick={() => router.push("/auth/login")}
            className="text-sm font-semibold text-blue-600 transition hover:text-blue-700 dark:text-blue-400"
          >
            ← Already have an account?
          </button>

          <div className="mt-6">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Create account
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 sm:text-base">
              Choose your role and enter your details to get started.
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="mt-7 space-y-5"
          >
            <fieldset>
              <legend className="mb-2 block text-sm font-medium text-gray-800 dark:text-gray-200">
                I want to join as
              </legend>
              <div className="grid grid-cols-2 gap-2 rounded-xl bg-gray-100 p-1.5 dark:bg-gray-800">
                <RoleButton
                  active={selectedRole === "CANDIDATE"}
                  icon={<UserRound size={17} />}
                  label="Candidate"
                  onClick={() => selectRole("CANDIDATE")}
                />
                <RoleButton
                  active={selectedRole === "RECRUITER"}
                  icon={<BriefcaseBusiness size={17} />}
                  label="Recruiter"
                  onClick={() => selectRole("RECRUITER")}
                />
              </div>
              <input type="hidden" {...register("role")} />
            </fieldset>

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                id="name"
                label={
                  selectedRole === "RECRUITER"
                    ? "Company name"
                    : "Full name"
                }
                error={errors.name?.message}
              >
                <input
                  id="name"
                  type="text"
                  autoComplete={
                    selectedRole === "RECRUITER" ? "organization" : "name"
                  }
                  maxLength={80}
                  placeholder={
                    selectedRole === "RECRUITER"
                      ? "Enter company name"
                      : "Enter your full name"
                  }
                  {...register("name", {
                    required:
                      selectedRole === "RECRUITER"
                        ? "Company name is required"
                        : "Full name is required",
                    setValueAs: (value: string) => value.trim(),
                    minLength: {
                      value: 2,
                      message: "Name must contain at least 2 characters",
                    },
                    maxLength: {
                      value: 80,
                      message: "Name cannot exceed 80 characters",
                    },
                    pattern: {
                      value: /^[\p{L}\p{N}][\p{L}\p{N}\s.'&()-]*$/u,
                      message: "Enter a valid name",
                    },
                  })}
                  className={inputClass(Boolean(errors.name))}
                />
              </FormField>

              <FormField
                id="phone"
                label="Phone number"
                error={errors.phone?.message}
              >
                <input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  maxLength={10}
                  placeholder="10-digit mobile number"
                  {...register("phone", {
                    required: "Phone number is required",
                    setValueAs: (value: string) =>
                      value.replace(/[\s()-]/g, ""),
                    pattern: {
                      value: phonePattern,
                      message: "Enter a valid 10-digit Indian mobile number",
                    },
                  })}
                  className={inputClass(Boolean(errors.phone))}
                />
              </FormField>
            </div>

            <FormField
              id="email"
              label={
                selectedRole === "RECRUITER" ? "Company email" : "Email address"
              }
              error={errors.email?.message}
            >
              <input
                id="email"
                type="email"
                autoComplete="email"
                maxLength={254}
                placeholder="you@example.com"
                {...register("email", {
                  required: "Email is required",
                  setValueAs: (value: string) => value.trim().toLowerCase(),
                  pattern: {
                    value: emailPattern,
                    message: "Enter a valid email address",
                  },
                  maxLength: {
                    value: 254,
                    message: "Email address is too long",
                  },
                })}
                className={inputClass(Boolean(errors.email))}
              />
            </FormField>

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                id="password"
                label="Password"
                error={errors.password?.message}
              >
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    maxLength={64}
                    placeholder="Create a password"
                    {...register("password", {
                      required: "Password is required",
                      pattern: {
                        value: passwordPattern,
                        message:
                          "Use 8+ characters with uppercase, lowercase, number, and symbol",
                      },
                    })}
                    className={`${inputClass(Boolean(errors.password))} pr-12`}
                  />
                  <PasswordToggle
                    visible={showPassword}
                    label="password"
                    onClick={() => setShowPassword((current) => !current)}
                  />
                </div>
              </FormField>

              <FormField
                id="confirmPassword"
                label="Confirm password"
                error={errors.confirmPassword?.message}
              >
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    maxLength={64}
                    placeholder="Repeat your password"
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (value) =>
                        value === getValues("password") ||
                        "Passwords do not match",
                    })}
                    className={`${inputClass(Boolean(errors.confirmPassword))} pr-12`}
                  />
                  <PasswordToggle
                    visible={showConfirmPassword}
                    label="confirmation password"
                    onClick={() =>
                      setShowConfirmPassword((current) => !current)
                    }
                  />
                </div>
              </FormField>
            </div>

            <PasswordRules password={password} />

            {apiError && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300"
              >
                {apiError}
              </div>
            )}

            <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                disabled={loading}
                onClick={() => {
                  reset();
                  setApiError("");
                }}
                className="h-11 rounded-xl px-5 text-sm font-semibold text-gray-500 transition hover:bg-gray-100 hover:text-red-600 disabled:opacity-50 dark:hover:bg-gray-800"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {loading && <Loader2 className="animate-spin" size={17} />}
                {loading ? "Creating account..." : "Create account"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}

function RoleButton({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg text-sm font-semibold transition ${
        active
          ? "bg-white text-blue-700 shadow-sm dark:bg-gray-700 dark:text-blue-300"
          : "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function FormField({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-gray-800 dark:text-gray-200"
      >
        {label}
      </label>
      {children}
      {error && (
        <p role="alert" className="mt-1.5 text-xs text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

function PasswordToggle({
  visible,
  label,
  onClick,
}: {
  visible: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={`${visible ? "Hide" : "Show"} ${label}`}
      onClick={onClick}
      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-400 transition hover:text-gray-700 dark:hover:text-gray-200"
    >
      {visible ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  );
}

function PasswordRules({ password }: { password: string }) {
  if (!password) return null;

  const rules = [
    { label: "8–64 characters", valid: password.length >= 8 },
    { label: "Upper & lowercase", valid: /[A-Z]/.test(password) && /[a-z]/.test(password) },
    { label: "Number", valid: /\d/.test(password) },
    { label: "Special character", valid: /[@$!%*?&.#]/.test(password) },
  ];

  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1 rounded-xl bg-gray-50 px-3 py-2 dark:bg-gray-800/70">
      {rules.map((rule) => (
        <span
          key={rule.label}
          className={`flex items-center gap-1 text-xs ${
            rule.valid
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-gray-400"
          }`}
        >
          <Check size={12} />
          {rule.label}
        </span>
      ))}
    </div>
  );
}

function inputClass(hasError: boolean) {
  return `h-11 w-full rounded-xl border bg-gray-50 px-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:bg-white focus:ring-2 dark:bg-gray-800 dark:text-white dark:focus:bg-gray-900 ${
    hasError
      ? "border-red-400 focus:border-red-500 focus:ring-red-500/15 dark:border-red-700"
      : "border-gray-300 focus:border-blue-500 focus:ring-blue-500/15 dark:border-gray-700 dark:focus:border-blue-500"
  }`;
}
