"use client";

import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="w-full min-h-screen bg-white text-gray-900">
      
      {/* ================= HERO SECTION ================= */}
      <section className="w-full py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center px-5">
          <h1 className="text-4xl md:text-6xl font-extrabold">
            Find Jobs. Apply Fast. Take Interviews in One Platform.
          </h1>
          <p className="text-lg md:text-xl mt-4 text-gray-600">
            A modern hiring platform for both candidates and companies — job posting, 
            applications, real-time chat, and video interviews in one place.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={() => router.push("auth/register")}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Get Started
            </button>

            <button
              onClick={() => router.push("auth/login")}
              className="px-6 py-3 border border-gray-700 rounded-lg hover:bg-gray-100 transition"
            >
              Login
            </button>
          </div>
        </div>
      </section>

      {/* ================= FOR WHO SECTION ================= */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-5">
          <h2 className="text-3xl font-bold text-center">Who Is This For?</h2>

          <div className="grid md:grid-cols-2 gap-10 mt-10">

            {/* Candidates */}
            <div className="p-8 border rounded-xl shadow-sm hover:shadow-md transition">
              <h3 className="text-2xl font-semibold mb-4">For Candidates</h3>
              <ul className="space-y-3">
                <li>✔ Search jobs & internships</li>
                <li>✔ Apply instantly</li>
                <li>✔ Build profile & upload resume</li>
                <li>✔ Attend live video interviews</li>
                <li>✔ Track application status</li>
              </ul>
            </div>

            {/* Companies */}
            <div className="p-8 border rounded-xl shadow-sm hover:shadow-md transition">
              <h3 className="text-2xl font-semibold mb-4">For Companies</h3>
              <ul className="space-y-3">
                <li>✔ Post jobs in minutes</li>
                <li>✔ Manage applicants easily</li>
                <li>✔ Shortlist talent instantly</li>
                <li>✔ Conduct real-time video interviews</li>
                <li>✔ Real-time chat & scheduling</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURES SECTION ================= */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-5 text-center">
          <h2 className="text-3xl font-bold">Key Features</h2>

          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {[
              {
                title: "Job Search & Apply",
                desc: "Find jobs and internships tailored to your profile."
              },
              {
                title: "Company HR Dashboard",
                desc: "Post jobs, manage applicants, shortlist easily."
              },
              {
                title: "Real-Time Interviews",
                desc: "WebRTC-powered live video interview system."
              },
              {
                title: "Instant Chat",
                desc: "Real-time messaging using WebSocket."
              },
              {
                title: "Smart Profile",
                desc: "Upload resume, build your portfolio."
              },
              {
                title: "Analytics Dashboard",
                desc: "Insights for companies and candidates."
              }
            ].map((f, i) => (
              <div
                key={i}
                className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition"
              >
                <h3 className="text-xl font-semibold">{f.title}</h3>
                <p className="mt-3 text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS SECTION ================= */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-5">
          <h2 className="text-3xl font-bold text-center">How It Works</h2>

          <div className="grid md:grid-cols-2 gap-12 mt-10">
            <div>
              <h3 className="text-2xl font-semibold mb-4">For Candidates</h3>
              <ol className="space-y-3 list-decimal list-inside text-gray-700">
                <li>Create an account</li>
                <li>Complete your profile</li>
                <li>Apply & attend interviews</li>
              </ol>
            </div>

            <div>
              <h3 className="text-2xl font-semibold mb-4">For Companies</h3>
              <ol className="space-y-3 list-decimal list-inside text-gray-700">
                <li>Register your company</li>
                <li>Post jobs & manage applications</li>
                <li>Interview & hire talent</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FA Q SECTION ================= */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-5">
          <h2 className="text-3xl font-bold text-center">Frequently Asked Questions</h2>

          <div className="mt-10 space-y-6">
            <div>
              <h3 className="font-semibold text-xl">Is this platform free?</h3>
              <p className="text-gray-700">
                Yes, candidates can apply and attend interviews for free.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-xl">
                How do video interviews work?
              </h3>
              <p className="text-gray-700">
                Real-time interviews powered by WebRTC inside the dashboard.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-xl">Can companies verify candidates?</h3>
              <p className="text-gray-700">
                Yes, companies can check applicant profiles, resumes, and chat history.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="w-full py-6 bg-black text-white mt-10">
        <div className="max-w-6xl mx-auto px-5 flex justify-between">
          <p>© {new Date().getFullYear()} YourAppName. All rights reserved.</p>

          <div className="flex gap-4">
            <a href="/about" className="hover:underline">About</a>
            <a href="/contact" className="hover:underline">Contact</a>
            <a href="/privacy" className="hover:underline">Privacy Policy</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
