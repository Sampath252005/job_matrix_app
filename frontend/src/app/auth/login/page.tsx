"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { loginService } from "@/services/auth.services";
import { Eye, EyeOff } from "lucide-react";

type RegisterForm = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterForm>();

  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const onSubmit: SubmitHandler<RegisterForm> = async (data) => {
    setLoading(true);
    setApiError("");

    try {
      //     const res = await fetch("http://localhost:2000/api/auth/login", {
      //       method: "POST",
      //       headers: { "Content-Type": "application/json" },
      //       body: JSON.stringify(data),
      //     });
      //  console.log("result:",res)
      //     const result = await res.json();

      //     if (!res.ok) {
      //       setApiError(result.message || "Login failed");
      //       return;
      //     }

      const res = await loginService(data);

      const result = res.data;
      // console.log("res:",result);
      localStorage.setItem("User", JSON.stringify(result.user));

      const role = result.user.role;
      router.push(
        role === "CANDIDATE" ? "/candidate/dashboard" : "/recruiter/dashboard",
      );
    } catch (error: any) {
      console.log("LOGIN ERROR:", error.response?.data);
      console.log(error.response.data.error);

      const message =
        error.response?.data?.error || "Something went wrong while logging in";

      setApiError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-6xl rounded-3xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 grid lg:grid-cols-2">
        {/* ================= LEFT SIDE ================= */}

        <div className="hidden lg:flex flex-col justify-center bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white p-14 relative overflow-hidden">
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-pink-400/20 rounded-full blur-3xl" />

          <div className="relative z-10">
            <h1 className="text-5xl font-black leading-tight">
              Welcome Back 👋
            </h1>

            <p className="mt-6 text-lg text-blue-100 leading-8">
              Sign in to continue managing applications, conducting interviews,
              and connecting with top talent.
            </p>

            <div className="mt-12 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span>Apply to thousands of jobs</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span>Real-time messaging</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span>Secure video interviews</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span>Track your applications</span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT SIDE ================= */}

        <div className="p-8 md:p-12">
          <button
            type="button"
            onClick={() => router.push("/register")}
            className="mb-8 text-blue-600 hover:text-blue-700 font-semibold"
          >
            ← Create New Account
          </button>

          <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
            Login
          </h2>

          <p className="mt-3 text-gray-600 dark:text-gray-400">
            Welcome back! Please enter your details.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-6">
            {/* EMAIL */}

            <div>
              <label className="block mb-2 font-medium">Email</label>

              <input
                type="email"
                placeholder="Enter your email"
                autoComplete="email"
                {...register("email", {
                  required: "Email is required",
                })}
                className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />

              {errors.email && (
                <p className="mt-2 text-red-500 text-sm">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* PASSWORD */}

            <div>
              <label className="block mb-2 font-medium">Password</label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  {...register("password", {
                    required: "Password is required",
                  })}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3 pr-20 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {errors.password && (
                <p className="mt-2 text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={() => reset()}
                className="text-gray-500 hover:text-red-500 transition"
              >
                Reset
              </button>

              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-blue-600 hover:bg-blue-700 px-8 py-3 text-white font-semibold transition disabled:opacity-50"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>

            {apiError && (
              <div className="rounded-xl bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800 p-4 text-red-600">
                {apiError}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
