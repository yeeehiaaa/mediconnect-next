"use client";

import { BrainCircuit, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AISection() {
  return (
    <section className="bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-700 py-24 text-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-20 px-6 lg:flex-row">

        {/* Left */}
        <div className="flex-1">

          <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm backdrop-blur">
            <Sparkles size={16} />
            Powered by Artificial Intelligence
          </span>

          <h2 className="mt-8 text-5xl font-extrabold leading-tight">
            Meet your
            <br />
            AI Healthcare Assistant
          </h2>

          <p className="mt-8 max-w-xl text-lg leading-8 text-violet-100">
            Ask medical questions, receive personalized recommendations,
            understand prescriptions and laboratory results, and navigate your
            healthcare journey with confidence.
          </p>

          <ul className="mt-10 space-y-4 text-lg">
            <li>✔ Symptom Guidance</li>
            <li>✔ Medication Information</li>
            <li>✔ Lab Result Explanation</li>
            <li>✔ Appointment Recommendations</li>
            <li>✔ Health Tips & Prevention</li>
          </ul>

          <Link
            href="/ai"
            className="mt-10 inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 font-semibold text-violet-700 transition hover:scale-105"
          >
            Try AI Assistant
            <ArrowRight size={20} />
          </Link>

        </div>

        {/* Right */}
        <div className="flex flex-1 justify-center">

          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">

            <div className="mb-6 flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-600 text-white">
                <BrainCircuit size={24} />
              </div>

              <div>
                <h3 className="font-bold text-gray-900">
                  MediConnect AI
                </h3>

                <p className="text-sm text-green-500">
                  ● Online
                </p>
              </div>

            </div>

            {/* AI */}
            <div className="space-y-4">

              <div className="max-w-xs rounded-2xl bg-gray-100 p-4 text-gray-700">
                Hello 👋
                <br />
                How can I help you today?
              </div>

              <div className="ml-auto max-w-xs rounded-2xl bg-violet-600 p-4 text-white">
                I've had a headache for two days.
              </div>

              <div className="max-w-xs rounded-2xl bg-gray-100 p-4 text-gray-700">
                Based on your symptoms, I recommend consulting a physician if
                the pain persists or worsens. Would you like me to help you book
                an appointment?
              </div>

            </div>

            <div className="mt-8 rounded-full border border-gray-200 px-5 py-3 text-gray-400">
              Ask anything...
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}