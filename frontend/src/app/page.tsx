"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Plus,
  Minus,
  ArrowRight,
  Briefcase,
  Building2,
  Users,
  BriefcaseBusiness,
  GraduationCap,
  CheckCircle2,
  Search,
  LayoutDashboard,
  Video,
  MessageCircle,
  FileText,
  BarChart3,
  UserPlus,
  FileSearch,
  VideoIcon,
  Building,
  ClipboardList,
  BadgeCheck,
  Github,
  Linkedin,
  Twitter,
  Mail,
  Heart,
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);

  const faqs = [
    {
      question: "Is the platform free for candidates?",
      answer:
        "Yes! Candidates can create an account, build their profile, apply to jobs, and attend interviews completely free.",
    },
    {
      question: "How do video interviews work?",
      answer:
        "Our platform provides secure browser-based video interviews. No additional software is required—just a modern web browser.",
    },
    {
      question: "Can companies manage multiple job postings?",
      answer:
        "Absolutely. Companies can create, edit, and manage multiple job openings from a single dashboard while tracking every applicant.",
    },
    {
      question: "Can I track my job applications?",
      answer:
        "Yes. Candidates can view the status of every application, including shortlisted, interview scheduled, accepted, or rejected.",
    },
    {
      question: "Does the platform support real-time chat?",
      answer:
        "Yes. Recruiters and candidates can communicate instantly through the built-in messaging system.",
    },
  ];
  const candidateSteps = [
    {
      icon: UserPlus,
      title: "Create an Account",
      description: "Sign up in minutes and choose your career preferences.",
    },
    {
      icon: FileSearch,
      title: "Apply to Jobs",
      description: "Browse jobs, upload your resume, and apply with one click.",
    },
    {
      icon: VideoIcon,
      title: "Interview & Get Hired",
      description:
        "Attend live interviews and receive offers directly on the platform.",
    },
  ];

  const companySteps = [
    {
      icon: Building,
      title: "Register Company",
      description: "Create your company profile and verify your organization.",
    },
    {
      icon: ClipboardList,
      title: "Post & Manage Jobs",
      description:
        "Publish job openings and review applications from your dashboard.",
    },
    {
      icon: BadgeCheck,
      title: "Hire Top Talent",
      description:
        "Interview candidates, shortlist the best, and make hiring decisions faster.",
    },
  ];
  const features = [
    {
      title: "Smart Job Search",
      description:
        "Find jobs and internships tailored to your skills, experience, and interests.",
      icon: Search,
      color: "text-blue-500",
      bg: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      title: "HR Dashboard",
      description:
        "Manage job postings, applications, and candidates from one dashboard.",
      icon: LayoutDashboard,
      color: "text-purple-500",
      bg: "bg-purple-100 dark:bg-purple-900/30",
    },
    {
      title: "Live Video Interviews",
      description:
        "Conduct secure real-time interviews directly inside the platform.",
      icon: Video,
      color: "text-red-500",
      bg: "bg-red-100 dark:bg-red-900/30",
    },
    {
      title: "Instant Messaging",
      description:
        "Chat with recruiters or candidates instantly using built-in messaging.",
      icon: MessageCircle,
      color: "text-green-500",
      bg: "bg-green-100 dark:bg-green-900/30",
    },
    {
      title: "Resume & Portfolio",
      description:
        "Upload resumes, showcase projects, and build your professional profile.",
      icon: FileText,
      color: "text-orange-500",
      bg: "bg-orange-100 dark:bg-orange-900/30",
    },
    {
      title: "Hiring Analytics",
      description:
        "Gain insights into applications, hiring progress, and recruitment trends.",
      icon: BarChart3,
      color: "text-pink-500",
      bg: "bg-pink-100 dark:bg-pink-900/30",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-white transition-colors duration-300">
      {/* ================= HERO ================= */}

      <section className="relative overflow-hidden">
        {/* Background */}

        <div className="absolute inset-0">
          <div className="absolute -top-32 left-10 w-96 h-96 rounded-full bg-blue-500/20 blur-3xl" />

          <div className="absolute top-40 right-10 w-96 h-96 rounded-full bg-purple-500/20 blur-3xl" />

          <div className="absolute inset-0 bg-grid-gray-200/[0.2] dark:bg-grid-white/[0.04]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-28 lg:py-36">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* LEFT */}

            <div>
              <span className="inline-flex items-center rounded-full border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 text-sm font-medium text-blue-700 dark:text-blue-300">
                🚀 Modern Hiring Platform
              </span>

              <h1 className="mt-8 text-5xl md:text-6xl lg:text-7xl font-black leading-tight">
                Find Jobs.
                <br />
                Hire Talent.
                <br />
                <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                  One Platform.
                </span>
              </h1>

              <p className="mt-8 text-lg text-gray-600 dark:text-gray-400 max-w-xl leading-8">
                Connect candidates and companies through a powerful hiring
                platform featuring job applications, real-time chat, interview
                scheduling, and live video interviews.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => router.push("/auth/register")}
                  className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-7 py-4 text-white font-semibold hover:bg-blue-700 hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5" />
                </button>

                <button
                  onClick={() => router.push("/auth/login")}
                  className="rounded-xl border border-gray-300 dark:border-gray-700 px-7 py-4 font-semibold hover:bg-gray-100 dark:hover:bg-gray-900 transition"
                >
                  Login
                </button>
              </div>
            </div>

            {/* RIGHT */}

            <div>
              <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/60 backdrop-blur-xl p-8 shadow-2xl">
                <div className="grid gap-6">
                  <div className="flex items-center gap-4 rounded-xl bg-gray-50 dark:bg-gray-800 p-5">
                    <Briefcase className="w-10 h-10 text-blue-500" />

                    <div>
                      <h3 className="font-semibold text-lg">10,000+ Jobs</h3>

                      <p className="text-gray-500">Updated Daily</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 rounded-xl bg-gray-50 dark:bg-gray-800 p-5">
                    <Building2 className="w-10 h-10 text-purple-500" />

                    <div>
                      <h3 className="font-semibold text-lg">500+ Companies</h3>

                      <p className="text-gray-500">Hiring Now</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 rounded-xl bg-gray-50 dark:bg-gray-800 p-5">
                    <Users className="w-10 h-10 text-green-500" />

                    <div>
                      <h3 className="font-semibold text-lg">25K+ Candidates</h3>

                      <p className="text-gray-500">Active Users</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ================= STATS ================= */}

      <section className="py-20 border-y border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-8 text-center hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
              <div className="flex justify-center">
                <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-4">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
              </div>

              <h2 className="mt-5 text-4xl font-extrabold">25K+</h2>

              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Active Candidates
              </p>
            </div>

            <div className="group rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-8 text-center hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
              <div className="flex justify-center">
                <div className="rounded-full bg-purple-100 dark:bg-purple-900/30 p-4">
                  <Building2 className="w-8 h-8 text-purple-600" />
                </div>
              </div>

              <h2 className="mt-5 text-4xl font-extrabold">500+</h2>

              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Hiring Companies
              </p>
            </div>

            <div className="group rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-8 text-center hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
              <div className="flex justify-center">
                <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-4">
                  <BriefcaseBusiness className="w-8 h-8 text-green-600" />
                </div>
              </div>

              <h2 className="mt-5 text-4xl font-extrabold">10K+</h2>

              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Jobs Posted
              </p>
            </div>

            <div className="group rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-8 text-center hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
              <div className="flex justify-center">
                <div className="rounded-full bg-yellow-100 dark:bg-yellow-900/30 p-4">
                  <BadgeCheck className="w-8 h-8 text-yellow-600" />
                </div>
              </div>

              <h2 className="mt-5 text-4xl font-extrabold">95%</h2>

              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Hiring Success
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* ================= WHO IS THIS FOR ================= */}

      <section className="py-28 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <span className="text-blue-600 font-semibold tracking-wider uppercase">
              Built For Everyone
            </span>

            <h2 className="mt-3 text-4xl md:text-5xl font-bold">
              Everything You Need To Get Hired
            </h2>

            <p className="mt-5 max-w-3xl mx-auto text-lg text-gray-600 dark:text-gray-400">
              Whether you're searching for your dream job or hiring the perfect
              candidate, our platform simplifies the entire recruitment process.
            </p>
          </div>

          <div className="mt-16 grid lg:grid-cols-2 gap-10">
            {/* Candidate Card */}

            <div className="group rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-10 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-blue-100 dark:bg-blue-900/30 p-4">
                  <GraduationCap className="w-9 h-9 text-blue-600" />
                </div>

                <div>
                  <h3 className="text-3xl font-bold">For Candidates</h3>

                  <p className="text-gray-500 mt-1">
                    Find jobs and grow your career.
                  </p>
                </div>
              </div>

              <div className="mt-10 space-y-5">
                {[
                  "Search thousands of jobs & internships",
                  "One-click job applications",
                  "Create your professional profile",
                  "Upload resume & portfolio",
                  "Track every application",
                  "Attend live video interviews",
                  "Real-time HR chat",
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />

                    <p className="text-gray-600 dark:text-gray-400">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Company Card */}

            <div className="group rounded-3xl border border-gray-200 dark:border-gray-800 bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-10 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-white/20 p-4">
                  <Building2 className="w-9 h-9" />
                </div>

                <div>
                  <h3 className="text-3xl font-bold">For Companies</h3>

                  <p className="text-blue-100 mt-1">
                    Hire faster with smarter tools.
                  </p>
                </div>
              </div>

              <div className="mt-10 space-y-5">
                {[
                  "Post unlimited job openings",
                  "Manage applications effortlessly",
                  "Shortlist top candidates",
                  "Schedule interviews instantly",
                  "Conduct live video interviews",
                  "Real-time messaging with applicants",
                  "Analytics & hiring insights",
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-300 mt-1 flex-shrink-0" />

                    <p className="text-blue-100">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ================= FEATURES ================= */}

      <section className="py-28 bg-gray-50 dark:bg-gray-900/40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <span className="text-blue-600 font-semibold uppercase tracking-wider">
              Platform Features
            </span>

            <h2 className="mt-3 text-4xl md:text-5xl font-bold">
              Everything You Need
            </h2>

            <p className="mt-5 max-w-3xl mx-auto text-lg text-gray-600 dark:text-gray-400">
              Our platform provides all the tools candidates and recruiters need
              to streamline the hiring process from start to finish.
            </p>
          </div>

          <div className="mt-20 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <div
                  key={index}
                  className="group rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 hover:-translate-y-3 hover:shadow-2xl transition-all duration-300"
                >
                  <div className={`inline-flex rounded-2xl p-4 ${feature.bg}`}>
                    <Icon className={`w-8 h-8 ${feature.color}`} />
                  </div>

                  <h3 className="mt-6 text-2xl font-bold">{feature.title}</h3>

                  <p className="mt-4 text-gray-600 dark:text-gray-400 leading-7">
                    {feature.description}
                  </p>

                  <div className="mt-8 flex items-center text-blue-600 font-semibold group-hover:translate-x-2 transition-transform">
                    Learn More →
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      {/* ================= HOW IT WORKS ================= */}

      <section className="py-28 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <span className="uppercase tracking-wider text-blue-600 font-semibold">
              Simple Process
            </span>

            <h2 className="mt-3 text-4xl md:text-5xl font-bold">
              How It Works
            </h2>

            <p className="mt-5 max-w-3xl mx-auto text-lg text-gray-600 dark:text-gray-400">
              Whether you're looking for your dream job or searching for the
              perfect candidate, getting started takes only a few simple steps.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 mt-20">
            {/* Candidate */}

            <div>
              <div className="flex items-center gap-3 mb-10">
                <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30">
                  <UserPlus className="w-7 h-7 text-blue-600" />
                </div>

                <h3 className="text-3xl font-bold">For Candidates</h3>
              </div>

              <div className="space-y-8">
                {candidateSteps.map((step, index) => {
                  const Icon = step.icon;

                  return (
                    <div key={index} className="flex gap-6 group">
                      <div className="flex flex-col items-center">
                        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-blue-600 text-white font-bold">
                          {index + 1}
                        </div>

                        {index !== candidateSteps.length - 1 && (
                          <div className="w-1 flex-1 bg-gray-200 dark:bg-gray-700 mt-2" />
                        )}
                      </div>

                      <div className="pb-10">
                        <div className="inline-flex p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30">
                          <Icon className="w-6 h-6 text-blue-600" />
                        </div>

                        <h4 className="mt-4 text-2xl font-semibold">
                          {step.title}
                        </h4>

                        <p className="mt-2 text-gray-600 dark:text-gray-400 leading-7">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Company */}

            <div>
              <div className="flex items-center gap-3 mb-10">
                <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/30">
                  <Building className="w-7 h-7 text-purple-600" />
                </div>

                <h3 className="text-3xl font-bold">For Companies</h3>
              </div>

              <div className="space-y-8">
                {companySteps.map((step, index) => {
                  const Icon = step.icon;

                  return (
                    <div key={index} className="flex gap-6 group">
                      <div className="flex flex-col items-center">
                        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-purple-600 text-white font-bold">
                          {index + 1}
                        </div>

                        {index !== companySteps.length - 1 && (
                          <div className="w-1 flex-1 bg-gray-200 dark:bg-gray-700 mt-2" />
                        )}
                      </div>

                      <div className="pb-10">
                        <div className="inline-flex p-3 rounded-xl bg-purple-100 dark:bg-purple-900/30">
                          <Icon className="w-6 h-6 text-purple-600" />
                        </div>

                        <h4 className="mt-4 text-2xl font-semibold">
                          {step.title}
                        </h4>

                        <p className="mt-2 text-gray-600 dark:text-gray-400 leading-7">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FAQ ================= */}

      <section className="py-28 bg-gray-50 dark:bg-gray-900/40">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center">
            <span className="uppercase tracking-wider text-blue-600 font-semibold">
              Frequently Asked Questions
            </span>

            <h2 className="mt-3 text-4xl md:text-5xl font-bold">
              Got Questions?
            </h2>

            <p className="mt-5 text-lg text-gray-600 dark:text-gray-400">
              Everything you need to know before getting started.
            </p>
          </div>

          <div className="mt-16 space-y-5">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                  className="w-full flex justify-between items-center px-6 py-6 text-left"
                >
                  <h3 className="text-lg md:text-xl font-semibold">
                    {faq.question}
                  </h3>

                  {openFAQ === index ? (
                    <Minus className="w-5 h-5 text-blue-600" />
                  ) : (
                    <Plus className="w-5 h-5 text-gray-500" />
                  )}
                </button>

                <div
                  className={`transition-all duration-300 ${
                    openFAQ === index
                      ? "max-h-60 opacity-100"
                      : "max-h-0 opacity-0"
                  } overflow-hidden`}
                >
                  <p className="px-6 pb-6 text-gray-600 dark:text-gray-400 leading-7">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* ================= FINAL CTA ================= */}

      <section className="relative overflow-hidden py-28">
        {/* Background */}

        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />

        {/* Decorative Blur */}

        <div className="absolute -top-24 left-10 w-72 h-72 rounded-full bg-white/10 blur-3xl" />

        <div className="absolute bottom-0 right-10 w-72 h-72 rounded-full bg-pink-400/20 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="rounded-3xl border border-white/20 bg-white/10 backdrop-blur-xl p-12 lg:p-16 text-center text-white">
            <div className="flex justify-center">
              <div className="rounded-2xl bg-white/20 p-5">
                <BriefcaseBusiness className="w-12 h-12" />
              </div>
            </div>

            <h2 className="mt-8 text-4xl md:text-5xl font-bold">
              Ready to Build Your Career?
            </h2>

            <p className="mt-6 max-w-3xl mx-auto text-lg text-blue-100 leading-8">
              Join thousands of candidates finding their dream jobs and
              companies hiring exceptional talent — all on one modern platform.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-5">
              <button
                onClick={() => router.push("/auth/register")}
                className="inline-flex items-center justify-center rounded-xl bg-white text-blue-700 px-8 py-4 font-semibold hover:scale-105 transition-all duration-300 shadow-xl"
              >
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>

              <button
                onClick={() => router.push("/auth/login")}
                className="rounded-xl border border-white/30 px-8 py-4 font-semibold hover:bg-white/10 transition-all duration-300"
              >
                Sign In
              </button>
            </div>

            {/* Trust indicators */}

            <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-3xl font-bold">25K+</h3>

                <p className="text-blue-100 mt-2">Candidates</p>
              </div>

              <div>
                <h3 className="text-3xl font-bold">500+</h3>

                <p className="text-blue-100 mt-2">Companies</p>
              </div>

              <div>
                <h3 className="text-3xl font-bold">10K+</h3>

                <p className="text-blue-100 mt-2">Jobs Posted</p>
              </div>

              <div>
                <h3 className="text-3xl font-bold">95%</h3>

                <p className="text-blue-100 mt-2">Hiring Success</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ================= FOOTER ================= */}

      <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}

            <div>
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-blue-600 p-3">
                  <BriefcaseBusiness className="w-6 h-6 text-white" />
                </div>

                <span className="text-2xl font-bold">HireHub</span>
              </div>

              <p className="mt-5 text-gray-600 dark:text-gray-400 leading-7">
                Connecting talented candidates with innovative companies through
                a modern hiring platform featuring job applications, real-time
                messaging, and live interviews.
              </p>
            </div>

            {/* Platform */}

            <div>
              <h3 className="text-lg font-semibold">Platform</h3>

              <ul className="mt-5 space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 transition"
                  >
                    Find Jobs
                  </a>
                </li>

                <li>
                  <a
                    href="#"
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 transition"
                  >
                    Companies
                  </a>
                </li>

                <li>
                  <a
                    href="#"
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 transition"
                  >
                    Interviews
                  </a>
                </li>

                <li>
                  <a
                    href="#"
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 transition"
                  >
                    Dashboard
                  </a>
                </li>
              </ul>
            </div>

            {/* Company */}

            <div>
              <h3 className="text-lg font-semibold">Company</h3>

              <ul className="mt-5 space-y-3">
                <li>
                  <a
                    href="/about"
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 transition"
                  >
                    About
                  </a>
                </li>

                <li>
                  <a
                    href="/contact"
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 transition"
                  >
                    Contact
                  </a>
                </li>

                <li>
                  <a
                    href="/privacy"
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 transition"
                  >
                    Privacy Policy
                  </a>
                </li>

                <li>
                  <a
                    href="/terms"
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 transition"
                  >
                    Terms & Conditions
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}

            <div>
              <h3 className="text-lg font-semibold">Connect</h3>

              <div className="mt-5 space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-blue-600" />

                  <span className="text-gray-600 dark:text-gray-400">
                    support@hirehub.com
                  </span>
                </div>
              </div>

              {/* Social Icons */}

              <div className="flex gap-4 mt-8">
                <a
                  href="#"
                  className="rounded-full bg-gray-100 dark:bg-gray-900 p-3 hover:bg-blue-600 hover:text-white transition"
                >
                  <Github className="w-5 h-5" />
                </a>

                <a
                  href="#"
                  className="rounded-full bg-gray-100 dark:bg-gray-900 p-3 hover:bg-blue-600 hover:text-white transition"
                >
                  <Linkedin className="w-5 h-5" />
                </a>

                <a
                  href="#"
                  className="rounded-full bg-gray-100 dark:bg-gray-900 p-3 hover:bg-blue-600 hover:text-white transition"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom */}

          <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-center md:text-left">
              © {new Date().getFullYear()} HireHub. All rights reserved.
            </p>

            <div className="flex items-center gap-2 text-gray-500">
              Built with
              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
              using Next.js & Tailwind CSS
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
