"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { CircleArrowOutUpLeft } from "lucide-react";
import { loginService } from "@/services/auth.services";

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
      localStorage.setItem("User",JSON.stringify(result.user));

      const role = result.user.role;
      router.push(
        role === "CANDIDATE" ? "/candidate/dashboard" : "/recruiter/dashboard",
      );
    } catch (error: any) {
      console.log("LOGIN ERROR:", error.response?.data);
      console.log(error.response.data.error);

      const message =
        error.response?.data?.error ||
        "Something went wrong while logging in";

      setApiError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
      flex justify-center items-center min-h-screen p-4
      bg-blue-100 dark:bg-gray-900
    "
    >
      <div
        className="
        flex flex-col bg-white dark:bg-gray-800
        w-full max-w-2xl rounded-xl shadow-lg p-6 gap-6
        text-gray-800 dark:text-gray-100
      "
      >
        {/* BACK */}
        <div>
          <button
            type="button"
            onClick={() => router.push("/register")}
            className="
              flex items-center gap-2 px-3 py-2 rounded-lg text-white
              bg-blue-500 hover:bg-blue-600 transition
            "
          >
            <CircleArrowOutUpLeft size={20} />
            Create new account
          </button>
        </div>

        {/* IMAGE */}
        <div className="hidden md:flex justify-center">
          <Image
            src="/loginPageBG.jpg"
            alt="Login illustration"
            width={400}
            height={400}
            className="rounded-lg"
          />
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* EMAIL */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              autoComplete="email"
              className="
                border rounded-lg p-3 bg-gray-100 dark:bg-gray-700
                focus:outline-none focus:ring-2 focus:ring-blue-500
              "
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          {/* PASSWORD */}
          <div className="flex flex-col gap-1 relative">
            <label className="font-semibold">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              autoComplete="current-password"
              className="
                border rounded-lg p-3 pr-12
                bg-gray-100 dark:bg-gray-700
                focus:outline-none focus:ring-2 focus:ring-blue-500
              "
              {...register("password", { required: "Password is required" })}
            />
            <button
              type="button"
              aria-label="Toggle password visibility"
              onClick={() => setShowPassword((prev) => !prev)}
              className="
                absolute right-3 top-9 text-sm
                text-gray-600 dark:text-gray-300
              "
            >
              {showPassword ? "Hide" : "Show"}
            </button>

            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          {apiError && <p className="text-red-600 font-semibold">{apiError}</p>}

          {/* ACTIONS */}
          <div className="flex justify-between pt-4">
            <button
              type="reset"
              onClick={() => reset()}
              className="bg-red-500 text-white px-6 py-2 rounded-lg"
            >
              Reset
            </button>

            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white px-6 py-2 rounded-lg disabled:opacity-70"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
